<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { debounce } from '@/base/Presentation/utils/debouced'
import Pagination from '@/shared/HelpersComponents/Pagination.vue'
import Image from 'primevue/image'
// import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import IconEdit from '@/shared/icons/IconEdit.vue'
import IconDelete from '@/shared/icons/IconDelete.vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PermissionBuilder from '@/shared/HelpersComponents/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import TitleInterface from '@/base/Data/Models/title_interface'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import CardSkelaton from '@/features/Organization/Inspection/Presentation/components/SubComponent/CardSkelaton.vue'
import IndexCapaParams from '../../Core/params/indexCapaParams'
import IndexCapaController from '../controllers/indexCapaController'
import DeleteCapaParams from '../../Core/params/deleteCapaParams'
import DeleteCapaController from '../controllers/deleteCapaController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { RiskLevelEnum } from '@/features/Organization/Investigating/Core/Enums/risk_level_enum'
import { ActionStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/ActionStatusEnum'
import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import { Observation } from '@/features/Organization/ObservationFactory/Core/Enums/ObservationTypeEnum'
import IndexEquipmentMangement from '@/features/Organization/ObservationFactory/Presentation/components/indexEquipmentMangement.vue'
import IndexHazardHeader from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexHazardHeader.vue'
import IndexFilter from '@/features/Organization/ObservationFactory/Presentation/components/Hazard/HazardUtils/IndexFilter.vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import FilterDialog from '../Hazard/HazardUtils/filterDialog.vue'
const { t } = useI18n()

// import DialogChangeStatusHazard from "@/features/setting/Hazard/Presentation/components/Hazard/DialogChangeStatusHazard.vue";
// const route = useRoute()
// ActionStatusEnum
const word = ref('')
const currentPage = ref(1)
const countPerPage = ref(10)
const indexCapaController = IndexCapaController.getInstance()
const state = ref(indexCapaController.state.value)
const route = useRoute()
const id = route.params.parent_id
// const type = ref<HazardStatusEnum>(HazardStatusEnum[route.params.type as keyof typeof HazardStatusEnum])

const fetchCapa = async (
  query = '',
  pageNumber = 1,
  perPage = 10,
  withPage = 1,
  projectZoneLozationId?: number[],
  projectLocationIds?: number[],
  zoonIds?: number[],
  projectIds?: number,
) => {
  const params = new IndexCapaParams(
    query,
    pageNumber,
    perPage,
    withPage,
    [Observation.ObservationType, Observation.HazardType],
    route.query.hazard || route.query.risk_level ? null : [projectIds],
    zoonIds,
    projectLocationIds || null,
    projectZoneLozationId,
    null,
    route.query.hazard ? route.query.hazard : null,
    route.query.risk_level ? [route.query.risk_level] : null,
    capaStatus?.value?.id,

  )
  await indexCapaController.getData(params)
}


onMounted(() => {
  if (selectedProjctesFilters.value) {
    fetchCapa()
  }
  FetchMyProjects()
})

const searchHazard = debounce(() => {
  fetchCapa(word.value)
})

// const deleteHazard = async (id: number) => {
//   const deleteCapaParams = new DeleteCapaParams(id)
//   await DeleteCapaController.getInstance().deleteCapa(deleteCapaParams)
//   await fetchCapa()
// }

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchCapa('', currentPage.value, countPerPage.value)
}

// Handle count per page change
const handleCountPerPage = (count: number) => {
  countPerPage.value = count
  fetchCapa('', currentPage.value, countPerPage.value)
}

