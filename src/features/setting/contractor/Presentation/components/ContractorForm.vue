<script lang="ts" setup>
import { ref, watch } from 'vue'

import type ContractorDetailsModel from '../../Data/models/ContractorDetailsModel'
import editContractorParams from '../../Core/params/editContractorParams'
import AddContractorParams from '../../Core/params/addContractorParams'

const emit = defineEmits(['update:data'])

const props = defineProps<{
  data?: ContractorDetailsModel
}>()
const phoneNumber = ref<string>('')
const Name = ref<string>('')
const updateData = () => {
  const params = props.data?.id
    ? new editContractorParams(
      props.data?.id! ?? 0,
      Name.value,
      phoneNumber.value,
    )
    : new AddContractorParams(
      Name.value,
      phoneNumber.value,
    )

  emit('update:data', params)
}



watch(
  [() => props.data],
  ([newData]) => {
    if (newData) {
      Name.value = newData.name
      phoneNumber.value = newData.phone
    }

  },
  { immediate: true },
)



const setPhoneNumber = (data) => {
  phoneNumber.value = data.target.value
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
    <input type="text" id="name" class="input" v-model="Name" @change="setName" placeholder="Enter Name " />
  </div>
  <div class="input-wrapper col-span-4 md:col-span-2">
    <label>{{ $t('phone_number') }}</label>
    <input type="text" v-model="phoneNumber" @change="setPhoneNumber" placeholder="Enter Phone Number " />
  </div>
</template>
