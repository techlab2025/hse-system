<script lang="ts" setup>
import { ref, watch } from 'vue'
import Check from '@/assets/images/check.png'
import alert from '@/assets/images/alert-sign.png'
import { SaveStatusEnum } from '../../../Core/Enums/save_status_enum';
// import { SaveStatusEnum } from '../../Core/Enums/save_status_enum'

const props = defineProps<{
  modelValue?: SaveStatusEnum | null
}>()

const emit = defineEmits(['update:saveStatus'])

const selectedSaveStatus = ref<SaveStatusEnum | null>(props.modelValue || null)

watch(selectedSaveStatus, (val) => emit('update:saveStatus', val))

const options = [
  { value: SaveStatusEnum.NotSaved, label: 'Negative', icon: Check },
  { value: SaveStatusEnum.Saved, label: 'Positive', icon: alert }
]

// إذا تغير modelValue من الخارج، حدّث selectedSaveStatus
watch(() => props.modelValue, (val) => {
  selectedSaveStatus.value = val || null
})
</script>

<template>
  <div class="observation-container lg:grid grid-cols-12 gap-4 mt-6">
    <div
      v-for="opt in options"
      :key="opt.value"
      class="col-span-6 select-container"
      :class="{ selected: selectedSaveStatus === opt.value }"
    >
      <label>
        <input
          type="radio"
          class="radio-input"
          v-model="selectedSaveStatus"
          :value="opt.value"
        />
        <span>{{ opt.label }}</span>
        <img :src="opt.icon" :alt="opt.label" />
      </label>
    </div>
  </div>
</template>
