<script setup lang="ts">
import {useKredite} from "./useKredite.ts";
import KreditPlan from "./KreditPlan.vue";

const kredite = useKredite()
</script>

<template>
  <div class="flex column items-center q-pa-md" style="gap: 10px;">
    <div class="text-h4">Tilgungspläne</div>

    <div class="full-width flex row justify-center" style="gap: 10px;">
      <div class="col-xs-12 col-md-4" v-for="kredit in kredite" :key="kredit.title">
        <KreditPlan v-bind="kredit"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>