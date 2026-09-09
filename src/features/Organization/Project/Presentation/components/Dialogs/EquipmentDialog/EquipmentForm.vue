<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

import IndexEquipmentParams from '@/features/_templateFeature/Core/params/indexEquipmentParams'
import CreateProjectZoneEquipmentsController from '../../../controllers/Equipments/CreateProjectZoneEquipmentsController'
import CreateProjectZoneEquipment from '@/features/Organization/Project/Core/params/ProjectEquipments/CreateProjectZoneEquipment'
import MultiSelect from '@/shared/HelpersComponents/MultiSelect.vue'
import IndexEquipmentController from '@/features/setting/Equipment/Presentation/controllers/indexEquipmentController'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.project_id || route.params.id)

const emit = defineEmits(['update:data'])
const props = defineProps<{
  zoonId: number
}>()

const Equipment = ref<TitleInterface[]>([])
const formKey = ref(0)

const EquipmentsData = ref<CreateProjectZoneEquipment>(
  new CreateProjectZoneEquipment(id, [
    {
      project_zoon_id: props.zoonId,
      equipment_ids: [],
    },
  ]),
)

const setEquipments = (data: TitleInterface[]) => {
  Equipment.value = data
  const equipmentIds = data.map((item) => item.id)

  console.log(equipmentIds, 'equipmentIds')

  EquipmentsData.value = new CreateProjectZoneEquipment(id, [
    {
      project_zoon_id: props.zoonId,
      equipment_ids: equipmentIds,
    },
  ])
}

const indexEquipmentController = IndexEquipmentController.getInstance()
const indexEquipmentParams = new IndexEquipmentParams('', 0, 0, 0, null, true)

const submitEquipment = async (saveAndNew: boolean) => {
  try {
    const controller = CreateProjectZoneEquipmentsController.getInstance()
    controller.setLoading()
    await controller.CreateProjectZoneEquipment(EquipmentsData.value, router, id)

    if (saveAndNew && controller.isDataSuccess()) {
      Equipment.value = []
      EquipmentsData.value = new CreateProjectZoneEquipment(id, [
        {
          project_zoon_id: props.zoonId,
          equipment_ids: [],
        },
      ])
      formKey.value++
    } else if (!saveAndNew) {
      emit('update:data')
    }
  } catch (error) {
    console.log(error)
  }
}

const AddEquipment = () => submitEquipment(false)
const saveAndNew = () => submitEquipment(true)

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
          <!-- <CustomSelectInput :modelValue="Equipment" :controller="indexEquipmentController"
            :params="indexEquipmentParams" class="input" label="Equipment" id="Equipment" :type="2"
            placeholder="Select Your Equipment" @update:modelValue="setEquipments" /> -->
          <label for="equipment">{{ $t('Select Equipment') }}</label>
          <MultiSelect
            :key="formKey"
            :modelValue="Equipment"
            :options="AllEquipments"
            optionLabel="title"
            filter
            :placeholder="$t('Select Your Equipment')"
            display="chip"
            class="w-full md:w-80"
            @update:modelValue="setEquipments"
          />
        </div>
      </div>

      <div class="submit-btn create-form-actions">
        <button class="btn btn-secondary" type="button" @click.prevent="saveAndNew">
          {{ $t('save and new') }}
        </button>
        <button class="btn btn-primary" type="submit">{{ $t('confirm') }}</button>
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
