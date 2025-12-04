<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import IndexInspectionController from '../../controllers/indexInspectionController';
import IndexInspectionParams from '../../../Core/params/indexInspectionParams';
import EmployeeIconCard from '@/shared/icons/employeeIconCard.vue';
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'

const props = defineProps<{
  employee_id: number
  employee_name: string
}>()
const indexInspectionController = IndexInspectionController.getInstance()
const state = ref(indexInspectionController.state.value)

const GetEmployeeInspection = async () => {
  const indexInspectionParams = new IndexInspectionParams('', 1, 10, 1, [props?.employee_id])
  const respone = await indexInspectionController.getData(indexInspectionParams)
}

// onMounted(() => {
//   GetEmployeeInspection()
// })

watch(() => indexInspectionController.state.value, (newState) => {
  if (newState) {
    state.value = newState
  }
})

watch(() => props.employee_id, (newState) => {
  if (newState) {
    GetEmployeeInspection()
  }
})

const PeriodSubtipe = (periodSubType: string) => {
  // PeriodTypeEnum
  if (periodSubType == PeriodTypeEnum.DAILY) {
    return 'Daily'
  }
  if (periodSubType == PeriodTypeEnum.WHITDATE) {
    return 'WHITDATE'
  }
  if (periodSubType == PeriodTypeEnum.BYDAY) {
    return 'BYDAY'
  }
  if (periodSubType == PeriodTypeEnum.BYDATE) {
    return 'BYDATE'
  }
  else {
    return 'DAILY'
  }
}

const EmployeeName = ref<string>('')
watch(() => props.employee_name, (newValue) => {
  EmployeeName.value = newValue
})
</script>

<template>

  <!-- <pre>{{ state.data }}</pre> -->
  <div class="inspection-show">
    <div class="inspection-show-title">
      <EmployeeIconCard />
      <h5>{{ $t('employee') }}</h5>
    </div>
    <div class="cards">
      <div class="employee-card">
        <div class="info">
          <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" />
          <div class="employee-info">
            <h4 class="employee-name">{{ EmployeeName }}</h4>
            <h5 class="employee-role">{{state.data?.[0]?.morph?.hierarchy?.map((item: any) => item?.title).join('-')}}
            </h5>
          </div>
        </div>
        <div class="tasks-num">{{ state?.data?.length }} {{ $t('tasks') }}</div>
      </div>
      <DataStatus :controller="state">
        <template #success>
          <div class="employee-tasks">
            <div class="task-card" v-for="(task, index) in state.data" :key="index">
              <h4>{{ task?.template?.title }}</h4>
              <div class="date">
                <span>{{ $t('date') }} : </span>
                <p>{{ PeriodSubtipe(task?.periodSubType) }}</p>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <h3 class="text-center ">No Inspections</h3>
        </template>
      </DataStatus>
    </div>
  </div>

</template>
