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
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image.ts'
import IndexAboutUsFeatureController from '../controllers/indexAboutUsFeatureController'
import IndexAboutUsFeatureParams from '../../Core/params/indexAboutUsFeatureParams'
import DeleteAboutUsFeatureParams from '../../Core/params/deleteAboutUsFeatureParams'
import DeleteAboutUsFeatureController from '../controllers/deleteAboutUsFeatureController'
import ChangeStatusAboutUsFeatureParams from '../../Core/params/changeStatusAboutUsFeatureParams'
import ChangeStatusAboutUsFeatureController from '../controllers/changeStatusAboutUsFeatureController'

const { t } = useI18n()

// import DialogChangeStatusAboutUsFeature from "@/features/setting/AboutUsFeatureuages/Presentation/components/AboutUsFeature/DialogChangeStatusAboutUsFeature.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexAboutUsFeatureController = IndexAboutUsFeatureController.getInstance()
const state = ref(indexAboutUsFeatureController.state.value)
const route = useRoute()
// const type = ref<AboutUsFeatureStatusEnum>(AboutUsFeatureStatusEnum[route.params.type as keyof typeof AboutUsFeatureStatusEnum])

const fetchAboutUsFeature = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const AboutUsFeatureParams = new IndexAboutUsFeatureParams(query, pageNumber, perPage, withPage)
  await indexAboutUsFeatureController.getData(AboutUsFeatureParams)
}

onMounted(() => {
  fetchAboutUsFeature()
})

const searchAboutUsFeature = debounce(() => {
  fetchAboutUsFeature(word.value)
})

const deleteAboutUsFeature = async (id: number) => {
  const deleteAboutUsFeatureParams = new DeleteAboutUsFeatureParams(id)
  await DeleteAboutUsFeatureController.getInstance().deleteAboutUsFeature(
    deleteAboutUsFeatureParams,
  )
  await fetchAboutUsFeature()
}

const changeStatusAboutUsFeature = async (id: number) => {
  const changeStatusAboutUsFeatureParams = new ChangeStatusAboutUsFeatureParams(id)
  await ChangeStatusAboutUsFeatureController.getInstance().changeStatusAboutUsFeature(
    changeStatusAboutUsFeatureParams,
  )
  await fetchAboutUsFeature()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchAboutUsFeature('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchAboutUsFeature('', currentPage.value, countPerPage.value)
}

watch(
  () => indexAboutUsFeatureController.state.value,
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

const actionList = (id: number, deleteAboutUsFeature: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/about-us-features/${id}`,
    permission: [
      PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.ABOUT_US_FEATURE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteAboutUsFeature(id),
    permission: [
      PermissionsEnum.ABOUT_US_FEATURE_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.ABOUT_US_FEATURE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchAboutUsFeature())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchAboutUsFeature"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.ABOUT_US_FEATURE_CREATE]">
        <router-link to="/admin/about-us-features/add" class="btn btn-primary">
          {{ $t('Add_about_us_feature') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.ABOUT_US_FEATURE_ALL,
      PermissionsEnum.ABOUT_US_FEATURE_DELETE,
      PermissionsEnum.ABOUT_US_FEATURE_FETCH,
      PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
      PermissionsEnum.ABOUT_US_FEATURE_CREATE,
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
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/about-us-features/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle) }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.ABOUT_US_FEATURE_ALL,
                      PermissionsEnum.ABOUT_US_FEATURE_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusAboutUsFeature(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteAboutUsFeature)"
                    @delete="deleteAboutUsFeature(item.id)"
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
          :link="`/admin/about-us-features/add`"
          addText="Add AboutUsFeature"
          description="Sorry .. You have no AboutUsFeature .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No AboutUsFeature"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/about-us-features/add`"
          addText="Add AboutUsFeature"
          description="Sorry .. You have no AboutUsFeature .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No AboutUsFeature"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no AboutUsFeature .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
