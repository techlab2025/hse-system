<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import ArrowIcons from '../icons/ArrowIcons.vue'

const props = defineProps<{
  BreadCramps: { title: string; link: string }[]
  cardType: string
  equipmentType: string
  equipment: string
  selctedequipment: TitleInterface
}>()
</script>

<template>
  <!-- {{ equipmentType }} -->
  <div class="breadcrumbs">
    <ul>
      <li>

        <span>{{ equipment }}</span>
        <ArrowIcons />
      </li>
      <p>{{ equipmentType }}</p>
    </ul>
  </div>
</template>
