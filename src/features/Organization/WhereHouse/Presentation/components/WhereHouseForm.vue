<script lang="ts" setup>
import { ref, watch } from 'vue'
import EditWhereHouseParams from '../../Core/params/editWhereHouseParams'
import AddWhereHouseParams from '../../Core/params/addWhereHouseParams'
import type WhereHouseDetailsModel from '../../Data/models/WhereHouseDetailsModel'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import { useRoute } from 'vue-router'
import IndexWhereHouseTypeController from '@/features/Organization/WhereHouseType/Presentation/controllers/indexWhereHouseTypeController'
import IndexWhereHouseTypeParams from '@/features/Organization/WhereHouseType/Core/params/indexWhereHouseTypeParams'
import SwitchInput from '@/shared/FormInputs/SwitchInput.vue'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: WhereHouseDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id
const Name = ref<string>()




const updateData = () => {
  const params = props.data?.id
    ? new EditWhereHouseParams(props.data.id, SelectedWhereHouseType?.value?.id, Name.value, SerialNumber.value?.SerialNumber)
    : new AddWhereHouseParams(SelectedWhereHouseType?.value?.id, Name.value, SerialNumber.value?.SerialNumber)

  console.log(SerialNumber, "SerialNumber");
  emit('update:data', params)
}

const SerialNumber = ref()

const fields = ref([
  { key: 'SerialNumber', label: 'serial_number', placeholder: 'You can leave it (auto-generated)', value: SerialNumber.value, enabled: props?.data?.SerialNumber ? false : true },
])
const UpdateSerial = (data) => {
  SerialNumber.value = data
  updateData()
}

watch(
  [() => props.data],
  ([newData]) => {
    console.log(newData, "newData");
    Name.value = newData?.name
    // SelectedWhereHouseType.value = new TitleInterface({id:newData})
  },
  { immediate: true }
)


const SelectedWhereHouseType = ref<TitleInterface>()

const indexWhereHouseTypeController = IndexWhereHouseTypeController.getInstance()
const indexWhereHouseTypeParams = new IndexWhereHouseTypeParams('', 1, 10, 1, false)

const setSelectedWhereHouseType = (data: TitleInterface) => {
  SelectedWhereHouseType.value = data
  updateData()
}


const setName = (data) => {
  Name.value = data.target.value
  updateData()
}
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">{{ $t('name') }}</label>
    <input type="text" id="name" class="input" v-model="Name" @input="setName" placeholder="Enter Name " />
  </div>

  <div class="col-span-4 md:col-span-2" v-if="!(data?.id)">
    <SwitchInput :fields="fields" :switch_title="$t('auto')" :switch_reverse="true" :is-auto="true"
      @update:value="UpdateSerial" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <CustomSelectInput :required="false" :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController" :params="indexWhereHouseTypeParams" label="Where House Type "
      id="Equipment" placeholder="Select Where House Type" @update:modelValue="setSelectedWhereHouseType" />
  </div>
</template>
