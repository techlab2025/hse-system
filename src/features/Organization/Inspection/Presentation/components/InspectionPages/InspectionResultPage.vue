<script setup lang="ts">
import InspectionTaskbg from "@/assets/images/InspectionTaskbg.png"
import InspectionHeader from "@/assets/images/InspectionHeader.png"
import { onMounted, ref, watch } from "vue";
import AllResultIcon from "@/shared/icons/AllResultIcon.vue";
import ResulReceiveIcon from "@/shared/icons/ResulReceiveIcon.vue";
import ResultComlated from "@/shared/icons/ResultComlated.vue";
import ResultNotComlated from "@/shared/icons/ResultNotComlated.vue";
import DelayedResult from "@/shared/icons/DelayedResult.vue";
import DropList from "@/shared/HelpersComponents/DropList.vue";
import { PermissionsEnum } from "@/features/users/Admin/Core/Enum/permission_enum";
import IconDelete from "@/shared/icons/IconDelete.vue";
import IconEdit from "@/shared/icons/IconEdit.vue";
import { useI18n } from "vue-i18n";
import FetchTaskResultDetailsController from "../../controllers/FetchTaskResultDetailsController";
import FetchTaskResultDetailsParams from "../../../Core/params/FetchTaskResultDetailsParams";
import { useRoute } from "vue-router";
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { AssignToTypeEnum } from "../../../Core/Enum/AssignToTypesEnum";
import FetchInspectionResultController from "../../controllers/FetchInspectionResultController";
import FetchInspectionResultParams from "../../../Core/params/FetchInspectionResultParams";
import EquipmentInspectionResultDialog from "@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionResultDialog.vue";

const route = useRoute()
const id = route.params?.id
const Statistics = ref([
  {
    text: "all Result",
    number: 50,
    icon: AllResultIcon
  },
  {
    text: "Results received today",
    number: 50,
    icon: ResulReceiveIcon
  },
  {
    text: "Results completed",
    number: 50,
    icon: ResultComlated
  },
  {
    text: "Results not completed",
    number: 50,
    icon: ResultNotComlated
  },
  {
    text: "Delayed results",
    number: 50,
    icon: DelayedResult
  },
])
const { t } = useI18n()
const actionList = (id: number, deletePartner: (id: number) => void) => [
  // {
  //   text: t('edit'),
  //   icon: IconEdit,
  //   link: `/organization/partner/${id}`,
  //   permission: [
  //     PermissionsEnum.PARTNER_UPDATE,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.PARTNER_ALL,
  //   ],
  // },

  // {
  //   text: t('delete'),
  //   icon: IconDelete,
  //   action: () => deletePartner(id),
  //   permission: [
  //     PermissionsEnum.PARTNER_DELETE,
  //     PermissionsEnum.ORGANIZATION_EMPLOYEE,
  //     PermissionsEnum.PARTNER_ALL,
  //   ],
  // },
]
const fetchTaskResultDetailsController = FetchTaskResultDetailsController.getInstance()
const staticstate = ref(fetchTaskResultDetailsController.state.value)


const fetchInspectionResultController = FetchInspectionResultController.getInstance()
const state = ref(fetchInspectionResultController.state.value)

const GetInspectionDetails = () => {
  const fetchTaskResultDetailsParams = new FetchTaskResultDetailsParams(id)
  fetchTaskResultDetailsController.getData(fetchTaskResultDetailsParams)
}


const GetInspectionResult = () => {
  const fetchInspectionResultParams = new FetchInspectionResultParams(id)
  fetchInspectionResultController.getData(fetchInspectionResultParams)
}
onMounted(() => {
  GetInspectionDetails()
  GetInspectionResult()
})

watch(() => fetchTaskResultDetailsController?.state.value, (newVal) => {
  staticstate.value = newVal
})
watch(() => fetchInspectionResultController?.state.value, (newVal) => {
  state.value = newVal
})

const getInspectionType = (type: number) => {
  return AssignToTypeEnum[type]
}
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="inspection-result">
        <div class="inspection-result-header">
          <img class="bg" :src="InspectionTaskbg" alt="">
          <img class="inspection-header-bg" :src="InspectionHeader" alt="">
          <img class="right-bg" :src="InspectionTaskbg" alt="">
          <p class="title">{{ $t('inspection') }}</p>
          <div class="card-info">
            <p>{{ $t('Inspection Type') }}: <span>{{ getInspectionType(staticstate?.data?.morphType) }}</span></p>
            <p>{{ $t('Assigned by') }} : <span>{{ staticstate?.data?.createdBy?.name }}</span></p>
            <p>{{ $t('Date&Time') }} : <span>{{ staticstate?.data?.createdAt }}</span></p>
          </div>
        </div>
        <div class="inspection-result-body">
          <div class="statistics">
            <div class="statistic">
              <component :is="Statistics[0]?.icon" />
              <div class="card-data">
                <p class="card-title">{{ $t('All Results') }}</p>
                <p class="card-number">{{ staticstate?.data?.allResult }}</p>
              </div>
            </div>
            <div class="statistic">
              <component :is="Statistics[1]?.icon" />
              <div class="card-data">
                <p class="card-title">{{ $t('Results received today') }}</p>
                <p class="card-number">{{ staticstate?.data?.resultsReceivedToday }}</p>
              </div>
            </div>
            <div class="statistic">
              <component :is="Statistics[2]?.icon" />
              <div class="card-data">
                <p class="card-title">{{ $t('Results completed') }}</p>
                <p class="card-number">{{ staticstate?.data?.resultsCompleted }}</p>
              </div>
            </div>
            <div class="statistic">
              <component :is="Statistics[3]?.icon" />
              <div class="card-data">
                <p class="card-title">{{ $t('Results not yet completed') }}</p>
                <p class="card-number">{{ staticstate?.data?.resultsNotYetCompleted }}</p>
              </div>
            </div>
            <div class="statistic">
              <component :is="Statistics[4]?.icon" />
              <div class="card-data">
                <p class="card-title">{{ $t('Delayed results') }}</p>
                <p class="card-number">{{ staticstate?.data?.delayedResults }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="inspection-result-table">
          <table>
            <thead>
              <tr>
                <th>{{ $t('serial') }}</th>
                <th>{{ $t('Emp') }}</th>
                <th>{{ $t('Date') }}</th>
                <th>{{ $t('Time') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(info, index) in state.data" :key="index">
                <td>{{ info.id + 1 }}</td>
                <td>{{ info.employee.name }}</td>
                <td>{{ info.date }}</td>
                <td>{{ info.time }}</td>
                <td>
                  <!-- <DropList :actionList="actionList(i, i)" /> -->
                  <EquipmentInspectionResultDialog :taskId="id"  />

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="3" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
        description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Inspection" />
    </template>
    <template #failed>
      <DataFailed :link="`/organization/equipment-mangement/inspection/add`" addText="Add Inspection"
        description="Sorry .. You have no Inspection .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Inspection" />
    </template>
  </DataStatus>
</template>
