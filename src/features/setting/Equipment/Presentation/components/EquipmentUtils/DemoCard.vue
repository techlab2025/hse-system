<script setup lang="ts">
import wordSlice from '@/base/Presentation/utils/word_slice'
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import CertificateImageDialog from '../certificateImageDialog.vue'
import { useUserStore } from '@/stores/user';
import { watch } from 'vue';

const props = withDefaults(
  defineProps<{
    isBreadCramp: boolean
    BreadCramps?: { title: string; link: string }[]
    equipmentName?: string
    inspectionDuration?: string
    image?: string
    decommissioningDate?: string
    certificateImage?: string
    cardType?: string
    selctedequipment: any
    selectedequipmentType: any
  }>(),
  {
    BreadCramps: () => [],
    equipmentName: '',
    inspectionDuration: '',
    image: '',
    decommissioningDate: '',
    certificateImage: '',
  },
)

const { user } = useUserStore()

// const getSelectedLang = (data) => {
//   const currentLang = user?.languages?.[0]?.code || 'en'
//   console.log(data.find(el => el.locale === currentLang)?.title || '', "data.find(el => el.locale === currentLang)?.title || ''");
//   return data.find(el => el.locale === currentLang)?.title || ''
// }

// watch(() => props.selctedequipment, (Newval) => {
//   getSelectedLang(Newval)
// })
</script>

<template>
  <div class="demo-card">
    <div class="texts">
      <h5 class="title">{{ cardType }} Card</h5>
      <span class="subtitle">
        Preview only — data shown is illustrative. Confirm to add the equipment
      </span>
    </div>

    <div class="sub-card">
      <img v-if="props.image" :src="props.image" alt="demo card" class="demo-img" />
      <img v-else src="@/assets/images/Rectangle 39931.png" alt="demo card" class="demo-img" />

      <div class="sub-card-body">

        <p v-if="!props.isBreadCramp" class="first-item">device</p>
        <div v-else class="sub-card-header">
          <BreadCrumb :selctedequipment="selctedequipment" :equipmentType="selectedequipmentType"
            :BreadCramps="props.BreadCramps" :cardType="cardType" />
          <CertificateImageDialog :certificateImage="props.certificateImage" />
        </div>



        <h3 class="demo-title">
          {{ wordSlice(selctedequipment[1]?.title  || $t('equipment name'), 40) }}
        </h3>

        <div class="inspection">
          <span>{{ $t('inspection date') }}:</span>
          <p class="font-semibold text-[#4B5563]">
            {{ wordSlice(props.inspectionDuration, 20) }}
          </p>
        </div>

        <div class="date">
          {{ $t('Date of Decommissioning') }}:
          <span>
            {{
              props.decommissioningDate
                ? new Date(props.decommissioningDate).toLocaleDateString()
                : 'Y / M / D'
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
