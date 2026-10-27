<script setup lang="ts">
import { colorFields, colorGroups, type Appearance } from '../appearance'
const model = defineModel<Appearance>({ required: true })
</script>
<template>
  <section class="identity-editor">
    <h2>{{ $t('Interface colors') }}</h2>
    <p>
      {{
        $t(
          'Default keeps the current HSE appearance, including light and dark mode. Enable a custom color to override it.',
        )
      }}
    </p>
    <fieldset v-for="group in colorGroups" :key="group" class="identity-color-group">
      <legend>{{ $t(group) }}</legend>
      <div class="identity-color-grid">
        <div
          v-for="field in colorFields.filter((field) => field.group === group)"
          :key="field.key"
          class="identity-color-field"
        >
          <label :for="`appearance-${field.key}`">{{ field.label }}</label>
          <div class="identity-color-inputs">
            <input
              :id="`appearance-${field.key}`"
              type="color"
              :value="model.colors[field.key] || field.fallback"
              :aria-label="field.label"
              @input="model.colors[field.key] = ($event.target as HTMLInputElement).value"
            />
            <span>{{ model.colors[field.key] || $t('Default') }}</span>
            <button
              type="button"
              :disabled="!model.colors[field.key]"
              :aria-label="$t('Use default color for {field}', { field: field.label })"
              @click="delete model.colors[field.key]"
            >
              {{ $t('Default') }}
            </button>
          </div>
        </div>
      </div>
    </fieldset>
  </section>
</template>
