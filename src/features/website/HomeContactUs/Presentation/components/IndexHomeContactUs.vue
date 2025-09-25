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
import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum.ts'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexHomeContactUsController from '../controllers/indexHomeContactUsController'
import IndexHomeContactUsParams from '../../Core/params/indexHomeContactUsParams'
import DeleteHomeContactUsParams from '../../Core/params/deleteHomeContactUsParams'
import DeleteHomeContactUsController from '../controllers/deleteHomeContactUsController'
import ChangeStatusHomeContactUsParams from '../../Core/params/changeStatusHomeContactUs'
import ChangeStatusHomeContactUsController from '../controllers/changeStatusHomeContactUsController'

const { t } = useI18n()

// import DialogChangeStatusHomeContactUs from "@/features/setting/HomeContactUsuages/Presentation/components/HomeContactUs/DialogChangeStatusHomeContactUs.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHomeContactUsController = IndexHomeContactUsController.getInstance()
const state = ref(indexHomeContactUsController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<HomeContactUsStatusEnum>(HomeContactUsStatusEnum[route.params.type as keyof typeof HomeContactUsStatusEnum])

const fetchHomeContactUs = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteHomeContactUsParams = new IndexHomeContactUsParams(
    query,
    pageNumber,
    perPage,
    withPage,
    id,
  )
  await indexHomeContactUsController.getData(deleteHomeContactUsParams)
}

onMounted(() => {
  fetchHomeContactUs()
})

const searchHomeContactUs = debounce(() => {
  fetchHomeContactUs(word.value)
})

const deleteHomeContactUs = async (id: number) => {
  const deleteHomeContactUsParams = new DeleteHomeContactUsParams(id)
  await DeleteHomeContactUsController.getInstance().deleteHomeContactUs(deleteHomeContactUsParams)
  await fetchHomeContactUs()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHomeContactUs('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHomeContactUs('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHomeContactUsController.state.value,
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

const changeStatusHomeContactUs = async (id: number) => {
  const changeStatusHomeContactUsParams = new ChangeStatusHomeContactUsParams(id)
  await ChangeStatusHomeContactUsController.getInstance().changeStatusHomeContactUs(
    changeStatusHomeContactUsParams,
  )
  await fetchHomeContactUs()
}

const actionList = (id: number, deleteHomeContactUs: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/home-contact-us/${id}`,
    permission: [
      PermissionsEnum.HOME_CONTACT_US_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_CONTACT_US_ALL,
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
    action: () => deleteHomeContactUs(id),
    permission: [
      PermissionsEnum.HOME_CONTACT_US_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_CONTACT_US_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHomeContactUs())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHomeContactUs"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.HOME_CONTACT_US_CREATE]">
        <router-link to="/admin/home-contact-us/add" class="btn btn-primary">
          {{ $t('Add_HomeContactUs') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_CONTACT_US_ALL,
      PermissionsEnum.HOME_CONTACT_US_DELETE,
      PermissionsEnum.HOME_CONTACT_US_FETCH,
      PermissionsEnum.HOME_CONTACT_US_UPDATE,
      PermissionsEnum.HOME_CONTACT_US_CREATE,
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
                <th scope="col">{{ $t('button_title') }}</th>

                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/home-contact-us/${item.id}`"
                    >{{ item.id }}
                  </router-link>
                </td>
                <td data-label="title">{{ item.title }}</td>
                <td data-label="subtitle">{{ item.subtitle }}</td>
                <td data-label="button_title">{{ item.button_title }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HOME_CONTACT_US_ALL,
                      PermissionsEnum.HOME_CONTACT_US_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusHomeContactUs(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteHomeContactUs)"
                    @delete="deleteHomeContactUs(item.id)"
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
          :link="`/admin/home-contact-us/add`"
          addText="Add HomeContactUs"
          description="Sorry .. You have no HomeContactUs .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeContactUs"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/home-contact-us/add`"
          addText="Add HomeContactUs"
          description="Sorry .. You have no HomeContactUs .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeContactUs"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no HomeContactUs .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
