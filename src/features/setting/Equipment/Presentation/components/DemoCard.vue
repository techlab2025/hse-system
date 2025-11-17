<script setup lang="ts">
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import ArrowIcons from '@/shared/icons/ArrowIcons.vue'

const { isBreadCramp, BreadCramps } = defineProps<{
  isBreadCramp: boolean
  BreadCramps: { title: string; link: string }[]
}>()
</script>

<template>
  <div class="demo-card">
    <div class="texts">
      <h5 class="title">Demo Card</h5>
      <span class="subtitle"
        >Preview only — data shown is illustrative. Confirm to add the equipment</span
      >
    </div>
    <div class="sub-card">
      <img src="@/assets/images/Rectangle 39931.png" alt="demo card" class="demo-img" />
      <div class="sub-card-body">
        <p class="first-item" v-if="!isBreadCramp">device</p>

        <div class="sub-card-header" v-if="isBreadCramp">
          <BreadCrumb :BreadCramps="BreadCramps" />

          <span class="link">Certification</span>
        </div>

        <h3 class="demo-title">Equipment name</h3>

        <div class="inspection">
          <span> inspection date : </span>
          <p class="font-semibold text-[#4B5563]">Determined automatically</p>
        </div>

        <div class="date">Date of Decommissioning : <span>y / m / d</span></div>
      </div>
    </div>
  </div>
</template>
