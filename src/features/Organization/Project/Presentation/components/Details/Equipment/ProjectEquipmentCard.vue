<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import RentIcon from '@/shared/icons/RentIcon.vue'
import WareHouseIcon from '@/assets/images/WareHouseIcon.png'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { EquipmentStatus } from '@/features/setting/Equipment/Core/enum/equipmentStatus'
import EquipmentCardImgDialog from '@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCardImgDialog.vue'
import type EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel'
import EquipmentLastInspectionResultDialog from './EquipmentLastInspectionResultDialog.vue'
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel'

const { t } = useI18n()

const props = defineProps<{
  // tool: EquipmentDetailsModel
  tool: ProjectLocationEquipmentModel
  isSelect?: boolean
}>()

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}

const DialogVisable = ref(false)
const emit = defineEmits(['delete:data'])
const deleteEquipment = async (id: number) => {
  emit('delete:data', id)
}
</script>

<template>
  <div class="project-equipment-card">
    <div class="tool-card equipment-card w-full" :class="isSelect ? 'is-select' : ''">
      <div class="tool-card-header w-full">
        <img
          :src="tool?.equipment?.image || '/src/assets/images/logo.svg'"
          alt="tool"
          @error="setDefaultImage"
        />
        <div class="tool-card-header-text w-full">
          <div class="flex gap-2 w-full items-center justify-between card-type">
            <div class="flex items-center gap-2">
              <span class="subtype" v-if="tool?.equipment?.equipment_type">
                <span class="subtype-title">
                  {{ GetEquipmentType(tool?.equipment?.equipment_type?.type) }}
                </span>
                <span class="arrow">></span>
              </span>
              <p class="title" v-if="tool?.equipment?.equipment_type?.title">
                {{ tool?.equipment?.equipment_type?.title }}
              </p>
            </div>
            <EquipmentCardImgDialog
              :Visable="DialogVisable"
              :img="tool?.equipment?.certificateImage"
            />
            <p class="serial-number">#{{ tool?.equipment?.serial_name }}</p>
          </div>
          <p class="type flex gap-2">
            <router-link :to="`/organization/equipment-show/${tool?.equipment?.id || tool.id}`">
              <span class="main-type">{{ tool?.equipment?.title }}</span>
            </router-link>

            <!-- <img :src="Rent" alt="rent" > -->
            <RentIcon v-if="tool?.equipment?.status == EquipmentStatus.RENT" class="icon" />
          </p>

          <!-- <div class="equipment-project-info" v-if="tool?.equipment?.project?.title">
            <img :src="Helmet" alt="helmet">
            <div class="project-data">
              <p class="project-name"><span class="project-name-title">{{ tool?.equipment?.project?.title }}</span>
              </p>
              <div class="project-zone-name">
                <div class="project-zone-name" v-if="tool?.equipment?.projectZoon?.zoon_title">
                  <img :src="mark" alt="">
                  <p> <span class="project-name-title">{{ tool?.equipment?.projectZoon?.zoon_title }}</span></p>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div
            class="equipment-project-info"
            v-if="tool?.equipment?.warehouse && !tool?.equipment?.project?.title"
          >
            <img :src="WareHouseIcon" alt="helmet" />
            <div class="project-data">
              <p class="project-name">
                <span class="project-name-title">{{ tool?.equipment?.warehouse?.name }}</span>
              </p>
            </div>
          </div> -->

          <div class="equipment-inspections-info">
            <p class="inspection-data">
              {{ $t('inspections No') }}
              <span>{{ tool?.equipment?.inspections_count }}</span>
            </p>
            <p class="inspection-data">
              {{ $t('results No') }}
              <span>{{ tool?.equipment?.inspections_with_result_count }}</span>
            </p>
          </div>
        
          <EquipmentLastInspectionResultDialog
            v-if="tool?.equipment?.last_inspection"
            :createdby="tool?.equipment?.last_inspection?.created_by?.name"
            :date="tool?.equipment?.last_inspection?.date"
            :time="tool?.equipment?.last_inspection?.time"
            :taskId="tool?.equipment?.last_inspection?.taskId"
            :lastinspection="true"
          />
        </div>
      </div>
    </div>
    <!-- </router-link> -->
  </div>
</template>
