<script setup lang="ts">

import type {KreditEigenschaften} from "../types/KreditEigenschaften.ts";
import {useTilgung} from "./useTilgung.ts";
import {formatMoney} from "./utils.ts";
import LabelValue from "./LabelValue.vue";
import {computed} from "vue";

const props = defineProps<KreditEigenschaften>()

const {simulierteVolltilgung, zinsenGesamt} = useTilgung(props)

const duration = computed(() => {
  if (!simulierteVolltilgung.value)
    return ''

  const years = Math.floor(simulierteVolltilgung.value.laufzeitInMonaten / 12) + ' Jahre'
  const months = (simulierteVolltilgung.value.laufzeitInMonaten % 12) + ' Monate'

  return years + ' und ' + months
})
</script>

<template>
  <q-card v-if="simulierteVolltilgung" class="q-pa-xs">
    <q-card-section>
      <LabelValue label="Restschuld" :value="formatMoney(simulierteVolltilgung.anfangsRestschuld)"/>
      <LabelValue label="Monatliche Rate" :value="formatMoney(simulierteVolltilgung.monatlicheRate)"/>
      <LabelValue label="Laufzeit" :value="duration"/>
      <LabelValue label="Gesamtzahlung" :value="formatMoney(simulierteVolltilgung.gesamtZahlung)"/>
      <LabelValue label="Zinszahlung" :value="formatMoney(simulierteVolltilgung.gesamteZinsen)"/>

      <q-separator/>

      <LabelValue label="Zinsen in der Sollzinszeit" :value="formatMoney(zinsenGesamt)"/>
      <LabelValue label="Gesamtzinsen" :value="formatMoney(simulierteVolltilgung.gesamteZinsen + zinsenGesamt)"/>

    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>