<script setup lang="ts" generic="T">
import {computed} from "vue";

const props = defineProps<{
  label: string
  value: T
}>()

const formattedValue = computed(() => props.value + "")
</script>

<template>
  <div class="flex row justify-between">
    <div>{{ label }}</div>
    <div>{{ formattedValue }}</div>
  </div>
</template>

<style scoped>

</style>