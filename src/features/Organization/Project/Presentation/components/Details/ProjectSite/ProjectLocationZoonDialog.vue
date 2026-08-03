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
  visible.value = false
  SelectedProjectZone.value = null
  emit('update:data')
}

const setProjectLocationZoon = (data: TitleInterface) => {
  SelectedProjectZone.value = data
}
</script>
<template>
  <button class="add-zone" type="button" @click="visible = true">
    <span aria-hidden="true">+</span>{{ $t('add Zone') }}
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissable-mask="true"
    class="project-zone-dialog"
    :style="{ width: 'min(50rem, calc(100vw - 24px))' }"
  >
    <template #header>
      <HeaderSection
        :img="ZoneDialog"
        title="Select Zones"
        subtitle="At least 1 zone required for every location"
      />
    </template>

    <div class="zone-dialog-content">
      <div class="zone-guidance">
        <span class="guidance-index">01</span>
        <div>
          <strong>{{ $t('Choose an operational zone') }}</strong>
          <p>{{ $t('The selected zone will be linked to this project location') }}</p>
        </div>
      </div>
      <div class="input-wrapper zone-select-field">
        <CustomSelectInput
          :required="false"
          :modelValue="SelectedProjectZone"
          :controller="indexProjectZoneController"
          :params="indexProjectZoneParams"
          label="zone"
          id="project-zone"
          :placeholder="$t('Select Zoon')"
          @update:modelValue="setProjectLocationZoon"
        />
      </div>
      <button
        class="btn btn-primary confirm-zone-btn"
        type="button"
        :disabled="!SelectedProjectZone"
        @click="CreatProjectZoon"
      >
        <span>{{ $t('Confirm') }}</span
        ><span aria-hidden="true">→</span>
      </button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.add-zone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border));
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
  cursor: pointer;
}

.add-zone span {
  font-size: 1rem;
  line-height: 1;
}

.zone-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 8px;
}

.zone-guidance {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
}

.guidance-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white;
  font-family: 'Bold';
  font-size: 0.68rem;
}

.zone-guidance strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}

.zone-guidance p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.68rem;
}

.zone-select-field {
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
}

.confirm-zone-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  gap: 10px;
  width: 100%;
  border-radius: 12px;
}

.confirm-zone-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
