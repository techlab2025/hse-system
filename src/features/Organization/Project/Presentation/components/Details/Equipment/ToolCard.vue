<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import type EquipmentDetailsModel from '@/features/_templateFeature/Data/models/equipmentDetailsModel';
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel';
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';
import ToolIcon from '@/shared/icons/ToolIcon.vue';


const props = defineProps<{
  tool: ProjectLocationEquipmentModel
}>()

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}
</script>

<template>

  <div class="tool-card">
    <div class="tool-card-header">
      <img :src="tool?.equipment?.[0]?.image || '/src/assets/images/logo.svg'" alt="tool" @error="setDefaultImage">
      <div class="tool-card-header-text">

        <div class="flex gap-2 items-center card-type">
          <span class="subtype" v-if="tool?.equipment?.[0]?.equipment_type?.type">
            <span>
              {{ GetEquipmentType(tool?.equipment?.[0]?.equipment_type?.type) }}
            </span>
            <span class="arrow">></span>
          </span>
          <p class="title" v-if="tool.equipmenType?.title">{{ tool.equipmenType?.title }}</p>
        </div>
        <p class="type"><span class="main-type">{{ tool.title }}</span></p>




        <!-- <p class="inspection">inspection date : <span class="date">{{ tool.decodedData }}</span> <span class="per">( per week
            )</span></p> -->
      </div>
    </div>
    <hr class="tool-hr">
    <!-- <div class="tool-subtitle">
      <ToolIcon />
      <p class="subtitle">Last Inspection</p>
    </div> -->
    <div class="tool-card-footer">
      <!-- <p class="date">Date: <span>{{ tool.equipment?.[0]?.date }}</span></p> -->
      <!-- <p class="added-by">Added By: <span>{{ tool. }}</span></p> -->
      <!-- <p class="status">Status: <span>{{ tool.status }}</span></p> -->
    </div>
  </div>
</template>
