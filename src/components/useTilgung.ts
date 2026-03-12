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


type MonatsZahlSatz = {
    zinssatz: number
    // tilgungssatz:number
}

export const useTilgung = (props: KreditEigenschaften) => {
    const {folgeZinsSatzProJahr, auszahlungInMonaten} = useAllgemeineBerechnungsvorschriften()

    const computeZinssatzProMonat = (monat: number): MonatsZahlSatz => {
        if (props.bereitstellung) {
            if (monat < props.bereitstellung.zinsfreieZeitInMonaten) {
                // bereitstellungsfreie zeit
                return {
                    zinssatz: 0
                }
            } else if (monat >= props.bereitstellung.zinsfreieZeitInMonaten && monat < auszahlungInMonaten.value) {
                // bereitstellungszeit
                // bis zur auszahlung
                if (monat < (props.bereitstellung.komplettAuszahlungNachMonaten ?? 0)) {
                    return {
                        zinssatz: props.bereitstellung.zinsProMonat
                    }
                }

                return {
                    zinssatz: props.sollzinsProJahr
                }
            }
        }

        if (monat < props.zinsbindungInJahren * 12)
            return {
                zinssatz: props.sollzinsProJahr
            }

        return {zinssatz: folgeZinsSatzProJahr.value}
    }

    const monthlyData = computed<MonthlyInfo[]>(() => {

        const data: MonthlyInfo[] = [
            {
                id: 'start-month',
                year: 0,
                month: 0,
                remaining: -props.darlehensbetrag,
                zahlung: -props.darlehensbetrag,
                zinsenGesamt: 0,
                tilgungGesamt: 0,
                zahlungGesamt: 0,
            }
        ]

        let month = 0
        let remaining = Math.round(props.darlehensbetrag * 100)
        let zinsenGesamt = 0
        let tilgungGesamt = 0
        let zahlungGesamt = 0

        while (remaining > 0) {
            const zinssatz = computeZinssatzProMonat(month).zinssatz

            const zinsen = remaining * zinssatz * (1 / 12)
            const tilgung = Math.min(Math.round(props.monatlicheRate * 100 - zinsen), remaining)

            if (month >= (props.tilgungsfreieAnlauf?.anlaufMonate ?? 0))
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
        }

        return data
    })

    /* TODO: hier müsste man beachten, dass ein kredit mit langer laufzeit aber kürzer zinsbindung trotzdem als "wie gehabt " eingerechnet wird
     d.h. nach z.b. 10 jahren zinsbindung, aber laufzeit von 30 jahren, werden die monatlichen kosten trotzdem nach den ersten 10 jahren weiter
     angenommen und als tilgung der anschluss finanzierung gedacht
    */

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

    return {
        monthlyData,
        yearlyData,
        restschuld: computed(() => {
            return monthlyData.value[monthlyData.value.length - 1]?.remaining ?? 0
        }),
        zinsenGesamt: computed(() => {
            return monthlyData.value[monthlyData.value.length - 1]?.zinsenGesamt ?? 0
        })
    }
}