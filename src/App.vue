<script setup lang="ts">

</script>

<template>
  <nav class="flex row justify-between items-center q-pa-sm bg-info text-white sticky-top z-top">
    <div class="flex items-center justify-start q-gutter-sm">
      <div class="text-h5">Kreditplaner</div>

      <RouterLink to="/" class="text-h6 text-white">Tilgungspläne</RouterLink>
    </div>

    <div id="top_right_area"/>
  </nav>

  <div class="q-mb-sm"/>

  <main class="bg-green-1 q-pa-sm">
    <RouterView/>
  </main>
</template>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
}
</style>
