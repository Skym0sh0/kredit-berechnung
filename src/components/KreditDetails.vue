<script setup lang="ts">
import {useKredite} from "./useKredite.ts";
import {computed} from "vue";
import KreditTeilDetails from "./KreditTeilDetails.vue";

const props = defineProps<{
  anbieter: string
  title: string
}>()

const kredite = useKredite()

const kredit = computed(() => {
  return kredite.value
      .filter(k => k.anbieter === props.anbieter)
      .filter(k => k.title === props.title)[0]
})

</script>

<template>
  <q-card>
    <q-card-section v-if="!kredit" class="bg-negative text-white">
      <div>Kein Kredit gefunden</div>
    </q-card-section>

    <template v-else>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <div class="text-subtitle2">{{ anbieter }}</div>
      </q-card-section>

      <q-card-section>
        <div class="full-width flex row justify-start q-col-gutter-sm">
          <KreditTeilDetails v-for="(teil,idx) in kredit.kreditTeile"
                             :key="teil.title"
                             :idx
                             v-bind="teil"
                             class="col col-xs-12 col-lg-6"/>
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>

<style scoped>

</style>