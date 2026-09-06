<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import AddSerialForm from './AddSerialForm.vue'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue'
import { onMounted, ref, watch } from 'vue'
import { SertialNumberStatusEnum } from '../../Core/Enums/SerialNumberStatusEnum'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController'
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams'

const projectStatus = useProjectAppStatusStore()
const emit = defineEmits(['update:data', 'close:dialog'])

const SerialType = ref<SertialNumberStatusEnum>(
  projectStatus.getProjectAppStatus()?.codeSystemType ?? SertialNumberStatusEnum.AUTO,
)

const refreshSerialType = async () => {
  const state = await IndexProjectProgressController.getInstance().getData(
    new IndexProjectProgressParams('', 1, 10, 0),
  )
  const status = state.value.data

  if (!status) return

  projectStatus.setProjectAppStatus(status)
  SerialType.value = status.codeSystemType
}

const handleSerialUpdated = async () => {
  await refreshSerialType()
  emit('update:data')
}

const updateSerialType = (type: boolean) => {
  if (type) {
    SerialType.value = SertialNumberStatusEnum.AUTO
  } else {
    SerialType.value = SertialNumberStatusEnum.MANUAL
  }
}
const GetSerialTypeTitle = (type: SertialNumberStatusEnum) => {
  switch (type) {
    case SertialNumberStatusEnum.AUTO:
      return 'Auto'
    case SertialNumberStatusEnum.MANUAL:
      return 'Manual'
    default:
      return ''
  }
}
onMounted(refreshSerialType)

watch(
  () => projectStatus.projectAppStatus?.codeSystemType,
  (status) => {
    if (status) SerialType.value = status
  },
)
</script>

<template>
  <div>
    <PagesHeader
      :title="$t('Serial Number Management')"
      :subtitle="
        SerialType === SertialNumberStatusEnum.AUTO
          ? $t('You Must Fill Serial Configuration First')
          : $t('Now You Can Fill Serial Number Manually')
      "
      :actions="true"
    >
      <!-- <span v-if="SerialType === SertialNumberStatusEnum.AUTO" class="subtitle">{{
        $t('You Must Fill Serial Configuration First')
      }}</span>
      <span v-else class="subtitle">{{ $t('Now You Can Fill Serial Number Manually') }}</span> -->
      <template #actions>
        <div class="actions-switch">
          <CustomCheckbox
            :index="6"
            :title="GetSerialTypeTitle(SerialType!)"
            @update:checked="updateSerialType"
            :checked="SerialType === SertialNumberStatusEnum.AUTO"
          />
        </div>
      </template>
    </PagesHeader>
    <div>
      <AddSerialForm
        @update:data="handleSerialUpdated"
        @close:dialog="emit('close:dialog')"
        :serialType="SerialType"
      />
    </div>
  </div>
</template>

<style scoped>
.checkbox-toggle-wrapper {
  border: none !important;
  margin-top: 0 !important;
}
.subtitle {
  font-size: 14px;
  color: var(--text-soft);
  margin-top: 8px;
  display: block;
}
</style>
