<script setup lang="ts">
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import { SerialNumberEnum } from '../../Core/Enums/serialNum'
import AddSerialNumberParams from '../../Core/params/addSerialNumberParams'
import { ref } from 'vue'
import CreateCodingSystemParams from '../../Core/params/createsSerialNumParams'
import SerialNumController from '../controllers/serialNumController'
import { useRouter } from 'vue-router'

// const SerialNumberLabels: Record<SerialNumberEnum, string> = {
//   [SerialNumberEnum.EQUIPMENT]: 'Equipment',
//   [SerialNumberEnum.PROJECT]: 'Project',
//   [SerialNumberEnum.EMPLOYEE]: 'Employee',
// }

// const sections = Object.values(SerialNumberEnum)
//   .filter((v) => typeof v === 'number')
//   .map((id) => ({
//     id,
//     title: SerialNumberLabels[id as SerialNumberEnum],
//   }))

const router = useRouter()

const getTitle = (serialNumberType: SerialNumberEnum) => {
  switch (serialNumberType) {
    case SerialNumberEnum.EQUIPMENT:
      return 'Equipment'
    case SerialNumberEnum.PROJECT:
      return 'Project'
    case SerialNumberEnum.EMPLOYEE:
      return 'Employee'
    default:
      return ''
  }
}

const fields = ref([
  {
    id: 1,
    serialNumberType: SerialNumberEnum.EQUIPMENT,
    name: SerialNumberEnum.EQUIPMENT,
    title: getTitle(SerialNumberEnum.EQUIPMENT),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 2,
    serialNumberType: SerialNumberEnum.PROJECT,
    name: SerialNumberEnum.PROJECT,
    title: getTitle(SerialNumberEnum.PROJECT),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 3,
    serialNumberType: SerialNumberEnum.EMPLOYEE,
    name: SerialNumberEnum.EMPLOYEE,
    title: getTitle(SerialNumberEnum.EMPLOYEE),
    prefix: '',
    suffix: '',
    start: '',
  },
])

const sendData = () => {
  const params = new CreateCodingSystemParams(fields.value)
  SerialNumController.getInstance().addSerialNumber(params, router)
}
</script>

<template>
  <form @submit.prevent="sendData" class="serial-form container">
    <div v-for="field in fields" :key="field.id" class="serial-form-section">
      <div class="serial-form-title uppercase">
        <h2>{{ field.title }}</h2>
      </div>

      <div class="serial-number-input-fields grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="input-wrapper w-full">
          <label class="flex items-center gap-2 uppercase">
            Prefix
            <ImportantIcon />
          </label>
          <input type="text" class="input" v-model="field.prefix" placeholder="Enter your prefix" />
        </div>
        <div class="input-wrapper w-full">
          <label class="flex items-center gap-2 uppercase">
            Suffix
            <ImportantIcon />
          </label>
          <input type="text" class="input" v-model="field.suffix" placeholder="Enter your suffix" />
        </div>
        <div class="input-wrapper w-full">
          <label class="flex items-center gap-2 uppercase">
            Start
            <ImportantIcon />
          </label>
          <input type="number" class="input" v-model="field.start" placeholder="Enter your start" />
        </div>
      </div>
    </div>

    <div class="button-wrapper flex gap-2">
      <router-link to="/" type="submit" class="btn btn-cancel" style="width: 15%"
        >Cancel</router-link
      >
      <button type="submit" class="btn btn-primary" style="width: 85%">Add</button>
    </div>
  </form>
</template>
