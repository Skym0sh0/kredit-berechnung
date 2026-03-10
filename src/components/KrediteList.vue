<script setup lang="ts">

import KreditPlan from "./KreditPlan.vue";
import {useKredite} from "./useKredite.ts";
import {computed} from "vue";
import type {KreditKonstellation} from "../types/KreditKonstellation.ts";
import {groupBy} from "lodash";

const kredite = useKredite()

const krediteProAnbieter = computed<Array<{ anbieter: string; kredite: KreditKonstellation[] }>>(() => {
  const byAnbieter = groupBy(kredite.value, v => v.anbieter)

  return Object.entries(byAnbieter)
      .map(([anbieter, kredite]) => ({anbieter, kredite}))
})
</script>

<template>
  <div class="flex column items-center q-pa-md bg-white q-gutter-sm">
    <div class="text-h4">
      Tilgungspläne
    </div>

    <div class="full-width">
      <q-list bordered class="rounded-borders">
        <q-expansion-item v-for="group in krediteProAnbieter"
                          :key="group.anbieter"
                          :label="group.anbieter"
                          icon="currency_exchange"
                          expand-separator
                          default-opened
                          header-class="bg-grey-2">
          <div class="full-width flex row justify-start q-pa-md q-col-gutter-sm">
            <div class="col-xs-12 col-md-4" v-for="kredit in group.kredite" :key="kredit.title">
              <KreditPlan v-bind="kredit"/>
            </div>
          </div>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>

<style scoped>

</style>