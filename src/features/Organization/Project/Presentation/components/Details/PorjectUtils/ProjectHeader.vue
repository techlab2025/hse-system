<script setup lang="ts">
import DeleteProjectParams from '@/features/Organization/Project/Core/params/deleteProjectParams';
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum';
import DropList from '@/shared/HelpersComponents/DropList.vue';
import ContractorIcon from '@/shared/icons/ContractorIcon.vue';
import IconDelete from '@/shared/icons/IconDelete.vue';
import IconEdit from '@/shared/icons/IconEdit.vue';
import ShowProjectIcon from '@/shared/icons/ShowProjectIcon.vue';
import { useI18n } from 'vue-i18n';
import DeleteProjectController from '../../../controllers/deleteProjectController';
import { useRoute } from 'vue-router';
import ShowProjectYelloHeader from "@/assets/images/ShowProjectYelloHeader.png"
import ShowProjectBlueHeader from "@/assets/images/ShowProjectBlueHeader.png"

const route = useRoute()
const { t } = useI18n()
const props = defineProps<{
  projectName: string
  SerialNumber: string
  Projectdate: string
  Contractors: string
  serialName: string
}>()

const actionList = (id: number, deleteProject: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/project/${id}`,
    permission: [
      PermissionsEnum.PROJECT_UPDATE,
      PermissionsEnum.PROJECT_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PROJECT_ALL,
    ],
  },
  // {
  //   text: t('delete'),
  //   icon: IconDelete,
  //   action: () => deleteProject(id),
  //   permission: [
  //     PermissionsEnum.PROJECT_DELETE,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.PROJECT_ALL,
  //   ],
  // },
]

const deleteProject = async (id: number) => {
  const deleteProjectParams = new DeleteProjectParams(id)
  await DeleteProjectController.getInstance().deleteProject(deleteProjectParams)
}


</script>
<template>
  <div class="project-header-container">
    <img class="bg-yellow" :src="ShowProjectYelloHeader" alt="yello">
    <img class="bg-blue" :src="ShowProjectBlueHeader" alt="blue">
    <div class="project-header">
      <div class="flex project-info">
        <span class="serial">serial : <span>{{ serialName }}</span></span>
        <span class="date">start in : <span>{{ Projectdate }}</span></span>
      </div>
      <p class="project-name">{{ projectName }}</p>
      <div class="project-statics">
        <ContractorIcon class="icon" />
        <span class="contractor">contractor : {{ Contractors }}</span>
      </div>
    </div>
    <DropList :actionList="actionList(route.params.id, deleteProject)" @delete="deleteProject(route.params.id)" />

  </div>
</template>
