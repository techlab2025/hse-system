<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('Equipment')
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
      @click="changeTab('Equipment')"
      :class="{
        activeTab: activeTab == 'Equipment',
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
