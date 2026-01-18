<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import IndexEquipmentController from '@/features/_templateFeature/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/_templateFeature/Core/params/indexEquipmentParams'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/Equipments/CreateProjectZoneEquipment'
import MultiSelect from '@/shared/HelpersComponents/MultiSelect.vue'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.project_id || route.params.id)

const emit = defineEmits(['update:data'])
const props = defineProps<{
  zoonId: number
}>()

const Equipment = ref<TitleInterface[]>([])

const EquipmentsData = ref<CreateProjectZoneEquipment>(
  new CreateProjectZoneEquipment(id,
    [
      {
        project_zoon_id: props.zoonId,
        equipment_ids: []
      }
    ]
  )
)

const setEquipments = (data: TitleInterface[]) => {
  const equipmentIds = data.map((item) => item.id)

  EquipmentsData.value = new CreateProjectZoneEquipment(id,
    [
      {
        project_zoon_id: props.zoonId,
        equipment_ids: equipmentIds
      }
    ]
  )
}

const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0, null, true)

const AddEquipment = async () => {
  try {
    const controller = CreateProjectZoneEquipmentsController.getInstance()
    const res = await controller.CreateProjectZoneEquipment(EquipmentsData.value, router, id)

    emit('update:data')
  } catch (error) {
    console.log(error);
  }
};

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
  <div class="equipment-form">
    <form @submit.prevent="AddEquipment">
      <div class="input-container">
        <div class="input-wrapper w-full">

          <CustomSelectInput :modelValue="Equipment" :controller="indexEquipmentController"
            :params="indexEquipmentParams" class="input" label="Equipment" id="Equipment" :type="2"
            placeholder="Select Your Equipment" @update:modelValue="setEquipments" />

          <!-- <MultiSelect :modelValue="Equipment" :options="AllEquipments" optionLabel="title" filter
            placeholder="Select Your Equipment" display="chip" class="w-full md:w-80"
            @update:modelValue="setEquipments" /> -->

        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-primary" type="submit">Confirm</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* .p-dialog-content {

  min-height: 100%;
}

.equipment-form {
  min-height: 20vh;
  height: 100%;
}

form {
  min-height: 20vh;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.submit-btn {
  margin-top: auto;
} */
</style>
