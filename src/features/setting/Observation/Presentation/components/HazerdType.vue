<script lang="ts" setup>
import { ref, watch } from 'vue'
import Check from '@/assets/images/check.png'
import alert from '@/assets/images/alert-sign.png'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'

const hazerd = ref(null)

const setHazerd = (value: any) => {
  hazerd.value = value
}

const hazerdTypes = [
  { id: 1, title: 'Forklift' },
  { id: 2, title: 'Safety Helmet' },
  { id: 3, title: 'Fire Extinguisher' },
]
const selectedAnswer = ref<string | null>(null)
const emit = defineEmits(['update:data'])

watch(selectedAnswer, (val) => {
  emit('update:data', val)
})
</script>

<template>
  <div class="hazard-type-container lg:grid grid-cols-12 md:grid-cols-12 sm:grid-cols-1 gap-4">
    <div class="input-wrapper col-span-12 md:grid-cols-12">
      <CustomSelectInput
        :modelValue="hazerd"
        :staticOptions="hazerdTypes"
        label="Hazerd Type"
        placeholder="Select Hazerd"
        @update:modelValue="setHazerd"
      />

      <div class="input-wrapper col-span-12">
        <label for="text">{{ $t('Description') }}</label>
        <input
          class="input"
          :placeholder="$t('add your description')"
          type="text"
          id="title"
          v-model="title"
        />
      </div>
      <div class="input-wrapper col-span-12">
        <label for="text">{{ $t('preventive action') }}</label>
        <input
          class="input"
          :placeholder="$t('add your description')"
          type="text"
          id="title"
          v-model="title"
        />
      </div>
    </div>
  </div>
</template>
