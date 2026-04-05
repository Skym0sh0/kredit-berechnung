<script setup lang="ts">
import {ref} from "vue";
import {useAllgemeineBerechnungsvorschriftenProvide} from "./useAllgemeineBerechnungsvorschriften.ts";

const folgeZinsSatzProJahrInProzent = ref(8)
const auszahlungInMonaten = ref(18)

useAllgemeineBerechnungsvorschriftenProvide(folgeZinsSatzProJahrInProzent, auszahlungInMonaten)
</script>

<template>
  <teleport to="#top_right_area">
    <div class="flex row justify-start items-center q-col-gutter-md">
      <q-input label="Auszahlung un Monaten"
               v-model="auszahlungInMonaten"
               v-if="false"
               type="number"
               debounce="1000"
               outlined
               dense
               bg-color="white"
               :rules="[
                 v => !!v || 'Monate müssen angegeben sein',
                 v => 0 < v || 'Monate müssen positiv sein',
             ]">
        <template v-slot:prepend>
          <q-icon name="calendar_month" color="info"/>
        </template>

        <template #append>M</template>
      </q-input>

      <q-input label="Folge Zinssatz"
               v-model="folgeZinsSatzProJahrInProzent"
               type="number"
               debounce="1000"
               outlined
               dense
               bg-color="white"
               :rules="[
                 v => !!v || 'Zinssatz muss gegeben sein',
                 v => 0 <= v || 'Zinssatz muss positiv sein',
             ]"
      >
        <template v-slot:prepend>
          <q-icon name="paid" color="positive"/>
        </template>

        <template #append>%</template>
      </q-input>
    </div>
  </teleport>

  <RouterView/>
</template>

<style scoped>

</style>