import {z} from 'zod';

export const BereitstellungszeitSchema = z.object({
    zinsfreieZeitInMonaten: z.number(),
    zinsProMonat: z.number(),
    // zinsProMonatWaehrendBereitstellung: z.optional(z.number()),
})

export type Bereitstellungszeit = {
    zinsfreieZeitInMonaten: number,
    zinsProMonat: number,
}