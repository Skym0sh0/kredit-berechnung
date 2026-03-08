import {computed} from "vue";
import {groupBy, sortBy} from "lodash";
import type {KreditEigenschaften} from "../types/KreditEigenschaften.ts";

export type TilgungsProps = {
    darlehensbetrag: number
    sollzinsProJahr: number
    zinsbindungInJahren: number
    monatlicheRate: number
    tilgungsfreieAnlaufMonate: number
}

export type FinanceInfo = {
    id: string
    remaining: number
    zahlung: number
    zinsen?: number
    tilgung?: number
}

export type MonthlyInfo = FinanceInfo & {
    year: number
    month: number
}

export type YearlyInfo = FinanceInfo & {
    year: number
    month?: unknown
}

export const useTilgung = (props: KreditEigenschaften) => {
    const monthlyData = computed<MonthlyInfo[]>(() => {
        const data: MonthlyInfo[] = [
            {
                id: 'start-month',
                year: 0,
                month: 0,
                remaining: -props.darlehensbetrag,
                zahlung: -props.darlehensbetrag,
            }
        ]

        let month = 0
        let remaining = Math.round(props.darlehensbetrag * 100)

        while (month < props.zinsbindungInJahren * 12) {
            const zinsen = remaining * props.sollzinsProJahr * (1 / 12)
            const tilgung = Math.min(Math.round(props.monatlicheRate * 100 - zinsen), remaining)

            if (month >= (props.tilgungsfreieAnlaufMonate ?? 0))
                remaining = remaining - tilgung

            month++

            data.push({
                id: 'month-' + month,
                year: Math.floor(month / 12) + 1,
                month: month,
                zahlung: props.monatlicheRate,
                remaining: -remaining / 100,
                zinsen: zinsen / 100,
                tilgung: tilgung / 100,
            })

            if (remaining <= 0)
                break;
        }

        return data
    })

    /* TODO: hier müsste man beachten, dass ein kredit mit langer laufzeit aber kürzer zinsbindung trotzdem als "wie gehabt " eingerechnet wird
     d.h. nach z.b. 10 jahren zinsbindung, aber laufzeit von 30 jahren, werden die monatlichen kosten trotzdem nach den ersten 10 jahren weiter
     angenommen und als tilgung der anschluss finanzierung gedacht
    */

    const yearlyData = computed<YearlyInfo[]>(() => {
        const byYear = groupBy(monthlyData.value, v => Math.floor((v.month - 1) / 12));

        return sortBy(
            Object.values(byYear)
                .map((months): YearlyInfo => {
                    if (months.length === 1 && months[0] && months[0].month === 0)
                        return {
                            id: 'start-year',
                            year: 0,
                            remaining: months[0].remaining,
                            zahlung: months[0].zahlung,
                        }


                    const tmp = months.reduce<Pick<YearlyInfo, 'remaining' | 'zahlung' | 'tilgung' | 'zinsen'>>((year, month) => ({
                            remaining: Math.min(year.remaining, month.remaining),
                            zahlung: year.zahlung + month.zahlung,
                            tilgung: (year.tilgung ?? 0) + (month.tilgung ?? 0),
                            zinsen: (year.zinsen ?? 0) + (month.zinsen ?? 0),
                        }),
                        {
                            remaining: 0,
                            zahlung: 0,
                            tilgung: 0,
                            zinsen: 0,
                        })


                    const year = Math.floor((months[0]?.month ?? 0) / 12) + 1

                    return {
                        id: 'year-' + year,
                        year,
                        zahlung: tmp.zahlung,
                        remaining: tmp.remaining,
                        zinsen: tmp.zinsen,
                        tilgung: tmp.tilgung,
                    }
                }),
            v => v.year)
    })

    return {
        monthlyData,
        yearlyData,
        restschuld: computed(() => {
            return monthlyData.value[monthlyData.value.length - 1]?.remaining ?? 0
        })
    }
}