import {type KreditEigenschaften, KreditEigenschaftenSchema} from "./KreditEigenschaften.ts";
import {z} from 'zod';

export const KreditKonstellationSchema = z.object({
    anbieter: z.string(),
    title: z.string(),
    kreditTeile: z.array(KreditEigenschaftenSchema)
})

export type KreditKonstellation = {
    anbieter: string,
    title: string,
    kreditTeile: KreditEigenschaften[]
}
