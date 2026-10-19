<script setup lang="ts">
import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'

import { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'
import { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'

import { inject } from 'vue'
import { overviewPresentationKey } from '../overviewPresentation'
const overviewPresentation = inject(overviewPresentationKey, false)

import { vProjectPanels } from '../../../composables/projectPanels'

import { onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'
import EquipmentImg from '@/assets/images/Equipment.png'
import plus from '@/assets/images/plus.png'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { useRoute, useRouter } from 'vue-router'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/ProjectEquipments/CreateProjectZoneEquipment.ts'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/_templateFeature/Core/params/indexEquipmentParams'
import EmptyData from '../LocationsTeams/EmptyData.vue'
import EquimentFolderEmpty from '@/assets/images/EquimentFolderEmpty.png'

const props = defineProps<{
  isEmpty: boolean
  project_zone_id: number
}>()

const visible = ref(false)
const route = useRoute()
const router = useRouter()

const projectId = Number(route.params.project_id || route.params.id)

// ================== STATE ==================
const selectedZoneId = ref<number | null>(props.project_zone_id)
const equipments = ref<TitleInterface[]>([])

// ================== CONTROLLERS ==================
const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 1, 100, 0, null, true)
// ================== HANDLERS ==================

const setEquipments = (data: TitleInterface | TitleInterface[] | null) => {
  equipments.value = Array.isArray(data) ? data : []
}

const AddEquipment = async () => {
  if (!canOrganizationOperation('create_project_zoon_equipment')) return

  const payload = new CreateProjectZoneEquipment(projectId, [
    {
      project_zoon_id: selectedZoneId.value,
      equipment_ids: equipments.value.map((e) => e.id),
    },
  ])

  const controller = CreateProjectZoneEquipmentsController.getInstance()
  await controller.CreateProjectZoneEquipment(payload, router, projectId)

  visible.value = false
  equipments.value = []
  selectedZoneId.value = null
}

const AllEquipments = ref<TitleInterface[]>([])
const getEquipment = async () => {
  const res = await indexEquipmentController.getData(indexEquipmentParams)
  AllEquipments.value = res.value?.data || []
}
onMounted(() => {
  getEquipment()
})
</script>

<template>
  <template v-if="canPolicy(organizationApiPolicies['create_project_zoon_equipment'])">

  <div data-hse-project v-project-panels class="hse-project-root card flex justify-center">
    <EmptyData
      v-if="isEmpty"
      @click="visible = true"
      :img="EquimentFolderEmpty"
      :title="$t('No Equipment Yet')"
      :subtitle="
        $t('You haven’t added any equipment to this project. Start building your crew now!')
      "
      :linkText="$t('Start adding equipment now!')"
    />

    <!-- <p class="add-equipment-icon" v-else @click="visible = true">{{ `add_equipment` }}</p> -->
    <button
      v-else
      class="add-equipment-trigger"
      type="button"
      :aria-label="$t('Add Equipment')"
      @click="visible = true"
    >
      <img class="add-equipment-icon" :src="plus" alt="" />
      <span>{{ $t('Add Equipment') }}</span>
    </button>

    <!-- <button @click="visible = true" class="content-btn">{{ btn_name }}</button> -->
    <Dialog
      :class="{ 'hse-project-overview-overlay': overviewPresentation }"
      data-hse-project
      :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
      v-model:visible="visible"
      modal
      dismissable-mask
      class="hse-project-root hse-project-overlay project-equipment-dialog"
      :style="{ width: 'min(50rem, calc(100vw - 24px))' }"
    >
      <template #header>
        <HeaderSection
          :img="EquipmentImg"
          :title="$t('Equipment')"
          :subtitle="$t('Choose for each zone all the equipment and devices you want.')"
        />
      </template>
      <!-- Equipment selection -->
      <div class="equipment-selection">
        <div class="equipment-dialog-intro">
          <span>01</span>
          <div>
            <strong>{{ $t('Assign equipment to this zone') }}</strong>
            <p>{{ $t('Select one or more available tools and devices') }}</p>
          </div>
        </div>
        <UpdatedCustomInputSelect
          :id="`zone-equipment-${project_zone_id}`"
          :modelValue="equipments"
          :staticOptions="AllEquipments"
          type="multiselect"
          :label="$t('Select Equipment')"
          :placeholder="$t('Select Your Equipment')"
          :reload="false"
          showOptionSerial
          @update:modelValue="setEquipments"
        />

        <div class="submit-btn w-full mt-4">
          <button v-if="canOrganizationOperation('create_project_zoon_equipment')"
            class="hse-project-button hse-project-button--primary btn btn-primary w-full confirm-equipment-btn"
            :disabled="!equipments.length"
            @click="AddEquipment"
          >
            {{ $t('Confirm') }} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </Dialog>
  </div>

  </template>
</template>

<style scoped lang="scss">
.card {
  min-width: 0;
}

.add-equipment-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  gap: 7px;
  padding: 5px 9px 5px 6px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 10px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  color: var(--PrimaryColor);
  font-size: 0.66rem;
  font-weight: 900;
  cursor: pointer;
}

.add-equipment-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.equipment-selection {
  min-width: 0;
  padding-top: 5px;
}

.equipment-dialog-intro {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
  padding: 13px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-2));
}

.equipment-dialog-intro > span {
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

.equipment-dialog-intro strong {
  color: var(--text-strong);
  font-size: 0.78rem;
}

.equipment-dialog-intro p {
  margin: 2px 0 0;
  color: var(--text-soft);
  font-size: 0.67rem;
}

.confirm-equipment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  gap: 9px;
  border-radius: 12px;
}

.confirm-equipment-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 640px) {
  .add-equipment-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
