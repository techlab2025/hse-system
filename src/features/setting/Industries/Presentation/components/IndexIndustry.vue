<script lang="ts" setup>
import RegisterPage from '@/shared/Tables/RegisterPage.vue'

import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
// import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexIndustryParams from '../../Core/Params/indexIndustryParams'
import IndexIndustryController from '../controllers/indexIndustryController'
import { useRouter } from 'vue-router'
import Search from '@/shared/icons/Search.vue'
import DeleteIndustryParams from '../../Core/Params/deleteIndustryParams'
import DeleteIndustryController from '../controllers/deleteIndustryController'

const { t } = useI18n()

// import DialogChangeStatusLang from "@/features/setting/languages/Presentation/components/Lang/DialogChangeStatusLang.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexIndustryController = IndexIndustryController.getInstance()
const state = ref(indexIndustryController.state.value)
// const type = ref<LangStatusEnum>(LangStatusEnum[route.params.type as keyof typeof LangStatusEnum])

const fetchIndustry = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const indexIndustryParams = new IndexIndustryParams(query, withPage, perPage, pageNumber)
  await indexIndustryController.getData(indexIndustryParams)
}

onMounted(() => {
  fetchIndustry()
})

const searchLang = debounce(() => {
  fetchIndustry(word.value)
})

const deleteLang = async (id: number) => {
  const deleteIndustryParams = new DeleteIndustryParams(id)
  await DeleteIndustryController.getInstance().DeleteIndustry(deleteIndustryParams, useRouter())
  await fetchIndustry()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchIndustry('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchIndustry('', currentPage.value, countPerPage.value)
}

watch(
  () => indexIndustryController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState, 'newstaet')
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
    link: `/admin/industry/${id}`,
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
  <RegisterPage>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
      <div class="input-search col-span-1">
        <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
        <span class="icon-remove" @click="((word = ''), searchLang())">
          <Search />
        </span>
        <input
          dir="auto"
          v-model="word"
          :placeholder="$t('search')"
          class="input"
          type="text"
          @input="searchLang"
        />
      </div>
      <div class="col-span-2 flex justify-end gap-2">
        <!-- <ExportExcel :data="state.data" /> -->
        <ExportPdf />
        <router-link to="/admin/industry/add" class="btn btn-primary">
          {{ $t('Add_Industry') }}
        </router-link>
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
          <div class="table-responsive hse-table-scroll">
            <table v-table-identity class="main-table hse-data-table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{{ $t('title') }}</th>

                  <!-- <th scope="col">Actions</th> -->
                  <th class="empty"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in state.data" :key="item.id">
                  <td data-label="#">
                    <span :to="`/users/Lang/edit/${item.id}`">{{ index + 1 }} </span>
                  </td>
                  <td :data-label="$t('Name')">{{ wordSlice(item.title) }}</td>

                  <td :data-label="$t('Actions')">
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
            :link="`/industry/add`"
            :addText="$t('Add_Lang')"
            :description="$t('auditUi.industries_will_appear_here_after_you_add_them')"
            :title="$t('auditUi.no_industries_yet')"
          />
        </template>
        <template #failed>
          <DataFailed
            :link="`/industry/add`"
            :addText="$t('Add_Lang')"
            :description="$t('auditUi.industries_will_appear_here_after_you_add_them')"
            :title="$t('auditUi.no_industries_yet')"
          />
        </template>
      </DataStatus>

      <template #notPermitted>
        <DataFailed
          :addText="$t('auditUi.you_do_not_have_permission')"
          :description="$t('auditUi.industries_will_appear_here_after_you_add_them')"
        />
      </template>
    </PermissionBuilder>
  </RegisterPage>
</template>
<style scoped></style>
