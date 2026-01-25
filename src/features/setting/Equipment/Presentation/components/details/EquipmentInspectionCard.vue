<script setup lang="ts">
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import { ref } from 'vue'
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue'
import ButtonArrow from '../../../../../../shared/icons/ButtonArrow.vue'
import ChevronRight from '../../../../../../shared/icons/ChevronRight.vue'
import image from '@/assets/images/onceimg.png'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import DurationBox from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/DurationBox.vue'
import { InspectionTypeEnum } from '@/features/Organization/Inspection/Core/Enum/InspectionTypeEnum'
import LastInspectionCard from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/LastInspectionCard.vue'
import InspectionStartTemplate from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/InspectionStartTemplate.vue'
import { AssignToTypeEnum } from '@/features/Organization/Inspection/Core/Enum/AssignToTypesEnum'

const props = defineProps<{
  tasks: InspectionModel[]
  // perioddata: TaskPeriodModel[]
  isDrag?: boolean
  showresult?: boolean
  isEquipment?: boolean
}>()



const GetMorohType = (type) => {
  return AssignToTypeEnum[type]
}
const GetEquipmentType = (type: number) => {
  return EquipmentTypesEnum[type]
}

</script>
<template>
  <div class="inspection-card">
    <div class="inspection-history-container">
      <div class="inspection-history w-full flex items-start gap-2" v-for="(task, index) in tasks" :key="index">
        <img class="bg" :src="InspectionTaskbg" alt="" />
        <div class="inspection-header">
          <div class="inspection-header-content">
            <div class="title-container">
              <div class="date-wrapper">
                <span class="title" v-if="task?.template?.title">{{ task?.template?.title }}</span>
                <span class="title" v-else> Inspection</span>
                <span class="date">{{ task?.created_at }}</span>
              </div>
              <div class="count" v-if="task?.template?.templateItems?.length > 0">
                <h5>{{ task?.template?.templateItems?.length }}</h5>
                <span>items</span>
              </div>
            </div>

            <div class="inspection-info">
              <div class="info-box">
                <p class="assigned-by">Assigned by :</p>
                <h5 class="position">
                  <span>{{ task?.createdBy?.name }}</span>
                </h5>
              </div>

              <div class="arrow-img">
                <img src="/src/assets/images/assign-arrow.png" alt="" />
              </div>

              <div class="info-box">
                <p class="assigned-by">Assigned To :</p>
                <h5 class="position">
                  {{ GetMorohType(task?.morphType).slice(0, 3) }}_
                  <span>{{ task?.assigned_to?.name || task?.assigned_to?.title }}</span>
                </h5>
              </div>

              <div>
                <DurationBox v-if="task?.periodType == InspectionTypeEnum.DAY" :singleImage="image" :data="task"
                  :isShow="showresult" :isDrag="isDrag" />
                <DurationBox v-if="task?.periodType == InspectionTypeEnum.PERIOD" :data="task" />
              </div>


            </div>
          </div>
        </div>

        <div class="tool-box" v-if="task?.equipment">
          <div class="tool-img">
            <img :src="task?.equipment?.image!" alt="" @error="setDefaultImage" />
          </div>
          <div class="contents">
            <div class="past">
              <!-- <pre>{{ task?.equipment }}</pre> -->
              <h4>{{ GetEquipmentType(task?.equipment?.equipmentType?.type) }}</h4>
              <ChevronRight />
              <h6>{{ task?.equipment?.equipmentType?.title }}</h6>
            </div>
            <h3>{{ task?.equipment?.title }}</h3>
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
          <InspectionStartTemplate :templateId="task?.template?.id" :taskId="task?.task_id" :status="task?.status"
            :showResult="true" />
        </div>

        <router-link v-if="!isDrag && !showresult && !isEquipment" class="show-button w-full mt"
          :to="`/organization/equipment-mangement/inspection/result/${task.id}`">
          <div class="button-text">
            <h5>Show all results</h5>
          </div>
          <ButtonArrow />
        </router-link>

        <div v-if="isEquipment" class="show-button w-full mt">

          <EquipmentInspectionShowDialog :taskId="task.id" :isEquipment="true" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.mt {
  margin-top: 12px;
}

.btn-primary {
  margin-top: 20px;
}

.count {
  display: block;
}
</style>
