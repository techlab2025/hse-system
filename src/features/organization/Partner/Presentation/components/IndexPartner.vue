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
import IndexPartnerController from '../controllers/indexPartnerController'
import IndexPartnerParams from '../../Core/params/indexPartnerParams'
import DeletePartnerParams from '../../Core/params/deletePartnerParams'
import DeletePartnerController from '../controllers/deletePartnerController'

const { t } = useI18n()

// import DialogChangeStatusPartner from "@/features/setting/Partneruages/Presentation/components/Partner/DialogChangeStatusPartner.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexPartnerController = IndexPartnerController.getInstance()
const state = ref(indexPartnerController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<PartnerStatusEnum>(PartnerStatusEnum[route.params.type as keyof typeof PartnerStatusEnum])

const fetchPartner = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deletePartnerParams = new IndexPartnerParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexPartnerController.getData(deletePartnerParams)
}

onMounted(() => {
  fetchPartner()
})

const searchPartner = debounce(() => {
  fetchPartner(word.value)
})

const deletePartner = async (id: number) => {
  const deletePartnerParams = new DeletePartnerParams(id)
  await DeletePartnerController.getInstance().deletePartner(deletePartnerParams)
  await fetchPartner()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchPartner('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchPartner('', currentPage.value, countPerPage.value)
}

watch(
  () => indexPartnerController.state.value,
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

const actionList = (id: number, deletePartner: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/partner/${id}`,
    permission: [
      PermissionsEnum.PARTNER_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PARTNER_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deletePartner(id),
    permission: [
      PermissionsEnum.PARTNER_DELETE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PARTNER_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchPartner()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchPartner())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchPartner"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel />
      <ExportPdf />
      <permission-builder
        :code="[PermissionsEnum.ORGANIZATION_EMPLOYEE, PermissionsEnum.PARTNER_CREATE]"
      >
        <router-link to="/organization/partner/add" class="btn btn-primary">
          {{ $t('Add_Partner') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.PARTNER_ALL,
      PermissionsEnum.PARTNER_DELETE,
      PermissionsEnum.PARTNER_FETCH,
      PermissionsEnum.PARTNER_UPDATE,
      PermissionsEnum.PARTNER_CREATE,
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

                <th scope="col">{{ $t('phone') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/partner/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ item.title }}</td>

                <td data-label="phone">
                  {{ item.phone }}
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusPartner-->
                  <!--                  v-if="item.PartnerStatus === PartnerStatusEnum.Draft"-->
                  <!--                  :PartnerId="item.id"-->
                  <!--                  @PartnerChangeStatus="fetchPartner"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deletePartner)"
                    @delete="deletePartner(item.id)"
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
          :link="`/organization/partner/add`"
          addText="Add Partner"
          description="Sorry .. You have no Partner .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Partner"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/organization/partner/add`"
          addText="Add Partner"
          description="Sorry .. You have no Partner .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Partner"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Partner .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
