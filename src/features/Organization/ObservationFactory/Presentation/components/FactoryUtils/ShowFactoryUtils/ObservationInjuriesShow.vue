<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import acc from '@/assets/images/acc.png'
import Injured from '@/shared/icons/injured.vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import {
  PpeItemConditionEnum,
  PpeItemEnum,
} from '@/features/Organization/ObservationFactory/Core/Enums/ppe_enum'

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()

const ppeItemLabels: Record<number, string> = {
  [PpeItemEnum.SAFETY_GLOVES]: 'Safety Gloves',
  [PpeItemEnum.SAFETY_GOGGLES]: 'Safety Goggles',
  [PpeItemEnum.SAFETY_SHOES]: 'Safety Shoes',
  [PpeItemEnum.HELMET]: 'Helmet',
  [PpeItemEnum.OTHERS]: 'Others',
}

const ppeConditionLabels: Record<number, string> = {
  [PpeItemConditionEnum.GOOD]: 'Good',
  [PpeItemConditionEnum.DAMAGED]: 'Damaged',
  [PpeItemConditionEnum.DEFECTIVE]: 'Defective',
}

const getPpeItemIds = (injury: InjuryDetailsModel) => {
  if (injury.ppe_items?.length) return injury.ppe_items.map((item) => item.ppe_item)
  return injury.ppe_item ? [injury.ppe_item] : []
}

const getPpeItemLabel = (injury: InjuryDetailsModel) => {
  return getPpeItemIds(injury)
    .map((ppeItem) => {
      const label = ppeItemLabels[ppeItem] || String(ppeItem)
      return ppeItem === PpeItemEnum.OTHERS && injury.ppe_item_text
        ? `${label}: ${injury.ppe_item_text}`
        : label
    })
    .join(', ')
}

const getPpeConditionLabel = (condition: number) =>
  ppeConditionLabels[condition] || String(condition)
</script>
<template>
  <!-- <pre>{{ data }}</pre> -->
  <div class="injury-header-container">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="acc" alt="acc" />
        <div class="text">
          <p>{{ $t('There are casualties from the accident.') }}</p>
          <h6>{{ props.data?.length }} {{ $t('injured') }}</h6>
        </div>
      </div>
    </div>
    <div class="card_Injured">
      <div class="all_injured" v-for="injury in props.data" :key="injury.id">
        <div class="Injured_title">
          <Injured />
          <div class="title">
            <p>{{ $t('infection type') }}:</p>
            <h6>{{ wordSlice(injury?.injury_type?.title, 20) }}</h6>
          </div>
        </div>
        <div class="user_note">
          <p class="note">{{ wordSlice(injury?.note, 120) }}</p>
          <div v-if="getPpeItemIds(injury).length || injury.ppe_item_condition" class="ppe-details">
            <p v-if="getPpeItemIds(injury).length">
              <span>{{ $t('PPE Item') }}:</span>
              <strong>{{ getPpeItemLabel(injury) }}</strong>
            </p>
            <p v-if="injury.ppe_item_condition">
              <span>{{ $t('PPE Item Condition') }}:</span>
              <strong>{{ getPpeConditionLabel(injury.ppe_item_condition) }}</strong>
            </p>
          </div>
          <div class="injury-header-employees">
            <img
              :src="
                injury.organization_employee?.image ||
                'https://cyber.comolho.com/static/img/avatar.png'
              "
              alt="user"
            />
            <p>{{ injury?.organization_employee?.name || injury?.employee_name }}</p>
          </div>
          <div v-if="injury.media?.length" class="injury-media">
            <UploadMultiImage
              class="image-upload"
              :initialImages="injury.media.map((item) => item.url)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ppe-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-block: 10px;
}

.injury-media {
  margin-top: 12px;
}

.ppe-details p {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ppe-details span {
  color: var(--text-soft);
}

.ppe-details strong {
  color: var(--text-strong);
  font-weight: 600;
}
</style>
