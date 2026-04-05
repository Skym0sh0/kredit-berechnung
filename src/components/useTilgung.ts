import {computed} from "vue";
import {groupBy, sortBy} from "lodash";
import type {KreditEigenschaften} from "../types/KreditEigenschaften.ts";
import {useAllgemeineBerechnungsvorschriften} from "./useAllgemeineBerechnungsvorschriften.ts";

export type FinanceInfo = {
    id: string
    remaining: number
    zahlung: number
    zinsen?: number
    tilgung?: number

    zinsenGesamt: number
    tilgungGesamt: number
    zahlungGesamt: number
}

export type MonthlyInfo = FinanceInfo & {
    year: number
    month: number
}

export type YearlyInfo = FinanceInfo & {
    year: number
    month?: unknown
}

export type SimulatedCompleteLiquidation = {
    laufzeitInMonaten: number
    anfangsRestschuld: number
    monatlicheRate: number
    gesamtZahlung: number
    gesamteZinsen: number
}

const simulateTimeline = (darlehensbetrag: number, sollzinsProJahr: number, monatlicheRate: number, abbruchBedingung ?: (month: number) => boolean) => {
    const data: MonthlyInfo[] = [
        {
            id: 'start-month',
            year: 0,
            month: 0,
            remaining: -darlehensbetrag,
            zahlung: -darlehensbetrag,
            zinsenGesamt: 0,
            tilgungGesamt: 0,
            zahlungGesamt: 0,
        }
    ]

    let month = 0
    let remaining = darlehensbetrag * 100
    let zinsenGesamt = 0
    let tilgungGesamt = 0
    let zahlungGesamt = 0

    while (remaining > 0) {
        const zinssatz = sollzinsProJahr

        const zinsen = remaining * zinssatz * (1 / 12)

        const tilgung = Math.min(Math.round(monatlicheRate * 100 - zinsen), remaining)

        remaining = remaining - tilgung

        zinsenGesamt += zinsen / 100
        tilgungGesamt += tilgung / 100
        zahlungGesamt += (zinsen + tilgung) / 100

        data.push({
            id: 'month-' + month,
            year: Math.floor(month / 12) + 1,
            month: month,
            zahlung: (zinsen + tilgung) / 100,
            remaining: -remaining / 100,
            zinsen: zinsen / 100,
            tilgung: tilgung / 100,
            zinsenGesamt,
            tilgungGesamt,
            zahlungGesamt,
        })

        month++

        if (abbruchBedingung?.(month)) {
            break
        }
    }

    return data

}

export const useTilgung = (props: KreditEigenschaften) => {
    const {folgeZinsSatzProJahr} = useAllgemeineBerechnungsvorschriften()

    const monthlyData = computed<MonthlyInfo[]>(() => {
        return simulateTimeline(props.darlehensbetrag, props.sollzinsProJahr, props.monatlicheRate, month => month >= props.zinsbindungInJahren * 12)
    })

    const yearlyData = computed<YearlyInfo[]>(() => {
        const byYear = groupBy(monthlyData.value, v => v.year);

        return sortBy(
            Object.values(byYear)
                .map((months): YearlyInfo => {
                    const tmp = months.reduce<Pick<YearlyInfo, 'remaining' | 'zahlung' | 'tilgung' | 'zinsen' | 'zinsenGesamt' | 'tilgungGesamt' | 'zahlungGesamt'>>
                    ((year, month) => ({
                            remaining: Math.max(year.remaining, month.remaining),
                            zahlung: year.zahlung + month.zahlung,
                            tilgung: (year.tilgung ?? 0) + (month.tilgung ?? 0),
                            zinsen: (year.zinsen ?? 0) + (month.zinsen ?? 0),
                            zinsenGesamt: Math.max(year.zinsenGesamt, month.zinsenGesamt),
                            tilgungGesamt: Math.max(year.tilgungGesamt, month.tilgungGesamt),
                            zahlungGesamt: Math.max(year.zahlungGesamt, month.zahlungGesamt),
                        }),
                        {
                            remaining: -Number.MAX_SAFE_INTEGER,
                            zahlung: 0,
                            tilgung: 0,
                            zinsen: 0,
                            zinsenGesamt: 0,
                            tilgungGesamt: 0,
                            zahlungGesamt: 0,
                        })


                    const year = months[0]?.year ?? 0

                    return {
                        id: 'year-' + year,
                        year,
                        zahlung: tmp.zahlung,
                        remaining: tmp.remaining,
                        zinsen: tmp.zinsen,
                        tilgung: tmp.tilgung,
                        zinsenGesamt: tmp.zinsenGesamt,
                        tilgungGesamt: tmp.tilgungGesamt,
                        zahlungGesamt: tmp.zahlungGesamt,
                    }
                }),
            v => v.year)
    })

    const restschuld = computed(() => {
        const monthlys = monthlyData.value
        return monthlys[monthlys.length - 1]?.remaining ?? 0
    });

    const zinsenGesamt = computed(() => {
        const monthlys = monthlyData.value
        return monthlys[monthlys.length - 1]?.zinsenGesamt ?? 0
    });

    const simulierteVolltilgungData = computed<MonthlyInfo[]>(() => {
        if (-restschuld.value <= 0)
            return []

        const restDarlehen = -restschuld.value

        const newRate = (folgeZinsSatzProJahr.value + props.anfangsTilgung) * restDarlehen / 12

        return simulateTimeline(restDarlehen, folgeZinsSatzProJahr.value, Math.max(props.monatlicheRate, newRate))
    })

    const simulierteVolltilgung = computed(() => {
        const data = simulierteVolltilgungData.value

        if (data.length < 1)
            return undefined

        const firstZahlung = data[1];
        const lastZahlung = data[data.length - 1];

        return {
            anfangsRestschuld: -restschuld.value,
            laufzeitInMonaten: lastZahlung?.month ?? 0,
            gesamtZahlung: lastZahlung?.zahlungGesamt ?? 0,
            monatlicheRate: firstZahlung?.zahlung ?? 0,
            gesamteZinsen: lastZahlung?.zinsenGesamt ?? 0,
        }
    })

    return {
        monthlyData,
        yearlyData,
        restschuld: restschuld,
        zinsenGesamt: zinsenGesamt,
        simulierteVolltilgungData,
        simulierteVolltilgung,
    }
}