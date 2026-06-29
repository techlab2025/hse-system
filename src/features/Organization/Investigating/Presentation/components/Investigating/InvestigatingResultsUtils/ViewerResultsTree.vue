<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import { watch } from 'vue'

const emit = defineEmits(['update:data'])
const { viwers } = defineProps<{
  viwers?: InjuryDetailsModel[]
}>()

type AnswerModel = {
  result: string
  employee: TitleInterface
}
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const employeeOptions = ref<TitleInterface[]>([])
const isSelectHasContent = ref<boolean[]>([])
const Answers = ref<AnswerModel[]>([
  {
    result: ' ',
    employee: new TitleInterface({ id: 0, title: '' }),
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    result: '',
    employee: new TitleInterface({ id: 0, title: '' }),
  })
  isSelectHasContent.value.push(false)
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  isSelectHasContent.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}
const fetchEmployees = async () => {
  employeeOptions.value = await fetchOriganizatioEmployeeController.fetch(
    fetchOrganizationEmployeeParams,
  )
}

const toggleMode = (index: number, isManual: boolean) => {
  isSelectHasContent.value[index] = isManual
  Answers.value[index].employee = new TitleInterface({ id: 0, title: '' })
  UpdateData()
}

onMounted(async () => {
  await fetchEmployees()
  emit('update:data', Answers.value)
})

const mapInjuryToAnswer = (item: InjuryDetailsModel): AnswerModel => {
  const employeeId =
    item?.organization_employee?.organization_employee_id || item?.organization_employee?.id || 0
  const employeeTitle = item?.organization_employee?.name || item?.employee_name || ''

  return {
    employee: new TitleInterface({ id: employeeId, title: employeeTitle }),
    result: item?.note || '',
  }
}

const isInitialized = ref(false)

watch(
  () => viwers,
  (newInjuries) => {
    if (!isInitialized.value && newInjuries?.length) {
      Answers.value = newInjuries.map(mapInjuryToAnswer)
      isSelectHasContent.value = Answers.value.map(
        (item) => !item.employee?.id && !!item.employee?.title,
      )
      isInitialized.value = true
      UpdateData()
    }
  },
  { immediate: true, deep: true },
)
</script>
<template>
  <div class="template-container">
    <div
      class="timeline-item"
      v-for="(item, index) in Answers"
      :key="index"
      :class="{ active: index === 0 }"
      :style="{ animationDelay: `${index * 0.15}s` }"
    >
      <div class="timeline-content">
        <div class="timeline-contect-select">
          <div class="input-wrapper">
            <UpdatedCustomInputSelect
              :staticOptions="employeeOptions"
              v-model="item.employee"
              placeholder="Select Employee"
              class="mt-4 mr-2 input"
              label="Employee"
              :reload="false"
              :hascontent="isSelectHasContent[index]"
              @update:model-value="UpdateData"
            >
              <template #reloadHeader>
                <div class="flex gap-2 items-center">
                  <button
                    :class="isSelectHasContent[index] ? 'active' : ''"
                    class="emp-name"
                    @click.prevent="toggleMode(index, true)"
                  >
                    {{ $t('employee_name') }}
                  </button>

                  <button
                    :class="isSelectHasContent[index] ? '' : 'active'"
                    class="emp-select"
                    @click.prevent="toggleMode(index, false)"
                  >
                    {{ $t('select') }}
                  </button>
                </div>
              </template>
              <template #content>
                <input
                  type="text"
                  v-model="item.employee.title"
                  class="input"
                  :placeholder="$t('employee_name')"
                  @input="UpdateData"
                />
              </template>
            </UpdatedCustomInputSelect>
          </div>
          <div class="timeline-content-text input-wrapper">
            <label for="result">result</label>
            <textarea
              type="result"
              id="result"
              v-model="item.result"
              class="input"
              placeholder="add your descripe"
              @input="UpdateData"
            ></textarea>
          </div>
        </div>
        <!-- </div> -->
      </div>

      <div class="tree-marker flex">
        <div>
          <div class="tree-dot">
            <div class="tree-dot-inner"></div>
            <div class="tree-pulse"></div>
          </div>

          <div class="tree-icon">
            <DeleteItemAction
              class="cursor-pointer"
              v-if="index >= 0 && index !== Answers.length - 1"
              @click="DeleteItem(index)"
            />
            <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
            <!-- <span>aaaa</span> -->
          </div>
        </div>
        <span
          class="add-text cursor-pointer"
          @click="addNewAnswer"
          v-if="!(index >= 0 && index !== Answers.length - 1)"
          >Add another result</span
        >
      </div>
    </div>
  </div>
</template>
