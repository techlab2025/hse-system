<script setup lang="ts">
import ImportantIcon from '@/shared/icons/ImportantIcon.vue'
import { SerialNumberEnum } from '../../Core/Enums/serialNum'
import AddSerialNumberParams from '../../Core/params/addSerialNumberParams'
import { onMounted, ref } from 'vue'
import CreateCodingSystemParams from '../../Core/params/createsSerialNumParams'
import SerialNumController from '../controllers/createSerialNumController'
import { useRoute, useRouter } from 'vue-router'
import ShowSerialNumController from '../controllers/showSerialNumController'
import ShowSerialNumberParams from '../../Core/params/ShowSerialNumber'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { SertialNumberStatusEnum } from '../../Core/Enums/SerialNumberStatusEnum'
import IndexProjectProgressController from '../../../ProjectPrgoress/Presentation/controllers/indexProjectProgressController'
import IndexProjectProgressParams from '@/features/Organization/ProjectPrgoress/Core/params/indexProjectProgressParams'
import PathSerial from '@/shared/icons/pathSerial.vue'

const showSerialNumController = ShowSerialNumController.getInstance()
const emit = defineEmits(['update:data', 'close:dialog'])
const router = useRouter()
const props = defineProps<{
  serialType: SertialNumberStatusEnum
}>()

