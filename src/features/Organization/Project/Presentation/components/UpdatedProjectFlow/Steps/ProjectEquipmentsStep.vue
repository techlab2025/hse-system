<script setup lang="ts">
import { ref, watch } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import ProjectCustomLocationParams from '../../../../Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '../../../../Core/Enums/ProjectCustomLocationEnum'
import type SohwProjectZoonModel from '../../../../Data/models/ShowProjectZone'
import type { EquipmentZoneForm } from '../../../../Core/params/UpdatedProjectFlow/ProjectEquipmentFormParams'

const props = defineProps<{ projectId?: number }>()
const equipments = defineModel<EquipmentZoneForm[]>('equipments', { required: true })

const equipmentController = IndexEquipmentController.getInstance()
const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const isLoadingZones = ref(false)
const zonesError = ref('')

const equipmentParams = (zoneId?: number) =>
  new IndexEquipmentParams(
    '',
    1,
    30,
    0,
    undefined,
    true,
    // zoneId,
    undefined,
    undefined,
    undefined,
    undefined,
    // props.projectId ?? null,
  )

const setZoneEquipments = (
  zone: EquipmentZoneForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  zone.equipments = Array.isArray(value) ? value : value ? [value] : []
}

const mapProjectZone = (zone: SohwProjectZoonModel): EquipmentZoneForm => ({
  zone: new TitleInterface({ id: zone.projectZoonId, title: zone.zoonTitle }),
  equipments: (zone.projectZoonEquipments ?? []).map(
    (equipment) => new TitleInterface({ id: equipment.id, title: equipment.title }),
  ),
  equipmentParams: equipmentParams(zone.projectZoonId),
})

const getProjectZonesEquipments = async () => {
  if (!props.projectId) {
    equipments.value = []
    return
  }

  isLoadingZones.value = true
  zonesError.value = ''
  try {
    const params = new ProjectCustomLocationParams(props.projectId, [
      ProjectCustomLocationEnum.ZOON,
      ProjectCustomLocationEnum.ZOON_EQUIPMENT,
    ])
    const state = await projectCustomLocationController.getData(params)
    equipments.value = (state.value.data ?? [])
      .flatMap((location) => location.locationZones ?? [])
      .map(mapProjectZone)
  } catch (error: unknown) {
    equipments.value = []
    zonesError.value = error instanceof Error ? error.message : 'Could not load project zones.'
  } finally {
    isLoadingZones.value = false
  }
}

watch(() => props.projectId, getProjectZonesEquipments, { immediate: true })
</script>

<template>
  <div class="form-stack">
    <div class="section-title">
      <span>05</span>
      <div>
        <h2>Project equipment</h2>
        <p>Attach equipment to zones, or finish without equipment.</p>
      </div>
    </div>
    <p v-if="isLoadingZones" class="locations-status">Loading project zones…</p>
    <p v-else-if="zonesError" class="locations-status locations-error">
      {{ zonesError }}
    </p>
    <p v-else-if="!equipments.length" class="locations-status">
      No zones are assigned to this project.
    </p>
    <div
      v-for="(zone, zoneIndex) in equipments"
      :key="zoneIndex"
      class="group-card fixed-equipment-row"
    >
      <div class="fixed-location">
        <span>Project zone</span>
        <strong>{{ zone.zone?.title }}</strong>
      </div>
      <div class="input-wrapper w-full">
        <UpdatedCustomInputSelect
          :model-value="zone.equipments"
          :params="zone.equipmentParams"
          :controller="equipmentController"
          label="Equipment"
          placeholder="Select equipment"
          :type="2"
          :disabled="!zone.zone"
          @update:model-value="setZoneEquipments(zone, $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>
