import {computed, type ComputedRef, inject, type InjectionKey, type MaybeRefOrGetter, provide, toValue} from "vue";

const INJECTION_KEY_FOLGEZINS: InjectionKey<ComputedRef<number>> = Symbol("folgezins")
const INJECTION_KEY_AUSZAHLUNG_MONATE: InjectionKey<ComputedRef<number>> = Symbol("auszahlungInMonaten")

export const useAllgemeineBerechnungsvorschriftenProvide = (folgeZinsSatzProJahrInProzent: MaybeRefOrGetter<number>, auszahlungInMonaten: MaybeRefOrGetter<number>) => {
    provide(INJECTION_KEY_FOLGEZINS, computed(() => toValue(folgeZinsSatzProJahrInProzent) / 100))
    provide(INJECTION_KEY_AUSZAHLUNG_MONATE, computed(() => toValue(auszahlungInMonaten)))
}

export const useAllgemeineBerechnungsvorschriften = () => {
    const folgeZinsSatzProJahr = inject(INJECTION_KEY_FOLGEZINS, computed(() => 0))
    const auszahlungInMonaten = inject(INJECTION_KEY_AUSZAHLUNG_MONATE, computed(() => 0))

    return {
        folgeZinsSatzProJahr,
        auszahlungInMonaten
    }
}