<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import ArrowIcons from '../icons/ArrowIcons.vue'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';

const props = defineProps<{
  BreadCramps: { title: string; link: string }[]
  cardType: string
  equipmentType: string
  equipment: string
  selctedequipment: TitleInterface
  isForm?: boolean
}>()

const getEquipmentTyep = (equipmentType: number) => {
  switch (equipmentType) {
    case EquipmentTypesEnum.DEVICE:
      return 'Device'
    case EquipmentTypesEnum.TOOL:
      return 'Tool'
    case EquipmentTypesEnum.EQUIPMENT:
      return 'Equipment'
  }
}
</script>

<template>
  <!-- {{ equipmentType }} -->
  <!-- 1- {{ cardType }}
  1- {{ equipmentType }} -->
  <div class="breadcrumbs">
    <ul>
      <li>
        <span>{{ equipment || cardType || getEquipmentTyep(equipmentType.type) }} </span>
        <ArrowIcons />
      </li>
      <p v-if="isForm">{{ equipmentType?.title }}</p>
      <p v-else>{{ equipmentType }}</p>
    </ul>
  </div>
</template>
