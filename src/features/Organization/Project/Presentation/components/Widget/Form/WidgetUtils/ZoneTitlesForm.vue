<script setup lang="ts">
import { ref, watch } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'

const emit = defineEmits(['update:value'])

const fields = ref([
  { key: 'MiniTitle', label: 'Mini title', placeholder: 'Safety days', value: '', enabled: false },
  { key: 'MainTitle', label: 'Main title', placeholder: 'Project Safety Score', value: '', enabled: false },
  { key: 'Hint', label: 'Hint', placeholder: 'Number of consecutive days without accidents so far', value: '', enabled: false }
])

watch(fields, (newVal) => {
  const payload: Record<string, string> = {}
  newVal.forEach(field => {
    payload[field.key] = field.enabled ? field.value : ''
  })
  emit('update:value', payload)
}, { deep: true })
</script>

<template>
  <div class="zone-data-container">
    <div v-for="(field, index) in fields" :key="field.key" class="input-wrapper">
      <div class="input-title">
        <label class="title" :for="field.key">{{ field.label }}</label>
        <ToggleSwitch v-model="field.enabled" />
      </div>
      <input :id="field.key" v-model="field.value" type="text" :placeholder="field.placeholder"
        :disabled="!field.enabled" />
    </div>
  </div>
</template>
