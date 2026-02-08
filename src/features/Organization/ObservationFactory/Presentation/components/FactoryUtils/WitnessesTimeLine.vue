<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

const emit = defineEmits(['update:data'])

const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const Answers = ref([
  {
    text: ' ',
    employee: new TitleInterface({ id: 0, title: '' }),
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    text: '',
    employee: new TitleInterface({ id: 0, title: '' }),
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  Answers.value.forEach(ensureEmployee)
  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})

const isSelectHasContent = ref([])
const ensureEmployee = (item: any) => {
  if (!item.employee) {
    item.employee = new TitleInterface({ id: 0, title: '' })
  }
}
</script>
<template>
  <div class="template-container col-span-6">
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div class="timeline-item" v-for="(item, index) in Answers" :key="index" :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
                  @click="DeleteItem(index)" />
                <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
              </div>
            </div>

            <div class="timeline-content">
              <div class=" input-wrapper">
                <label for="wetness-text">{{ $t('Text') }}</label>
                <input type="text" id="wetness-text" v-model="item.text" class="input" placeholder="add your title"
                  @input="UpdateData" />
              </div>
              <div class="input-wrapper">


                <UpdatedCustomInputSelect :controller="fetchOriganizatioEmployeeController"
                  :params="fetchOrganizationEmployeeParams" v-model="item.employee" placeholder="Select Employee"
                  class="mt-4 mr-2 input" :label="$t('Employee')" @update:model-value="UpdateData"
                  :hascontent="isSelectHasContent[index]">
                  <template #reloadHeader>
                    <div class="flex gap-2 items-center">
                      <button :class="isSelectHasContent[index] ? 'active' : ''" class="emp-name"
                        @click.prevent="isSelectHasContent[index] = true; item.employee.title = ''">{{
                          $t('employee_name')
                        }}</button>
                      <button :class="isSelectHasContent[index] ? '' : 'active'" class="emp-select"
                        @click.prevent="isSelectHasContent[index] = false; item.employee.title = ''">{{ $t('select')
                        }}</button>
                    </div>
                  </template>
                  <template #content>
                    <input type="text" v-model="item.employee.title" class="input" placeholder="Select Employee">
                  </template>
                </UpdatedCustomInputSelect>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
