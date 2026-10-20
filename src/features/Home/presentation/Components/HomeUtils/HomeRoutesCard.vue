<script lang="ts" setup>
import DashboardIcon from '../Dashboard/DashboardIcon.vue'
import type { Component } from 'vue'

const props = defineProps<{
  imgSrc?: string
  title?: string
  description?: string
  icon?: Component
}>()
</script>
<template>
  <div class="home-routes-card">
    <div class="card-img">
      <img v-if="!props.icon" :src="props.imgSrc" alt="logo" />
      <component class="icon" v-if="props.icon" :is="props.icon"></component>
    </div>
    <div class="card-content">
      <h3 class="title">{{ props?.title }}</h3>
      <p class="description">{{ props.description }}</p>
    </div>
    <DashboardIcon name="arrow" class="home-route-arrow" />
  </div>
</template>
