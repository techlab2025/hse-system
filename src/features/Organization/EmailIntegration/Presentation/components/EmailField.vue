<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: string
    required?: boolean
    maxlength?: number
    placeholder?: string
    hint?: string
    dir?: 'rtl' | 'ltr'
    autocomplete?: string
  }>(),
  { type: 'text', dir: 'ltr', autocomplete: 'off' },
)
const value = defineModel<string | null>({ required: true })
const visible = ref(false)
</script>
<template>
  <div class="email-field">
    <label :for="id">{{ label }} <span v-if="required" aria-hidden="true">*</span></label>
    <div class="email-input-wrap">
      <input
        :id="id"
        v-model="value"
        :type="type === 'password' && visible ? 'text' : type"
        :required="required"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :dir="dir"
        :autocomplete="autocomplete"
        :aria-describedby="hint ? `${id}-hint` : undefined"
        :spellcheck="false"
      />
      <button
        v-if="props.type === 'password'"
        type="button"
        class="email-reveal"
        :aria-controls="id"
        :aria-pressed="visible"
        :aria-label="
          label + (visible ? ' — ' + $t('emailSettings.hide') : ' — ' + $t('emailSettings.show'))
        "
        @click="visible = !visible"
      >
        {{ $t(visible ? 'emailSettings.hide' : 'emailSettings.show') }}
      </button>
    </div>
    <small v-if="hint" :id="`${id}-hint`">{{ hint }}</small>
  </div>
</template>
