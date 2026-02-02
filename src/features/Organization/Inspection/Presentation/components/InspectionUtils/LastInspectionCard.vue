<script setup lang="ts">
import { EquipmentInspectionEnum } from '@/features/setting/Equipment/Core/enum/EquipmentInspectionEnum'
import type InspectionModel from '../../../Data/models/InspectionModel'
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import { ref } from 'vue'
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue'
import type LastInspectionModel from '../../../Data/models/LastInspectionModel'
import InspectionStartTemplate from '../InspectionDialog/InspectionStartTemplate.vue'

const props = defineProps<{
  task: LastInspectionModel
  fulltask: InspectionModel
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))
    ?.title
}
</script>
<template>
  <!-- <pre>{{ task }}</pre> -->
  <div class="last-inspection-card" v-if="fulltask?.hasResults">
    <div class="inspection-history-container">
      <div class="inspection-header-content">
        <div class="title-container">
          <span class="title">Last Inspection</span>
        </div>
        <div class="inspection-info-container">
          <div class="inspection-info">
            <p>
              {{ $t('Inspected by') }} : <span>{{ task?.employee?.name || task?.created_by?.name }}</span>
            </p>
            <p>
              {{ $t('Date') }} : <span>{{ task?.date }}</span>
            </p>
            <!-- <p>Time : <span>{{task?.date}}</span></p> -->
          </div>
          <div>
            <span class="view-inspection-btn">
              <InspectionStartTemplate :templateId="fulltask?.template?.id" :taskId="fulltask?.id"
                :status="fulltask?.status" :lastinspection="true" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
