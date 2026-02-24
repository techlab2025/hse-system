<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import AddSerialForm from './AddSerialForm.vue'
import CustomCheckbox from '@/shared/HelpersComponents/CustomCheckbox.vue';
import { onMounted, ref, watch } from 'vue';
import { SertialNumberStatusEnum } from '../../Core/Enums/SerialNumberStatusEnum';
import { useProjectAppStatusStore } from '@/stores/ProjectStatus';
import IndexProjectProgressController from '@/features/Organization/ProjectPrgoress/Presentation/controllers/indexProjectProgressController';
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams';

const projectStatus = useProjectAppStatusStore()
const SerialType = ref<SertialNumberStatusEnum | null>(projectStatus.getProjectAppStatus()?.codeSystemType ?? SertialNumberStatusEnum.AUTO)
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
// onMounted(async () => {
//   await IndexProjectProgressController.getInstance().getData(
//     new IndexProjectProgressParams('', 1, 10, 0),
//   )
// })

// watch(() => projectStatus.projectAppStatus?.codeSystemType, () => {
//   SerialType.value = projectStatus.projectAppStatus?.codeSystemType ?? SertialNumberStatusEnum.AUTO
// })
</script>

<template>
  <div>
    <PagesHeader :title="$t('Serial Number Management')" :actions="true">
      <template #actions>
        <CustomCheckbox :index="6" :title="GetSerialTypeTitle(SerialType!)" @update:checked="updateSerialType"
          :checked="SerialType === SertialNumberStatusEnum.AUTO" />
      </template>
    </PagesHeader>
    <div>
      <AddSerialForm @update:data="$emit('update:data')" @close:dialog="$emit('close:dialog')"
        :serialType="SerialType" />
    </div>
  </div>
</template>

<style scoped>
.checkbox-toggle-wrapper {
  border: none !important;
  margin-top: 0 !important;
}
</style>
