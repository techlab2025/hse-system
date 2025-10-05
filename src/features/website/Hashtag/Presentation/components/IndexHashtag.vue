<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import DropList from '@/shared/HelpersComponents/DropList.vue'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

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
import IndexHashtagController from '../controllers/indexHashtagController'
import IndexHashtagParams from '../../Core/params/indexHashtagParams'
import DeleteHashtagParams from '../../Core/params/deleteHashtagParams'
import DeleteHashtagController from '../controllers/deleteHashtagController'
import ChangeServiceHashtagParams from '../../Core/params/changeStatusHashtagParams'
import disActiveHashtagController from '../controllers/disActiveHashtagController'

const { t } = useI18n()

// import DialogChangeStatusHashtag from "@/features/setting/Hashtaguages/Presentation/components/Hashtag/DialogChangeStatusHashtag.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHashtagController = IndexHashtagController.getInstance()
const state = ref(indexHashtagController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<HashtagStatusEnum>(HashtagStatusEnum[route.params.type as keyof typeof HashtagStatusEnum])

const fetchHashtag = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteHashtagParams = new IndexHashtagParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexHashtagController.getData(deleteHashtagParams)
}

onMounted(() => {
  fetchHashtag()
})

const searchHashtag = debounce(() => {
  fetchHashtag(word.value)
})

const deleteHashtag = async (id: number) => {
  const deleteHashtagParams = new DeleteHashtagParams(id)
  await DeleteHashtagController.getInstance().deleteHashtag(deleteHashtagParams)
  await fetchHashtag()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHashtag('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHashtag('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHashtagController.state.value,
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

const actionList = (id: number, deleteHashtag: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/hashtag/${id}`,
    permission: [
      PermissionsEnum.HASHTAG_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HASHTAG_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHashtag(id),
    permission: [
      PermissionsEnum.HASHTAG_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HASHTAG_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchHashtag()
  },
)

const changeStatusHashtag = async (id: number) => {
  const changeServiceHashtagParams = new ChangeServiceHashtagParams(id)
  await disActiveHashtagController.getInstance().disActiveHashtag(changeServiceHashtagParams)
  await fetchHashtag()
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHashtag())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHashtag"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <permission-builder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.HASHTAG_CREATE]">
        <router-link to="/admin/hashtag/add" class="btn btn-primary">
          {{ $t('Add_Hashtag') }}
        </router-link>
      </permission-builder>
    </div>
  </div>

  <permission-builder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.HASHTAG_ALL,
      PermissionsEnum.HASHTAG_DELETE,
      PermissionsEnum.HASHTAG_FETCH,
      PermissionsEnum.HASHTAG_UPDATE,
      PermissionsEnum.HASHTAG_CREATE,
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

                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/Hashtag/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>
                <td data-label="status">
                  <permission-builder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.HOME_VIEW_PRICING_ALL,
                      PermissionsEnum.HOME_VIEW_PRICING_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.isActive === 1"
                      binary
                      @update:model-value="changeStatusHashtag(item.id)"
                    />
                  </permission-builder>
                </td>
                <td data-label="Actions">
                  <!--                <DialogChangeStatusHashtag-->
                  <!--                  v-if="item.HashtagStatus === HashtagStatusEnum.Draft"-->
                  <!--                  :HashtagId="item.id"-->
                  <!--                  @HashtagChangeStatus="fetchHashtag"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteHashtag)"
                    @delete="deleteHashtag(item.id)"
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
          :link="`/admin/hashtag/add`"
          addText="Add hashtag"
          description="Sorry .. You have no Hashtag .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Hashtag"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/hashtag/add`"
          addText="Add Hashtag"
          description="Sorry .. You have no Hashtag .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Hashtag"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Hashtag .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </permission-builder>
</template>

<style scoped></style>
