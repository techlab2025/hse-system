<script setup lang="ts">
import InspectionTaskbg from "@/assets/images/InspectionTaskbg.png"
import InspectionHeader from "@/assets/images/InspectionHeader.png"
import { ref } from "vue";
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
</script>
<template>
  <div class="inspection-result">
    <div class="inspection-result-header">
      <img class="bg" :src="InspectionTaskbg" alt="">
      <img class="inspection-header-bg" :src="InspectionHeader" alt="">
      <img class="right-bg" :src="InspectionTaskbg" alt="">
      <p class="title">inspection</p>
      <div class="card-info">
        <p>Inspection Type: <span>Emp</span></p>
        <p>Assigned by : <span>Ahmed hawam</span></p>
        <p>Date&Time : <span>22 july,10 : 30 AM</span></p>
      </div>
    </div>
    <div class="inspection-result-body">
      <div class="statistics">
        <div v-for="(statistic, index) in Statistics" :key="index" class="statistic">
          <component :is="statistic.icon" />
          <div class="card-data">
            <p class="card-title">{{ statistic.text }}</p>
            <p class="card-number">{{ statistic.number }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="inspection-result-table">
      <table>
        <thead>
          <tr>
            <th>serial</th>
            <th>Emp</th>
            <th>Date</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td>{{ i }}</td>
            <td>Ahmed Hawam</td>
            <td>22 july 2025</td>
            <td>10 : 30 AM</td>
            <td>
              <DropList :actionList="actionList(i, i)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
