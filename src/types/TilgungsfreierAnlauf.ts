import {z} from 'zod';

export const TilgungsfreierAnlaufSchema = z.object({
    anlaufMonate: z.number(),
    monatlicheRate: z.number(),
})

export type TilgungsfreierAnlauf = {
    anlaufMonate: number,
    monatlicheRate: number,
}