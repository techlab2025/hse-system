<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import ArrowIcons from '../icons/ArrowIcons.vue'

const props = defineProps<{
  BreadCramps: { title: string; link: string }[]
  cardType: string
  equipmentType: string
  equipment: string
  selctedequipment: TitleInterface
  isForm?: boolean
}>()
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
      <p v-if="isForm">{{ equipmentType?.title }}</p>
      <p v-else>{{ equipmentType }}</p>
    </ul>
  </div>
</template>
