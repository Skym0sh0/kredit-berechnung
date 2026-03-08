import {computed, onMounted, ref} from "vue";
import type {ZodError} from "zod";
import {type KreditKonstellation, KreditKonstellationSchema} from "../types/KreditKonstellation.ts";

class SchemaError extends Error {
    public readonly data?: unknown

    constructor(error: ZodError, data?: unknown) {
        super("Parse Error: " + error);
        this.data = data

        Object.setPrototypeOf(this, SchemaError.prototype)
    }
}

export const useKredite = () => {
    const kredite = ref<KreditKonstellation[]>([])

    onMounted(() => {
        const conf: string = (import.meta.env.VITE_KREDIT_FILENAMES ?? '')

        const promises = conf.split(",")
            .map(s => s.trim())
            .flatMap(s => !s ? [] : [s])
            .map(name => {
                return fetch(`/secret/${name}.json`)
                    .then(res => res.json())
                    .then(data => {
                        const parsed = KreditKonstellationSchema.array().safeParse(data)

                        if (!parsed.success)
                            throw new SchemaError(parsed.error, data)

                        return parsed.data
                    })
                    .catch((err: unknown) => {
                        console.error(`---------- File ${name} ----------`)
                        console.error(err);
                        if (err instanceof SchemaError)
                            console.error(err.data)
                        console.error(`-----------------------------------------`)
                        return []
                    })
            })

        Promise.all(promises)
            .then(files => kredite.value = files.flatMap(v => v))
    })

    return computed(() => kredite.value ?? [])
}