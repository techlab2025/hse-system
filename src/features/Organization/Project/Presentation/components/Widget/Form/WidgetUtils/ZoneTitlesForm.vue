<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import { vProjectPanels } from '../../../../composables/projectPanels'

import { ref, watch } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'

const emit = defineEmits(['update:value'])

const fields = ref([
  {
    key: 'MiniTitle',
    get label() {
      return localizeUi('Mini title')
    },
    placeholder: localizeUi('Safety days'),
    value: '',
    enabled: false,
  },
  {
    key: 'MainTitle',
    get label() {
      return localizeUi('Main title')
    },
    placeholder: localizeUi('Project Safety Score'),
    value: '',
    enabled: false,
  },
  {
    key: 'Hint',
    get label() {
      return localizeUi('Hint')
    },
    placeholder: localizeUi('Number of consecutive days without accidents so far'),
    value: '',
    enabled: false,
  },
])

watch(
  fields,
  (newVal) => {
    const payload: Record<string, string> = {}
    newVal.forEach((field) => {
      payload[field.key] = field.enabled ? field.value : ''
    })
    emit('update:value', payload)
  },
  { deep: true },
)
</script>

<template>
  <div data-hse-project v-project-panels class="hse-project-root zone-data-container">
    <div v-for="(field, index) in fields" :key="field.key" class="hse-project-field input-wrapper">
      <div class="input-title">
        <label class="hse-project-field-label title" :for="field.key">{{ field.label }}</label>
        <ToggleSwitch v-model="field.enabled" />
      </div>
      <input
        dir="auto"
        class="hse-project-input"
        :id="field.key"
        v-model="field.value"
        type="text"
        :placeholder="field.placeholder"
        :disabled="!field.enabled"
      />
    </div>
  </div>
</template>