watch(
  () => indexCapaController.state.value,
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

// const actionList = (id: number, deleteHazard: (id: number) => void) => [
//   {
//     text: t('edit'),
//     icon: IconEdit,
//     link: `/organization/equipment-mangement/observation/${id}`,
//     permission: [
//       PermissionsEnum.ORG_OBSERVATION_UPDATE,
//       PermissionsEnum.ORGANIZATION_EMPLOYEE,
//       PermissionsEnum.ORG_OBSERVATION_ALL,
//       PermissionsEnum.ORG_OBSERVATION_DETAILS,
//     ],
//   },
//   {
//     text: t('delete'),
//     icon: IconDelete,
//     action: () => deleteHazard(id),
//     permission: [
//       PermissionsEnum.ORG_OBSERVATION_DELETE,
//       PermissionsEnum.ORGANIZATION_EMPLOYEE,
//       PermissionsEnum.ORG_OBSERVATION_ALL,
//     ],
//   },
// ]
const router = useRouter()
const Projects = ref<MyProjectsModel[]>([])
const FetchMyProjects = async () => {
  const fetchMyProjectsParams = new FetchMyProjectsParams()
  const fetchMyProjectsController = FetchMyProjectsController.getInstance()
  const res = await fetchMyProjectsController.getData(fetchMyProjectsParams, router, true)
  if (res.value.data) {
    Projects.value = res.value.data
  }
}
const selectedProjctesFilters = ref<number>()

const Filters = ref<MyZonesModel[]>()
const fetchMyZonesController = FetchMyZonesController.getInstance()
const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(selectedProjctesFilters.value)
  const response = await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
  if (response.value.data) {
    Filters.value = response.value.data
  }
}

const SelectedZonesFilter = ref<number[]>([])
const ApplayFilter = (data: number[]) => {
  SelectedZonesFilter.value = data
  fetchCapa('', 1, 10, 1, null, null, SelectedZonesFilter.value, selectedProjctesFilters.value)
}

const setSelectedProjectFilter = (data) => {
  selectedProjctesFilters.value = data
  console.log(data, 'data')
  fetchCapa('', 1, 10, 1, null, null, null, data)
  if (data) {
    FetchMyZones()
  }
}

const ShowDetails = ref<number[]>([])

const GetRiskLevel = (riskLevel: RiskLevelEnum) => {
  switch (riskLevel) {
    case RiskLevelEnum.Low:
      return 'Low'
    case RiskLevelEnum.Medium:
      return 'Medium'
    case RiskLevelEnum.High:
      return 'High'
    default:
      return 'Unknown'
  }
}

const GetAcionStatus = (actionStatus: ActionStatusEnum) => {
  switch (actionStatus) {
    case ActionStatusEnum.OPEN:
      return 'Open'
    case ActionStatusEnum.CLOSED:
      return 'Closed'

  }
}

const GetSaveStatus = (saveStatus: SaveStatusEnum) => {
  switch (saveStatus) {
    case SaveStatusEnum.Saved:
      return 'Positive'
    case SaveStatusEnum.NotSaved:
      return 'Negative'

  }
}

// capa status filter
const capaStatus = ref<TitleInterface | null>(null)
const setCapaStatus = (data: TitleInterface) => {
  capaStatus.value = data
  fetchCapa("", 1, 10, 1, null, null, null, selectedProjctesFilters.value)
}
const ActionStatusList = ref<TitleInterface[]>([
  new TitleInterface({
    id: ActionStatusEnum.OPEN,
    title: 'Open',
    subtitle: ''
  }),
  new TitleInterface({
    id: ActionStatusEnum.CLOSED,
    title: 'Closed',
    subtitle: ''
  }),
])

// watch(capaStatus, () => {
//   fetchCapa('', 1, 10, 1, null, null, SelectedZonesFilter.value, selectedProjctesFilters.value)
// })



const GetObservationType = (type: number) => {
  switch (type) {
    case Observation.ObservationType:
      return 'Observation'
    case Observation.HazardType:
      return 'Hazard'
  }
}
// export excel
const exportExcel = () => {
  if (!state.value.data || state.value.data.length === 0) {
    alert("No data available to export");
    return;
  }
  const worksheetData = state.value.data.map(
    (item: Record<string, unknown>) => {
      const it = item as any;
      return {
        "title": it.title || "N/A",
        "serial": it.serial || "N/A",
        "date": it.date || "N/A",
        "description": it.description || "N/A",
        "machine": it.equipment.title || "N/A",
        "zone": it.zoon.title || "N/A",
      };
    },
  );
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "capa.xlsx");
};

