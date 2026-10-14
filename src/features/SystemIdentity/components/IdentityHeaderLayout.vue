<script setup lang="ts">
import { computed } from 'vue'
import { useSystemIdentity } from '@/composables/useSystemIdentity'
import { defaultAppearance } from '../appearance'
const { identity } = useSystemIdentity()
const appearance = computed(() =>
  identity.value.isActive ? identity.value.appearance : defaultAppearance(),
)
const custom = computed(
  () => appearance.value.headerOrder.join() !== defaultAppearance().headerOrder.join(),
)
</script>
<template>
  <template v-for="field in appearance.headerOrder" :key="field">
    <div
      v-if="field === 'actions'"
      class="setting identity-header-settings"
      :class="{ 'is-custom-position': custom }"
    >
      <slot v-for="action in appearance.headerActionOrder" :key="action" :name="action" />
    </div>
    <slot v-else :name="field" />
  </template>
</template>
<style scoped>
.identity-header-settings {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: auto;
}
.identity-header-settings.is-custom-position {
  margin-inline-start: 0;
}
@media (max-width: 768px) {
  .identity-header-settings {
    gap: 6px;
  }
}
</style>
