import {z} from 'zod';

export const BereitstellungszeitSchema = z.object({
    zinsfreieZeitInMonaten: z.number(),
    zinsProMonat: z.number(),
    // zinsProMonatWaehrendBereitstellung: z.optional(z.number()),
})

export const KreditEigenschaftenSchema = z.object({
    title: z.string(),

    darlehensbetrag: z.number(),
    sollzinsProJahr: z.number(),
    effektivZinsProJahr: z.optional(z.number()),
    anfangsTilgung: z.optional(z.number()),
    tilgungsfreieAnlaufMonate: z.optional(z.number()),
    zinsbindungInJahren: z.number(),
    monatlicheRate: z.number(),
    monatlicheRateTilgungsfreieZeit: z.optional(z.number()),
    bereitstellung: z.optional(BereitstellungszeitSchema)
})

export type KreditEigenschaften = {
    title: string,
    darlehensbetrag: number,
    sollzinsProJahr: number,
    zinsbindungInJahren: number,
    monatlicheRate: number,
}

export const KreditKonstellationSchema = z.object({
    anbieter: z.string(),
    title: z.string(),
    kreditTeile: z.array(KreditEigenschaftenSchema)
})

export type KreditKonstellation = {
    title: string,
    kreditTeile: KreditEigenschaften[]
}
