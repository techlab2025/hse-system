<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface'
import { translateKeyOrLiteral } from '@/localization/i18n'
import ArrowIcons from '../icons/ArrowIcons.vue'

const props = withDefaults(
  defineProps<{
    BreadCramps: { title: string; link: string }[]
    cardType?: string
    equipmentType?: TitleInterface | string | null
    equipment?: string
    selctedequipment?: TitleInterface | TitleInterface[] | string
    isForm?: boolean
  }>(),
  {
    BreadCramps: () => [],
    cardType: '',
    equipmentType: null,
    equipment: '',
    selctedequipment: '',
    isForm: false,
  },
)

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
        <span>{{ equipment || translateKeyOrLiteral(cardType?.toLowerCase()) }} </span>
        <ArrowIcons class="locale-directional-icon" aria-hidden="true" />
      </li>
      <p>{{ equipmentTypeTitle() }}</p>
    </ul>
  </div>
</template>
