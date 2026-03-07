<script setup lang="ts">
import {computed} from "vue";
import {formatMoney, formatPercent} from "./utils.ts";
import {useTilgung} from "./useTilgung.ts";
import LabelValue from "./LabelValue.vue";
import type {KreditKonstellation} from "./types.ts";

const props = defineProps<KreditKonstellation>()

const gesamt = computed(() => {
  const darlehensbetrag = props.kreditTeile.map(s => s.darlehensbetrag).reduce((acc, cur) => acc + cur, 0);

  return {
    darlehensbetrag,
    monatlicheRate: props.kreditTeile.map(s => s.monatlicheRate).reduce((acc, cur) => acc + cur, 0),
    sollzinsProJahr: props.kreditTeile.map(s => s.sollzinsProJahr * (s.darlehensbetrag / darlehensbetrag)).reduce((acc, cur) => acc + cur, 0),
  }
})

const parts = computed(() =>
    props.kreditTeile.map(part => {
      const {restschuld} = useTilgung(part)

      return {restschuld: -restschuld.value, title: part.title, zinsbindungInJahren: part.zinsbindungInJahren}
    }))

const restschuld = computed(() => parts.value.map(v => v.restschuld).reduce((acc, cur) => acc + cur, 0))
</script>

<template>
  <q-card bordered flat>
    <q-card-section>
      <div class="text-h6">
        {{ props.title }}
      </div>
    </q-card-section>

    <q-card-section>
      <ul>
        <li>
          <LabelValue label="Darlehensbetrag" :value="formatMoney(gesamt.darlehensbetrag)"/>
        </li>
        <li>
          <LabelValue label="Zinssatz" :value="formatPercent(gesamt.sollzinsProJahr, 3)"/>
        </li>
        <li>
          <LabelValue label="Monatliche Rate" :value="formatMoney(gesamt.monatlicheRate)"/>
        </li>
        <li>
          <LabelValue label="Restschuld" :value="formatMoney(restschuld)"/>
          <div class="text-caption text-grey q-px-md">
            <LabelValue v-for="p in parts" :key="p.title" :label="`${p.title} nach ${p.zinsbindungInJahren}`"
                        :value="formatMoney(p.restschuld)"/>
          </div>
        </li>
      </ul>
    </q-card-section>
  </q-card>

</template>

<style scoped>

</style>