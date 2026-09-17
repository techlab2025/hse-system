<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import IndexOwnTaskController from '../../controllers/employeeTask/indexOwnTaskController'
import IndexOwnTaskParams from '../../../Core/params/employeeTask/indexOwnTaskParams'
import DialogChangeStatus from '../../supcomponents/employeeTask/DialogChangeStatus.vue'

const route = useRoute()
const controller = IndexOwnTaskController.getInstance()
const state = ref(controller.state.value)

const dialogVisible = ref(false)
const selectedTaskId = ref<number>(0)

const openStatusDialog = (taskId: number) => {
  selectedTaskId.value = taskId
  dialogVisible.value = true
}

const fetchEmployeeOwnTasks = async (id: number) => {
  await controller.getData(new IndexOwnTaskParams(id))
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) fetchEmployeeOwnTasks(id)
})

watch(
  () => controller.state.value,
  (newState) => {
    if (newState) state.value = newState
  },
  { deep: true },
)
</script>

<template>
  <div class="tasks_wrapper">
    <div v-for="task in state?.data ?? []" :key="task.id" class="task_card">
      <div class="task_card__header">
        <span class="task_code">#{{ task?.code }}</span>
        <Tag :value="task?.statusText" :severity="task?.statusSeverity" />
      </div>

      <div class="task_card__body">
        <h6 class="task_title">{{ task?.title }}</h6>
        <p class="task_description">{{ task?.description }}</p>
      </div>

      <div class="task_card__meta">
        <div class="meta_item">
          <span class="meta_label">{{ $t('team leader') }}</span>
          <span class="meta_value">{{ task?.teamLeader }}</span>
        </div>
        <div class="meta_item">
          <span class="meta_label">{{ $t('Assigned To') }}</span>
          <span class="meta_value">{{ task?.assignedTo }}</span>
        </div>
        <div class="meta_item">
          <span class="meta_label">{{ $t('Duration') }}</span>
          <span class="meta_value">{{ task?.duration }}</span>
        </div>
        <div class="meta_item">
          <span class="meta_label">{{ $t('Delivery date') }}</span>
          <span class="meta_value">{{ task?.deliveryDate }}</span>
        </div>
      </div>

      <div class="task_card__footer">
        <Button size="small" @click="openStatusDialog(task.id)">
          {{ $t('change status') }}
        </Button>
      </div>
    </div>

    <DialogChangeStatus v-model:visible="dialogVisible" :task-id="selectedTaskId" />
  </div>
</template>

<style scoped>
.tasks_wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.task_card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--surface-border);
  border-radius: 12px;
  background: var(--surface-card);
  transition: box-shadow 0.2s ease;
}
.task_card:hover {
  box-shadow: 0 4px 14px rgb(0 0 0 / 8%);
}
.task_card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task_code {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}
.task_title {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 600;
}
.task_description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.task_card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--surface-border);
}
.meta_item {
  display: flex;
  flex-direction: column;
}
.meta_label {
  font-size: 0.72rem;
  color: var(--text-color-secondary);
}
.meta_value {
  font-size: 0.85rem;
  font-weight: 500;
}
.task_card__footer {
  display: flex;
  justify-content: flex-end;
}
</style>