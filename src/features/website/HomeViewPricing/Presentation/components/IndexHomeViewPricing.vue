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
import IndexHomeViewPricingController from '../controllers/indexHomeViewPricingController'
import IndexHomeViewPricingParams from '../../Core/params/indexHomeViewPricingParams'
import DeleteHomeViewPricingParams from '../../Core/params/deleteHomeViewPricingParams'
import DeleteHomeViewPricingController from '../controllers/deleteHomeViewPricingController'
import ChangeStatusHomeViewPricingController from '../controllers/changeStatusHomeViewPricingController'
import ChangeStatusHomeViewPricingParams from '../../Core/params/changeStatusHomeViewPricingParams'

const { t } = useI18n()

// import DialogChangeStatusHomeViewPricing from "@/features/setting/HomeViewPricinguages/Presentation/components/HomeViewPricing/DialogChangeStatusHomeViewPricing.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHomeViewPricingController = IndexHomeViewPricingController.getInstance()
const state = ref(indexHomeViewPricingController.state.value)
const route = useRoute()
// const type = ref<HomeViewPricingStatusEnum>(HomeViewPricingStatusEnum[route.params.type as keyof typeof HomeViewPricingStatusEnum])

const fetchHomeViewPricing = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const HomeViewPricingParams = new IndexHomeViewPricingParams(query, pageNumber, perPage, withPage)
  await indexHomeViewPricingController.getData(HomeViewPricingParams)
}

onMounted(() => {
  fetchHomeViewPricing()
})

const searchHomeViewPricing = debounce(() => {
  fetchHomeViewPricing(word.value)
})

const deleteHomeViewPricing = async (id: number) => {
  const deleteHomeViewPricingParams = new DeleteHomeViewPricingParams(id)
  await DeleteHomeViewPricingController.getInstance().deleteHomeViewPricing(
    deleteHomeViewPricingParams,
  )
  await fetchHomeViewPricing()
}

const changeStatusHomeViewPricing = async (id: number) => {
  const changeStatusHomeViewPricingParams = new ChangeStatusHomeViewPricingParams(id)
  await ChangeStatusHomeViewPricingController.getInstance().changeStatusHomeViewPricing(
    changeStatusHomeViewPricingParams,
  )
  await fetchHomeViewPricing()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHomeViewPricing('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHomeViewPricing('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHomeViewPricingController.state.value,
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

const actionList = (id: number, deleteHomeViewPricing: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/home-view-pricing/${id}`,
    permission: [
      PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_VIEW_PRICING_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHomeViewPricing(id),
    permission: [
      PermissionsEnum.HOME_VIEW_PRICING_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_VIEW_PRICING_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHomeViewPricing())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHomeViewPricing"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
    <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.HOME_VIEW_PRICING_CREATE]">
        <router-link to="/admin/home-view-pricing/add" class="btn btn-primary">
          {{ $t('Add_HomeViewPricing') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HOME_VIEW_PRICING_ALL,
      PermissionsEnum.HOME_VIEW_PRICING_DELETE,
      PermissionsEnum.HOME_VIEW_PRICING_FETCH,
      PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
      PermissionsEnum.HOME_VIEW_PRICING_CREATE,
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
                  <router-link :to="`/admin/home-view-pricing/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="title">{{ wordSlice(item.title) }}</td>
                <td data-label="subtitle">{{ wordSlice(item.subtitle) || '--' }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HOME_VIEW_PRICING_ALL,
                      PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusHomeViewPricing(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteHomeViewPricing)"
                    @delete="deleteHomeViewPricing(item.id)"
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
          :link="`/admin/home-view-pricing/add`"
          addText="Add HomeViewPricing"
          description="Sorry .. You have no HomeViewPricing .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeViewPricing"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/home-view-pricing/add`"
          addText="Add HomeViewPricing"
          description="Sorry .. You have no HomeViewPricing .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HomeViewPricing"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no HomeViewPricing .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
