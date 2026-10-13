<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import { onMounted, ref } from 'vue'
import Dialog from 'primevue/dialog'
import EquipmentImg from '@/assets/images/Equipment.png'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { useRoute, useRouter } from 'vue-router'
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/ProjectEquipments/CreateProjectZoneEquipment.ts'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import MultiSelect from '@/shared/HelpersComponents/MultiSelect.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/_templateFeature/Core/params/indexEquipmentParams'

const props = defineProps<{
  btn_name: string
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
  // try {
  //   if (!selectedZoneId.value || equipments.value.length === 0) return

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
  // } catch (error) {
  //   console.log(error)
  // }
}

const AllEquipments = ref([])
const getEquipment = async () => {
  const res = await indexEquipmentController.getData(indexEquipmentParams)
  AllEquipments.value = res.value?.data || []
}
const Equipment = ref<TitleInterface[]>([])
onMounted(() => {
  getEquipment()
})
</script>

<template>
  <div data-hse-project v-project-panels class="hse-project-root card flex justify-center">
    <button @click="visible = true" class="hse-project-button content-btn">{{ btn_name }}</button>
    <Dialog
      data-hse-project
      class="hse-project-root hse-project-overlay"
      :dir="$i18n.locale.startsWith('ar') ? 'rtl' : 'ltr'"
      v-model:visible="visible"
      modal
      dismissable-mask
      :style="{ width: '50rem' }"
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
        <!-- <CustomSelectInput :modelValue="equipments" :controller="indexEquipmentController"
          :params="indexEquipmentParams" label="Equipment" placeholder="Select Your Equipment" :type="2"
          @update:modelValue="setEquipments" /> -->
        <label class="hse-project-field-label" for="equipment">{{ $t('Select Equipment') }}</label>
        <MultiSelect
          overlay-class="hse-project-overlay"
          :modelValue="Equipment"
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
            class="hse-project-button hse-project-button--primary btn btn-primary w-full"
            @click="AddEquipment"
          >
            {{ $t('Confirm') }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
