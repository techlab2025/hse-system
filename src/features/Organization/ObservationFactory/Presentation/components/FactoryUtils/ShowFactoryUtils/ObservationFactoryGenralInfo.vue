<script lang="ts" setup>
import { RiskLevelEnum } from '@/features/Organization/Investigating/Core/Enums/risk_level_enum'
import { ActionStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/ActionStatusEnum'
import { LikelihoodEnum } from '@/features/Organization/ObservationFactory/Core/Enums/LikelihoodEnum'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import { SeverityEnum } from '@/features/Organization/ObservationFactory/Core/Enums/SeverityEnum'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import ActionClosed from '@/shared/icons/ActionClosed.vue'
import ActionOpen from '@/shared/icons/ActionOpen.vue'
import RootCase from '@/shared/icons/RootCase.vue'
import TakeActionIcon from '@/shared/icons/TakeActionIcon.vue'
import WarningIcon from '@/shared/icons/WarningIcon.vue'
import Image from 'primevue/image'
import { ref, watch } from 'vue'

const props = defineProps<{
  data: HazardDetailsModel
}>()

const GetLikelyHood = (value: number) => {
  return LikelihoodEnum[value]
}

const GetSeverity = (value: number) => {
  return SeverityEnum[value]
}

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
// imges
const emit = defineEmits(['update:data', 'update:images'])
const Img = ref()
const textArea = ref('')
const SelectedValues = ref<number[]>([])

const UpdateData = () => {
  emit('update:data', {
    itemid: props.data.media?.length,
    selected: SelectedValues.value,
    img: Img.value,
    notes: textArea.value, // Updated key to match the data structure
  })
}

// Watch for text changes
watch(textArea, () => {
  UpdateData()
})
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}
</script>
<template>
  <div class="observation-genral-info-conatiner">
    <div class="genral-info-content">
      <div class="observation-genral-info">
        <p
          class="like_lihood-container flex flex-col"
          v-if="props.data?.type == Observation.HazardType && props.data?.like_lihood"
        >
          <span class="like_lihood-title">{{ $t('Likelihood') }}</span>
          <span class="like_lihood">{{ GetLikelyHood(props.data?.like_lihood) }}</span>
        </p>

        <div
          class="severity-container flex flex-col"
          v-if="props.data?.type == Observation.HazardType && props.data?.severity"
        >
          <span class="severity-title">{{ $t('Severity') }}</span>
          <span class="severity">{{ GetSeverity(props.data?.severity) }}</span>
        </div>

        <span
          v-if="props.data?.riskLevel && props.data?.type == Observation.HazardType"
          class="observation-risk-level flex items-center gap-2"
          :class="GetRiskLevel(props.data?.riskLevel)"
        >
          <WarningIcon v-if="props.data?.riskLevel == RiskLevelEnum.High" />
          {{ GetRiskLevel(props.data?.riskLevel) }} {{ $t('Level') }}
        </span>

        <div class="flex flex-col gap-2">
          <!-- <p class="observation-type" v-if="props.data?.type != Observation.HazardType">
            {{ GetHeader(props.data?.type) }} {{ $t('Type') }} :
            <span>{{ props.data?.typeModel?.title }}</span>
          </p> -->

          <div
            class="root-causes"
            v-if="props.data?.rootCauses && props.data?.rootCauses.length > 0"
          >
            <div class="icon_title">
              <RootCase />

              <p class="root-causes-title">
                {{ $t('Root Causes') }}
                <span>{{
                  $t('Analyze the main reasons behind the event to prevent recurrence')
                }}</span>
              </p>
            </div>
            <div class="root-causes-content">
              <p v-for="(root, index) in props.data?.rootCauses" :key="index" class="root-title">
                {{ root?.title }}
              </p>
            </div>
          </div>
        </div>

        <div  class="image-container">
          <div class="" v-if="props?.data?.media && props?.data?.media.length > 0">
            <UploadMultiImage
              @update:images="UpdateImg"
              class="image-upload"
              :initialImages="props?.data?.media?.map((el) => el.url) || []"
            />
            
          </div>
          <!-- <Image  :src="value?.url" alt="Image" preview>
            <template #previewicon>
              <div class="perview">
                <span>{{ $t('view') }}</span>
                <ViewIcon />
              </div>
            </template>
          </Image> -->
        </div>
      </div>

      <div
        class="hazard-info w-full flex items-center justify-between gap-2"
        v-if="props.data?.type == Observation.HazardType"
      >
        <div
          class="severity-container flex flex-col"
          v-if="props.data?.type == Observation.HazardType && props.data?.typeModel?.title"
        >
          <span class="severity-title">{{ $t('Hazard Type') }}</span>
          <p class="severity">{{ props.data?.typeModel?.title }}</p>
        </div>

        <!-- <div class="severity-container flex flex-col"
         >
          <span class="severity-title">Hazard </span>
          <p class="severity">{{ props.data?.typeModel?.title }}</p>
        </div> -->

        <div class="severity-container"></div>
        <div class="severity-container"></div>
        <div class="severity-container"></div>
      </div>
    </div>

    <div class="take-action-container" v-if="props?.data?.action">
      <div class="action-container flex items-center gap-2">
        <TakeActionIcon />
        <div class="flex flex-col">
          <p class="emp-text">{{ $t('Emp take an action') }}</p>
          <p class="action-text">{{ props?.data?.action }}</p>
        </div>
      </div>
      <div class="card_status">
        <span></span>
        <p>{{ $t('status') }}</p>
        <h6>{{ $t('open') }}</h6>
      </div>
      <!-- <div class="status-container">
        <div class="status" v-if="props.data?.actionStatus == ActionStatusEnum.OPEN">
          <ActionOpen class="icon" />
          <span>{{ $t('Open') }}</span>
        </div>
        <div class="status" v-else>
          <ActionClosed class="icon" />
          <span>{{ $t('Closed') }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>
