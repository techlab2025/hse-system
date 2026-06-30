<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'

const emit = defineEmits(['update:data'])

const { capaStyles, staticEmployeeOptions, useStaticEmployeeOptions } = defineProps<{
  capaStyles?: boolean
  staticEmployeeOptions?: TitleInterface[]
  useStaticEmployeeOptions?: boolean
}>()
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const employeeOptions = ref<TitleInterface[]>([])
const Answers = ref([
  {
    text: ' ',
    employee: new TitleInterface({ id: 0, title: '' }),
    date: new Date(),
    ResponablePerson: new TitleInterface({ id: 0, title: '' }),
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    text: '',
    employee: new TitleInterface({ id: 0, title: '' }),
    date: new Date(),
    ResponablePerson: new TitleInterface({ id: 0, title: '' }),
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

const fetchEmployees = async () => {
  if (useStaticEmployeeOptions) {
    employeeOptions.value = staticEmployeeOptions ?? []
    return
  }

  employeeOptions.value = await fetchOriganizatioEmployeeController.fetch(
    fetchOrganizationEmployeeParams,
  )
}

onMounted(async () => {
  await fetchEmployees()
  emit('update:data', Answers.value)
})
</script>
<template>
  <div class="template-container">
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            v-for="(item, index) in Answers"
            :key="index"
            :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction
                  class="cursor-pointer"
                  v-if="Answers.length > 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer
                  v-if="index === Answers.length - 1"
                  @click="addNewAnswer"
                  class="cursor-pointer"
                />
              </div>
            </div>

            <div class="timeline-content" :class="{ 'capa-timeline-content': capaStyles }">
              <div class="timeline-content-text input-wrapper">
                <label for="text">Action</label>
                <input
                  type="text"
                  id="text"
                  v-model="item.text"
                  class="input"
                  placeholder="add your title"
                  @input="UpdateData"
                />
              </div>
              <div class="timeline-contect-select" :class="{ 'capa-timeline-select': capaStyles }">
                <div class="input-wrapper">
                  <CustomSelectInput
                    :staticOptions="employeeOptions"
                    v-model="item.employee"
                    placeholder="Select Employee"
                    class="mt-4 mr-2 input"
                    label="Implementation Responsibility "
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                </div>
                <div class="flex flex-col gap-2 input-wrapper">
                  <label for="date">Expected Time for Implementation </label>
                  <DatePicker
                    v-model="item.date"
                    class="mt-4 mr-2 input date-picker"
                    placeholder="Select Date"
                    @update:model-value="UpdateData"
                    input-id="date"
                  />
                </div>
                <div class="input-wrapper">
                  <CustomSelectInput
                    :staticOptions="employeeOptions"
                    v-model="item.ResponablePerson"
                    placeholder="Select Responable Person"
                    class="mt-4 mr-2 input"
                    label="Monitoring Responsibility "
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.capa-timeline-content {
  gap: 12px;
}

.capa-timeline-content .timeline-content-text,
.capa-timeline-select .input-wrapper {
  width: 100%;
}

.capa-timeline-select {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 12px !important;
  width: 100%;
}
</style>
