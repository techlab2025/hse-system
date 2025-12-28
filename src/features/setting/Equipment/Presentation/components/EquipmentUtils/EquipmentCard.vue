<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import type EquipmentDetailsModel from '@/features/_templateFeature/Data/models/equipmentDetailsModel';
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel';
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';
import ToolIcon from '@/shared/icons/ToolIcon.vue';
import type EquipmentModel from '../../../Data/models/equipmentModel';
import Rent from "@/assets/images/Rent.png";
import RentIcon from '@/shared/icons/RentIcon.vue';
import { EquipmentStatus } from '../../../Core/enum/equipmentStatus';
import Helmet from "@/assets/images/Helmet.png";
import mark from "@/assets/images/mark.png";
import EquipmentCardImgDialog from './EquipmentCardImgDialog.vue';

const props = defineProps<{
  tool: EquipmentModel
}>()

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}
</script>

<template>

  <div class="tool-card equipment-card">
    <div class="tool-card-header">
      <img :src="tool?.image || '/src/assets/images/logo.svg'" alt="tool" @error="setDefaultImage">
      <div class="tool-card-header-text w-full">
        <div class="flex gap-2 w-full items-center justify-between card-type">
          <div class="flex items-center gap-2">
            <span class="subtype" v-if="tool?.equipmentType">
              <span class="subtype-title">
                {{ GetEquipmentType(tool?.equipmentType?.type) }}
              </span>
              <span class="arrow">></span>
            </span>
            <p class="title" v-if="tool.equipmentType?.title">{{ tool.equipmentType?.title }}</p>
          </div>

          <EquipmentCardImgDialog :img="tool?.certificateImage" />
        </div>
        <p class="type flex gap-2">
          <span class="main-type">{{ tool.title }}</span>
          <!-- <img :src="Rent" alt="rent" > -->
          <RentIcon v-if="tool.status == EquipmentStatus.RENT" class="icon" />
        </p>

        <div class="equipment-project-info" v-if="tool.project?.title">
          <img :src="Helmet" alt="helmet">
          <div class="project-data">
            <p class="project-name"><span class="project-name-title">{{ tool.project?.title }}</span></p>
            <div class="project-zone-name">
              <img :src="mark" alt="">
              <p> <span class="project-name-title">{{ tool.projectZoon?.title }}</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
