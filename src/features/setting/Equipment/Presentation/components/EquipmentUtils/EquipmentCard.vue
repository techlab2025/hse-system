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
import WareHouseIcon from "@/assets/images/WareHouseIcon.png";
import mark from "@/assets/images/mark.png";
import EquipmentCardImgDialog from './EquipmentCardImgDialog.vue';
import { useUserStore } from '@/stores/user';
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import IconEye from '@/shared/icons/IconEye.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n()

const props = defineProps<{
  tool: EquipmentModel
  isSelect?: boolean
}>()

const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}

const { user } = useUserStore()

const actionList = (id: number, deleteEquipment: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/${props?.tool.id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('add_inspection'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
      }/equipment-mangement/inspection/add/${props?.tool?.id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('show'),
    icon: IconEye,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
      }/equipment-show/${props?.tool?.id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_DETAILS,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('Cerificate Image'),
    icon: IconEye,
    action: () => DialogVisable.value = true,
    permission: [
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteEquipment(props?.tool?.id),
    permission: [
      PermissionsEnum.EQUIPMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },

]

const DialogVisable = ref(false)
const emit = defineEmits(['delete:data'])
const deleteEquipment = async (id: number) => {
  emit('delete:data', id)
}


import EmptyEquipment from '@/assets/images/EmptyEquipment.png'

function setEquipmentDefaultImage(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = EmptyEquipment
}


</script>

<template>

  <!-- <pre>{{ tool }}</pre> -->

  <div class="tool-card equipment-card w-full" :class="isSelect ? 'is-select' : ''">
    <div class="tool-card-header w-full">


      <img :src="tool?.image || '/src/assets/images/EmptyEquipment.png'" alt="tool" @error="setEquipmentDefaultImage">


      <div class="tool-card-header-text w-full">
        <div class="flex gap-2 w-full items-center justify-between card-type">
          <div class="flex items-center gap-2">
            <span class="subtype" v-if="tool?.equipmentType">
              <span class="subtype-title">
                {{ GetEquipmentType(tool?.equipmentType?.type) }}
              </span>
              <span class="arrow">></span>
            </span>
            <p class="title" v-if="tool?.equipmentType?.title">{{ tool?.equipmentType?.title }}</p>
          </div>

          <EquipmentCardImgDialog :Visable="DialogVisable" :img="tool?.certificateImage" />
          <DropList v-if="!isSelect" :actionList="actionList(tool.id, deleteEquipment)"
            @delete="deleteEquipment(tool.id)" />

        </div>
        <p class="type flex gap-2">
          <span class="main-type">{{ tool?.title }}</span>
          <!-- <img :src="Rent" alt="rent" > -->
          <RentIcon v-if="tool?.status == EquipmentStatus.RENT" class="icon" />
        </p>

        <div class="equipment-project-info" v-if="tool?.project?.title">
          <img :src="Helmet" alt="helmet">
          <div class="project-data">
            <p class="project-name"><span class="project-name-title">{{ tool?.project?.title }}</span></p>
            <div class="project-zone-name">
              <div class="project-zone-name" v-if="tool?.projectZoon?.zoon_title">
                <img :src="mark" alt="">
                <p> <span class="project-name-title">{{ tool?.projectZoon?.zoon_title }}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="equipment-project-info" v-if="tool?.warehouse && !tool?.project?.title">
          <img :src="WareHouseIcon" alt="helmet">
          <div class="project-data">
            <p class="project-name"><span class="project-name-title">{{ tool?.warehouse?.name }}</span></p>
          </div>
        </div>

      </div>

    </div>



  </div>
</template>