</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <!-- <IndexEquipmentMangement class="col-span-2" /> -->
    <div :class="route?.query?.isAll ? 'col-span-12' : 'col-span-12'">
      <PermissionBuilder :code="[
        PermissionsEnum.ORGANIZATION_EMPLOYEE,
        PermissionsEnum.ORG_OBSERVATION_ALL,
        PermissionsEnum.ORG_OBSERVATION_DELETE,
        PermissionsEnum.ORG_OBSERVATION_FETCH,
        PermissionsEnum.ORG_OBSERVATION_UPDATE,
        PermissionsEnum.ORG_OBSERVATION_CREATE,
      ]">
        <div>
          <IndexHazardHeader :title="`observation`" :length="state?.data?.length" :projects="Projects"
            @update:data="setSelectedProjectFilter" />


          <div class="flex items-center justify-between">
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <IndexFilter :filters="Filters" @update:data="ApplayFilter"
                :link="'/organization/equipment-mangement/observation/add'" :linkText="'Create Observation'" />
            </PermissionBuilder>


            <!-- <div class="btns-filter"> -->
              <!-- <FilterDialog @confirmFilters="confirmFilters" /> -->

              <!-- <PermissionBuilder :code="[
                PermissionsEnum?.ORGANIZATION_EMPLOYEE,
                PermissionsEnum?.ORG_OBSERVATION_CREATE,
              ]">
                <router-link :to="`/organization/equipment-mangement/observation/add`">
                  <button class="btn btn-primary">{{ $t('Create observation') }}</button>
                </router-link>
              </PermissionBuilder> -->
            <!-- </div> -->
            <!-- capaStatus -->
             <div class="export-fillter">
              <div class="select-cap-status">
                 <CustomSelectInput :required="false" :modelValue="capaStatus" :static-options="ActionStatusList"
                 label="Status" id="Severity" placeholder="Select Status" @update:modelValue="setCapaStatus" />
              </div>
              <div class=""> <button class="btn btn-secondary" @click="exportExcel">Export Excel</button></div>
             </div>
          </div>
        </div>
        <DataStatus :controller="state">
          <template #success>
            <div class="table-responsive">
              <div class="index-table-card-container">
                <div class="index-table-card" style="box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);"
                  v-for="(item, index) in state.data" :key="index">

                  <!-- :to="`observation/show/${item?.id}`" -->
                  <div class="w-full">
                    <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
                      <div class="header-container">
                        <div class="card-content" style="flex: 1">
                          <div class="card-header">
                            <p class="label-item-primary">
                              {{ $t('Serial') }} : <span>{{ item.serialName }}</span>
                            </p>
                            <p class="label-item-secondary">
                              {{ $t('Date & Time') }} :
                              <span>{{ item.date }} & {{ item.time }}</span>
                            </p>
                            <p class="label-item-secondary flex items-center gap-1">
                              {{ $t('operation type') }} :
                              <span>{{ GetObservationType(item.type) }}</span>
                            </p>
                            <!-- <p class="label-item-secondary flex items-center gap-1" v-if="item.actionStatus">
                              {{ $t('status') }} : <span>{{ GetAcionStatus(item.actionStatus) }}</span>
                              <CustomCheckboxToggle :index="item.id" title="" :checked="item.actionStatus == 1"
                                @update:checked="toggleObservationActionStatus(item?.id)" />
                            </p> -->
                            <p class="label-item-secondary flex items-center gap-1"
                              :class="`${GetSaveStatus(item.saveStatus)}`" v-if="item.saveStatus">
                              {{ GetSaveStatus(item.saveStatus) }}

                            </p>
                            <!-- <p class="label-item-secondary Negative flex items-center gap-1"
                              v-if="item.isWorkStopped == 1">
                              {{ item.isWorkStopped == 1 ? 'Work Stoped' : '' }}
                              <CustomCheckboxToggle :index="item.id + 100" title="" :checked="item.isWorkStopped == 1"
                                @update:checked="toggleObservationWorkStopped(item?.id)" />
                            </p> -->

                          </div>
                          <router-link :to="`equipment-mangement/observation/show/${item?.id}`" class="card-details">
                            <p class="title">
                              {{ item.observer.name }} <span>{{ '(observer)' }}</span>
                            </p>
                            <p class="subtitle">{{ item.title }}</p>
                            <!-- <p class="subtitle">{{ item.description }}</p> -->
                            <div class="project-details">
                              <p class="label-item-primary flex items-center gap-1" v-if="item.zoon?.title">
                                <PinIcons /> {{ $t('Zone') }} : <span>{{ item.zoon?.title }}</span>
                              </p>
                              <p class="label-item-primary" v-if="item.equipment?.title">
                                {{ $t('Machine') }} : <span>{{ item.equipment?.title }}</span>
                              </p>
                              <!-- <p class="label-item-primary" v-if="item.status">
                                Status : <span>{{ item?.status }}</span>
                              </p> -->
                            </div>
                          </router-link>
                        </div>

                        <div class="card-info">
                          <span v-if="item.riskLevel && item.saveStatus == SaveStatusEnum.NotSaved"
                            class="observation-risk-level flex items-center gap-1"
                            :class="GetRiskLevel(item.riskLevel)">
                            {{ GetRiskLevel(item.riskLevel) }} {{ '(Level)' }}
                            <HighLevel v-if="GetRiskLevel(item.riskLevel) === 'High'" />
                          </span>
                          <!-- <img :src="item.HazardImg" alt="hazard-img"> -->
                          <Image v-if="item.media[0]?.url" :src="item.media[0]?.url" alt="Image" preview>
                            <template #previewicon>
                              <div class="perview">
                                <span>{{ $t('View') }}</span>
                                <ViewIcon />
                              </div>
                            </template>
                          </Image>
                          <!-- <img v-else src="@/assets/images/logo.svg" alt=""> -->
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="observation-dwspcription-more">
                    <p class="show-more" @click="ShowDetails[index] = !ShowDetails[index]">
                      <span v-if="ShowDetails[index]">{{ $t('Show Less') }}</span>
                      <span v-else>{{ $t('Show More') }}</span>
                      <ShowMoreIcon />
                    </p>

                    <div v-if="ShowDetails[index]" class="card-description">
                      <p class="title">{{ $t('description') }} :</p>
                      <p class="description">
                        {{ item.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Pagination :pagination="state.pagination" @changePage="handleChangePage"
              @countPerPage="handleCountPerPage" />
          </template>
          <template #loader>
            <CardSkelaton />
            <!-- <TableLoader :cols="3" :rows="10" /> -->
          </template>
          <template #initial>
            <CardSkelaton />
            <!-- <TableLoader :cols="3" :rows="10" /> -->
          </template>
          <template #empty>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <DataEmpty :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation" />
            </PermissionBuilder>
          </template>
          <template #failed>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.ORG_OBSERVATION_CREATE,
            ]">
              <DataFailed :link="`/organization/equipment-mangement/observation/add`" addText="Add Observation"
                description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data"
                title="..ops! You have No Observation" />
            </PermissionBuilder>
          </template>
        </DataStatus>
        <template #notPermitted>
          <DataFailed addText="Have not  Permission"
            description="Sorry .. You have no Observation .. All your joined customers will appear here when you add your customer data" />
        </template>
      </PermissionBuilder>
    </div>
  </div>
</template>

<style scoped lang="scss">
.export-fillter{
display: flex;
align-items: end;
justify-content: end;
gap: 10px;
width: 100%;
}
.select-cap-status{
  width: 70%;
}
</style>
