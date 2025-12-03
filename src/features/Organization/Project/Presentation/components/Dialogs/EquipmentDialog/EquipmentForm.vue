<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import IndexEquipmentController from '@/features/_templateFeature/Presentation/controllers/indexEquipmentController'
import IndexEquipmentParams from '@/features/_templateFeature/Core/params/indexEquipmentParams'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/Equipments/CreateProjectZoneEquipment'

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
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0)

const AddEquipment = async () => {
  try {
    const controller = CreateProjectZoneEquipmentsController.getInstance()
    const res = await controller.CreateProjectZoneEquipment(EquipmentsData.value, router, id)

    emit('update:data')
  } catch (error) {
    console.log(error);
  }
};


</script>

<template>
  <div class="equipment-form">
    <form @submit.prevent="AddEquipment">
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Equipment" :controller="indexEquipmentController"
            :params="indexEquipmentParams" class="input" label="Equipment" id="Equipment" :type="2"
            placeholder="Select Your Equipment" @update:modelValue="setEquipments" />
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-primary" type="submit">Confirm</button>
      </div>
    </form>
  </div>
</template>
