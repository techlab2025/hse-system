<script setup lang="ts">
import { EquipmentInspectionEnum } from '@/features/setting/Equipment/Core/enum/EquipmentInspectionEnum';
import type InspectionModel from '../../../Data/models/InspectionModel';
import InspectionTaskbg from "@/assets/images/InspectionTaskbg.png"
import { ref } from 'vue';
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue';
import LastInspectionCard from './LastInspectionCard.vue';
import ShowInspectionDialog from '../InspectionDialog/ShowInspectionDialog.vue';
import { AssignToTypeEnum } from '../../../Core/Enum/AssignToTypesEnum';
import InspectionStartTemplate from '../InspectionDialog/InspectionStartTemplate.vue';

const props = defineProps<{
  tasks: InspectionModel[]
  isDrag?: boolean
  showresult?: boolean
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))?.title
}

const getInspectionType = (type: number) => {
  return AssignToTypeEnum[type]
}

</script>
<template>
  <div class="inspection-card">

    <div class="inspection-history-container">
      <div class="inspection-history w-full flex items-start gap-2" v-for="(task, index) in tasks" :key="index">
        <img class="bg" :src="InspectionTaskbg" alt="">
        <div class="inspection-header">
          <!-- <img class="warn" :src="Warn" alt="warn" width="30" height="30"> -->
          <div class="inspection-header-content">
            <div class="title-container">
              <span class="title">Inspection</span>
              <!-- <span class="date">{{ task?.date }}</span> -->
            </div>
            <div class="inspection-info">
              <p>Inspection Type: <span>{{ getInspectionType(task?.morphType) }}</span></p>
              <p>Assigned by : <span>{{ task?.createdBy?.name }}</span></p>
              <p v-if="!isDrag">Number of result: <span>{{ task?.numberOfResults }}</span></p>
              <p>Date&Time : <span>{{ task?.date }}</span></p>
            </div>
          </div>
        </div>
        <!-- <LastInspectionCard class="mt" v-if="!isDrag && !showresult" :task="task?.lastInspectionResult" -->
        <LastInspectionCard class="mt" v-if="!isDrag && !showresult" :task="task?.lastInspectionResult"
          :fulltask="task" />


        <!-- <ShowInspectionDialog class="mt" v-if="isDrag" :taskId="task.id" /> -->


        <div class="mt w-full" v-if="isDrag">
          <InspectionStartTemplate :templateId="task?.template?.id" :taskId="task?.id" :status="task?.status"
            :showResult="false" />
        </div>
        <div class="mt w-full" v-if="showresult">
          <InspectionStartTemplate :templateId="task?.template?.id" :taskId="task?.id" :status="task?.status"
            :showResult="true" />
        </div>


        <router-link v-if="!isDrag && !showresult" class="btn btn-primary w-full"
          :to="`/organization/equipment-mangement/inspection/result/${task.id}`">
          <span>show</span>
        </router-link>


      </div>
    </div>
  </div>

</template>
<style scoped>
.mt {
  margin-top: 20px;
}

.btn-primary {
  margin-top: 20px;
}
</style>
