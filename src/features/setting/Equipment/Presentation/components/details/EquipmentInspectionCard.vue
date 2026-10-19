<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'
import EquipmentInspectionShowDialog from '../Dialogs/EquipmentInspectionShowDialog.vue'
import DurationBox from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/DurationBox.vue'
import { InspectionTypeEnum } from '@/features/Organization/Inspection/Core/Enum/InspectionTypeEnum'
import { InspectionStatus } from '@/features/Organization/Inspection/Core/Enum/InspectionStatusEnum'
import LastInspectionCard from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/LastInspectionCard.vue'
import InspectionStartTemplate from '@/features/Organization/Inspection/Presentation/components/InspectionDialog/InspectionStartTemplate.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
defineProps<{
  tasks: InspectionModel[]
  isDrag?: boolean
  showresult?: boolean
  isEquipment?: boolean
  isEquipmentResult?: boolean
  isEquipmentShowQuestions?: boolean
}>()
const { locale } = useI18n()
const title = (task: InspectionModel) =>
  task.template?.titles?.find((item) => item.locale === locale.value)?.title || task.template?.title
</script>
<template>
  <div class="eq-records">
    <article v-for="task in tasks" :key="task.id" class="eq-record">
      <header class="eq-record-header">
        <span class="eq-record-icon"><ProjectIcon name="equipment" /></span>
        <div>
          <h3>{{ title(task) || $t('Inspection') }}</h3>
          <p v-if="task.created_at" class="eq-muted">
            {{ $t('created_at') }} · {{ task.created_at }}
          </p>
        </div>
        <span
          v-if="
            task.status === InspectionStatus.FINISHED ||
            task.status === InspectionStatus.NOT_FINISHED
          "
          class="eq-badge"
          :class="{ 'eq-badge--rent': task.status === InspectionStatus.NOT_FINISHED }"
          >{{
            $t(
              task.status === InspectionStatus.FINISHED
                ? 'inspection_completed'
                : 'inspection_in_progress',
            )
          }}</span
        >
        <span v-if="task.template?.templateItems?.length" class="eq-record-count"
          >{{ task.template.templateItems.length }} {{ $t('eq_items') }}</span
        >
      </header>
      <dl class="eq-record-facts">
        <div>
          <dt><ProjectIcon name="users" />{{ $t('Inspected by') }}</dt>
          <dd>{{ task.inspectedBy?.name || task.createdBy?.name || '—' }}</dd>
        </div>
        <div>
          <dt><ProjectIcon name="users" />{{ $t('eq_assigned_to') }}</dt>
          <dd>{{ task.assigned_to?.name || task.assigned_to?.title || '—' }}</dd>
        </div>
        <div v-if="task.date || task.from_date">
          <dt><ProjectIcon name="clock" />{{ $t('inspection date') }}</dt>
          <dd>{{ task.from_date || task.date }}</dd>
        </div>
        <div v-if="task.equipment">
          <dt><ProjectIcon name="equipment" />{{ $t('Equipment') }}</dt>
          <dd>{{ task.equipment.title || task.equipment.equipment_type?.title || '—' }}</dd>
        </div>
      </dl>
      <div
        v-if="
          task.periodType === InspectionTypeEnum.DAY ||
          task.periodType === InspectionTypeEnum.PERIOD
        "
        class="eq-record-frequency"
      >
        <ProjectIcon name="clock" /><DurationBox
          :data="task"
          :is-show="showresult"
          :is-drag="isDrag"
        />
      </div>
      <LastInspectionCard
        v-if="isEquipmentShowQuestions && task.hasResults && task.lastInspectionResult"
        class="eq-last-result"
        :task="task.lastInspectionResult"
        :fulltask="task"
      />
      <footer class="eq-record-footer">
        <EquipmentInspectionShowDialog
          v-if="isEquipmentShowQuestions"
          :template-id="task.template?.id"
          :task-id="task.id"
          :status="task.status"
          :is-equipment="true"
        />
        <InspectionStartTemplate
          v-if="isEquipmentResult"
          :template-id="task.template?.id"
          :task-id="task.task_id"
          :status="task.status"
          :show-result="true"
        />
      </footer>
    </article>
  </div>
</template>
