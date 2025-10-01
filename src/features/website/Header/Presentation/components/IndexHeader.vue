<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
// import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import ToggleSwitch from 'primevue/toggleswitch'

import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum.ts'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexHeaderController from '../controllers/indexHeadersController'
import IndexHeaderParams from '../../Core/params/indexHeaderParams'
import DeleteHeaderParams from '../../Core/params/deleteHeaderParams'
import DeleteHeaderController from '../controllers/deleteHeaderController'
import ChangeStatusHeaderParams from '../../Core/params/changeStatusHeaderParams'
import ChangeStatusHeaderController from '../controllers/changeStatusHeaderController'

const { t } = useI18n()

// import DialogChangeStatusHeader from "@/features/setting/Headeruages/Presentation/components/Header/DialogChangeStatusHeader.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHeaderController = IndexHeaderController.getInstance()
const state = ref(indexHeaderController.state.value)
const route = useRoute()
// const type = ref<HeaderStatusEnum>(HeaderStatusEnum[route.params.type as keyof typeof HeaderStatusEnum])

const fetchHeader = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const HeaderParams = new IndexHeaderParams(query, pageNumber, perPage, withPage)
  await indexHeaderController.getData(HeaderParams)
}

onMounted(() => {
  fetchHeader()
})

const searchHeader = debounce(() => {
  fetchHeader(word.value)
})

const deleteHeader = async (id: number) => {
  const deleteHeaderParams = new DeleteHeaderParams(id)
  await DeleteHeaderController.getInstance().deleteHeader(deleteHeaderParams)
  await fetchHeader()
}

const changeStatusHeader = async (id: number) => {
  const changeStatusHeaderParams = new ChangeStatusHeaderParams(id)
  await ChangeStatusHeaderController.getInstance().changeStatusHeader(changeStatusHeaderParams)
  await fetchHeader()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHeader('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHeader('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHeaderController.state.value,
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

const actionList = (id: number, deleteHeader: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/header/${id}`,
    permission: [
      PermissionsEnum.HEADER_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HEADER_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHeader(id),
    permission: [
      PermissionsEnum.HEADER_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HEADER_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHeader())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHeader"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.HEADER_CREATE]">
        <router-link to="/admin/header/add" class="btn btn-primary">
          {{ $t('Add_Header') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HEADER_ALL,
      PermissionsEnum.HEADER_DELETE,
      PermissionsEnum.HEADER_FETCH,
      PermissionsEnum.HEADER_UPDATE,
      PermissionsEnum.HEADER_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('title') }}</th>
                <th scope="col">{{ $t('subtitle') }}</th>
                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/header/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title, 15) }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle, 20) }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HEADER_ALL,
                      PermissionsEnum.HEADER_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusHeader(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteHeader)"
                    @delete="deleteHeader(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
          :link="`/admin/header/add`"
          addText="Add Header"
          description="Sorry .. You have no Header .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Header"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/header/add`"
          addText="Add Header"
          description="Sorry .. You have no Header .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Header"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Header .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
