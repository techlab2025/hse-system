<script setup lang="ts">
import wordSlice from '@/base/Presentation/utils/word_slice'
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import CertificateImageDialog from '../certificateImageDialog.vue'
import { useUserStore } from '@/stores/user'
import { watch } from 'vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus'
import RentIcon from '@/shared/icons/RentIcon.vue'
import Rent from '@/shared/icons/rent.vue'
import type { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { RentTypeEnum } from '../../../Core/enum/RentTypeEnum'
import { formatTime } from '@/base/Presentation/utils/time_format'
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
    isForm?: boolean
    expiredate: string
    startDate: string
    EndDate: string
    rentType: RentTypeEnum
    typerent?: OrganizationTypeEnum
    deviceStatus?: number
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
    <!-- <div class="texts">
      <h5 class="title">{{ cardType }} Card</h5>
      <span class="subtitle">
        Preview only — data shown is illustrative. Confirm to add the equipment
      </span>
    </div> -->

    <div class="sub-card flex gap-4">
      <img v-if="props.image" :src="props.image" alt="demo card" class="demo-img" />
      <img v-else src="@/assets/images/Rectangle 39931.png" alt="demo card" class="demo-img" />

      <div class="sub-card-body">
        <p v-if="!props.isBreadCramp" class="first-item">device</p>
        <div v-else class="sub-card-header">
          <BreadCrumb :isForm="isForm" :selctedequipment="selctedequipment" :equipmentType="selectedequipmentType"
            :BreadCramps="props.BreadCramps" :cardType="cardType" />
          <!-- <CertificateImageDialog :certificateImage="props.certificateImage" /> -->
        </div>

        <h3 class="demo-title">
          {{ wordSlice(selctedequipment[1]?.title, 40) }}
        </h3>

        <div class="rent_expire">
          <h2 class="expire_date" v-if="expiredate">
            Certification expiry date : <span>{{ formatJoinDate(expiredate) }}</span>
          </h2>
        </div>
        <div class="rent_expire" v-if="deviceStatus === EquipmentStatus.RENT">
          <div class="date_rent">
            <p class="rent">
              <Rent /> <span>Rent</span> |per {{ RentTypeEnum[rentType] }}
            </p>
            <h6 class="start_date">
              start date :
              <span>{{
                rentType === RentTypeEnum.HOUR
                  ? formatJoinDate(startDate) + ' ' + formatTime(startDate)
                  : formatJoinDate(startDate)
              }}</span>
            </h6>
            <h6 class="end_date">
              end date :
              <span>{{
                rentType === RentTypeEnum.HOUR
                  ? formatJoinDate(EndDate) + ' ' + formatTime(EndDate)
                  : formatJoinDate(EndDate)
              }}</span>
            </h6>
          </div>
        </div>
        <!-- <div class="inspection">
          <span>{{ $t('inspection date') }}:</span>
          <p class="font-semibold text-[#4B5563]">
            {{ wordSlice(props.inspectionDuration, 20) }}
          </p>
        </div> -->

        <!-- <div class="date">
          {{ $t(' Inspection expiry date') }}:
          <span>
            {{
              props.decommissioningDate
                ? new Date(props.decommissioningDate).toLocaleDateString()
                : 'Y / M / D'
            }}
          </span>
        </div> -->
      </div>
    </div>
  </div>
</template>
