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
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import DeleteEquipmentParams from '../../../Core/params/deleteEquipmentParams'
import DeleteEquipmentController from '../../controllers/deleteEquipmentController'
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'

const { t } = useI18n()

const { equipmentData } = defineProps<{
  equipmentData: EquipmentDetailsModel
}>()

const op = ref()
const { user } = useUserStore()

const route = useRoute()

const actions = ref([
  {
    title: t('edit'),
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/${route.params.id}`,
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

const deleteEquipment = async (id: number) => {
  const deleteEquipmentParams = new DeleteEquipmentParams(+route.params.id!)
  await DeleteEquipmentController.getInstance().deleteEquipment(deleteEquipmentParams)
}

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}
</script>

<template>
  <div class="card-equipment">
    <img
      :src="equipmentData.image || `/src/assets/images/logo.svg`"
      @error="setDefaultImage($event)"
      alt=""
      class="img-equipment"
    />
    <div class="card-body">
      <div class="card-body-content-left">
        <!-- {{ GetEquipmentType(equipmentData?.equipment_type?.type) }} -->
        <BreadCrumb
          :BreadCramps="breadcrumbs"
          :equipment="GetEquipmentType(equipmentData?.equipment_type?.type)"
          :equipmentType="equipmentData?.equipment_type?.title"
        />
        <div class="card-body-title">
          <h3 class="title">{{ tTitle }}</h3>
          <RentIcons v-if="equipmentData.status == EquipmentStatus.RENT" />
        </div>
        <div class="inspection" v-if="equipmentData.lastInspectoinDate">
          <span>{{ $t('inspection date') }} :</span>
          <p>
            {{ equipmentData.lastInspectoinDate }} <span>({{ $t('per_week') }})</span>
          </p>
        </div>
        <!-- <div class="date-of-decommissioning">
          <span>{{ $t('Date of Decommissioning') }} :</span>
          <p>{{ new Date(equipmentData.checkinDate).toLocaleDateString() }}</p>
        </div> -->
        <div class="vehicle">
          <!-- <Car /> -->

          <div class="items">
            <div class="item">
              <span>{{ $t('License number') }} : </span>
              <p>{{ equipmentData?.licensePlateNumber }}</p>
            </div>
            <div class="item" v-if="equipmentData?.kilometer">
              <span>{{ $t('Vehicle Kilometer') }} : </span>
              <p>{{ equipmentData?.kilometer }}</p>
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
                    <RouterLink
                      :to="action.link"
                      class="flex items-center gap-3"
                      v-if="action.id == 1"
                    >
                      <component :is="action.icon" />
                      <div class="text-sm text-surface-500 dark:text-surface-400">
                        {{ action.title }}
                      </div>
                    </RouterLink>

                    <button
                      v-else-if="action.id == 2"
                      @click="deleteEquipment"
                      class="flex items-center gap-3 w-full"
                    >
                      <component :is="action.icon" />
                      <div class="text-sm text-surface-500 dark:text-surface-400">
                        {{ action.title }}
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </Popover>
        </div>
        <div class="image-content">
          <div class="texts">
            <!-- <p>Lorem ipsum dolor</p> -->
            <span>{{ $t('EXP-Date') }} {{ equipmentData?.certificateExppiredDate }}</span>
          </div>
          <img :src="equipmentData.certificateImage" alt="" class="" />
        </div>
      </div>
    </div>
  </div>
</template>
