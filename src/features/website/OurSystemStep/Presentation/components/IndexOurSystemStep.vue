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

import wordSlice from '@/base/Presentation/utils/word_slice'

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
import IndexOurSystemStepController from '../controllers/indexOurSystemStepController'
import IndexOurSystemStepParams from '../../Core/params/indexOurSystemStepParams'
import DeleteOurSystemStepParams from '../../Core/params/deleteOurSystemStepParams'
import DeleteOurSystemStepController from '../controllers/deleteOurSystemStepController'
import ChangeStatusOurSystemStepController from '../controllers/changeStatusOurSystemStepController'
import ChangeStatusOurSystemStepParams from '../../Core/params/changeStatusOurSystemStepParams'

const { t } = useI18n()

// import DialogChangeStatusOurSystemStep from "@/features/setting/OurSystemStepuages/Presentation/components/OurSystemStep/DialogChangeStatusOurSystemStep.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexOurSystemStepController = IndexOurSystemStepController.getInstance()
const state = ref(indexOurSystemStepController.state.value)
const route = useRoute()

// const id = ref(route.params.parent_id)

// const type = ref<OurSystemStepStatusEnum>(OurSystemStepStatusEnum[route.params.type as keyof typeof OurSystemStepStatusEnum])

const fetchOurSystemStep = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteOurSystemStepParams = new IndexOurSystemStepParams(
    query,
    pageNumber,
    perPage,
    withPage,
    // id.value?? '',
  )
  await indexOurSystemStepController.getData(deleteOurSystemStepParams)
}

onMounted(() => {
  fetchOurSystemStep()
})

const searchOurSystemStep = debounce(() => {
  fetchOurSystemStep(word.value)
})

const changeStatusOurSystemStep = async (id: number) => {
  const changeStatusOurSystemStepParams = new ChangeStatusOurSystemStepParams(id)
  await ChangeStatusOurSystemStepController.getInstance().changeStatusOurSystemStep(
    changeStatusOurSystemStepParams,
  )
  await fetchOurSystemStep()
}

const deleteOurSystemStep = async (id: number) => {
  const deleteOurSystemStepParams = new DeleteOurSystemStepParams(id)
  await DeleteOurSystemStepController.getInstance().deleteOurSystemStep(deleteOurSystemStepParams)
  await fetchOurSystemStep()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchOurSystemStep('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchOurSystemStep('', currentPage.value, countPerPage.value)
}

watch(
  () => indexOurSystemStepController.state.value,
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

const actionList = (id: number, deleteOurSystemStep: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/admin/our-system-step/${id}`,
    permission: [
      PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
    ],
  },

  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteOurSystemStep(id),
    permission: [
      PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
    ],
  },
]

watch(
  () => route?.params?.id,
  (Newvalue) => {
    // id = Newvalue
    fetchOurSystemStep()
  },
)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchOurSystemStep())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchOurSystemStep"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />

      <PermissionBuilder :code="[PermissionsEnum.WEBSITE, PermissionsEnum.EQUIPMENT_TYPE_CREATE]">
        <router-link to="/admin/our-system-step/add" class="btn btn-primary">
          {{ $t('add_our_system_step') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.WEBSITE,
      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
      PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
      PermissionsEnum.OUR_SYSTEM_STEP_FETCH,
      PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
      PermissionsEnum.OUR_SYSTEM_STEP_CREATE,
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
                  <router-link :to="`/admin/OurSystemStep/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) || '___' }}</td>

                <td data-label="image">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td>

                <td data-label="status">
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.WEBSITE,
                      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
                      PermissionsEnum.OUR_SYSTEM_STEP_CHANGE_STATUS,
                    ]"
                  >
                    <ToggleSwitch
                      :modelValue="item.is_active === 1"
                      binary
                      @update:model-value="changeStatusOurSystemStep(item.id)"
                    />
                  </PermissionBuilder>
                </td>

                <td data-label="Actions">
                  <!--                <DialogChangeStatusOurSystemStep-->
                  <!--                  v-if="item.OurSystemStepStatus === OurSystemStepStatusEnum.Draft"-->
                  <!--                  :OurSystemStepId="item.id"-->
                  <!--                  @OurSystemStepChangeStatus="fetchOurSystemStep"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteOurSystemStep)"
                    @delete="deleteOurSystemStep(item.id)"
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
          :link="`/admin/our-system-step/add`"
          addText="Add OurSystemStep"
          description="Sorry .. You have no OurSystemStep .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No OurSystemStep"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/admin/our-system-step/add`"
          addText="Add OurSystemStep"
          description="Sorry .. You have no OurSystemStep .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No OurSystemStep"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no OurSystemStep .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
