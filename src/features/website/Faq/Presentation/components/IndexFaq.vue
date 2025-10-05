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
import IndexFaqController from '../controllers/indexFaqController'
import IndexFaqParams from '../../Core/params/indexFaqParams'
import DeleteFaqParams from '../../Core/params/deleteFaqParams'
import DeleteFaqController from '../controllers/deleteFaqController'
import ChangeStatusFaqController from '../controllers/changeStatusFaqController'
import ChangeStatusFaqParams from '../../Core/params/changeStatusFaqParams'

const { t } = useI18n()

// import DialogChangeStatusFaq from "@/features/setting/Faquages/Presentation/components/Faq/DialogChangeStatusFaq.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexFaqController = IndexFaqController.getInstance()
const state = ref(indexFaqController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<FaqStatusEnum>(FaqStatusEnum[route.params.type as keyof typeof FaqStatusEnum])

const fetchFaq = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteFaqParams = new IndexFaqParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexFaqController.getData(deleteFaqParams)
}

onMounted(() => {
  fetchFaq()
})

const searchFaq = debounce(() => {
  fetchFaq(word.value)
})

const changeStatusFaq = async (id: number) => {
  const changeStatusFaqParams = new ChangeStatusFaqParams(id)
  await ChangeStatusFaqController.getInstance().changeStatusFaq(changeStatusFaqParams)
  await fetchFaq()
}

const deleteFaq = async (id: number) => {
  const deleteFaqParams = new DeleteFaqParams(id)
  await DeleteFaqController.getInstance().deleteFaq(deleteFaqParams)
  await fetchFaq()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchFaq('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchFaq('', currentPage.value, countPerPage.value)
}

watch(
  () => indexFaqController.state.value,
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

const actionList = (id: number, deleteFaq: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/faq/${id}`,
    permission: [PermissionsEnum.FAQ_UPDATE, PermissionsEnum.WEBSITE, PermissionsEnum.FAQ_ALL],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteFaq(id),
    permission: [PermissionsEnum.FAQ_DELETE, PermissionsEnum.WEBSITE, PermissionsEnum.FAQ_ALL],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchFaq()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchFaq())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchFaq" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.EQUIPMENT_TYPE_CREATE]">
        <router-link to="/admin/faq/add" class="btn btn-primary">
          {{ $t('Add_Faq') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
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
                <th scope="col">{{ $t('question') }}</th>

                <th scope="col">{{ $t('answer') }}</th>

                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/Faq/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ item.question || '___' }}</td>
                <td data-label="Name">{{ item.answer || '___' }}</td>

                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.FAQ_ALL,
                      PermissionsEnum.FAQ_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusFaq(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusFaq-->
                  <!--                  v-if="item.FaqStatus === FaqStatusEnum.Draft"-->
                  <!--                  :FaqId="item.id"-->
                  <!--                  @FaqChangeStatus="fetchFaq"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteFaq)"
                    @delete="deleteFaq(item.id)"
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
          :link="`/admin/faq/add`"
          addText="Add faq"
          description="Sorry .. You have no Faq .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Faq"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/faq/add`"
          addText="Add Faq"
          description="Sorry .. You have no Faq .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Faq"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Faq .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