const SERIAL_TITLES: Record<SerialNumberEnum, string> = {
  [SerialNumberEnum.EQUIPMENT]: 'Equipment',
  [SerialNumberEnum.PROJECT]: 'Project',
  [SerialNumberEnum.EMPLOYEE]: 'Employee',
  [SerialNumberEnum.AccidentsType]: 'Incident Type',
  [SerialNumberEnum.CONTRACTOR]: 'Contractor',
  // [SerialNumberEnum.HazardType]: 'Hazard Type',
  [SerialNumberEnum.OBSERVATION]: 'Observation',
  // [SerialNumberEnum.ObservationType]: 'Observation Type',
  // [SerialNumberEnum.PROJECTLOCATION]: 'Project Location',
  // [SerialNumberEnum.PROJECTZONE]: 'Project Zone',
  [SerialNumberEnum.TASK]: 'Task',
  [SerialNumberEnum.WAREHOUSE]: 'Warehouse',
  // [SerialNumberEnum.ZONE]: 'Zone',
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
  // {
  //   id: 6,
  //   serialNumberType: SerialNumberEnum.HazardType,
  //   name: SerialNumberEnum.HazardType,
  //   title: getTitle(SerialNumberEnum.HazardType),
  //   prefix: '',
  //   suffix: '',
  //   start: '',
  // },

  {
    id: 8,
    serialNumberType: SerialNumberEnum.OBSERVATION,
    name: SerialNumberEnum.OBSERVATION,
    title: getTitle(SerialNumberEnum.OBSERVATION),
    prefix: '',
    suffix: '',
    start: '',
  },
  // {
  //   id: 9,
  //   serialNumberType: SerialNumberEnum.ObservationType,
  //   name: SerialNumberEnum.ObservationType,
  //   title: getTitle(SerialNumberEnum.ObservationType),
  //   prefix: '',
  //   suffix: '',
  //   start: '',
  // },
  // {
  //   id: 10,
  //   serialNumberType: SerialNumberEnum.PROJECTLOCATION,
  //   name: SerialNumberEnum.PROJECTLOCATION,
  //   title: getTitle(SerialNumberEnum.PROJECTLOCATION),
  //   prefix: '',
  //   suffix: '',
  //   start: '',
  // },
  // {
  //   id: 11,
  //   serialNumberType: SerialNumberEnum.PROJECTZONE,
  //   name: SerialNumberEnum.PROJECTZONE,
  //   title: getTitle(SerialNumberEnum.PROJECTZONE),
  //   prefix: '',
  //   suffix: '',
  //   start: '',
  // },

  {
    id: 12,
    serialNumberType: SerialNumberEnum.TASK,
    name: SerialNumberEnum.TASK,
    title: getTitle(SerialNumberEnum.TASK),
    prefix: '',
    suffix: '',
    start: '',
  },
  // {
  //   id: 13,
  //   serialNumberType: SerialNumberEnum.ZONE,
  //   name: SerialNumberEnum.ZONE,
  //   title: getTitle(SerialNumberEnum.ZONE),
  //   prefix: '',
  //   suffix: '',
  //   start: '',
  // },
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

const sendData = async () => {
  fields.value.map((el) => {
    if (!el.prefix && !el.suffix && !el.start) {
      el.name = 0
    }
  })

  const params = new CreateCodingSystemParams(props.serialType == SertialNumberStatusEnum.AUTO ? fields.value.filter((el) => el.name != 0) : [], props.serialType)
  const state = await SerialNumController.getInstance().addSerialNumber(params, router)
  if (state.value.data) {
    await IndexProjectProgressController.getInstance().getData(
      new IndexProjectProgressParams('', 1, 10, 0),
    )
  }
  emit('close:dialog')
  emit('update:data')
  // location.reload()

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

onMounted(async () => {
  await ShowData()
  // await IndexProjectProgressController.getInstance().getData(
  //   new IndexProjectProgressParams('', 1, 10, 0),
  // )
})
const route = useRoute()
</script>

<template>
  <form @submit.prevent="sendData" class="serial-form container">
    <div v-if="serialType == SertialNumberStatusEnum.MANUAL" class="serial-overlay"></div>
    <div v-for="field in fields" :key="field.id" class="serial-form-section"
      :class="serialType == SertialNumberStatusEnum.MANUAL ? 'opacity' : ''">
      <div class="serial-number-input-fields flex flex-col gap-5 w-full">
        <Accordion :value="field.id" class="w-full" expandIcon="null" collapseIcon="null" lazy>
          <AccordionPanel :value="1" :header="field.title" class="w-full">
            <AccordionHeader>
              <div class="serial-form-title uppercase w-full">
                <h2>{{ field.title }}</h2>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-4">
                <div class="input-wrapper star">
                  <label>{{ $t('prefix') }}
                    <ImportantIcon />
                  </label>
                  <input type="text" v-model="field.prefix" placeholder="Enter your prefix" />
                </div>
                <div class="input-wrapper star">
                  <label>{{ $t('suffix') }}
                    <ImportantIcon />
                  </label>
                  <input type="text" v-model="field.suffix" placeholder="Enter your suffix" />
                </div>
                <div class="input-wrapper star">
                  <label>{{ $t('start number') }}
                    <ImportantIcon />
                  </label>
                  <input type="text" v-model="field.start" placeholder="Enter your start" />
                </div>
                <div class="generated-serial ">
                  <div class="icon-text">
                    <PathSerial />
                    <p>Generated Serial number Example:</p>
                  </div>
                  <div class="cards">
                    <p>{{ field.prefix }}-{{ field.start }}-{{ field.suffix }}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

      </div>
    </div>

    <div class="form-sticky-button flex gap-2">
      <router-link v-if="!route.path.includes('project-progress')" to="/organization" class="btn btn-cancel"
        style="width: 15%">{{
          $t('cancel')
        }}</router-link>
      <button type="submit" class="btn btn-primary"
        :style="!route.path.includes('project-progress') ? 'width: 85%' : 'width: 100%'">{{ $t('save') }}</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.generated-serial {
  background-color: rgba(249, 249, 252, 1);
  border-radius: 24px;
  padding: 1rem;
  width: 100%;
  grid-column: span 3;

  display: flex;
  align-items: end;
  gap: .5rem;
  // justify-content: space-between;
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  margin: 0 1.1rem;

  .icon-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    p {
      font-size: 1rem;
      font-weight: 600;
      font-family: "regular";
      color: rgba(32, 32, 32, 1);
    }
  }

  .cards {
    // display: flex;
    // gap: 1rem;
    // flex-wrap: wrap;
    // justify-content: space-between;
    // display: grid;
    // grid-template-columns: 1fr 1fr 1fr 1fr;

    // @media (max-width: 1100px) {
    //   grid-template-columns: 1fr 1fr 1fr;
    // }

    // @media (max-width: 768px) {
    //   grid-template-columns: 1fr 1fr;
    // }

    p {
      font-size: .8rem;
      font-weight: 600;
      font-family: "regular";
      color: rgba(130, 130, 139, 1);

      span {
        color: rgba(32, 32, 32, 1);
      }
    }
  }
}
</style>
