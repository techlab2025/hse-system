<script setup lang="ts">
import BlueBack from '@/assets/images/BgGroup.png';
import yelloecircle from '@/assets/images/yelloecircle.png';
import { onMounted, ref } from 'vue';
import IndexProjectLocationZonesController from '@/features/Organization/Project/Presentation/controllers/fetchLocationZonesController';
import IndexProjectLocationZonesParams from '@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams';
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone';

const emit = defineEmits(['update:data'])
const SelectedLocation = ref(1)
const props = defineProps<{
  LocationIds: number[]
}>()
const updateData = (data) => {
  console.log(data);
  emit('update:data', data.target.value)
}

const AllZones = ref<SohwProjectZoonModel[]>([])
const GetZones = async () => {
  const indexProjectLocationZonesParams = new IndexProjectLocationZonesParams('', 1, 10, 1, props.LocationIds)
  const indexProjectLocationZonesController = IndexProjectLocationZonesController.getInstance()
  const Response = await indexProjectLocationZonesController.getData(indexProjectLocationZonesParams)
  if (Response.value.data) {
    AllZones.value = Response.value.data
  }
}
onMounted(() => {
  GetZones();
})
</script>
<template>
  <div class="tabs-selction-container">
    <div class="tabs-selction-header">
      <p class="title">Zones</p>
      <p class="subtitle">Main location is : <span> {{ AllZones[0]?.zoonTitle }}</span></p>
    </div>
    <div class="tabs-selction-content">
      <div class="select-container">
        <div class="select-item" v-for="(item, index) in AllZones[0]?.zoons" :key="index"
          :class="SelectedLocation === item.id ? 'active' : ''">
          <div class="left-back-img">
            <img :src="BlueBack" alt="blue">
            <img class="left-yellow" :src="yelloecircle" alt="yellow">
          </div>
          <input type="radio" :id="`radio-${item.id}`" name="radio" :value="item.id" @change="updateData">
          <label class="item" @click="SelectedLocation = item.id" :for="`radio-${item.id}`">{{ item.title }}</label>
          <div class="right-back-img">
            <img :src="BlueBack" alt="blue">
            <img class="right-yellow" :src="yelloecircle" alt="blue">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
