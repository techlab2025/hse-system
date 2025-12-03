<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import DatePicker from 'primevue/datepicker'
import FilterWithProject from './FilterWithProject.vue'

import IndexIndustryController from '@/features/setting/Industries/Presentation/controllers/indexIndustryController'
import IndexEquipmentTypeParams from '@/features/setting/EquipmentType/Core/params/indexEquipmentTypeParams'
import TitleInterface from '@/base/Data/Models/title_interface'

import { SaveStatusEnum } from '@/features/Organization/ObservationFactory/Core/Enums/save_status_enum'
import { RiskLevelEnum } from '@/features/Organization/ObservationFactory/Core/Enums/risk_level_enum'

import IndexLocationController from '@/features/setting/Location/Presentation/controllers/indexLocationController'
import IndexLocationParams from '@/features/setting/Location/Core/params/indexLocationParams'
import { LocationEnum } from '@/features/setting/Location/Core/Enum/LocationEnum'

import IndexEquipmentController from '@/features/_templateFeature/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/setting/Equipment/Core/params/indexEquipmentParams'

import IndexEquipmentTypeController from '@/features/setting/EquipmentType/Presentation/controllers/indexEquipmentTypeController'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'

import IndexProjectZoneController from '@/features/Organization/ProjectZone/Presentation/controllers/indexProjectZoneController'
import IndexProjectZoneParams from '@/features/Organization/ProjectZone/Core/params/indexProjectZoneParams'

import { useI18n } from 'vue-i18n'

const visible = ref(false)

const date = ref(null)
const { t } = useI18n()

const caseOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: SaveStatusEnum.Saved, title: t('Positive') }),
  new TitleInterface({ id: SaveStatusEnum.NotSaved, title: t('Negative') }),
])

const staticOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: RiskLevelEnum.High, title: t('High') }),
  new TitleInterface({ id: RiskLevelEnum.Low, title: t('Low') }),
  new TitleInterface({ id: RiskLevelEnum.Medium, title: t('Medium') }),
])

const locationController = IndexLocationController.getInstance()
const locationParams = ref(new IndexLocationParams('', 0, 0, 0, LocationEnum.AREA))

const machineController = IndexEquipmentController.getInstance()
const machineParams = ref(new IndexEquipmentParams('', 0, 0, 0))

const machineTypeOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: EquipmentTypesEnum.DEVICE, title: t('Device') }),
  new TitleInterface({ id: EquipmentTypesEnum.EQUIPMENT, title: t('Equipment') }),
  new TitleInterface({ id: EquipmentTypesEnum.TOOL, title: t('TOOL') }),
])
const machineTypeController = IndexEquipmentTypeController.getInstance()
const machineTypeParams = ref(new IndexEquipmentTypeParams('', 0, 0, 0, 0))

const projectZoneController = IndexProjectZoneController.getInstance()
const projectZoneParams = ref(new IndexProjectZoneParams('', 0, 0, 0, []))

const selectedLocation = ref([])
const selectedZone = ref([])
const selectedMachine = ref([])
const selectedMachineType = ref([])
const selectedMachineSubType = ref([])
const selectedCase = ref([])
const selectedStatus = ref([])

const emit = defineEmits(['confirmFilters'])

const confirmFilters = () => {
  emit(
    'confirmFilters',
    date.value,
    selectedLocation.value,
    selectedZone.value,
    selectedMachine.value,
    selectedMachineType.value,
    selectedMachineSubType.value,
    selectedCase.value,
    selectedStatus.value,
  )

  visible.value = false
}
</script>

<template>
  <div class="card flex justify-center">
    <button class="btn btn-filter" @click="visible = true">
      <span>{{ $t('Filter') }}</span>
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      dismissableMask
      :header="$t('Filter')"
      :style="{ width: '35vw' }"
      class="filter-dialog"
    >
      <div class="flex flex-col gap-3 input-wrapper">
        <label>{{ $t('date') }}</label>
        <DatePicker v-model="date" :placeholder="$t('today')" />
      </div>

      <FilterWithProject
        :filterTitle="$t('location')"
        :controllerData="locationController"
        :pramsData="locationParams"
        v-model="selectedLocation"
      />

      <FilterWithProject
        :filterTitle="$t('Zone')"
        :controllerData="projectZoneController"
        :pramsData="projectZoneParams"
        v-model="selectedZone"
      />

      <FilterWithProject
        :filterTitle="$t('Machine')"
        :controllerData="machineController"
        :pramsData="machineParams"
        v-model="selectedMachine"
      />

      <FilterWithProject
        :filterTitle="$t('Machine type')"
        :staticOptions="machineTypeOptions"
        v-model="selectedMachineType"
      />

      <FilterWithProject
        :filterTitle="$t('machine sub-type')"
        :controllerData="machineTypeController"
        :pramsData="machineTypeParams"
        v-model="selectedMachineSubType"
      />

      <FilterWithProject
        :filterTitle="$t('case')"
        :staticOptions="caseOptions"
        v-model="selectedCase"
      />

      <FilterWithProject
        :filterTitle="$t('status')"
        :staticOptions="staticOptions"
        v-model="selectedStatus"
      />

      <button class="btn btn-primary w-full !mt-4" @click="confirmFilters">
        {{ $t('confirm') }}
      </button>
    </Dialog>
  </div>
</template>
