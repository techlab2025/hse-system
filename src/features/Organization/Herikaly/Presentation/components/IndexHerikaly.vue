<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ToggleSwitch from 'primevue/toggleswitch'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexHerikalyController from '../controllers/indexHerikalyController'
import IndexHerikalyParams from '../../Core/params/indexHerikalyParams'
import DeleteHerikalyParams from '../../Core/params/deleteHerikalyParams'
import DeleteHerikalyController from '../controllers/deleteHerikalyController'
import ChangeStatusHerikalyParams from '../../Core/params/changeStatusHerikalyParams'
import ChangeStatusHerikalyController from '../controllers/changeStatusHerikalyController'
import wordSlice from '@/base/Presentation/utils/word_slice'
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import Heirarchy from '@/assets/images/Heirarchy.png'
import Timeline from 'primevue/timeline'
import EmployeeIcon from '@/shared/icons/EmployeeIcon.vue'
import TreeTimeLine from './TreeTimeLine.vue'

const { t } = useI18n()

// import DialogChangeStatusHerikaly from "@/features/setting/Herikalyuages/Presentation/components/Herikaly/DialogChangeStatusHerikaly.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHerikalyController = IndexHerikalyController.getInstance()
const state = ref(indexHerikalyController.state.value)
const route = useRoute()
// const type = ref<HerikalyStatusEnum>(HerikalyStatusEnum[route.params.type as keyof typeof HerikalyStatusEnum])

const fetchHerikaly = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const HerikalyParams = new IndexHerikalyParams(query, pageNumber, perPage, withPage)
  await indexHerikalyController.getData(HerikalyParams)
}

onMounted(() => {
  fetchHerikaly()
})

const searchHerikaly = debounce(() => {
  fetchHerikaly(word.value)
})

const deleteHerikaly = async (id: number) => {
  const deleteHerikalyParams = new DeleteHerikalyParams(id)
  await DeleteHerikalyController.getInstance().deleteHerikaly(deleteHerikalyParams)
  await fetchHerikaly()
}

const changeStatusHerikaly = async (id: number) => {
  const changeStatusHerikalyParams = new ChangeStatusHerikalyParams(id)
  await ChangeStatusHerikalyController.getInstance().changeStatusHerikaly(
    changeStatusHerikalyParams,
  )
  await fetchHerikaly()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHerikaly('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHerikaly('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHerikalyController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, deleteHerikaly: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/organization/herikaly/${id}`,
    permission: [
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },
  {
    text: t('add_sub_herikaly'),
    icon: IconEdit,
    link: `/organization/herikaly/add/${id}`,
    permission: [
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHerikaly(id),
    permission: [
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
    ],
  },
]

const Hierarchies = ref([
  {
    title: 'Hierarchy 1',
    children: [
      {
        title: 'Level 2-A',
        children: [
          {
            title: 'Level 3-A',
            children: [{ title: 'Level 4-A' }],
          },
        ],
      },
    ],
  },
  {
    title: 'Hierarchy 2',
    children: [
      {
        title: 'Level 2-B',
        children: [
          {
            title: 'Level 3-B',
            children: [{ title: 'Level 4-B' }],
          },
        ],
      },
    ],
  },
  {
    title: 'Hierarchy 3',
    children: [
      {
        title: 'Level 3-C',
        children: [
          {
            title: 'Level 3-C',
            children: [{ title: 'Level 4-C' }],
          },
        ],
      },
    ],
  },
])
</script>

<template>
  <PagesHeader
    :title="$t('functional Hierarchy')"
    :subtitle="`Define the hierarchy and assign roles for your project team`"
    :img="Heirarchy"
  />
  <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchHerikaly())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchHerikaly" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.HERIKALY_CREATE]">
        <router-link to="/organization/herikaly/add" class="btn btn-primary">
          {{ $t('Add_kerikaly') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div> -->

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
      PermissionsEnum.HERIKALY_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <!-- :Hierarchies="" -->
        <TreeTimeLine :Hierarchies="state.data" @delete-data="fetchHerikaly" />
        <div class="btn-container">
          <router-link to="/organization/herikaly/add" class="btn btn-primary add-btn">
            {{ $t('add_new_heirarchy') }}
          </router-link>
          <button class="btn btn-secondary edit-btn">edit</button>
        </div>
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
          :link="`/organization/herikaly/add`"
          addText="Add Herikaly"
          description="Sorry .. You have no Herikaly .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Herikaly"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/herikaly/add`"
          addText="Add Herikaly"
          description="Sorry .. You have no Herikaly .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Herikaly"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Herikaly .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
