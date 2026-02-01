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
import wordSlice from '@/base/Presentation/utils/word_slice'

// import ToggleSwitch from 'primevue/toggleswitch'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
// import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
// import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
// import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexInjuryController from '../controllers/indexInjuryController'
import IndexInjuryParams from '../../Core/params/indexInjuryParams'
import DeleteInjuryParams from '../../Core/params/deleteInjuryParams'
import DeleteInjuryController from '../controllers/deleteInjuryController'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'

const { t } = useI18n()

// import DialogChangeStatusInjury from "@/features/setting/Injuryuages/Presentation/components/Injury/DialogChangeStatusInjury.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexInjuryController = IndexInjuryController.getInstance()
const state = ref(indexInjuryController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<InjuryStatusEnum>(InjuryStatusEnum[route.params.type as keyof typeof InjuryStatusEnum])

const fetchInjury = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteInjuryParams = new IndexInjuryParams(query, pageNumber, perPage, withPage)
  await indexInjuryController.getData(deleteInjuryParams)
}

onMounted(() => {
  fetchInjury()
})

const searchInjury = debounce(() => {
  fetchInjury(word.value)
})

const deleteInjury = async (id: number) => {
  const deleteInjuryParams = new DeleteInjuryParams(id)
  await DeleteInjuryController.getInstance().deleteInjury(deleteInjuryParams)
  await fetchInjury()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchInjury('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchInjury('', currentPage.value, countPerPage.value)
}

watch(
  () => indexInjuryController.state.value,
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

const actionList = (id: number, deleteInjury: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/Injury/${id}`,
    permission: [
      PermissionsEnum.INJURY_UPDATE,
      PermissionsEnum.INJURY_DETAILS,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.INJURY_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteInjury(id),
    permission: [
      PermissionsEnum.INJURY_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.INJURY_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchInjury()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2" >
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchInjury())">
        <Search />
      </span>
      <input v-model="word" :placeholder="$t('search')" class="input" type="text" @input="searchInjury" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.INJURY_CREATE]">
        <router-link to="/organization/injury/add" class="btn btn-primary">
          {{ $t('Add_Injury') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder :code="[
    PermissionsEnum.ORGANIZATION_EMPLOYEE,
    PermissionsEnum.INJURY_ALL,
    PermissionsEnum.INJURY_DELETE,
    PermissionsEnum.INJURY_FETCH,
    PermissionsEnum.INJURY_UPDATE,
    PermissionsEnum.INJURY_CREATE,
  ]">
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>

                <!-- <th scope="col">{{ $t('phone') }}</th> -->
                <!-- <th scope="col">{{ $t('status') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/injury/${item.id}`">{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <!-- <td data-label="phone">
                  {{ item.phone }}
                </td> -->

                <td data-label="Actions">
                  <!--                <DialogChangeStatusInjury-->
                  <!--                  v-if="item.InjuryStatus === InjuryStatusEnum.Draft"-->
                  <!--                  :InjuryId="item.id"-->
                  <!--                  @InjuryChangeStatus="fetchInjury"-->
                  <!--                />-->

                  <DropList :actionList="actionList(item.id, deleteInjury)" @delete="deleteInjury(item.id)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination :pagination="state.pagination" @changePage="handleChangePage" @countPerPage="handleCountPerPage" />
      </template>
      <template #loader>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #initial>
        <TableLoader :cols="3" :rows="10" />
      </template>
      <template #empty>
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.INJURY_CREATE]">
          <DataEmpty :link="`/organization/Injury/add`" addText="Add Injury"
            description="Sorry .. You have no Injury .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Injury" />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.ORGANIZATION_EMPLOYEE, PermissionsEnum?.INJURY_CREATE]">
          <DataFailed :link="`/organization/Injury/add`" addText="Add Injury"
            description="Sorry .. You have no Injury .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Injury" />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed addText="Have not  Permission"
        description="Sorry .. You have no Injury .. All your joined customers will appear here when you add your customer data"
        link="" />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
