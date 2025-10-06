<script lang="ts" setup>
import IndexLangParams from '@/features/setting/languages/Core/params/indexLangParams'
import IndexLangController from '@/features/setting/languages/Presentation/controllers/indexLangController'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import IconRemoveInput from '@/shared/icons/IconRemoveInput.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DeleteLangController from '@/features/setting/languages/Presentation/controllers/deleteLangController'
import DeleteLangParams from '@/features/setting/languages/Core/params/deleteLangParams'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
// import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import ExportIcon from '@/shared/icons/ExportIcon.vue'
import ExportExcel from '@/shared/HelpersComponents/ExportExcel.vue'
import SaveIcon from '@/shared/icons/SaveIcon.vue'
import Search from '@/shared/icons/Search.vue'

const { t } = useI18n()

// import DialogChangeStatusLang from "@/features/setting/languages/Presentation/components/Lang/DialogChangeStatusLang.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexLangController = IndexLangController.getInstance()
const state = ref(indexLangController.state.value)
// const type = ref<LangStatusEnum>(LangStatusEnum[route.params.type as keyof typeof LangStatusEnum])

const fetchLang = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteLangParams = new IndexLangParams(query, withPage, perPage, pageNumber)
  await indexLangController.getData(deleteLangParams)
}

onMounted(() => {
  fetchLang()
})

const searchLang = debounce(() => {
  fetchLang(word.value)
})

const deleteLang = async (id: number) => {
  const deleteLangParams = new DeleteLangParams(id)
  await DeleteLangController.getInstance().deleteLang(deleteLangParams)
  await fetchLang()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchLang('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchLang('', currentPage.value, countPerPage.value)
}

watch(
  () => indexLangController.state.value,
  (newState) => {
    if (newState) {
      // console.log(newState)
      state.value = newState
    }
  },
  {
    deep: true,
  },
)

const actionList = (id: number, deleteLang: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/lang/${id}`,
    permission: [
      PermissionsEnum.LANGUAGE_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.LANGUAGE_ALL,
    ],
  },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteLang(id),
    permission: [
      PermissionsEnum.LANGUAGE_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.LANGUAGE_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchLang())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchLang" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.ADMIN, PermissionsEnum.LANGUAGE_CREATE]">
        <router-link to="/admin/lang/add" class="btn btn-primary">
          {{ $t('Add_Lang') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.LANGUAGE_ALL,
      PermissionsEnum.LANGUAGE_FETCH,
      PermissionsEnum.LANGUAGE_UPDATE,
      PermissionsEnum.LANGUAGE_DELETE,
    ]"
  >
    <DataStatus :controller="state">
      <template #success>
        <div class="table-responsive">
          <table class="main-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">title</th>
                <th scope="col">Code</th>

                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/users/Lang/edit/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="Code">{{ item.code ?? '--' }}</td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusLang-->
                  <!--                  v-if="item.LangStatus === LangStatusEnum.Draft"-->
                  <!--                  :LangId="item.id"-->
                  <!--                  @LangChangeStatus="fetchLang"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteLang)"
                    @delete="deleteLang(item.id)"
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
          :link="`/add/Lang`"
          addText="Add Lang"
          description="Sorry .. You have no languages .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No languages"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/add/Lang`"
          addText="Add Lang"
          description="Sorry .. You have no language .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No languages"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no language .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
