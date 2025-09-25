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
import IndexCategoryController from '../controllers/indexCategoryController'
import IndexCategoryParams from '../../Core/params/indexCategoryParams'
import DeleteCategoryParams from '../../Core/params/deleteCategoryParams'
import DeleteCategoryController from '../controllers/deleteCategoryController'

const { t } = useI18n()

// import DialogChangeStatusCategory from "@/features/setting/Categoryuages/Presentation/components/Category/DialogChangeStatusCategory.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexCategoryController = IndexCategoryController.getInstance()
const state = ref(indexCategoryController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<CategoryStatusEnum>(CategoryStatusEnum[route.params.type as keyof typeof CategoryStatusEnum])

const fetchCategory = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteCategoryParams = new IndexCategoryParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexCategoryController.getData(deleteCategoryParams)
}

onMounted(() => {
  fetchCategory()
})

const searchCategory = debounce(() => {
  fetchCategory(word.value)
})

const deleteCategory = async (id: number) => {
  const deleteCategoryParams = new DeleteCategoryParams(id)
  await DeleteCategoryController.getInstance().deleteCategory(deleteCategoryParams)
  await fetchCategory()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCategory('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCategory('', currentPage.value, countPerPage.value)
}

watch(
  () => indexCategoryController.state.value,
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

const actionList = (id: number, deleteCategory: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/category/${id}`,
    permission: [
      PermissionsEnum.CATEGORY_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.CATEGORY_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteCategory(id),
    permission: [
      PermissionsEnum.CATEGORY_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.CATEGORY_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchCategory()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchCategory())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchCategory"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
     <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.EQUIPMENT_TYPE_CREATE]">
        <router-link to="/admin/category/add" class="btn btn-primary">
          {{ $t('Add_Category') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.EQUIPMENT_TYPE_ALL,
      PermissionsEnum.EQUIPMENT_TYPE_DELETE,
      PermissionsEnum.EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.EQUIPMENT_TYPE_CREATE,
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

                <th scope="col">{{ $t('image') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/Category/${item.id}`">{{ item.id }} </router-link>
                </td>
                <td data-label="Name">{{ item.title }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusCategory-->
                  <!--                  v-if="item.CategoryStatus === CategoryStatusEnum.Draft"-->
                  <!--                  :CategoryId="item.id"-->
                  <!--                  @CategoryChangeStatus="fetchCategory"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteCategory)"
                    @delete="deleteCategory(item.id)"
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
          :link="`/admin/category/add`"
          addText="Add category"
          description="Sorry .. You have no Category .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Category"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/category/add`"
          addText="Add Category"
          description="Sorry .. You have no Category .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Category"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Category .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
