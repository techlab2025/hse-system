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
import IndexBlogController from '../controllers/indexBlogController'
import IndexBlogParams from '../../Core/params/indexBlogParams'
import DeleteBlogParams from '../../Core/params/deleteBlogParams'
import DeleteBlogController from '../controllers/deleteBlogController'
import ChangeStatusBlogController from '../controllers/changeStatusBlogController'
import ChangeStatusBlogParams from '../../Core/params/changeStatusBlogParams'
const { t } = useI18n()

// import DialogChangeStatusBlog from "@/features/setting/Bloguages/Presentation/components/Blog/DialogChangeStatusBlog.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexBlogController = IndexBlogController.getInstance()
const state = ref(indexBlogController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<BlogStatusEnum>(BlogStatusEnum[route.params.type as keyof typeof BlogStatusEnum])

const fetchBlog = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteBlogParams = new IndexBlogParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexBlogController.getData(deleteBlogParams)
}

onMounted(() => {
  fetchBlog()
})

const searchBlog = debounce(() => {
  fetchBlog(word.value)
})

const changeStatusBlog = async (id: number) => {
  const changeStatusBlogParams = new ChangeStatusBlogParams(id)
  await ChangeStatusBlogController.getInstance().changeStatusBlog(changeStatusBlogParams)
  await fetchBlog()
}

const deleteBlog = async (id: number) => {
  const deleteBlogParams = new DeleteBlogParams(id)
  await DeleteBlogController.getInstance().deleteBlog(deleteBlogParams)
  await fetchBlog()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchBlog('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchBlog('', currentPage.value, countPerPage.value)
}

watch(
  () => indexBlogController.state.value,
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

const actionList = (id: number, deleteBlog: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/blog/${id}`,
    permission: [PermissionsEnum.BLOG_UPDATE, PermissionsEnum.WEBSITE, PermissionsEnum.BLOG_ALL],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteBlog(id),
    permission: [PermissionsEnum.BLOG_DELETE, PermissionsEnum.WEBSITE, PermissionsEnum.BLOG_ALL],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchBlog()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchBlog())">
        <Search />
      </span>
      <input v-model="word" :placeholder="'search'" class="input" type="text" @input="searchBlog" />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.EQUIPMENT_TYPE_CREATE]">
        <router-link to="/admin/blog/add" class="btn btn-primary">
          {{ $t('Add_Blog') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
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
                <th scope="col">{{ $t('title') }}</th>

                <th scope="col">{{ $t('image') }}</th>
                <th scope="col">{{ $t('status') }}</th>

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link :to="`/admin/Blog/${item.id}`">{{ index + 1 }} </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>

                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.BLOG_ALL,
                      PermissionsEnum.BLOG_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusBlog(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusBlog-->
                  <!--                  v-if="item.BlogStatus === BlogStatusEnum.Draft"-->
                  <!--                  :BlogId="item.id"-->
                  <!--                  @BlogChangeStatus="fetchBlog"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteBlog)"
                    @delete="deleteBlog(item.id)"
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
          :link="`/admin/blog/add`"
          addText="Add blog"
          description="Sorry .. You have no Blog .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Blog"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/blog/add`"
          addText="Add Blog"
          description="Sorry .. You have no Blog .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No Blog"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no Blog .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
