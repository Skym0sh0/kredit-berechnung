import {z} from 'zod';

export const KreditEigenschaftenSchema = z.object({
    title: z.string(),

    darlehensbetrag: z.number(),
    sollzinsProJahr: z.number(),
    zinsbindungInJahren: z.number(),
    monatlicheRate: z.number(),
})

export type KreditEigenschaften = {
    title: string,
    darlehensbetrag: number,
    sollzinsProJahr: number,
    zinsbindungInJahren: number,
    monatlicheRate: number,
}

export const KreditKonstellationSchema = z.object({
    title: z.string(),
    kreditTeile: z.array(KreditEigenschaftenSchema)
})

export type KreditKonstellation = {
    title: string,
    kreditTeile: KreditEigenschaften[]
}
