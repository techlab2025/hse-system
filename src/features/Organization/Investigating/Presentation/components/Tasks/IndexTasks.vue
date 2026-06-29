<script lang="ts" setup>
// import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
// import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'

import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
// import DeleteEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/deleteEquipmentTypeController'
// import DeleteEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/deleteEquipmentTypeParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'

import Search from '@/shared/icons/Search.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import IconEye from '@/shared/icons/IconEye.vue'

import IndexTasksParams from '../../../Core/params/Tasks/indexTasksParams'
import IndexTasksController from '../../controllers/Tasks/indexTasksController'
import InvestegaionResultTasksAnswerCard from '../InvestegationResultAnswer/InvestegationResultAnswerUtils/InvestegaionResultTasksAnswerCard.vue'

const { t } = useI18n()

// import DialogChangeStatusEquipmentType from "@/features/setting/EquipmentTypes/Presentation/components/EquipmentType/DialogChangeStatusEquipmentType.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexTasksController = IndexTasksController.getInstance()
const state = ref(indexTasksController.state.value)
const route = useRoute()
const router = useRouter()
let id = route.params.id

// const type = ref<EquipmentTypeStatusEnum>(EquipmentTypeStatusEnum[route.params.type as keyof typeof EquipmentTypeStatusEnum])

const fetchTasks = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteEquipmentTypeParams = new IndexTasksParams(
    query,
    pageNumber,
    perPage,
    withPage,
    route.params.id ? Number(route.params.id) : null,
  )
  await indexTasksController.indexTasks(deleteEquipmentTypeParams, router)
}

onMounted(() => {
  fetchTasks()
})

const searchEquipmentType = debounce(() => {
  fetchTasks(word.value)
})

const clearSearch = () => {
  word.value = ''
  fetchTasks()
}

// const deleteEquipment = async (id: number) => {
//   const deleteEquipmentParams = new DeleteEquipmentParams(id)
//   await DeleteEquipmentController.getInstance().deleteEquipment(deleteEquipmentParams)
//   await fetchEquipment()
// }

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchTasks('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchTasks('', currentPage.value, countPerPage.value)
}

watch(
  () => indexTasksController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const { user } = useUserStore()

const actionList = (id: number, deleteEquipment: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipment/${id}`,
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
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/equipment-mangement/inspection/add/${id}`,
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
    link: `/${
      user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
    }/equipment-show/${id}`,
    permission: [
      PermissionsEnum.EQUIPMENT_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_DETAILS,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_ALL,
    ],
  },
  // {
  //   text: t('delete'),
  //   icon: IconDelete,
  //   action: () => deleteEquipment(id),
  //   permission: [
  //     PermissionsEnum.EQUIPMENT_DELETE,
  //     PermissionsEnum.ORG_EQUIPMENT_DELETE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.EQUIPMENT_ALL,
  //     PermissionsEnum.ORG_EQUIPMENT_ALL,
  //   ],
  // },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    id = Newvalue
    fetchTasks()
  },
)
</script>

<template>
  <main class="tasks-index-page investegation-result-answer-container">
    <section class="tasks-index-toolbar">
      <div class="toolbar-copy">
        <span>Investigation tasks</span>
        <h1>All corrective and preventive tasks</h1>
      </div>

      <div class="input-search tasks-search">
        <span class="icon-remove" @click="clearSearch">
          <Search />
        </span>
        <input
          v-model="word"
          :placeholder="'Search tasks'"
          class="input"
          type="text"
          @input="searchEquipmentType"
        />
      </div>
    </section>

    <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE]">
      <DataStatus :controller="state">
        <template #success>
          <section class="tasks-board">
            <div class="tasks-board-header">
              <div>
                <span>Task board</span>
                <h2>{{ state.data?.length || 0 }} tasks</h2>
              </div>
              <p>Review assignments, due dates, status, and task answers.</p>
            </div>


          
            <div class="tasks-index-grid">
              <InvestegaionResultTasksAnswerCard
                v-for="(task, index) in state.data"
                :key="task?.id || index"
                :task="task"
                @answered="fetchTasks(word, currentPage, countPerPage)"
              />
            </div>
          </section>

          <Pagination
            :pagination="state.pagination"
            @changePage="handleChangePage"
            @countPerPage="handleCountPerPage"
          />
        </template>
        <template #loader>
          <TableLoader :cols="3" :rows="10" />
        </template>
        <template #initial>
          <TableLoader :cols="3" :rows="10" />
        </template>
        <template #empty>
          <DataEmpty
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/add/EquipmentType`"
            addText="Add EquipmentType"
            description="Sorry .. You have no EquipmentTypes .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No EquipmentTypes"
          />
        </template>
        <template #failed>
          <DataFailed
            :link="`/${
              user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'
            }/add/EquipmentType`"
            addText="Add EquipmentType"
            description="Sorry .. You have no EquipmentType .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No EquipmentTypes"
          />
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          addText="Have not  Permission"
          description="Sorry .. You have no EquipmentType .. All your joined customers will appear here when you add your customer data"
        />
      </template>
    </PermissionBuilder>
  </main>
</template>

<style scoped lang="scss">
.tasks-index-toolbar + div{
  width: 100%;
}
.tasks-index-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 16px;
}
.tasks-index-toolbar,
.tasks-index-toolbar div,
.tasks-index-toolbardiv div
{
  width: 100%;
}
.tasks-index-toolbar,
.tasks-board {
  border: 1px solid #e6edf7;
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.96)), #ffffff;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);
}

.tasks-index-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  align-items: center;
  gap: 18px;
  padding: 18px;
}

.toolbar-copy,
.tasks-board-header {
  span {
    color: var(--PrimaryColor);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2 {
    margin: 4px 0 0;
    color: #0f172a;
    font-family: 'Bold';
    font-weight: 900;
    line-height: 1.25;
  }

  h1 {
    font-size: clamp(20px, 2vw, 28px);
  }

  h2 {
    font-size: 18px;
  }
}

.tasks-search {
  position: relative;
  width: 100%;
  margin: 0;

  .icon-remove {
    position: absolute;
    inset-inline-start: 12px;
    top: 50%;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(29, 78, 216, 0.08);
    color: var(--PrimaryColor);
    cursor: pointer;
    transform: translateY(-50%);
  }

  .input {
    width: 100%;
    min-height: 46px;
    border: 1px solid #dbe5f2;
    border-radius: 8px;
    background: #ffffff;
    padding-inline-start: 52px;
    font-weight: 700;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:focus {
      border-color: rgba(29, 78, 216, 0.34);
      box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08);
      outline: none;
    }
  }
}

.tasks-board {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  width: 100%;
}

.tasks-board-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px dashed #dbe5f2;

  p {
    max-width: 420px;
    margin: 0;
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.6;
    text-align: end;
  }
}

.tasks-index-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(310px, 1fr));
  gap: 14px;
}

@media (max-width: 820px) {
  .tasks-index-toolbar,
  .tasks-board-header {
    grid-template-columns: 1fr;
  }

  .tasks-index-toolbar,
  .tasks-board-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .tasks-board-header p {
    max-width: none;
    text-align: start;
  }
}

@media (max-width: 520px) {
  .tasks-index-page {
    padding: 10px;
  }

  .tasks-index-toolbar,
  .tasks-board {
    padding: 12px;
  }

  .tasks-index-grid {
    grid-template-columns: 1fr;
  }
}
</style>
