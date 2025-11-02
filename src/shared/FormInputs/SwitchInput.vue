<script setup lang="ts">
import { ref, watch } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'

const emit = defineEmits(['update:value'])
const props = defineProps<{
  fields: { key: string, label: string, placeholder: string, value: string, enabled: boolean }[]
  switch_title?: string
}>()


watch(props.fields, (newVal) => {
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
        <div class="switch-btn">
          <p class="title">{{ switch_title }}</p>
          <ToggleSwitch v-model="field.enabled" />
        </div>
      </div>
      <input :id="field.key" v-model="field.value" type="text" :placeholder="field.placeholder"
        :disabled="!field.enabled" />
    </div>
  </div>
</template>
