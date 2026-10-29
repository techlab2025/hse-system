<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { translateKeyOrLiteral } from '@/localization/i18n'

const props = defineProps<{ title?: string; description?: string }>()
const route = useRoute()
const title = computed(() => {
  const label = props.title || route.meta.breadcrumb || route.name
  return typeof label === 'string' ? translateKeyOrLiteral(label) : ''
})
</script>

<template>
  <section class="hse-register-page">
    <header v-if="title" class="hse-register-header">
      <div>
        <h1 class="hse-register-title">{{ title }}</h1>
        <p v-if="description" class="hse-register-description">{{ description }}</p>
      </div>
      <slot name="actions" />
    </header>
    <div class="hse-register-content"><slot /></div>
  </section>
</template>
