<script setup lang="ts">
import {computed, ref} from 'vue'
import type {QTableProps} from "quasar";
import {useTilgung} from "./useTilgung.ts";
import {formatMoney, formatPercent} from "./utils.ts";
import type {KreditEigenschaften} from "../types/KreditEigenschaften.ts";

const props = defineProps<KreditEigenschaften>()

const {monthlyData, yearlyData} = useTilgung(props)


const columns = computed<QTableProps["columns"]>(() => {
  return [
    {
      name: 'year',
      label: 'Jahr',
      field: row => row.year,
      sortable: true,
      align: 'center',
      style: 'width: 30px'
    },
    {
      name: 'month',
      label: 'Monat',
      field: row => row.month,
      format: month => month ? `${month % 12 + 1}` : '',
      sortable: true,
      align: 'center',
      style: 'width: 30px'
    },
    {
      name: 'remaining',
      label: 'Verbleibend',
      field: row => row.remaining,
      format: formatMoney,
      align: 'right',
      sortable: true,
      style: 'width: 125px'
    },
    {
      name: 'zahlung',
      label: 'Monatsrate',
      field: row => row.zahlung,
      format: formatMoney,
      align: 'right',
      sortable: true,
      style: 'width: 125px'
    },
    {
      name: 'zinsen',
      label: 'Zinsen',
      field: row => row.zinsen,
      format: formatMoney,
      align: 'right',
      sortable: true,
      style: 'width: 125px'
    },
    {
      name: 'tilgung',
      label: 'Tilgung',
      field: row => row.tilgung,
      format: formatMoney,
      align: 'right',
      sortable: true,
      style: 'width: 125px'
    },

    {
      name: 'relation',
      label: 'Verhältnis',
      field: row => ({zinsen: row.zinsen / row.zahlung, tilgung: row.tilgung / row.zahlung}),
      format: v => `${formatPercent(v.tilgung)} / ${formatPercent(v.zinsen)}`,
      align: 'right',
      sortable: true,
    },
  ];
})

const title = computed(() => {
  return `Tilgungsplan (${formatMoney(props.darlehensbetrag)} zu ${formatPercent(props.sollzinsProJahr, 3)} mit monatlich ${formatMoney(props.monatlicheRate)})`
})

enum View {
  YEAR = 'year',
  MONTH = 'month'
}

const view = ref<View>(View.YEAR)

const rows = computed(() => {
  switch (view.value) {
    case View.YEAR:
      return yearlyData.value
    case View.MONTH:
      return monthlyData.value
    default:
      return []
  }
})
</script>

<template>
  <div class="full-height full-width q-pa-sm">
    <q-table :title
             :rows
             row-key="id"
             bordered
             flat
             separator="cell"
             virtual-scroll
             :columns
             style="height: 95vh; width: 100%"
             :rows-per-page-options="[0]"
    >
      <template #top-right>
        <div>
          <q-radio v-model="view" :val="View.YEAR" label="jährlich"/>
          <q-radio v-model="view" :val="View.MONTH" label="monatlich"/>
        </div>
      </template>
    </q-table>
  </div>
</template>

<style scoped>

</style>