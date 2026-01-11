<script setup lang="ts">
import { EquipmentInspectionEnum } from '@/features/setting/Equipment/Core/enum/EquipmentInspectionEnum'
import type InspectionModel from '../../../Data/models/InspectionModel'
import InspectionTaskbg from '@/assets/images/InspectionTaskbg.png'
import { ref } from 'vue'
import EquipmentInspectionShowDialog from '@/features/setting/Equipment/Presentation/components/Dialogs/EquipmentInspectionShowDialog.vue'
import LastInspectionCard from './LastInspectionCard.vue'
import ShowInspectionDialog from '../InspectionDialog/ShowInspectionDialog.vue'
import { AssignToTypeEnum } from '../../../Core/Enum/AssignToTypesEnum'
import InspectionStartTemplate from '../InspectionDialog/InspectionStartTemplate.vue'

import DurationBox from './DurationBox.vue'
import ButtonArrow from '../../../../../../shared/icons/ButtonArrow.vue';
import ChevronRight from '../../../../../../shared/icons/ChevronRight.vue';

import { InspectionTypeEnum } from '../../../Core/Enum/InspectionTypeEnum'
import type TaskPeriodModel from '../../../Data/models/TaskPeriodModel'
import { PeriodTypeEnum } from '../../../Core/Enum/PeriodTypeEnum'

const props = defineProps<{
  tasks: InspectionModel[]
  // perioddata: TaskPeriodModel[]
  isDrag?: boolean
  showresult?: boolean
}>()

const GetInspectionTitle = (task: InspectionModel) => {
  return task.template?.titles?.find((title: any) => title.locale === localStorage.getItem('lang'))
    ?.title
}

const getInspectionType = (type: number) => {
  return AssignToTypeEnum[type]
}

// if all (inspection form) 1  => !isDrag && !showresult
// if all (Drag inspection form) 2  => isDrag
// if all (Show inspection form) 3  => showresult
</script>
<template>
  <div class="inspection-card">
    <div class="inspection-history-container">
      <div
        class="inspection-history w-full flex items-start gap-2"
        v-for="(task, index) in tasks"
        :key="index"
      >
        <img class="bg" :src="InspectionTaskbg" alt="" />
        <div class="inspection-header">
          <!-- <img class="warn" :src="Warn" alt="warn" width="30" height="30"> -->
          <div class="inspection-header-content">
            <div class="title-container">
              <div class="date-wrapper">
                <span class="title">Prime Inspection</span>
                <span class="date">{{ task?.date }}</span>
              </div>
              <div class="count">
                <h5>10</h5>
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
                  Emp_
                  <span>{{ task?.createdBy?.name }}</span>
                </h5>
              </div>

              <div>
                <!-- {{ period }} -->
                <DurationBox
                  v-if="task?.periodType == InspectionTypeEnum.DAY"
                  singleImage="/src/assets/images/onceimg.png"
                  :data="task"
                />

                <DurationBox
                  v-if="task?.periodType == InspectionTypeEnum.PERIOD"
                  :data="task"
                />
              </div>

              <!-- <p>
                Inspection Type: <span>{{ getInspectionType(task?.morphType) }}</span>
              </p> -->

              <!-- <p v-if="!isDrag">
                Number of result: <span>{{ task?.numberOfResults }}</span>
              </p> -->
              <!-- <p>
                Date&Time : <span>{{ task?.date }}</span>
              </p> -->
            </div>
          </div>
        </div>

        <div class="tool-box" v-if="task?.equipment?.length > 0">
          <div class="tool-img">
            <img src="/src/assets/images/toolimg.png" alt="" />
          </div>
          <div class="contents">
            <div class="past">
              <h4>Tools</h4>
              <ChevronRight />
              <h6>hand tool</h6>
            </div>
            <h3>Drilling Rig</h3>
          </div>
        </div>
        <!-- <LastInspectionCard class="mt" v-if="!isDrag && !showresult" :task="task?.lastInspectionResult" -->
        <LastInspectionCard
          class="mt"
          v-if="!isDrag && !showresult"
          :task="task?.lastInspectionResult"
          :fulltask="task"
        />

        <!-- <ShowInspectionDialog class="mt" v-if="isDrag" :taskId="task.id" /> -->

        <div class="mt w-full" v-if="isDrag">
          <InspectionStartTemplate
            :templateId="task?.template?.id"
            :taskId="task?.id"
            :status="task?.status"
            :showResult="false"
          />
        </div>
        <div class="mt w-full" v-if="showresult">
          <InspectionStartTemplate
            :templateId="task?.template?.id"
            :taskId="task?.id"
            :status="task?.status"
            :showResult="true"
          />
        </div>

        <router-link
          v-if="!isDrag && !showresult"
          class="show-button w-full mt"
          :to="`/organization/equipment-mangement/inspection/result/${task.id}`"
        >
          <div class="button-text">
            <h5>Show all results</h5>
            <!-- <span>20</span> -->
          </div>
          <ButtonArrow />
        </router-link>
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
</style>
