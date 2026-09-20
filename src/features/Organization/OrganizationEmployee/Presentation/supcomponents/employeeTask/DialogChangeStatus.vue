<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { ChangeTaskStatusEnum } from '../../../Core/Enum/ChangeTaskStatusEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import changeTaskStatusController from '../../controllers/employeeTask/ChangeTaskStatusController'
import ChangeTaskStatusParams from '../../../Core/params/employeeTask/ChangeTaskStatusParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

const props = defineProps<{
  taskId: number
  visible: boolean
}>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'update:data'): void
}>()

const { t } = useI18n()
const controller = changeTaskStatusController.getInstance()

const reason = ref<string>('')
const selectedOption = ref<TitleInterface | null>(null)
const isSubmitting = ref(false)

const ChangeTaskStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: ChangeTaskStatusEnum.NOT_STARTED, title: t('task_status_not_started') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.IN_PROGRESS, title: t('task_status_in_progress') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.PENDING_ON_HOLD, title: t('task_status_pending') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.OVERDUE, title: t('task_status_overdue') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.COMPLETED, title: t('task_status_completed') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.CANCELLED, title: t('task_status_cancelled') }),
])

const isValid = computed(() => selectedOption.value !== null && reason.value.trim().length > 0)

const reset = () => {
  reason.value = ''
  selectedOption.value = null
}

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

watch(
  () => props.visible,
  (v) => {
    if (!v) reset()
  },
)

const submit = async () => {
  if (!isValid.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    await controller.getData(
      new ChangeTaskStatusParams({
        id: props.taskId,
        status: selectedOption.value!.id,
        reason: reason.value.trim(),
      }),
    )

    emit('update:data')
    dialogVisible.value = false
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :dismissable-mask="true"
    :header="$t('change task status')"
    :style="{ width: 'min(28rem, calc(100vw - 24px))' }"
  >
    <div class="task-status-dialog">
      <div class="input-wrapper">
        <UpdatedCustomInputSelect
          :modelValue="selectedOption"
          :staticOptions="ChangeTaskStatusOptions"
          :required="true"
          :reload="false"
          label="status"
          id="task_status"
          placeholder="Select status"
          @update:modelValue="selectedOption = $event as TitleInterface | null"
        />
      </div>

      <div class="task-note-field">
        <label for="reason">{{ $t('reason') }}</label>
        <Textarea
          id="reason"
          v-model="reason"
          :rows="3"
          :placeholder="$t('write the reason for changing status')"
        />
      </div>
    </div>

    <template #footer>
      <Button severity="secondary" variant="outlined" type="button" @click="dialogVisible = false">
        {{ $t('cancel') }}
      </Button>
      <Button
        type="button"
        :disabled="!isValid || isSubmitting"
        :loading="isSubmitting"
        @click="submit"
      >
        {{ $t('save') }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped>
.task-status-dialog {
  display: grid;
  gap: 18px;
  padding-block: 4px;
}

.task-note-field {
  display: grid;
  gap: 8px;
}

.task-note-field label {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.88rem;
  font-weight: 800;
}

.task-note-field :deep(textarea) {
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border: 1px solid var(--brand-primary-100);
  border-radius: 8px;
  background: var(--surface-1);
  color: var(--text-strong);
  font-family: inherit;
  line-height: 1.5;
}
</style>
