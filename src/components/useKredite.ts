import {computed, onMounted, ref} from "vue";
import {type KreditKonstellation, KreditKonstellationSchema} from "./types.ts";

export const useKredite = () => {
    const kredite = ref<KreditKonstellation[]>([])

    onMounted(() => {
        fetch('/secret/kredite.json')
            .then(res => res.json())
            .then(data => {
                const parsed = KreditKonstellationSchema.array().safeParse(data)

                if (!parsed.success)
                    throw new Error("Kredit Schema passt nicht: " + parsed.error)

                return parsed.data
            })
            .then(data => {
                kredite.value = data;
            })
            .catch(err => console.error(err))
    })

    return computed(() => kredite.value ?? [])
}