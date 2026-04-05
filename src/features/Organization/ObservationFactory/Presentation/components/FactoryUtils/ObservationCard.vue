<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ActionStatusEnum } from '../../../Core/Enums/ActionStatusEnum'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import { RiskLevelEnum } from '../../../Core/Enums/risk_level_enum'
import ToggleObservationActionStatusParams from '../../../Core/params/ToggleObservationActionStatusParams'
import type HazardDetailsModel from '../../../Data/models/hazardDetailsModel'
import ToggleObservationActionStatusController from '../../controllers/ToggleObservationActionStatusController'
import CustomCheckboxToggle from '../../SubComponent/CustomCheckboxToggle.vue'
import { watch } from 'vue'

const props = defineProps<{
  data: HazardDetailsModel
}>()

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.Low:
      return 'Low'
    case RiskLevelEnum.Medium:
      return 'Medium'
    case RiskLevelEnum.High:
      return 'High'
    default:
      return 'Unknown'
  }
}

const GetHeader = (value: number) => {
  return Observation[value] == 'ObservationType'
    ? 'Observation'
    : Observation[value] == 'HazardType'
      ? 'Hazard'
      : 'incident'
}

const GetStatus = (status: ActionStatusEnum) => {
  switch (status) {
    case ActionStatusEnum.CLOSED:
      return 'Closed'
    case ActionStatusEnum.OPEN:
      return 'Open'
    default:
      return 'Unknown'
  }
}
const emit = defineEmits(['update:data'])
const router = useRouter()
const toggleObservationActionStatus = async (id: number) => {
  const toggleObservationActionStatusParams = new ToggleObservationActionStatusParams(id)
  await ToggleObservationActionStatusController.getInstance().toggleObservationActionStatus(
    toggleObservationActionStatusParams,
    router,
  )
}

const ToogleStatus = async (id: number) => {
  await toggleObservationActionStatus(id)
  emit('update:data')
}

watch(
  () => props.data,
  () => {
    toggleObservationActionStatus(props.data.id)
  },
)
const GoToShowPage = () => {
  if (props.data.id) {
    router.push(`/organization/equipment-mangement/incedant/show/${props.data.id}`)
  }
}
</script>
<template>
  <div class="observation-card">
    <div class="header-container">
      <div class="card-content">
        <div class="title_observation" @click="GoToShowPage">
          <p class="observation-title">{{ data?.title }}</p>
          <p class="Description">{{ data?.description }}</p>
        </div>
        <div class="card-header">
          <p class="label-item-primary cursor-pointer" @click="GoToShowPage">
            <span>{{ $t('Serial') }} : </span> <span>{{ data?.serialName }}</span>
          </p>
          <h6 class="label-item-secondary">
            <span>{{ $t('Date & Time') }} :</span> <span>{{ data?.date }} - {{ data?.time }}</span>
          </h6>
          <h6 class="label-item-secondary" v-if="data?.zoon?.title">
            <span>{{ $t('Zone') }} :</span><span>{{ data?.zoon?.title }}</span>
          </h6>

          <p class="label-employee">
            <span>{{ $t('employee') }} :</span> <span>{{ data?.observer?.name }}</span>
          </p>
          <p class="label-item-primary">
            <span>{{ $t(`${GetHeader(data.type)} Type`) }} :</span>
            <span>{{ data?.typeModel?.title }}</span>
          </p>

          <div
            class="flex flex-col items-start gap-2"
            v-if="data?.type != Observation.ObservationType && data?.actionStatus"
          >
            <p>{{ $t(`toggle status`) }}</p>
            <CustomCheckboxToggle
              :index="data.id"
              title=""
              :checked="data.actionStatus == 1"
              @update:checked="ToogleStatus(data.id)"
            />
          </div>
        </div>
        <!-- <div class="card-details">
          <p class="subtitle">{{ data?.description }}</p>
          <div class="project-details">
            <p class="label-item-primary" v-if="data?.equipment?.title">
              {{ $t('Machine') }} : <span>{{ data?.equipment?.title }}</span>
            </p>
          </div>
        </div> -->
      </div>
      <div
        class="card_status"
        v-if="data?.type != Observation.ObservationType && data?.actionStatus"
      >
        <p>{{ $t('status') }}</p>
        <h6>{{ $t(`${GetStatus(data?.actionStatus)}`) }}</h6>
      </div>

      <!-- if we want add imge -->
      <!-- <div class="observer-container" v-if="data?.observer.name">
        <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="30" height="30" />
        <p class="title">{{ data?.observer.name }}</p>
        <span class="observer">{{ $t('observer') }}</span>
      </div> -->
      <!-- <p class="title">{{ data?.observer. }}</p> -->
      <!-- <div class="card-info">
        <span v-if="data?.riskLevel" class="observation-risk-level" :class="GetRiskLevel(data?.riskLevel)">
          {{ GetRiskLevel(data?.riskLevel) }} Level
        </span>
        <Image v-if="data?.media[0]?.url" :src="data?.media[0]?.url" alt="Image" preview>
          <template #previewicon>
            <div class="perview">
              <span>view</span>
              <ViewIcon />
            </div>
          </template>
</Image>
</div> -->
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
