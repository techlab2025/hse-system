<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BlueBack from '@/assets/images/BgGroup.png'
import yelloecircle from '@/assets/images/yelloecircle.png'
const route = useRoute()

const Routes = ref([
  {
    name: 'Observations',
    route: '/organization/equipment/observation',
  },
  {
    name: 'Hazard',
    route: '/organization/equipment/hazard',
  },
  {
    name: 'Incident',
    route: '/organization/equipment/incedant',
  },
  {
    name: 'Inspection',
    route: '/organization/equipment/inspection',
  },
])
</script>
<template>
  <div class="equipment-sidebar">
    <ul>
      <router-link v-for="(route, index) in Routes" :key="index" :to="route.route">
        <div class="left-back-img">
          <img :src="BlueBack" alt="blue" />
          <img class="left-yellow" :src="yelloecircle" alt="yellow" />
        </div>
        <li>{{ route?.name }}</li>
        <div class="right-back-img">
          <img :src="BlueBack" alt="blue" />
          <img class="right-yellow" :src="yelloecircle" alt="blue" />
        </div>
      </router-link>
    </ul>
  </div>
</template>
