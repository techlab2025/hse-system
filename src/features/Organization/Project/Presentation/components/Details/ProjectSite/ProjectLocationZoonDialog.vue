<script setup lang="ts">
import { ref } from 'vue'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import ZoneDialog from '@/assets/images/ZoneDialog.png'
import Dialog from 'primevue/dialog'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'
import CreateProjectZoonController from '../../../controllers/CreateProjectZoonController'
import CreateProjectZoneParams from '@/features/Organization/Project/Core/params/CreateProjectZoneParams'
import IndexProjectZoneController from '@/features/Organization/ProjectZone/Presentation/controllers/indexProjectZoneController'
import IndexProjectZoneParams from '@/features/Organization/ProjectZone/Core/params/indexProjectZoneParams'

const { LocationId, projectId } = defineProps<{
  LocationId: number | undefined
  projectId: number | undefined
}>()

const visible = ref(false)
const emit = defineEmits(['update:data'])
const SelectedProjectZone = ref<TitleInterface | null>(null)
const indexProjectZoneController = IndexProjectZoneController.getInstance()
const indexProjectZoneParams = new IndexProjectZoneParams('', 1, 10, 0, [LocationId!])

const CreatProjectZoon = async () => {
  const createProjectZoonController = CreateProjectZoonController.getInstance()
  const createProjectZoonParams = new CreateProjectZoneParams(
    projectId!,
    LocationId!,
    SelectedProjectZone?.value?.id!,
  )
  await createProjectZoonController.CreateProjectZoon(createProjectZoonParams, projectId!)
  emit('update:data')
}

const setProjectLocationZoon = (data: TitleInterface) => {
  SelectedProjectZone.value = data
}
</script>
<template>
  <button class="add-zone" @click="visible = true">{{ $t('add Zone') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem' }">
    <template #header>
      <HeaderSection
        :img="ZoneDialog"
        title="Select Zones"
        subtitle="At least 1 zone required for every location"
      />
    </template>

    <div class="input-wrapper">
      <CustomSelectInput
        :required="false"
        :modelValue="SelectedProjectZone"
        :controller="indexProjectZoneController"
        :params="indexProjectZoneParams"
        label="Zoon"
        id="Equipment"
        :placeholder="$t('Select Zoon')"
        @update:modelValue="setProjectLocationZoon"
      />
    </div>
    <button class="btn btn-primary w-full" @click="CreatProjectZoon">{{ $t('Confirm') }}</button>
  </Dialog>
</template>

<style scoped>
.btn-primary {
  margin-top: 10px;
}
</style>
