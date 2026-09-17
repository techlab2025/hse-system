<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import ArrowIcons from '../icons/ArrowIcons.vue'

const props = withDefaults(defineProps<{
  BreadCramps: { title: string; link: string }[]
  cardType?: string
  equipmentType?: TitleInterface | string | null
  equipment?: string
  selctedequipment?: TitleInterface | TitleInterface[] | string
  isForm?: boolean
}>(), {
  BreadCramps: () => [],
  cardType: '',
  equipmentType: null,
  equipment: '',
  selctedequipment: '',
  isForm: false,
})

const equipmentTypeTitle = () => {
  if (typeof props.equipmentType === 'string') return props.equipmentType
  return props.equipmentType?.title ?? ''
}

</script>

<template>
  <!-- {{ equipmentType }} -->
  <!-- 1- {{ cardType }}
  1- {{ equipmentType }} -->
  <div class="breadcrumbs">
    <ul>
      <li>
        <span>{{ equipment || cardType }} </span>
        <ArrowIcons />
      </li>
      <p>{{ equipmentTypeTitle() }}</p>
    </ul>
  </div>
</template>
