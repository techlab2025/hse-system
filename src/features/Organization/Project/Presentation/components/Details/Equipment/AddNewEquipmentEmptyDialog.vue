<script setup lang="ts">
import { onMounted, ref } from "vue";
import Dialog from 'primevue/dialog';
import EquipmentImg from "@/assets/images/Equipment.png";
import CustomSelectInput from "@/shared/FormInputs/CustomSelectInput.vue";
import type TitleInterface from "@/base/Data/Models/title_interface";
import { useRoute, useRouter } from "vue-router";
import HeaderSection from "../../Details/DetailsHeader/HeaderSection.vue";
import CreateProjectZoneEquipment from "@/features/Organization/Project/Core/params/Equipments/CreateProjectZoneEquipment";
import CreateProjectZoneEquipmentsController from "../../../controllers/Equipments/CreateProjectZoneEquipmentsController";
import MultiSelect from '@/shared/HelpersComponents/MultiSelect.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from "@/features/_templateFeature/Core/params/indexEquipmentParams";
import EmptyData from "../LocationsTeams/EmptyData.vue";
import EquimentFolderEmpty from "@/assets/images/EquimentFolderEmpty.png"

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
  <div class="card flex justify-center">

    <EmptyData v-if="isEmpty" @click="visible = true" :img="EquimentFolderEmpty" title="No Equipment Yet"
      subtitle="You haven’t added any equipment to this project. Start building your crew now!"
      linkText=" Start adding equipment now!" />
    <p class="add-equipment-icon" v-else @click="visible = true">{{ `add_equipment` }}</p>

    <!-- <button @click="visible = true" class="content-btn">{{ btn_name }}</button> -->
    <Dialog v-model:visible="visible" modal dismissable-mask :style="{ width: '50rem' }">
      <template #header>
        <HeaderSection :img="EquipmentImg" :title="$t('Equipment')"
          :subtitle="$t('Choose for each zone all the equipment and devices you want.')" />
      </template>
      <!-- Equipment selection -->
      <div class="equipment-selection">
        <!-- <CustomSelectInput :modelValue="equipments" :controller="indexEquipmentController"
          :params="indexEquipmentParams" label="Equipment" placeholder="Select Your Equipment" :type="2"
          @update:modelValue="setEquipments" /> -->
        <label for="equipment">{{ $t('Select Equipment') }}</label>
        <MultiSelect :modelValue="Equipment" :options="AllEquipments" optionLabel="title" filter
          :placeholder="$t('Select Your Equipment')" display="chip" class="w-full md:w-80"
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
