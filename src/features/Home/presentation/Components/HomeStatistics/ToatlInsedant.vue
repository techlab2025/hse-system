<script lang="ts" setup>
const props = defineProps<{
  title: string
  subTitle: string
  totalInsedant: number
  textClass: string
  link: string
}>()
</script>
<template>
  <router-link :to="props.link">
    <div class="total-insedent-card">
      <div class="titlte">
        <p>{{ props.title }}</p>
      </div>
      <div class="data">
        <p :class="props.textClass">{{ props.totalInsedant }}</p>
        <h6>| {{ props.subTitle }}</h6>
      </div>
    </div>
  </router-link>
</template>
