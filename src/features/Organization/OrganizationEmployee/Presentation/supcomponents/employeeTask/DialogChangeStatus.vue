<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChangeTaskStatusEnum } from '../../../Core/Enum/ChangeTaskStatusEnum'
import TitleInterface from '@/base/Data/Models/title_interface'
import changeTaskStatusController from '../../controllers/employeeTask/ChangeTaskStatusController';
import ChangeTaskStatusParams from '../../../Core/params/employeeTask/ChangeTaskStatusParams';


const props = defineProps<{ taskId: number }>()
const visible = defineModel<boolean>('visible', { required: true })

const { t } = useI18n()
const controller = changeTaskStatusController.getInstance()

const reason = ref<string>('')
const selectedOption = ref<number | null>(null)

const ChangeTaskStatusOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: ChangeTaskStatusEnum.completed, title: t('Completed') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.pending, title: t('Pending') }),
  new TitleInterface({ id: ChangeTaskStatusEnum.cancelled, title: t('Cancelled') }),
])

const isValid = computed(() => selectedOption.value !== null && reason.value.trim().length > 0)

const reset = () => {
  reason.value = ''
  selectedOption.value = null
}

watch(visible, (v) => {
  if (!v) reset()
})

const submit = async () => {
  if (!isValid.value) return

  await controller.update(
    new ChangeTaskStatusParams({
      id: props.taskId,
      status: selectedOption.value!,
      reason: reason.value.trim(),
    }),
  )

  visible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="$t('change task status')"
    :style="{ width: '28rem' }"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1.5">
        <label for="status">{{ $t('status') }}</label>
        <div class="buttons flex gap-2 flex-wrap">
          <Button
            v-for="option in ChangeTaskStatusOptions"
            :key="option.id"
            :class="{ 'p-button-outlined': selectedOption !== option.id }"
            @click="selectedOption = option.id"
          >
            {{ option.title }}
          </Button>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
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
      <Button severity="secondary" variant="outlined" @click="visible = false">
        {{ $t('cancel') }}
      </Button>
      <Button :disabled="!isValid" :loading="controller.state.value?.loading" @click="submit">
        {{ $t('save') }}
      </Button>
    </template>
  </Dialog>
</template>