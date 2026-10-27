<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus'
import placeholder from '@/assets/images/EmptyEquipment.png'
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
    contractorName?: string
    rentType?: RentTypeEnum | string
    typerent?: boolean
    deviceStatus?: number | string
    equipmentTypeInShow?: string
  }>(),
  {
    BreadCramps: () => [],
    equipmentName: '',
    contractorName: '',
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
    : props.selctedequipment?.find((item) => item.locale === locale.value && item.title?.trim())
        ?.title ||
      props.equipmentName ||
      props.selctedequipment?.find((item) => item.title?.trim())?.title,
)
const isRental = computed(() => Number(props.deviceStatus) === EquipmentStatus.RENT)
const hasOwnership = computed(() =>
  [EquipmentStatus.RENT, EquipmentStatus.OWN].includes(Number(props.deviceStatus)),
)
const rentUnits: Record<number, string> = {
  [RentTypeEnum.HOUR]: 'hour',
  [RentTypeEnum.DAY]: 'day',
  [RentTypeEnum.MONTH]: 'month',
  [RentTypeEnum.YEAR]: 'year',
}
const rentalUnit = computed(() => rentUnits[Number(props.rentType)])
const labelDates = computed(() => [
  ...(isRental.value
    ? [
        {
          label: 'eq_rental_start_date',
          value: props.startDate,
        },
        {
          label: 'eq_rental_end_date',
          value: props.EndDate,
        },
      ]
    : []),
  {
    label: 'eq_certificate_expiry_date',
    value: props.expiredate,
  },
])
const displayDate = (value: string | Date | null | undefined, includeTime = true) => {
  if (!value) return '—'
  const parsedDate = value instanceof Date ? value : new Date(value)
  if (!Number.isFinite(parsedDate.getTime())) return '—'
  return Number(props.rentType) === RentTypeEnum.HOUR && isRental.value && includeTime
    ? `${formatJoinDate(value)} ${formatTime(value)}`
    : formatJoinDate(value)
}
const imageFallback = (event: Event) => {
  const image = event.target as HTMLImageElement
  image.onerror = null
  image.src = placeholder
}
</script>

<template>
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
      <span v-if="hasOwnership" class="eq-label-status"
        >{{ $t(isRental ? 'Rent' : 'Owned')
        }}<template v-if="isRental && rentalUnit"> · {{ $t(rentalUnit) }}</template></span
      >
      <dl class="eq-label-fields">
        <div v-if="isRental">
          <dt>{{ $t('contractor') }}</dt>
          <dd>{{ contractorName || '—' }}</dd>
        </div>
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
          <dd dir="ltr">
            {{ displayDate(field.value, field.label !== 'eq_certificate_expiry_date') }}
          </dd>
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
  <article v-else class="equipment-preview" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="equipment-preview__heading">
      <img
        :src="image || placeholder"
        :alt="resolvedName || equipmentName || $t('Equipment')"
        class="equipment-preview__image"
        @error="imageFallback"
      />
      <div class="equipment-preview__identity">
        <BreadCrumb
          v-if="isBreadCramp"
          :is-form="isForm"
          :selctedequipment="resolvedName || equipmentName"
          :equipment-type="selectedequipmentType"
          :equipment="equipmentTypeInShow"
          :BreadCramps="BreadCramps"
          :card-type="cardType"
        />
        <p v-else class="equipment-preview__category">{{ $t(cardType || 'Equipment') }}</p>
        <h3>{{ resolvedName || equipmentName || '—' }}</h3>
        <span v-if="hasOwnership" class="equipment-preview__status">
          {{ $t(isRental ? 'Rent' : 'Owned') }}
          <template v-if="isRental && rentalUnit"> · {{ $t(rentalUnit) }}</template>
        </span>
      </div>
    </div>
    <dl v-if="expiredate || isRental" class="equipment-preview__fields">
      <div v-if="expiredate">
        <dt>{{ $t('eq_certificate_expiry_date') }}</dt>
        <dd dir="ltr">{{ displayDate(expiredate, false) }}</dd>
      </div>
      <template v-if="isRental">
        <div v-if="contractorName">
          <dt>{{ $t('contractor') }}</dt>
          <dd>{{ contractorName }}</dd>
        </div>
        <div>
          <dt>{{ $t('eq_rental_start_date') }}</dt>
          <dd dir="ltr">{{ displayDate(startDate) }}</dd>
        </div>
        <div>
          <dt>{{ $t('eq_rental_end_date') }}</dt>
          <dd dir="ltr">{{ displayDate(EndDate) }}</dd>
        </div>
      </template>
    </dl>
  </article>
</template>

<style scoped>
.equipment-preview {
  --preview-primary: var(--identity-primary, var(--PrimaryColor));
  --preview-text: var(--identity-sectionText, var(--hse-color-text));
  --preview-surface: var(--identity-sectionBackground, var(--surface-1));
  width: 100%;
  min-width: 0;
  padding: var(--hse-space-5, 20px);
  border: 1px solid var(--main-border);
  border-radius: var(--hse-radius-card, 16px);
  background: var(--preview-surface);
  color: var(--preview-text);
  font-family: var(--identity-fontFamily, inherit);
  box-shadow: none;
}
.equipment-preview__heading {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.equipment-preview__image {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  object-fit: contain;
  padding: 6px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-2);
}
.equipment-preview__identity {
  min-width: 0;
}
.equipment-preview h3 {
  margin: 6px 0;
  color: var(--identity-headingColor, var(--preview-text));
  font-size: var(--identity-fontSize, 16px);
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.equipment-preview__category,
.equipment-preview :deep(.breadcrumbs) {
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font-size: 12px;
}
.equipment-preview :deep(.breadcrumbs ul) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 0;
}
.equipment-preview :deep(.breadcrumbs ul li) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.equipment-preview :deep(.breadcrumbs svg) {
  width: 12px;
  height: 12px;
}
.equipment-preview :deep(.breadcrumbs p),
.equipment-preview :deep(.breadcrumbs span) {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
}
.equipment-preview__status {
  display: inline-flex;
  padding: 3px 9px;
  border-radius: var(--hse-radius-badge, 99px);
  background: color-mix(in srgb, var(--preview-primary) 8%, var(--preview-surface));
  color: var(--preview-primary);
  font-size: 12px;
  font-weight: 500;
}
.equipment-preview__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 16px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--main-border);
}
.equipment-preview__fields div {
  min-width: 0;
}
.equipment-preview__fields dt {
  margin: 0 0 4px;
  color: var(--text-muted);
  font-size: 12px;
}
.equipment-preview__fields dd {
  margin: 0;
  color: var(--preview-text);
  font-size: var(--identity-fontSize, 13px);
  font-weight: 500;
  overflow-wrap: anywhere;
  text-align: start;
}
.equipment-preview__fields dd[dir='ltr'] {
  text-align: match-parent;
}
@media (max-width: 420px) {
  .equipment-preview {
    padding: 16px;
  }
  .equipment-preview__image {
    width: 56px;
    height: 56px;
  }
  .equipment-preview__fields {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
