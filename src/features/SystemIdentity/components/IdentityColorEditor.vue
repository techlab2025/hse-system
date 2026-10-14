<script setup lang="ts">
import { colorFields, type Appearance } from '../appearance'
const model = defineModel<Appearance>({ required: true })
</script>
<template>
  <section class="identity-editor">
    <h2>Interface colors</h2>
    <p>
      Default keeps the current HSE appearance, including light and dark mode. Enable a custom color
      to override it.
    </p>
    <div class="identity-color-grid">
      <div v-for="field in colorFields" :key="field.key" class="identity-color-field">
        <label :for="`appearance-${field.key}`">{{ field.label }}</label>
        <div class="identity-color-inputs">
          <input
            :id="`appearance-${field.key}`"
            type="color"
            :value="model.colors[field.key] || field.fallback"
            :aria-label="field.label"
            @input="model.colors[field.key] = ($event.target as HTMLInputElement).value"
          />
          <span>{{ model.colors[field.key] || 'Default' }}</span>
          <button
            type="button"
            :disabled="!model.colors[field.key]"
            :aria-label="`Use default ${field.label.toLowerCase()}`"
            @click="delete model.colors[field.key]"
          >
            Default
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
