<script setup lang="ts">
import BlueBack from '@/assets/images/BgGroup.png'
import yelloecircle from '@/assets/images/yelloecircle.png'
import { onMounted, ref } from 'vue'
import IndexProjectLocationZonesController from '@/features/Organization/Project/Presentation/controllers/fetchLocationZonesController'
import IndexProjectLocationZonesParams from '@/features/Organization/Project/Core/params/fetchProjectLocationsZonesParams'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '@/features/Organization/Project/Presentation/controllers/ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import { watch } from 'vue'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { useRouter } from 'vue-router'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'

const emit = defineEmits(['update:data'])
const SelectedLocation = ref(1)
const router = useRouter()
const props = defineProps<{
  LocationIds: number[]
}>()
const updateData = (data) => {
  console.log(data.target.value, "data.target.value")
  emit('update:data', data.target.value)
}

// const AllZones = ref<MyZonesModel[]>([])
// const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const fetchMyZonesController = FetchMyZonesController.getInstance()
const state = ref(fetchMyZonesController.state.value)

// const GetProjectLocationsEmployes = async () => {
//   const projectCustomLocationParams = new ProjectCustomLocationParams(
//     37,
//     [ProjectCustomLocationEnum.ZOON],
//     [63],
//   )
//   const response = await projectCustomLocationController.getData(
//     projectCustomLocationParams,
//   )
//   // console.log(response.value.data, 'response.va')
// }

const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams()
  const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
}
onMounted(() => {
  // GetProjectLocationsEmployes()
  FetchMyZones()
})

watch(
  () => fetchMyZonesController.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>
<template>
  <!-- <pre>{{ state.data }}</pre> -->
  <div class="w-full">

    <div class="tabs-selction-container">
      <!-- <div class="tabs-selction-header">
        <p class="title">{{ $t('zones') }}</p>
        <p class="subtitle">
          Main location is : <span> {{ item?.title }}</span>
        </p>
      </div> -->
      <div class="tabs-selction-content">
        <div class="select-container">
          <div class="select-item" v-for="zoon in state.data" :key="zoon.projectZoonId"
            :class="SelectedLocation === zoon.projectZoonId ? 'active' : ''">
            <div class="left-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="left-yellow" :src="yelloecircle" alt="yellow" />
            </div>
            <input type="radio" :id="`radio-${zoon.projectZoonId}`" name="radio" :value="zoon.projectZoonId"
              @change="updateData" />
            <label class="item" @click="SelectedLocation = zoon.projectZoonId" :for="`radio-${zoon.projectZoonId}`">{{
              zoon.zoonTitle || `--` }}</label>
            <div class="right-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="right-yellow" :src="yelloecircle" alt="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
