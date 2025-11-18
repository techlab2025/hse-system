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
  <div class="hazard-type-container grid grid-cols-12 gap-4">
    <div class="col-span-12">
      <div class="input-wrapper">
        <CustomSelectInput
          :modelValue="hazerd"
          :staticOptions="hazerdTypes"
          label="Hazerd Type"
          placeholder="Select Hazerd"
          @update:modelValue="setHazerd"
        />
      </div>

      <!-- radio buttons -->
      <div class="grid grid-cols-12 gap-6 radio-container">
        <div class="col-span-12 md:col-span-6">
          <label class="radio-title">{{ $t('take action') }}</label>
          <div class="flex items-center gap-6 radio-answers">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="yes" v-model="title" />
              <span>Yes</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="no" v-model="title" />
              <span>No</span>
            </label>
          </div>
        </div>

        <!-- السؤال الثاني -->
        <div class="col-span-12 md:col-span-6">
          <label class="radio-title">{{ $t('solved') }}</label>
          <div class="flex items-center gap-6 radio-answers">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="yes" v-model="title" />
              <span>Yes</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="no" v-model="title" />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>

      <!-- end radio buttons -->

      <div class="col-span-12">
        <div class="input-wrapper">
          <label>{{ $t('Description') }}</label>
          <input
            class="input"
            :placeholder="$t('add your description')"
            type="text"
            v-model="title"
          />
          <!-- <label>{{ $t('preventive action') }}</label>
          <input
            class="input"
            :placeholder="$t('add your description')"
            type="text"
            v-model="title"
          /> -->
        </div>
      </div>
    </div>
  </div>
</template>
