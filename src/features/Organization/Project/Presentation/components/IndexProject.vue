<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import IndexProjectController from '../controllers/indexProjectController'
import IndexProjectParams from '../../Core/params/indexProjectParams'
import ProjectCard from './ProjectUtils/ProjectCard.vue'
import ProjectCardSkelaton from './ProjectUtils/ProjectCardSkelaton.vue'

const { t } = useI18n()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexProjectController = IndexProjectController.getInstance()
const state = ref(indexProjectController.state.value)
const route = useRoute()

const fetchProject = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1
) => {
  const deleteProjectParams = new IndexProjectParams(query, pageNumber, perPage, withPage)
  await indexProjectController.getData(deleteProjectParams)
}

onMounted(() => {
  fetchProject()
})

const searchProject = debounce(() => {
  fetchProject(word.value)
})


const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProject('', currentPage.value, countPerPage.value)
}

const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchProject('', currentPage.value, countPerPage.value)
}

watch(
  () => indexProjectController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  }
)


watch(
  () => route?.params?.id,
  (Newvalue) => {
    fetchProject()
  }
)


</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="; (word = ''), searchProject()">
        <Search />
      </span>
      <input v-model="word" :placeholder="`${t('search')}`" class="input py" type="text" @input="searchProject" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]">
        <router-link to="/organization/project/add" class="btn btn-primary ">
          {{ $t('Add_Project') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.PROJECT_ALL,
    PermissionsEnum.PROJECT_DELETE,
    PermissionsEnum.PROJECT_FETCH,
    PermissionsEnum.PROJECT_UPDATE,
    PermissionsEnum.PROJECT_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="modern-table-responsive mt-2 ">
          <ProjectCard v-for="item in state.data" :key="item.id" :data="item" />
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />

      </template>
      <template #loader>
        <!-- <TableLoader :cols="8" :rows="10" /> -->
        <div class="modern-table-responsive mt-2 flex w-full gap-2 ">
          <ProjectCardSkelaton v-for="item in 6" />
        </div>
      </template>
      <template #initial>
        <TableLoader :cols="8" :rows="10" />
      </template>
      <template #empty>
        <PermissionBuilder :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]">

          <DataEmpty :link="`/organization/project/add`" addText="Add Project"
            description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Project" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PROJECT_CREATE]">

          <DataFailed :link="`/organization/project/add`" addText="Add Project"
            description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Project" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not Permission"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data" />
    </template>
  </PermissionBuilder>
</template>
