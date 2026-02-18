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
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddWhereHouseType from '@/features/Organization/WhereHouseType/Presentation/components/AddWhereHouseType.vue'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: WhereHouseDetailsModel
}>()

const route = useRoute()
const id = route.params.parent_id
const Name = ref<string>()

const updateData = () => {
  const params = props.data?.id
    ? new EditWhereHouseParams(props.data.id, SelectedWhereHouseType?.value?.id, Name.value)
    : new AddWhereHouseParams(
      SelectedWhereHouseType?.value?.id,
      Name.value,
      SerialNumber.value,
    )

  // console.log(SerialNumber, 'SerialNumber')
  emit('update:data', params)
}

const SerialNumber = ref()

const fields = ref([
  {
    key: 'SerialNumber',
    label: 'serial_number',
    placeholder: 'You can leave it (auto-generated)',
    value: SerialNumber.value,
    enabled: props?.data?.SerialNumber ? false : true,
  },
])
const projtecStateus = useProjectAppStatusStore()
const UpdateSerial = (data) => {
  SerialNumber.value = data.target.value
  updateData()
}
const SelectedWhereHouseType = ref<TitleInterface>()

watch(
  [() => props.data],
  ([newData]) => {
    console.log(newData, 'newData')
    Name.value = newData?.name
    const savedLocale = localStorage.getItem('lang')
    SelectedWhereHouseType.value = new TitleInterface({ id: newData?.warehouse_type?.id, title: newData?.warehouse_type?.titles })

  },
  { immediate: true },
)


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
const WarehouseTypeDialog = ref<boolean>(false)
</script>

<template>
  <div class="col-span-4 md:col-span-2 input-wrapper">
    <label for="name">{{ $t('name') }}</label>
    <input type="text" id="name" class="input" v-model="Name" @input="setName" :placeholder="$t('Enter Name')" />
  </div>

  <div class="input-wrapper col-span-4 md:col-span-2" v-if="!data?.id">
    <label for="serialNumber">{{ $t('serial_number') }}</label>
    <input type="text" v-model="SerialNumber" @input="UpdateSerial" id="serialNumber"
      :disabled="projtecStateus.isSerialNumberAuto()"
      :placeholder="projtecStateus.isSerialNumberAuto() ? 'You can leave it (auto-generated)' : 'Enter Your Serial Number'" />
  </div>

  <div class="col-span-4 md:col-span-2 input-wrapper">
    <!-- <CustomSelectInput :required="false" :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController" :params="indexWhereHouseTypeParams" :label="$t('Where House Type')"
      id="Equipment" placeholder="Select Where House Type" @update:modelValue="setSelectedWhereHouseType" /> -->
    <UpdatedCustomInputSelect :required="false" :modelValue="SelectedWhereHouseType"
      :controller="indexWhereHouseTypeController" :params="indexWhereHouseTypeParams" :label="$t('Where House Type')"
      id="Equipment" placeholder="Select Where House Type" @update:modelValue="setSelectedWhereHouseType"
      :isDialog="true" :dialogVisible="WarehouseTypeDialog">
      <template #LabelHeader>
        <span class="add-dialog" @click="WarehouseTypeDialog = true">New</span>
      </template>
      <template #Dialog>
        <AddWhereHouseType @update:data="WarehouseTypeDialog = false" />
      </template>
    </UpdatedCustomInputSelect>
  </div>
</template>
