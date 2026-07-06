<script setup lang="ts">
import DropList from '@/shared/HelpersComponents/DropList.vue'
import type OrganizatoinEmployeeDetailsModel from '../../../Data/models/OrganizatoinEmployeeDetailsModel'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useI18n } from 'vue-i18n'
import DeleteOrganizatoinEmployeeParams from '../../../Core/params/deleteOrganizatoinEmployeeParams'
import DeleteOrganizatoinEmployeeController from '../../controllers/deleteOrganizatoinEmployeeController'
import { useRouter } from 'vue-router'
import PrintIcon from '@/shared/icons/PrintIcon.vue'
import employeeFallback from '@/assets/images/employee-img.png'
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
  // {
  //   text: t('show'),
  //   icon: IconEdit,
  //   link: `/organization/organization-employee/show/${id}`,
  //   permission: [PermissionsEnum.CREATE_PERMISSION, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  // },
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
  {
    text: t('print'),
    icon: PrintIcon,
    action: () => window.print(),
    permission: [
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_EMPLOYEE_ALL,
    ],
  },
]
const router = useRouter()
const deleteOrganizatoinEmployee = async (id: number) => {
  const deleteOrganizatoinEmployeeParams = new DeleteOrganizatoinEmployeeParams(id)
  await DeleteOrganizatoinEmployeeController.getInstance().deleteOrganizatoinEmployee(
    deleteOrganizatoinEmployeeParams,
    router,
  )
  // await fetchOrganizatoinEmployee()
}
</script>

<template>
  <div class="employee-profile-box">
    <div class="employee-img">
      <img :src="state?.image || employeeFallback" :alt="state?.name || 'Employee'" />
    </div>

    <div class="all-info">
      <div class="info-wrapper">
        <div class="employee-info">
          <!-- {{ state?.serial_number }} -->
          <span class="employee-serial employee-serial text-2xl">{{
            state?.serialName || state?.serial_number
          }}</span>

          <div class="employee-name">{{ state?.name || 'Not Selectes' }}</div>
          <div class="employee-position">
            {{ state?.showHierarchy?.map((el) => el.title).join(' - ') }}
          </div>
          <div class="employee-badges">
            <span v-if="state?.is_leader">Team leader</span>
            <span v-if="state?.canAccessDashboard">Dashboard access</span>
            <span v-if="state?.allPermissions">Full permissions</span>
          </div>
        </div>
        <DropList
          class="print-btn"
          :actionList="actionList(state?.id, deleteOrganizatoinEmployee)"
          @delete="deleteOrganizatoinEmployee(state?.id)"
        />
      </div>
      <div class="all-info-row">
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Phone') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.phone || '**********' }}</span>
        </div>
        <div class="all-info-row-item">
          <h4 class="all-info-row-item-label">{{ $t('Email') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.email || 'not-select@mail.com' }}</span>
        </div>
        <div class="all-info-row-item" v-if="state?.startDate">
          <h4 class="all-info-row-item-label">{{ $t('Start Date') }} :</h4>
          <span class="all-info-row-item-value">{{ state?.startDate || 'not-start-date' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-profile-box {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
  overflow: hidden;
  padding: 18px;
  border: 1px solid rgba(221, 226, 237, 0.76);
  border-radius: 26px;
  background:
    radial-gradient(circle at 0 0, rgba(29, 78, 216, 0.14), transparent 32%),
    linear-gradient(135deg, #ffffff, #f8fbff);
  box-shadow: 0 22px 48px rgba(15, 25, 39, 0.08);
}

.employee-profile-box::before {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  content: '';
  background: linear-gradient(180deg, #1d4ed8, #4aae3a);
}

.employee-img {
  position: relative;
  z-index: 1;
}

.employee-img img {
  width: 132px;
  height: 132px;
  border: 5px solid #fff;
  border-radius: 24px;
  object-fit: cover;
  box-shadow: 0 18px 34px rgba(15, 25, 39, 0.14);
}

.all-info {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}

.info-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.employee-info {
  min-width: 0;
}

.employee-serial {
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 12px !important;
  font-weight: 900;
  background: rgba(29, 78, 216, 0.09);
}

.employee-name {
  margin-top: 8px;
  color: #041953;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 900;
  line-height: 1.1;
}

.employee-position {
  margin-top: 5px;
  color: #607086;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.employee-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
}

.employee-badges span {
  min-height: 26px;
  padding: 5px 9px;
  border: 1px solid rgba(74, 174, 58, 0.2);
  border-radius: 999px;
  color: #287b22;
  font-size: 11px;
  font-weight: 900;
  background: rgba(74, 174, 58, 0.1);
}

.print-btn {
  flex: 0 0 auto;
}

.all-info-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.all-info-row-item {
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(221, 226, 237, 0.82);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.74);
}

.all-info-row-item-label {
  margin: 0 0 5px;
  color: #7a8797;
  font-size: 11px;
  font-weight: 900;
}

.all-info-row-item-value {
  display: block;
  min-width: 0;
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 820px) {
  .employee-profile-box {
    grid-template-columns: 1fr;
  }

  .employee-img img {
    width: 112px;
    height: 112px;
  }

  .all-info-row {
    grid-template-columns: 1fr;
  }
}

@media print {
  .print-btn {
    display: none !important;
  }

  body {
    background: white;
  }

  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
