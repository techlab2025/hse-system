<script setup lang="ts">
import { watch } from 'vue'
import { ref } from 'vue'

const { activeTabData } = defineProps<{
  activeTabData: string
}>()

const activeTab = ref(activeTabData || 'equipment')

watch(
  () => activeTabData,
  (newVal) => {
    if (newVal) {
      activeTab.value = newVal
    }
  },
  { immediate: true },
)

const emit = defineEmits(['update:activeTab'])
const changeTab = (tab: string) => {
  activeTab.value = tab
  emit('update:activeTab', tab)
}
</script>

<template>
  <div class="tabs-container">
    <button
      class="tab"
      @click="changeTab('equipment')"
      :class="{
        activeTab: activeTab == 'equipment',
      }"
    >
      {{ $t('Equipment') }}
    </button>

    <button
      class="tab"
      @click="changeTab('devices')"
      :class="{
        activeTab: activeTab == 'devices',
      }"
    >
      {{ $t('devices') }}
    </button>

    <button
      class="tab"
      @click="changeTab('tools')"
      :class="{
        activeTab: activeTab == 'tools',
      }"
    >
      {{ $t('tools') }}
    </button>
  </div>
</template>
