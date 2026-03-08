import {z} from 'zod';
import {type Bereitstellungszeit, BereitstellungszeitSchema} from "./Bereitstellungszeit.ts";
import {type TilgungsfreierAnlauf, TilgungsfreierAnlaufSchema} from "./TilgungsfreierAnlauf.ts";

export const KreditEigenschaftenSchema = z.object({
    title: z.string(),

    darlehensbetrag: z.number(),
    sollzinsProJahr: z.number(),
    effektivZinsProJahr: z.number(),
    anfangsTilgung: z.number(),
    zinsbindungInJahren: z.number(),
    monatlicheRate: z.number(),

    tilgungsfreieAnlauf: z.optional(TilgungsfreierAnlaufSchema),
    bereitstellung: z.optional(BereitstellungszeitSchema)
})

export type KreditEigenschaften = {
    title: string,

    darlehensbetrag: number,
    sollzinsProJahr: number,
    effektivZinsProJahr: number,
    anfangsTilgung: number,
    zinsbindungInJahren: number,
    monatlicheRate: number,

    tilgungsfreieAnlauf?: TilgungsfreierAnlauf,
    bereitstellung?: Bereitstellungszeit
}
