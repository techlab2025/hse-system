<script setup lang="ts">
import DropList from '@/shared/HelpersComponents/DropList.vue'
import type OrganizatoinEmployeeDetailsModel from '../../../Data/models/OrganizatoinEmployeeDetailsModel'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useI18n } from 'vue-i18n'
// import type OrganizatoinEmployeeDetailsModel from '../../Data/models/OrganizatoinEmployeeDetailsModel'

const { state } = defineProps<{
  state: OrganizatoinEmployeeDetailsModel
}>()



const { t } = useI18n()

const actionList = (id: number, deleteOrganizatoinEmployee: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/organization-employee/${id}`,
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
  {
    text: t('show'),
    icon: IconEdit,
    link: `/organization/organization-employee/show/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    text: t('add_permission'),
    icon: IconEdit,
    link: `/organization/permission/${id}`,
    permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteOrganizatoinEmployee(id),
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
]
</script>

<template>
  <div class="employee-profile-box">
    <div class="employee-img">
      <img src="@/assets/images/employee-img.png" alt="" />
    </div>

    <div class="all-info">
      <div class="info-wrapper">
        <div class="employee-info">
          <div class="employee-position">
            {{ state?.showHierarchy?.map((el) => el.title).join(' - ') }}
          </div>
          <div class="employee-name">{{ state?.name || 'Not Selectes' }}</div>
        </div>
        <DropList
          :actionList="actionList(state?.id, deleteOrganizatoinEmployee)"
          @delete="deleteOrganizatoinEmployee(state?.id)"
        />
      </div>
      <div class="all-info-row">
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Phone') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.phone || '01023456789' }}</span>
        </div>
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Email') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.email || 'Min3m@mail.com' }}</span>
        </div>
        <div class="all-info-row-item" v-if="state?.startDate">
          <h4 class="all-info-row-item-label">{{ $t('Start Date') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.startDate || 'not-start-date' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
