import {computed, onMounted, ref} from "vue";
import type {TilgungsProps} from "./useTilgung.ts";

export type KreditKonstellation = {
    title: string
    kreditTeile: Array<TilgungsProps & { title: string }>
}

export const useKredite = () => {
    const kredite = ref<KreditKonstellation[]>([])

    onMounted(() => {
        fetch('/kredite.json')
            .then(res => res.json())
            .then(data => {
                kredite.value = data;
            })
            .catch(err => console.error(err))
    })

    return computed(() => kredite.value ?? [])
}