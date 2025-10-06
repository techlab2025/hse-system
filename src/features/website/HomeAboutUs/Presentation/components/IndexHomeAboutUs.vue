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
import IndexHomeAboutUsController from '../controllers/indexHomeAboutUsController'
import IndexHomeAboutUsParams from '../../Core/params/indexHomeAboutUsParams'
import DeleteHomeAboutUsParams from '../../Core/params/deleteHomeAboutUsParams'
import DeleteHomeAboutUsController from '../controllers/deleteHomeAboutUsController'
import ChangeStatusHomeAboutUsParams from '../../Core/params/changeStatusHomeAboutUS'
import ChangeStatusHomeAboutUsController from '../controllers/changeStatusHomeAboutUsController'
// import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'

const { t } = useI18n()

// import DialogChangeStatusHomeAboutUs from "@/features/setting/HomeAboutUsuages/Presentation/components/HomeAboutUs/DialogChangeStatusHomeAboutUs.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHomeAboutUsController = IndexHomeAboutUsController.getInstance()
const state = ref(indexHomeAboutUsController.state.value)
const route = useRoute()
// const type = ref<HomeAboutUsStatusEnum>(HomeAboutUsStatusEnum[route.params.type as keyof typeof HomeAboutUsStatusEnum])

const fetchHomeAboutUs = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteHomeAboutUsParams = new IndexHomeAboutUsParams(query, pageNumber, perPage, withPage)
  await indexHomeAboutUsController.getData(deleteHomeAboutUsParams)
}

onMounted(() => {
  fetchHomeAboutUs()
})

const searchHomeAboutUs = debounce(() => {
  fetchHomeAboutUs(word.value)
})

const deleteHomeAboutUs = async (id: number) => {
  const deleteHomeAboutUsParams = new DeleteHomeAboutUsParams(id)
  await DeleteHomeAboutUsController.getInstance().deleteHomeAboutUs(deleteHomeAboutUsParams)
  await fetchHomeAboutUs()
}

const changeStatusHomeAboutUs = async (id: number) => {
  const changeStatusHomeAboutUsParams = new ChangeStatusHomeAboutUsParams(id)
  await ChangeStatusHomeAboutUsController.getInstance().changeStatusHomeAboutUs(
    changeStatusHomeAboutUsParams,
  )
  await fetchHomeAboutUs()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHomeAboutUs('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHomeAboutUs('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHomeAboutUsController.state.value,
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

const actionList = (id: number, deleteHomeAboutUs: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/home-about-us/${id}`,
    permission: [
      PermissionsEnum.HOME_ABOUT_US_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_ABOUT_US_ALL,
    ],
  },
  // {
  //   text: t('add_sub_HAZARD_type'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.HAZARD_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HAZARD_TYPE_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_HAZARD_types'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-types/${id}`,
  //   permission: [
  //     PermissionsEnum.HAZARD_TYPE_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HAZARD_TYPE_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHomeAboutUs(id),
    permission: [
      PermissionsEnum.HOME_ABOUT_US_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_ABOUT_US_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHomeAboutUs())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHomeAboutUs"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.HOME_ABOUT_US_CREATE]">
        <router-link to="/admin/home-about-us/add" class="btn btn-primary">
          {{ $t('Add_HomeAboutUs') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_ABOUT_US_ALL,
      PermissionsEnum.HOME_ABOUT_US_DELETE,
      PermissionsEnum.HOME_ABOUT_US_FETCH,
      PermissionsEnum.HOME_ABOUT_US_UPDATE,
      PermissionsEnum.HOME_ABOUT_US_CREATE,
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
                <th scope="col">{{ $t('subtitle') }}</th>
                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/home-about-us/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle) }}</td>
                <td data-label="image">
                  <img :src="item.image" width="100" height="100" />
                </td>
                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HOME_ABOUT_US_ALL,
                      PermissionsEnum.HOME_ABOUT_US_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusHomeAboutUs(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteHomeAboutUs)"
                    @delete="deleteHomeAboutUs(item.id)"
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
          :link="`/admin/home-about-us/add`"
          addText="Add HomeAboutUs"
          description="Sorry .. You have no HomeAboutUs .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeAboutUs"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/home-about-us/add`"
          addText="Add HomeAboutUs"
          description="Sorry .. You have no HomeAboutUs .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeAboutUs"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no HomeAboutUs .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
