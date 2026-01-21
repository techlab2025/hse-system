<script setup lang="ts">
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import type ProjectLocationEquipmentModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEquipmentModel';
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum';
import ToolIcon from '@/shared/icons/ToolIcon.vue';
import Rent from "@/assets/images/Rent.png";
import RentIcon from '@/shared/icons/RentIcon.vue';
import Helmet from "@/assets/images/Helmet.png";
import WareHouseIcon from "@/assets/images/WareHouseIcon.png";
import mark from "@/assets/images/mark.png";
import { useUserStore } from '@/stores/user';
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import IconEye from '@/shared/icons/IconEye.vue'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { EquipmentStatus } from '@/features/setting/Equipment/Core/enum/equipmentStatus';
import EquipmentCardImgDialog from '@/features/setting/Equipment/Presentation/components/EquipmentUtils/EquipmentCardImgDialog.vue';
import type EquipmentDetailsModel from '@/features/setting/Equipment/Data/models/equipmentDetailsModel';
import LastInspectionIcon from '@/shared/icons/LastInspectionIcon.vue';

const { t } = useI18n()

const props = defineProps<{
  tool: EquipmentDetailsModel
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
</script>

<template>

  <!-- <pre>{{ tool }}</pre> -->


  <div class="project-equipment-card">
    <router-link :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
      }/equipment-show/${props?.tool?.id}`">
      <div class="tool-card equipment-card w-full" :class="isSelect ? 'is-select' : ''">
        <div class="tool-card-header w-full">
          <img :src="tool?.equipment?.image || '/src/assets/images/logo.svg'" alt="tool" @error="setDefaultImage">
          <div class="tool-card-header-text w-full">
            <div class="flex gap-2 w-full items-center justify-between card-type">
              <div class="flex items-center gap-2">
                <span class="subtype" v-if="tool?.equipment?.equipment_type">
                  <span class="subtype-title">
                    {{ GetEquipmentType(tool?.equipment?.equipment_type?.type) }}
                  </span>
                  <span class="arrow">></span>
                </span>
                <p class="title" v-if="tool?.equipment?.title">{{ tool?.equipment?.title }}</p>
              </div>

              <EquipmentCardImgDialog :Visable="DialogVisable" :img="tool?.equipment?.certificateImage" />
              <!-- <DropList v-if="!isSelect" :actionList="actionList(tool.id, deleteEquipment)"
            @delete="deleteEquipment(tool.id)" /> -->
              <p class="serial-number">#{{ tool?.equipment?.serial_number }}</p>

            </div>
            <p class="type flex gap-2">
              <span class="main-type">{{ tool?.equipment?.title }}</span>
              <!-- <img :src="Rent" alt="rent" > -->
              <RentIcon v-if="tool?.equipment?.status == EquipmentStatus.RENT" class="icon" />
            </p>

            <div class="equipment-project-info" v-if="tool?.equipment?.project?.title">
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
            </div>
            <div class="equipment-project-info" v-if="tool?.equipment?.warehouse && !tool?.equipment?.project?.title">
              <img :src="WareHouseIcon" alt="helmet">
              <div class="project-data">
                <p class="project-name"><span class="project-name-title">{{ tool?.equipment?.warehouse?.name }}</span>
                </p>
              </div>
            </div>

            <div class="equipment-inspections-info">
              <p class="inspection-data">inspections No <span>{{ tool?.equipment?.inspections_count }}</span></p>
              <p class="inspection-data">results No <span>{{ tool?.equipment?.inspections_with_result_count }}</span>
              </p>
            </div>
            <div class="last-inspection-info-container" v-if="tool?.equipment?.lastest_inspection_result">
              <p class="last-inspection">last inspection</p>
              <div class="last-inspection-info">
                <span class="by">by : <span>{{ `mohab` }}</span></span>
                <span class="date-time">date & Time : <span>{{ `10-20` }}</span></span>
              </div>
              <LastInspectionIcon class="inspection-icon" />
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>

</template>
