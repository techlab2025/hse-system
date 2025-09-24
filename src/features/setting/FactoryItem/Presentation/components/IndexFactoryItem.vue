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
import IndexFactoryItemController from '@/features/setting/FactoryItem/Presentation/controllers/indexFactoryItemController.ts'
import IndexFactoryItemParams from '@/features/setting/FactoryItem/Core/params/indexFactoryItemParams.ts'
import DeleteFactoryItemParams from '@/features/setting/FactoryItem/Core/params/deleteFactoryItemParams.ts'
import DeleteFactoryItemController from '@/features/setting/FactoryItem/Presentation/controllers/deleteFactoryItemController.ts'

const { t } = useI18n()

// import DialogChangeStatusFactory from "@/features/setting/Factoryuages/Presentation/components/Factory/DialogChangeStatusFactory.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexFactoryController = IndexFactoryItemController.getInstance()
const state = ref(indexFactoryController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<FactoryStatusEnum>(FactoryStatusEnum[route.params.type as keyof typeof FactoryStatusEnum])

const fetchFactory = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteFactoryParams = new IndexFactoryItemParams(query, pageNumber, perPage, withPage, id)
  await indexFactoryController.getData(deleteFactoryParams)
}

onMounted(() => {
  fetchFactory()
})

const searchFactory = debounce(() => {
  fetchFactory(word.value)
})

const deleteFactory = async (id: number) => {
  const deleteFactoryParams = new DeleteFactoryItemParams(id)
  await DeleteFactoryItemController.getInstance().deleteFactory(deleteFactoryParams)
  await fetchFactory()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchFactory('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchFactory('', currentPage.value, countPerPage.value)
}

watch(
  () => indexFactoryController.state.value,
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

const actionList = (id: number, deleteFactory: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/factory-item/${id}`,
    permission: [
      PermissionsEnum.FACTORY_ITEM_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.FACTORY_ITEM_ALL,
    ],
  },
  // {
  //   text: t('add_sub_FACTORY'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.FACTORY_ITEM_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.FACTORY_ITEM_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_FACTORYs'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-types/${id}`,
  //   permission: [
  //     PermissionsEnum.FACTORY_ITEM_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.FACTORY_ITEM_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteFactory(id),
    permission: [
      PermissionsEnum.FACTORY_ITEM_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.FACTORY_ITEM_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchFactory())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchFactory"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportExcel
          :data="state.data!"
          :columns="customColumns"
          filename="formatted_export"
          sheet-name="Equipment Type Data"
          button-text="Export Formatted"
          button-class="btn-primary"
        />        <SaveIcon />
      </div>
      <div class="btn btn-secondary flex align-center justify-center">
        <ExportPdf />
        <ExportIcon />
      </div>
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.FACTORY_ITEM_CREATE]">
        <router-link to="/admin/factory-item/add" class="btn btn-primary">
          {{ $t('Add_Factory') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.FACTORY_ITEM_ALL,
      PermissionsEnum.FACTORY_ITEM_DELETE,
      PermissionsEnum.FACTORY_ITEM_FETCH,
      PermissionsEnum.FACTORY_ITEM_UPDATE,
      PermissionsEnum.FACTORY_ITEM_CREATE,
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
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col">{{ $t('all_industries') }}</th>
                <th scope="col">{{ $t('industries') }}</th>
                <th scope="col">{{ $t('factory') }}</th>
                <!--                <th scope="col">{{ $t('image') }}</th>-->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/hazard-type/${item.id}`">{{ item.id }} </router-link>
                </td>
                <td data-label="Name">{{ item.title }}</td>
                <td data-label="all_industries">{{ item.allIndustries ? $t('yes') : $t('no') }}</td>
                <td data-label="all_industries">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : '---'
                  }}
                </td>
                <td data-label="factory">
                  <router-link :to="`/admin/factory-item/${item.id}`">{{
                    item.factory.title
                  }}</router-link>
                </td>
<!--                <td data-label="all_industries">-->
<!--                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />-->
<!--                </td>-->

                <td data-label="Actions">
                  <!--                <DialogChangeStatusFactory-->
                  <!--                  v-if="item.FactoryStatus === FactoryStatusEnum.Draft"-->
                  <!--                  :FactoryId="item.id"-->
                  <!--                  @FactoryChangeStatus="fetchFactory"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteFactory)"
                    @delete="deleteFactory(item.id)"
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
          :link="`admin/add/factory`"
          addText="Add Factory"
          description="Sorry .. You have no Factory .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Factory"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`admin/add/factory`"
          addText="Add Factory"
          description="Sorry .. You have no Factory .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Factory"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Factory .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
