<script setup lang="ts">
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';
import { watch } from 'vue'
import { ref } from 'vue'

const { activeTabData } = defineProps<{
  activeTabData: EquipmentTypesEnum
}>()

const activeTab = ref<EquipmentTypesEnum>(activeTabData)

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
const changeTab = (tab: EquipmentTypesEnum) => {
  activeTab.value = tab
  emit('update:activeTab', tab)
}
</script>

<template>
  <div class="tabs-container">
    <button class="tab" @click.prevent="changeTab(EquipmentTypesEnum.EQUIPMENT)" :class="{
      activeTab: activeTab == EquipmentTypesEnum.EQUIPMENT,
    }">
      {{ $t('Equipment') }}
    </button>

    <button class="tab" @click.prevent="changeTab(EquipmentTypesEnum.DEVICE)" :class="{
      activeTab: activeTab == EquipmentTypesEnum.DEVICE,
    }">
      {{ $t('devices') }}
    </button>

    <button class="tab" @click.prevent="changeTab(EquipmentTypesEnum.TOOL)" :class="{
      activeTab: activeTab == EquipmentTypesEnum.TOOL,
    }">
      {{ $t('tools') }}
    </button>
  </div>
</template>
