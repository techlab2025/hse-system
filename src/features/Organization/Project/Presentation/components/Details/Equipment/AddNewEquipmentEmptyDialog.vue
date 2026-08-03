<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'
import EquipmentImg from '@/assets/images/Equipment.png'
import plus from '@/assets/images/plus.png'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { useRoute, useRouter } from 'vue-router'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/ProjectEquipments/CreateProjectZoneEquipment.ts'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import MultiSelect from '@/shared/HelpersComponents/MultiSelect.vue'
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
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0, null, true)
// ================== HANDLERS ==================

const setEquipments = (data: TitleInterface[]) => {
  equipments.value = data
}

const AddEquipment = async () => {
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

const AllEquipments = ref([])
const getEquipment = async () => {
  const res = await indexEquipmentController.getData(indexEquipmentParams)
  AllEquipments.value = res.value?.data || []
}
onMounted(() => {
  getEquipment()
})
</script>

<template>
  <div class="card flex justify-center">
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
      v-model:visible="visible"
      modal
      dismissable-mask
      class="project-equipment-dialog"
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
        <!-- <UpdatedCustomInputSelect :modelValue="equipments" :controller="indexEquipmentController"
          :params="indexEquipmentParams" label="Equipment" placeholder="Select Your Equipment" :type="2"
          @update:modelValue="setEquipments" /> -->
        <label for="equipment">{{ $t('Select Equipment') }}</label>
        <MultiSelect
          :modelValue="equipments"
          :options="AllEquipments"
          optionLabel="title"
          filter
          :placeholder="$t('Select Your Equipment')"
          display="chip"
          class="w-full md:w-80"
          @update:modelValue="setEquipments"
        />

        <div class="submit-btn w-full mt-4">
          <button
            class="btn btn-primary w-full confirm-equipment-btn"
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

.equipment-selection > label {
  display: block;
  margin-bottom: 7px;
  color: var(--text-strong);
  font-size: 0.72rem;
  font-weight: 850;
}

.equipment-selection :deep(.p-multiselect) {
  width: 100% !important;
  max-width: 100%;
  min-height: 48px;
  border-color: var(--main-border);
  border-radius: 12px;
  background: var(--surface-1);
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
