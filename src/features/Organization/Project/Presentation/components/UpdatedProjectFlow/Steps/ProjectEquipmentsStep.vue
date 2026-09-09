<script setup lang="ts">
import { computed } from 'vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexProjectZoneController from '@/features/Organization/ProjectZone/Presentation/controllers/indexProjectZoneController'
import IndexProjectZoneParams from '@/features/Organization/ProjectZone/Core/params/indexProjectZoneParams'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'
import type { EquipmentZoneForm } from '../../../../Core/params/UpdatedProjectFlow/ProjectEquipmentFormParams'

const props = defineProps<{ locations: TitleInterface[]; projectId?: number }>()
const equipments = defineModel<EquipmentZoneForm[]>('equipments', { required: true })

const projectZoneController = IndexProjectZoneController.getInstance()
const equipmentController = IndexEquipmentController.getInstance()
const projectZoneParams = computed(
  () =>
    new IndexProjectZoneParams(
      '',
      1,
      30,
      0,
      props.locations.map((item) => item.id),
      props.projectId ?? null,
    ),
)
const equipmentParams = (zoneId?: number) =>
  new IndexEquipmentParams(
    '',
    1,
    30,
    0,
    undefined,
    true,
    zoneId,
    undefined,
    undefined,
    undefined,
    undefined,
    props.projectId ?? null,
  )

const addEquipmentZoon = () => {
  equipments.value.push({ zone: null, equipments: [], equipmentParams: equipmentParams() })
}
const setEquipmentZone = (
  zone: EquipmentZoneForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  zone.zone = Array.isArray(value) ? (value[0] ?? null) : value
  zone.equipments = []
  zone.equipmentParams = equipmentParams(zone.zone?.id)
}
const setZoneEquipments = (
  zone: EquipmentZoneForm,
  value: TitleInterface | TitleInterface[] | null,
) => {
  zone.equipments = Array.isArray(value) ? value : value ? [value] : []
}
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
    <div v-for="(zone, zoneIndex) in equipments" :key="zoneIndex" class="group-card equipment-row">
      <div class="input-wrapper w-full">
        <UpdatedCustomInputSelect
          :model-value="zone.zone"
          :params="projectZoneParams"
          :controller="projectZoneController"
          label="Project zone"
          placeholder="Select project zone"
          :type="1"
          @update:model-value="setEquipmentZone(zone, $event)"
        />
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
      <button type="button" class="icon-button danger" @click="equipments.splice(zoneIndex, 1)">
        ×
      </button>
    </div>
    <button type="button" class="add-group" @click="addEquipmentZoon">+ Add project zone</button>
  </div>
</template>

<style scoped src="../ProjectFlowStepStyles.css"></style>
