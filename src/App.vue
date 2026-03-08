<script setup lang="ts">
</script>

<template>
  <nav class="flex row justify-start items-center q-gutter-sm q-pa-sm bg-info text-white sticky-top z-top">
    <div class="text-h5">Kreditplaner</div>

    <RouterLink to="/" class="text-h6 text-white">Tilgungspläne</RouterLink>
  </nav>

  <main>
    <RouterView/>
  </main>
</template>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
}
</style>
