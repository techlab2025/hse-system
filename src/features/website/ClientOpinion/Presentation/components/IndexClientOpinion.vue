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
import IndexClientOpinionController from '../controllers/indexClientOpinionController'
import IndexClientOpinionParams from '../../Core/params/indexClientOpinionParams'
import DeleteClientOpinionParams from '../../Core/params/deleteClientOpinionParams'
import DeleteClientOpinionController from '../controllers/deleteClientOpinionController'
import ChangeStatusClientOpinionParams from '../../Core/params/changeStatusClientOpinionParams'
import ChangeStatusClientOpinionController from '../controllers/changeStatusClientOpinionController'

const { t } = useI18n()

// import DialogChangeStatusClientOpinion from "@/features/setting/ClientOpinionuages/Presentation/components/ClientOpinion/DialogChangeStatusClientOpinion.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexClientOpinionController = IndexClientOpinionController.getInstance()
const state = ref(indexClientOpinionController.state.value)
const route = useRoute()
// const type = ref<ClientOpinionStatusEnum>(ClientOpinionStatusEnum[route.params.type as keyof typeof ClientOpinionStatusEnum])

const fetchClientOpinion = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const ClientOpinionParams = new IndexClientOpinionParams(query, pageNumber, perPage, withPage)
  await indexClientOpinionController.getData(ClientOpinionParams)
}

onMounted(() => {
  fetchClientOpinion()
})

const searchClientOpinion = debounce(() => {
  fetchClientOpinion(word.value)
})

const deleteClientOpinion = async (id: number) => {
  const deleteClientOpinionParams = new DeleteClientOpinionParams(id)
  await DeleteClientOpinionController.getInstance().deleteClientOpinion(deleteClientOpinionParams)
  await fetchClientOpinion()
}

const changeStatusClientOpinion = async (id: number) => {
  const changeStatusClientOpinionParams = new ChangeStatusClientOpinionParams(id)
  await ChangeStatusClientOpinionController.getInstance().changeStatusClientOpinion(
    changeStatusClientOpinionParams,
  )
  await fetchClientOpinion()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchClientOpinion('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchClientOpinion('', currentPage.value, countPerPage.value)
}

watch(
  () => indexClientOpinionController.state.value,
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

const actionList = (id: number, deleteClientOpinion: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/client-opinion/${id}`,
    permission: [
      PermissionsEnum.CLIENT_OPINION_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.CLIENT_OPINION_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteClientOpinion(id),
    permission: [
      PermissionsEnum.CLIENT_OPINION_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.CLIENT_OPINION_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchClientOpinion())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchClientOpinion"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
     <ExportExcel />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.ADMIN, PermissionsEnum.CLIENT_OPINION_CREATE]">
        <router-link to="/admin/client-opinion/add" class="btn btn-primary">
          {{ $t('Add_ClientOpinion') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.CLIENT_OPINION_ALL,
      PermissionsEnum.CLIENT_OPINION_DELETE,
      PermissionsEnum.CLIENT_OPINION_FETCH,
      PermissionsEnum.CLIENT_OPINION_UPDATE,
      PermissionsEnum.CLIENT_OPINION_CREATE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{{ $t('name') }}</th>
                <th scope="col">{{ $t('rate') }}</th>
                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/client-opinion/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ item.name }}</td>
                <td data-label="rate">{{ item.rate }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.CLIENT_OPINION_ALL,
                      PermissionsEnum.CLIENT_OPINION_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusClientOpinion(item.id)"
                    />
                  </permission-builder>
                </td>

                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteClientOpinion)"
                    @delete="deleteClientOpinion(item.id)"
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
          :link="`/admin/client-opinion/add`"
          addText="Add ClientOpinion"
          description="Sorry .. You have no ClientOpinion .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ClientOpinion"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/client-opinion/add`"
          addText="Add ClientOpinion"
          description="Sorry .. You have no ClientOpinion .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No ClientOpinion"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no ClientOpinion .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
