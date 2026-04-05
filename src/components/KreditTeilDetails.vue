<script setup lang="ts">
import Tilgungsplan from "./Tilgungsplan.vue";
import {formatMoney, formatPercent} from "./utils.ts";
import LabelValue from "./LabelValue.vue";
import type {KreditEigenschaften} from "../types/KreditEigenschaften.ts";
import {useTilgung} from "./useTilgung.ts";
import SimulationDetails from "./SimulationDetails.vue";

const props = defineProps<KreditEigenschaften & { idx: number }>()

const {zinsenGesamt, restschuld} = useTilgung(props)
</script>

<template>
  <q-card class="q-pa-xs">
    <q-card-section>
      <div class="text-h6">Finanzierungsbaustein {{ idx + 1 }}</div>
      <div class="text-subtitle2">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <LabelValue label="Name" :value="props.title"/>
      <LabelValue label="Darlehensbetrag" :value="formatMoney(props.darlehensbetrag)"/>
      <LabelValue label="Sollzins / effektivzins"
                  :value="formatPercent(props.sollzinsProJahr,3) + ' / ' + formatPercent(props.effektivZinsProJahr,3)"/>
      <LabelValue label="Zinsbindung" :value="props.zinsbindungInJahren + ' Jahre'"/>
      <LabelValue label="Anfängliche Tilgung" :value="formatPercent(props.anfangsTilgung,3)"/>
      <LabelValue label="Monatliche Rate" :value="formatMoney(props.monatlicheRate)"/>

      <q-separator/>

      <LabelValue label="Gesamtzinsen" :value="formatMoney(zinsenGesamt)"/>
      <LabelValue label="Restschuld" :value="formatMoney(-restschuld)"/>
    </q-card-section>

    <q-card-section>
      <q-expansion-item v-if="restschuld < 0"
                        label="Simulierter Volltilger"
                        icon="developer_board"
                        default-opened
                        expand-separator
                        header-class="bg-grey-2">
        <SimulationDetails v-bind="props"/>
      </q-expansion-item>

      <q-expansion-item label="Tilgungsplan"
                        icon="currency_exchange"
                        expand-separator
                        header-class="bg-grey-2">
        <Tilgungsplan v-bind="props"/>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<style scoped>

</style>