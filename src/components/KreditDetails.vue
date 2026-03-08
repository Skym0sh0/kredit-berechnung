<script setup lang="ts">
import {useKredite} from "./useKredite.ts";
import {computed} from "vue";

const props = defineProps<{
  anbieter: string
  title: string
}>()

const kredite = useKredite()

const kredit = computed(() => {
  return kredite.value
      .filter(k => k.anbieter === props.anbieter)
      .filter(k => k.title === props.title)
})
</script>

<template>
  <div>some details</div>
  <div>{{ props }}</div>
  <div>{{ kredit }}</div>
</template>

<style scoped>

</style>