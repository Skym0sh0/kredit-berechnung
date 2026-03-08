import {z} from 'zod';
import {type Bereitstellungszeit, BereitstellungszeitSchema} from "./Bereitstellungszeit.ts";

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
    effektivZinsProJahr?: number,
    anfangsTilgung?: number,
    tilgungsfreieAnlaufMonate?: number,
    zinsbindungInJahren: number,
    monatlicheRate: number,

    monatlicheRateTilgungsfreieZeit?: number,
    bereitstellung?: Bereitstellungszeit
}
