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

const emit = defineEmits(['update:data'])
const SelectedLocation = ref(1)
const props = defineProps<{
  LocationIds: number[]
}>()
const updateData = (data) => {
  console.log(data)
  emit('update:data', data.target.value)
}

const AllZones = ref<SohwProjectZoonModel[]>([])
const projectCustomLocationController = ProjectCustomLocationController.getInstance()

const state = ref(projectCustomLocationController.state.value)

const GetProjectLocationsEmployes = async () => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(
    37,
    [ProjectCustomLocationEnum.ZOON],
    [63],
  )
  const response = await projectCustomLocationController.FetchProjecuCustomLocation(
    projectCustomLocationParams,
  )
  // console.log(response.value.data, 'response.va')
}

onMounted(() => {
  GetProjectLocationsEmployes()
})

watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>
<template>
  <div class="w-full">
    <div class="tabs-selction-container" v-for="(item, index) in state.data" :key="index">
      <div class="tabs-selction-header">
        <p class="title">{{ $t('zones') }}</p>
        <p class="subtitle">
          Main location is : <span> {{ item?.title }}</span>
        </p>
      </div>
      <div class="tabs-selction-content">
        <div class="select-container">
          <div
            class="select-item"
            v-for="zoon in item.locationZones"
            :key="zoon.projectZoonId"
            :class="SelectedLocation === zoon.projectZoonId ? 'active' : ''"
          >
            <div class="left-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="left-yellow" :src="yelloecircle" alt="yellow" />
            </div>
            <input
              type="radio"
              :id="`radio-${zoon.projectZoonId}`"
              name="radio"
              :value="zoon.projectZoonId"
              @change="updateData"
            />
            <label
              class="item"
              @click="SelectedLocation = zoon.projectZoonId"
              :for="`radio-${zoon.projectZoonId}`"
              >{{ zoon.zoonTitle }}</label
            >
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
