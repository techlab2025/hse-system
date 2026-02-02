<script setup lang="ts">
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import { SerialNumberEnum } from '../../Core/Enums/serialNum'
import AddSerialNumberParams from '../../Core/params/addSerialNumberParams'
import { onMounted, ref } from 'vue'
import CreateCodingSystemParams from '../../Core/params/createsSerialNumParams'
import SerialNumController from '../controllers/createSerialNumController'
import { useRouter } from 'vue-router'
import ShowSerialNumController from '../controllers/showSerialNumController'
import ShowSerialNumberParams from '../../Core/params/ShowSerialNumber'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

const showSerialNumController = ShowSerialNumController.getInstance()

const router = useRouter()

const SERIAL_TITLES: Record<SerialNumberEnum, string> = {
  [SerialNumberEnum.EQUIPMENT]: 'Equipment',
  [SerialNumberEnum.PROJECT]: 'Project',
  [SerialNumberEnum.EMPLOYEE]: 'Employee',
  [SerialNumberEnum.AccidentsType]: 'Accidents Type',
  [SerialNumberEnum.CONTRACTOR]: 'Contractor',
  [SerialNumberEnum.HazardType]: 'Hazard Type',
  [SerialNumberEnum.MACHINE]: 'Machine',
  [SerialNumberEnum.OBSERVATION]: 'Observation',
  [SerialNumberEnum.ObservationType]: 'Observation Type',
  [SerialNumberEnum.PROJECTLOCATION]: 'Project Location',
  [SerialNumberEnum.PROJECTZONE]: 'Project Zone',
  [SerialNumberEnum.TASK]: 'Task',
  [SerialNumberEnum.WAREHOUSE]: 'Warehouse',
  [SerialNumberEnum.ZONE]: 'Zone',
}
const getTitle = (type: SerialNumberEnum) => SERIAL_TITLES[type]

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
  {
    id: 4,
    serialNumberType: SerialNumberEnum.AccidentsType,
    name: SerialNumberEnum.AccidentsType,
    title: getTitle(SerialNumberEnum.AccidentsType),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 5,
    serialNumberType: SerialNumberEnum.CONTRACTOR,
    name: SerialNumberEnum.CONTRACTOR,
    title: getTitle(SerialNumberEnum.CONTRACTOR),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 6,
    serialNumberType: SerialNumberEnum.HazardType,
    name: SerialNumberEnum.HazardType,
    title: getTitle(SerialNumberEnum.HazardType),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 7,
    serialNumberType: SerialNumberEnum.MACHINE,
    name: SerialNumberEnum.MACHINE,
    title: getTitle(SerialNumberEnum.MACHINE),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 8,
    serialNumberType: SerialNumberEnum.OBSERVATION,
    name: SerialNumberEnum.OBSERVATION,
    title: getTitle(SerialNumberEnum.OBSERVATION),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 9,
    serialNumberType: SerialNumberEnum.ObservationType,
    name: SerialNumberEnum.ObservationType,
    title: getTitle(SerialNumberEnum.ObservationType),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 10,
    serialNumberType: SerialNumberEnum.PROJECTLOCATION,
    name: SerialNumberEnum.PROJECTLOCATION,
    title: getTitle(SerialNumberEnum.PROJECTLOCATION),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 11,
    serialNumberType: SerialNumberEnum.PROJECTZONE,
    name: SerialNumberEnum.PROJECTZONE,
    title: getTitle(SerialNumberEnum.PROJECTZONE),
    prefix: '',
    suffix: '',
    start: '',
  },

  {
    id: 12,
    serialNumberType: SerialNumberEnum.TASK,
    name: SerialNumberEnum.TASK,
    title: getTitle(SerialNumberEnum.TASK),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 13,
    serialNumberType: SerialNumberEnum.ZONE,
    name: SerialNumberEnum.ZONE,
    title: getTitle(SerialNumberEnum.ZONE),
    prefix: '',
    suffix: '',
    start: '',
  },
  {
    id: 14,
    serialNumberType: SerialNumberEnum.WAREHOUSE,
    name: SerialNumberEnum.WAREHOUSE,
    title: getTitle(SerialNumberEnum.WAREHOUSE),
    prefix: '',
    suffix: '',
    start: '',
  },
])

const sendData = () => {
  fields.value.map((el) => {
    if (!el.prefix && !el.suffix && !el.start) {
      el.name = 0
    }
  })

  const params = new CreateCodingSystemParams(fields.value.filter((el) => el.name != 0))
  SerialNumController.getInstance().addSerialNumber(params, router)
}

const ShowData = async () => {
  const showSerialNumberParams = new ShowSerialNumberParams()
  const state = await showSerialNumController.ShowSerialNumber(showSerialNumberParams, router)
  if (state.value.data) {
    state.value.data.map((el) => {
      fields.value.map((field) => {
        if (Number(el.name) == Number(field.name)) {
          field.prefix = el.prefix
          field.suffix = el.suffix
          field.start = el.start
        }
      })
    })
  }
}

onMounted(() => {
  ShowData()
})
</script>

<template>
  <form @submit.prevent="sendData" class="serial-form container">
    <div v-for="field in fields" :key="field.id" class="serial-form-section">
      <div class="serial-number-input-fields flex flex-col gap-5 w-full">
        <Accordion :value="field.id" class="w-full">
          <AccordionPanel :value="1" :header="field.title" class="w-full">
            <AccordionHeader>
              <div class="serial-form-title uppercase w-full">
                <h2>{{ field.title }}</h2>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
                <div class="input-wrapper star">
                  <label>{{ $t('prefix') }} <ImportantIcon /></label>
                  <input type="text" v-model="field.prefix" placeholder="Enter your prefix" />
                </div>
                <div class="input-wrapper star">
                  <label>{{ $t('suffix') }} <ImportantIcon /></label>
                  <input type="text" v-model="field.suffix" placeholder="Enter your suffix" />
                </div>
                <div class="input-wrapper star">
                  <label>{{ $t('start') }} <ImportantIcon /></label>
                  <input type="text" v-model="field.start" placeholder="Enter your start" />
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>

    <div class="form-sticky-button flex gap-2">
      <router-link to="/organization" class="btn btn-cancel" style="width: 15%">{{ $t('cancel') }}</router-link>
      <button type="submit" class="btn btn-primary" style="width: 85%">{{ $t('Add') }}</button>
    </div>
  </form>
</template>
