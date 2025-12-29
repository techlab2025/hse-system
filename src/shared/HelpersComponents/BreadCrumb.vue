<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import ArrowIcons from '../icons/ArrowIcons.vue'

const props = defineProps<{
  BreadCramps: { title: string; link: string }[]
  cardType: string
  equipmentType: string
  selctedequipment:TitleInterface
}>()
</script>

<template>
  <div class="breadcrumbs">
    <ul>
      <li>
        <span>{{ cardType }}</span>
        <ArrowIcons />
      </li>
      <p>{{ equipmentType?.title }}</p>
    </ul>
  </div>
</template>
