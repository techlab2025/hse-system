<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MultiSelect from 'primevue/multiselect'
import type TitleInterface from '@/base/Data/Models/title_interface'
import EquipmentCard from '@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCard.vue'

const props = defineProps<{
  options: []
  modelValue: []
  simpleOptions?: boolean
  showOptionSerial?: boolean
  showSelectAllOption?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const selectAllOption = {
  id: '__select_all__',
  title: 'Select All',
  __selectAllOption: true,
}

const selectedCountries = ref(props.modelValue)
const displayedOptions = computed(() =>
  props.showSelectAllOption ? [selectAllOption, ...props.options] : props.options,
)

const clearAllOptions = () => {
  selectedCountries.value = []
}

const getOptionSerial = (option: any) =>
  option?.serialName ??
  option?.serial_name ??
  option?.serialNumber ??
  option?.serial_number ??
  option?.serial ??
  option?.subtitle

watch(
  () => selectedCountries.value,
  (value: any[]) => {
    if (value.some((option) => option?.__selectAllOption)) {
      selectedCountries.value = [...props.options]
      return
    }

    emit('update:modelValue', selectedCountries.value)
  },
)
</script>

<template>
  <MultiSelect
    v-model="selectedCountries"
    :options="displayedOptions"
    :showToggleAll="!showSelectAllOption"
  >
    <template #option="slotProps">
      <span v-if="slotProps.option?.__selectAllOption" class="select-all-option">
        {{ $t('Select All') }}
      </span>
      <span v-else-if="simpleOptions" class="simple-option">
        <strong>{{ slotProps.option?.title }}</strong>
        <small v-if="showOptionSerial && getOptionSerial(slotProps.option)">
          {{ $t('serial_number') }}: {{ getOptionSerial(slotProps.option) }}
        </small>
      </span>
      <div v-else class="flex items-center gap-2 w-full border-none">
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
    <template #footer>
      <div
        class="p-3 flex justify-between"
        :class="{ 'simple-options-footer': showSelectAllOption }"
      >
        <Button
          v-if="!showSelectAllOption"
          label="Add New"
          severity="secondary"
          variant="text"
          size="small"
          icon="pi pi-plus"
        />
        <Button
          label="Remove All"
          severity="danger"
          variant="text"
          size="small"
          icon="pi pi-times"
          @click="clearAllOptions"
        />
      </div>
    </template>
  </MultiSelect>
</template>

<style scoped>
.border-none {
  border: none !important;
}

.simple-option {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.simple-option strong {
  color: var(--text-strong);
  font-weight: 600;
}

.simple-option small {
  color: var(--text-soft);
  font-size: 0.75rem;
}

.select-all-option {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  color: var(--PrimaryColor);
  font-weight: 800;
  text-align: right;
}

.simple-options-footer {
  justify-content: flex-end;
}
</style>
