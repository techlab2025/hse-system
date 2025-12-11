<script setup lang="ts">
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue';
import investigationImg from '@/assets/images/investigationImg.png'

</script>

<template>
  <div class="cause-of-accidant">
    <HeaderPage :title="`Meetings Overview`" :subtitle="`A complete list of your past and upcoming meetings.`"
      :img="investigationImg" class="title-header" />
  </div>
</template>
