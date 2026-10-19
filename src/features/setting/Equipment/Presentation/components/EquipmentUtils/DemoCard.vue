<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import wordSlice from '@/base/Presentation/utils/word_slice'
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus'
import Rent from '@/shared/icons/rent.vue'
import { RentTypeEnum } from '../../../Core/enum/RentTypeEnum'
import { formatTime } from '@/base/Presentation/utils/time_format'

type EquipmentTranslation = {
  locale: string
  title: string
}

const props = withDefaults(
  defineProps<{
    identification?: boolean
    qrCode?: string
    serial?: string
    licenseNumber?: string
    isBreadCramp: boolean
    BreadCramps?: { title: string; link: string }[]
    equipmentName?: string
    inspectionDuration?: string
    image?: string
    decommissioningDate?: string
    certificateImage?: string
    cardType?: string
    selctedequipment: EquipmentTranslation[] | string
    selectedequipmentType?: TitleInterface | null
    isForm?: boolean
    expiredate?: string | Date | null
    startDate?: string | Date | null
    EndDate?: string | Date | null
    rentType?: RentTypeEnum
    typerent?: boolean
    deviceStatus?: number
    equipmentTypeInShow?: string
  }>(),
  {
    BreadCramps: () => [],
    equipmentName: '',
    inspectionDuration: '',
    image: '',
    decommissioningDate: '',
    certificateImage: '',
    selectedequipmentType: null,
    expiredate: null,
    startDate: null,
    EndDate: null,
    rentType: undefined,
  },
)

const { locale } = useI18n()
const resolvedName = computed(() =>
  typeof props.selctedequipment === 'string'
    ? props.selctedequipment
    : props.selctedequipment?.find((item) => item.locale === locale.value)?.title ||
      props.equipmentName,
)
const labelDates = computed(() => [
  { label: 'eq_start_date', value: props.startDate },
  { label: 'eq_end_date', value: props.EndDate },
  { label: 'CertificateExpireDate', value: props.expiredate },
])
const displayDate = (value: string | Date | null | undefined) =>
  value
    ? props.rentType === RentTypeEnum.HOUR
      ? `${formatJoinDate(value)} ${formatTime(value)}`
      : formatJoinDate(value)
    : '—'
</script>

<template>
  <!-- {{ props }} -->
  <article
    v-if="identification"
    class="eq-label"
    :style="{ direction: locale === 'ar' ? 'rtl' : 'ltr' }"
  >
    <div class="eq-label-information">
      <p class="eq-label-category">
        {{ selectedequipmentType?.title || equipmentTypeInShow || $t('Equipment') }}
      </p>
      <h3>{{ resolvedName || equipmentName || '—' }}</h3>
      <span v-if="deviceStatus" class="eq-label-status"
        >{{ $t(deviceStatus === EquipmentStatus.RENT ? 'Rent' : 'Owned')
        }}<template v-if="rentType"> · {{ $t(RentTypeEnum[rentType]) }}</template></span
      >
      <dl class="eq-label-fields">
        <div v-if="serial">
          <dt>{{ $t('serial name') }}</dt>
          <dd>{{ serial }}</dd>
        </div>
        <div v-if="licenseNumber">
          <dt>{{ $t('License number') }}</dt>
          <dd>{{ licenseNumber }}</dd>
        </div>
        <div v-for="field in labelDates" :key="field.label">
          <dt>{{ $t(field.label) }}</dt>
          <dd>{{ displayDate(field.value) }}</dd>
        </div>
        <div v-if="inspectionDuration">
          <dt>{{ $t('eq_inspection_frequency') }}</dt>
          <dd>{{ inspectionDuration }}</dd>
        </div>
      </dl>
    </div>
    <figure v-if="qrCode" class="eq-label-qr">
      <img :src="qrCode" :alt="$t('equipment_qr_code')" width="120" height="120" />
      <figcaption>{{ $t('eq_scan_equipment') }}</figcaption>
    </figure>
    <p v-else class="eq-muted">{{ $t('eq_qr_unavailable') }}</p>
  </article>
  <div v-else class="demo-card">
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
          <BreadCrumb
            :isForm="isForm"
            :selctedequipment="resolvedName || equipmentName"
            :equipmentType="selectedequipmentType"
            :equipment="equipmentTypeInShow"
            :BreadCramps="props.BreadCramps"
            :cardType="cardType"
          />
          <!-- <CertificateImageDialog :certificateImage="props.certificateImage" /> -->
        </div>

        <h3 class="demo-title">
          {{ wordSlice(resolvedName, 40) || equipmentName }}
        </h3>

        <div class="rent_expire">
          <h2 class="expire_date" v-if="expiredate">
            {{ $t('CertificateExpireDate') }} : <span>{{ formatJoinDate(expiredate) }}</span>
          </h2>
        </div>
        <div class="rent_expire" v-if="deviceStatus === EquipmentStatus.RENT">
          <div class="date_rent">
            <p class="rent" v-if="rentType">
              <Rent /> <span>Rent</span> |per {{ RentTypeEnum[rentType] }}
            </p>
            <h6 class="start_date">
              start date :
              <span>{{
                rentType === RentTypeEnum.HOUR
                  ? formatJoinDate(startDate!) + ' ' + formatTime(startDate!)
                  : formatJoinDate(startDate!)
              }}</span>
            </h6>
            <h6 class="end_date">
              end date :
              <span>{{
                rentType === RentTypeEnum.HOUR
                  ? formatJoinDate(EndDate!) + ' ' + formatTime(EndDate!)
                  : formatJoinDate(EndDate!)
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
          {{ $t('Inspection expiry date') }}:
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
<style scoped>
.demo-img {
  max-width: 90px !important;
  max-height: 90px !important;
}
</style>
