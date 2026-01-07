<script setup lang="ts">
import { EquipmentInspectionEnum } from '@/features/setting/Equipment/Core/enum/EquipmentInspectionEnum';
import type InspectionModel from '../../../Data/models/InspectionModel';
import InspectionTaskbg from "@/assets/images/InspectionTaskbg.png"
import { ref } from 'vue';
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue';
import InspectionStartTemplate from '../InspectionDialog/InspectionStartTemplate.vue';
import type LastInspectionModel from '../../../Data/models/LastInspectionModel';

const props = defineProps<{
  task: LastInspectionModel
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))?.title
}

</script>
<template>
  <!-- <pre>{{ task }}</pre> -->
  <div class="last-inspection-card">

    <div class="inspection-history-container">
      <div class="inspection-header-content">
        <div class="title-container">
          <span class="title">Last Inspection</span>
        </div>
        <div class="inspection-info-container">
          <div class="inspection-info">
            <p>Assigned by : <span>{{ task?.employee?.name }}</span></p>
            <p>Date : <span>{{ task?.date }}</span></p>
            <!-- <p>Time : <span>{{task?.date}}</span></p> -->
          </div>
          <div>
            <span class="view-inspection-btn">Show Result</span>
            <!-- <span>start</span> -->
            <!-- <div class="mt w-full">
              <InspectionStartTemplate :templateId="tasks?.template?.id" :taskId="tasks?.id" :status="tasks?.status" />
            </div> -->

          </div>
        </div>

      </div>
    </div>
  </div>

</template>
