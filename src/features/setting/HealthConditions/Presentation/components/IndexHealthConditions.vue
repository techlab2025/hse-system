<script lang="ts" setup>
import IndexHealthConditionsParams from '@/features/setting/HealthConditions/Core/params/indexHealthConditionsParams'
import IndexHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/indexHealthConditionsController'

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
import DeleteHealthConditionsController from '@/features/setting/HealthConditions/Presentation/controllers/deleteHealthConditionsController'
import DeleteHealthConditionsParams from '@/features/setting/HealthConditions/Core/params/deleteHealthConditionsParams'
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
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const { t } = useI18n()

// import DialogChangeStatusHealthConditions from "@/features/setting/HealthConditions/Presentation/components/HealthConditions/DialogChangeStatusHealthConditions.vue";
// const route = useRoute()

const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexHealthConditionsController = IndexHealthConditionsController.getInstance()
const state = ref(indexHealthConditionsController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<HealthConditionsStatusEnum>(HealthConditionsStatusEnum[route.params.type as keyof typeof HealthConditionsStatusEnum])

const fetchHealthConditions = async (
  query: string = '',
  pageNumber: number = 1,
  perPage: number = 10,
  withPage: number = 1,
) => {
  const deleteHealthConditionsParams = new IndexHealthConditionsParams(query, pageNumber, perPage, withPage, id)
  await indexHealthConditionsController.getData(deleteHealthConditionsParams)
}

onMounted(() => {
  fetchHealthConditions()
})

const searchHealthConditions = debounce(() => {
  fetchHealthConditions(word.value)
})

const deleteHealthConditions = async (id: number) => {
  const deleteHealthConditionsParams = new DeleteHealthConditionsParams(id)
  await DeleteHealthConditionsController.getInstance().deleteHealthConditions(deleteHealthConditionsParams)
  await fetchHealthConditions()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchHealthConditions('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchHealthConditions('', currentPage.value, countPerPage.value)
}

watch(
  () => indexHealthConditionsController.state.value,
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

const { user } = useUserStore()

const actionList = (id: number, deleteHealthConditions: (id: number) => void) => [
  {
    text: t('edit'),
    icon: IconEdit,
    link: `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/health-conditions/${id}`,
    permission: [
      PermissionsEnum.HEALTH_CONDITION_UPDATE,
      PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HEALTH_CONDITION_ALL,
      PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
    ],
  },
  // {
  //   text: t('add_sub_OBSERVATION_type'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-type/add/${id}`,
  //   permission: [
  //     PermissionsEnum.HEALTH_CONDITION_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HEALTH_CONDITION_ALL,
  //   ],
  // },
  // {
  //   text: t('sub_OBSERVATION_types'),
  //   icon: IconEdit,
  //   link: `/admin/Hazard-types/${id}`,
  //   permission: [
  //     PermissionsEnum.HEALTH_CONDITION_UPDATE,
  //     PermissionsEnum.ADMIN,
  //     PermissionsEnum.HEALTH_CONDITION_ALL,
  //   ],
  // },
  {
    text: t('delete'),
    icon: IconDelete,
    action: () => deleteHealthConditions(id),
    permission: [
      PermissionsEnum.HEALTH_CONDITION_DELETE,
      PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HEALTH_CONDITION_ALL,
      PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
    ],
  },
]
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
    <div class="input-search col-span-1">
      <!--      <img alt="search" src="../../../../../../../assets/images/search-normal.png" />-->
      <span class="icon-remove" @click="((word = ''), searchHealthConditions())">
        <Search />
      </span>
      <input
        v-model="word"
        :placeholder="'search'"
        class="input"
        type="text"
        @input="searchHealthConditions"
      />
    </div>
    <div class="col-span-2 flex justify-end gap-2">
      <ExportExcel :data="state.data" />
      <ExportPdf />
      <PermissionBuilder
        :code="[
          PermissionsEnum.ADMIN,
          PermissionsEnum.ORGANIZATION_EMPLOYEE,
          PermissionsEnum.HEALTH_CONDITION_CREATE,
          PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
        ]"
      >
        <router-link
          :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/health-conditions/add`"
          class="btn btn-primary"
        >
          {{ $t('Add_HealthConditions') }}
        </router-link>
      </PermissionBuilder>
    </div>
  </div>

  <PermissionBuilder
    :code="[
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
      PermissionsEnum.HEALTH_CONDITION_ALL,
      PermissionsEnum.HEALTH_CONDITION_DELETE,
      PermissionsEnum.HEALTH_CONDITION_FETCH,
      PermissionsEnum.HEALTH_CONDITION_UPDATE,
      PermissionsEnum.HEALTH_CONDITION_CREATE,

      PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
      PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
      PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
      PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
      PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
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
                <!--                <th scope="col">{{ $t('has_certificate') }}</th>-->
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('all_industries') }}</th>
                <th scope="col" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ $t('industries') }}</th>
                <!-- <th scope="col">{{ $t('image') }}</th> -->

                <th scope="col">{{ $t('actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.data" :key="item.id">
                <td data-label="#">
                  <router-link
                    :to="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/health-conditions/${item.id}`"
                    >{{ index + 1 }}
                  </router-link>
                </td>
                <td data-label="Name">{{ wordSlice(item.title) }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">{{ item.allIndustries ? $t('yes') : $t('no') }}</td>
                <td data-label="all_industries" v-if="user?.type === OrganizationTypeEnum?.ADMIN">
                  {{
                    item.industries.length > 0
                      ? item.industries.map((industry) => industry.title).join(', ')
                      : '---'
                  }}
                </td>
                <!-- <td data-label="all_industries">
                  <img :src="item.image" @error="setDefaultImage($event)" alt="" />
                </td> -->

                <td data-label="Actions">
                  <!--                <DialogChangeStatusHealthConditions-->
                  <!--                  v-if="item.HealthConditionsStatus === HealthConditionsStatusEnum.Draft"-->
                  <!--                  :HealthConditionsId="item.id"-->
                  <!--                  @HealthConditionsChangeStatus="fetchHealthConditions"-->
                  <!--                />-->

                  <DropList
                    :actionList="actionList(item.id, deleteHealthConditions)"
                    @delete="deleteHealthConditions(item.id)"
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
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/HealthConditions`"
          addText="Add HealthConditions"
          description="Sorry .. You have no HealthConditions .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HealthConditions"
        />
      </template>
      <template #failed>
        <DataFailed
          :link="`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/add/HealthConditions`"
          addText="Add HealthConditions"
          description="Sorry .. You have no HealthConditions .. All your joined customers will appear here when you add your customer data"
          title="..ops! You have No HealthConditions"
        />
      </template>
    </DataStatus>

    <template #notPermitted>
      <DataFailed
        addText="Have not  Permission"
        description="Sorry .. You have no HealthConditions .. All your joined customers will appear here when you add your customer data"
      />
    </template>
  </PermissionBuilder>
</template>

<style scoped></style>
