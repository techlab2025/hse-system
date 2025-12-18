<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import EquipmentImg from "@/assets/images/Equipment.png";
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import IndexEquipmentController from "@/features/_templateFeature/Presentation/controllers/indexEquipmentController";
import IndexEquipmentParams from "@/features/_templateFeature/Core/params/indexEquipmentParams";
import type TitleInterface from "@/base/Data/Models/title_interface";
import { useRoute, useRouter } from "vue-router";
import HeaderSection from "../../Details/DetailsHeader/HeaderSection.vue";
import CreateProjectZoneEquipment from "@/features/Organization/Project/Core/params/Equipments/CreateProjectZoneEquipment";
import CreateProjectZoneEquipmentsController from "../../../controllers/Equipments/CreateProjectZoneEquipmentsController";

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
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0)

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
      equipment_ids: equipments.value.map(e => e.id)
    }
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
</script>

<template>
  <div class="card flex justify-center">

    <button @click="visible = true" class="content-btn">{{ btn_name }}</button>
    <Dialog v-model:visible="visible" modal dismissable-mask :style="{ width: '50rem' }">
      <template #header>
        <HeaderSection :img="EquipmentImg" title="Equipment"
          subtitle="Choose for each zone all the equipment and devices you want." />
      </template>
      <!-- Equipment selection -->
      <div class="equipment-selection">
        <CustomSelectInput :modelValue="equipments" :controller="indexEquipmentController"
          :params="indexEquipmentParams" label="Equipment" placeholder="Select Your Equipment" :type="2"
          @update:modelValue="setEquipments" />

        <div class="submit-btn w-full mt-4">
          <button class="btn btn-primary w-full" @click="AddEquipment">
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
