<script setup lang="ts">
import { ref } from "vue";
import HeaderSection from '../DetailsHeader/HeaderSection.vue';
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog';

import { useRouter } from "vue-router";
import LocationCard from "./LocationCard.vue";

const visible = ref(false);
const props = defineProps<{
  LocationId: number
  projectId: number
  locations: []
}>()
const router = useRouter()
const emit = defineEmits(['update:data'])


</script>
<template>
  <button @click.prevent="visible = true" class="show-all-btn">{{ $t('show_all') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection :img="ZoneDialog" title="All Zones" subtitle="Show All Locations Zones" />
    </template>
    <div class="card-section">
      <LocationCard v-for="(card, index) in locations" :key="index" :title="card.title" :zone="card.zoons.length"
        :zoons="card.zoons" :LocationId="card?.id" :projectId="projectId" class="dialog"/>
    </div>
  </Dialog>
</template>

<style scoped>
.btn-primary {
  margin-top: 10px;
}
</style>
