<script setup lang="ts">
import BreadCrumb from '@/shared/HelpersComponents/BreadCrumb.vue'
import { useI18n } from 'vue-i18n'
import RentIcons from '@/shared/icons/RentIcons.vue'
import Car from '@/shared/icons/car.vue'
import DropdownIcons from '@/shared/icons/DropdownIcons.vue'
import Popover from 'primevue/popover'
import { computed, ref } from 'vue'
import IconEye from '@/shared/icons/IconEye.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import type EquipmentDetailsModel from '../../../Data/models/equipmentDetailsModel'
import { EquipmentStatus } from '../../../Core/enum/EquipmentStatus'

const { t } = useI18n()

const { equipmentData } = defineProps<{
  equipmentData: EquipmentDetailsModel
}>()

const op = ref()

const actions = ref([
  {
    title: t('edit'),
    icon: IconEdit,
    id: 1,
  },
  {
    title: t('delete'),
    icon: IconDelete,
    id: 2,
  },
  // {
  //   title: t('view'),
  //   icon: IconEye,
  //   id: 3,
  // },
])

const toggle = (event) => {
  op.value.toggle(event)
}

const breadcrumbs = [
  {
    title: t('equipment'),
    link: '',
  },
  {
    title: t('heavy'),
    link: '',
  },
]

const { locale } = useI18n()

const tTitle = computed(() => {
  return equipmentData?.titles?.find((item) => item.locale === locale.value)?.title || ''
})
</script>

<template>
  <div class="card-equipment">
    <img :src="equipmentData.image" alt="" class="img-equipment" />
    <div class="card-body">
      <div class="card-body-content-left">
        <BreadCrumb :BreadCramps="breadcrumbs" />
        <div class="card-body-title">
          <h3 class="title">{{ tTitle }}</h3>
          <RentIcons v-if="equipmentData.status == EquipmentStatus.RENT" />
        </div>
        <div class="inspection">
          <span>{{ $t('inspection date') }} :</span>
          <p>
            {{ equipmentData.inspectionDuration }} <span>({{ $t('per_week') }})</span>
          </p>
        </div>
        <div class="date-of-decommissioning">
          <span>{{ $t('Date of Decommissioning') }} :</span>
          <p>{{ new Date(equipmentData.date).toLocaleDateString() }}</p>
        </div>
        <div class="vehicle">
          <Car />

          <div class="items">
            <div class="item">
              <span>{{ $t('License number') }} : </span>
              <p>{{ equipmentData?.licenseNumber }}</p>
            </div>
            <div class="item">
              <span>{{ $t('Vehicle License No') }} : </span>
              <p>2359874</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body-content-right">
        <div class="card flex justify-center">
          <button @click="toggle" type="button">
            <DropdownIcons />
          </button>

          <Popover ref="op">
            <div class="flex flex-col gap-4">
              <div>
                <ul class="list-none !px-3 !py-1 flex-col m-0 flex gap-3">
                  <li
                    v-for="action in actions"
                    :key="action.id"
                    class="flex flex-col items-start justify-start gap-2 px-2 py-1 hover:bg-emphasis cursor-pointer rounded-border"
                  >
                    <div class="flex items-center gap-3">
                      <component :is="action.icon" />
                      <div class="text-sm text-surface-500 dark:text-surface-400">
                        {{ action.title }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Popover>
        </div>
        <div class="image-content">
          <div class="texts">
            <p>Lorem ipsum dolor</p>
            <span>{{ $t('EXP-Date') }} 12/5/2025</span>
          </div>
          <img :src="equipmentData.certificateImage" alt="" class="" />
        </div>
      </div>
    </div>
  </div>
</template>
