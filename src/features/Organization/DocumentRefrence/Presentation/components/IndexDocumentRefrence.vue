<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import Search from '@/shared/icons/Search.vue'
import ActionsTableEdit from '@/shared/icons/ActionsTableEdit.vue'
import IndexDocumentRefrenceController from '../controllers/IndexDocumentRefrenceController.ts'
import IndexDocumentRefrenceParams from '../../Core/params/IndexADocumentRefrenceParams.ts'
import DeleteDocumentRefrenceParams from '../../Core/params/DeleteDocumentRefrenceParams.ts'
import DeleteDocumentRefrenceController from '../controllers/DeleteDocumentRefrenceController.ts'

const { t } = useI18n()
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexDocumentRefrenceController = IndexDocumentRefrenceController.getInstance()
const state = computed(() => indexDocumentRefrenceController.state.value)
const route = useRoute()

const fetchDocumentRefrence = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteInjuryParams = new IndexDocumentRefrenceParams(query, pageNumber, perPage, withPage)
  await indexDocumentRefrenceController.getData(deleteInjuryParams)
}

onMounted(() => {
  fetchDocumentRefrence()
})

const searchDocumentRefrence = debounce(() => {
  fetchDocumentRefrence(word.value)
})

const deleteDocumentRefrence = async (id: number) => {
  const deleteDocumentRefrenceParams = new DeleteDocumentRefrenceParams(id)
  await DeleteDocumentRefrenceController.getInstance().deleteDocumentRefrence(
    deleteDocumentRefrenceParams,
  )
  await fetchDocumentRefrence()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchDocumentRefrence('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchDocumentRefrence('', currentPage.value, countPerPage.value)
}

const actionList = (id: number, deleteDocumentRefrence: (id: number) => void) => [
  {
    text: t('edit'),
    icon: ActionsTableEdit,
    link: `/organization/document-refrence/${id}`,
    permission: [
      PermissionsEnum.DOCUMENT_REFRENCE_UPDATE,
      PermissionsEnum.DOCUMENT_REFRENCE_DETAILS,
      PermissionsEnum.DOCUMENT_REFRENCE_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteDocumentRefrence(id),
    permission: [PermissionsEnum.DOCUMENT_REFRENCE_DELETE, PermissionsEnum.DOCUMENT_REFRENCE_ALL],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    fetchDocumentRefrence()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 mt-2">
    <div class="input-search col-span-1">
      <span class="icon-remove" @click="((word = ''), searchDocumentRefrence())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="$t('search')"
        class="input"
        type="text"
        @input="searchDocumentRefrence"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <router-link class="btn btn-primary" to="/organization/document-refrence/add">
        {{ $t('add_document_refrence') }}
      </router-link>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.DOCUMENT_REFRENCE_ALL,
      PermissionsEnum.DOCUMENT_REFRENCE_DELETE,
      PermissionsEnum.DOCUMENT_REFRENCE_FETCH,
      PermissionsEnum.DOCUMENT_REFRENCE_UPDATE,
      PermissionsEnum.DOCUMENT_REFRENCE_CREATE,
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
                <th class="empty"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/organization/document-refrence/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Actions">
                  <DropList
                    :actionList="actionList(item.id, deleteDocumentRefrence)"
                    @delete="deleteDocumentRefrence(item.id)"
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
        <PermissionBuilder :code="[PermissionsEnum?.DOCUMENT_REFRENCE_CREATE]">
          <DataEmpty
            :link="`/organization/document-refrence/add`"
            addText="Add Document Refrence"
            description="Sorry .. You have no Document Refrence .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Document Refrence"
          />
        </PermissionBuilder>
      </template>
      <template #failed>
        <PermissionBuilder :code="[PermissionsEnum?.DOCUMENT_REFRENCE_CREATE]">
          <DataFailed
            :link="`/organization/document-refrence/add`"
            addText="Add Document Refrence"
            description="Sorry .. You have no Document Refrence .. All your joined customers will appear here when you add your customer data"
            title="..ops! You have No Document Refrence"
          />
        </PermissionBuilder>
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Injury .. All your joined customers will appear here when you add your customer data"
        link=""
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
