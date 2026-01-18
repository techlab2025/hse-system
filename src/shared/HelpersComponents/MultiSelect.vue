<script setup lang="ts">
import { ref } from "vue";
import MultiSelect from 'primevue/multiselect';
import type TitleInterface from "@/base/Data/Models/title_interface";
import EquipmentCard from "@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCard.vue";

const props = defineProps<{
  options: []
  modelValue: []

}>()

const selectedCountries = ref(props.modelValue);


</script>

<template>
  <MultiSelect v-model="selectedCountries" :options="options">
    <template #option="slotProps">
      <div class="flex items-center gap-2 w-full border-none">
        <!-- <img width="50" height="50" :src="slotProps.option.image" alt="">
        <p>{{ slotProps.option.title }}</p> -->

        <EquipmentCard :tool="slotProps.option" :isSelect="true" />

      </div>
    </template>
    <template #dropdownicon>
      <i class="pi pi-map" />
    </template>
    <template #filtericon>
      <i class="pi pi-map-marker" />
    </template>
    <!-- <template #header>
      <div class="font-medium px-3 py-2">Available Countries</div>
    </template> -->
    <template #footer>
      <div class="p-3 flex justify-between">
        <Button label="Add New" severity="secondary" variant="text" size="small" icon="pi pi-plus" />
        <Button label="Remove All" severity="danger" variant="text" size="small" icon="pi pi-times" />
      </div>
    </template>
  </MultiSelect>
</template>

<style scoped>
.border-none {
  border: none !important;
}
</style>
