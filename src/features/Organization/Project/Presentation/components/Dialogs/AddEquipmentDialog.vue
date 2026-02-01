<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import HeaderSection from "../Details/DetailsHeader/HeaderSection.vue";
import EquipmentImg from "@/assets/images/Equipment.png";
import EmptyData from "../Details/LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"
import type SohwProjectZoonModel from "../../../Data/models/ShowProjectZone";
import ProjectZoneSelection from "../Details/PorjectUtils/ProjectZoneSelection.vue";
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import IndexEquipmentController from "@/features/_templateFeature/Presentation/controllers/indexEquipmentController";
import IndexEquipmentParams from "@/features/_templateFeature/Core/params/indexEquipmentParams";
import CreateProjectZoneEquipment from "../../../Core/params/Equipments/CreateProjectZoneEquipment";
import type TitleInterface from "@/base/Data/Models/title_interface";
import { useRoute, useRouter } from "vue-router";
import CreateProjectZoneEquipmentsController from "../../controllers/Equipments/CreateProjectZoneEquipmentsController";
import AddEquipmentIcon from "@/shared/icons/AddEquipmentIcon.vue";

const props = defineProps<{
  project_zoons: SohwProjectZoonModel[]
  isEmpty?: boolean
  ZoonId?: number
}>()

const visible = ref(false)
const route = useRoute()
const router = useRouter()

const projectId = Number(route.params.project_id || route.params.id)

// ================== STATE ==================
const selectedZoneId = ref<number | null>(null)
const equipments = ref<TitleInterface[]>([])

// ================== CONTROLLERS ==================
const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0, null, true)

// ================== HANDLERS ==================
const setZoneId = (id: number) => {
  selectedZoneId.value = id
}

const setEquipments = (data: TitleInterface[]) => {
  equipments.value = data
}

const AddEquipment = async () => {
  // try {
  //   if (!selectedZoneId.value || equipments.value.length === 0) return

  const payload = new CreateProjectZoneEquipment(projectId, [
    {
      project_zoon_id: selectedZoneId.value || props.ZoonId,
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
    <EmptyData :img="EquimentFolderEmpty" :title="$t('No Equipment Yet')"
      :subtitle="$t('You haven’t added any equipment to this project. Start building your crew now!')"
      linkText="Start building your crew now!" @click="visible = true" v-if="isEmpty" />

    <!-- <AddEquipmentIcon class="add-equipment-icon" @click="visible = true" v-else /> -->
    <p class="add-equipment-icon" v-if="!isEmpty" @click="visible = true">{{ `add_equipment` }}</p>
    <Dialog v-model:visible="visible" modal dismissable-mask :style="{ width: '50rem' }">
      <template #header>
        <HeaderSection :img="EquipmentImg" :title="$t('Equipment')"
          :subtitle="$t('Choose for each zone all the equipment and devices you want.')" />
      </template>

      <!-- Zone selection -->
      <div class="zone-selection mb-4" v-if="!ZoonId">
        <ProjectZoneSelection :zones="project_zoons" @update:data="setZoneId" />
      </div>

      <!-- Equipment selection -->
      <div class="equipment-selection">
        <CustomSelectInput :modelValue="equipments" :controller="indexEquipmentController"
          :params="indexEquipmentParams" :label="$t('Equipment')" :placeholder="$t('Select Your Equipment')" :type="2"
          @update:modelValue="setEquipments" />

        <div class="submit-btn w-full mt-4">
          <button class="btn btn-primary w-full" @click="AddEquipment">
            {{ $t('Confirm') }}
          </button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
