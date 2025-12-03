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

const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const Answers = ref([
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
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})
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
            <CustomSelectInput
              :controller="fetchOriganizatioEmployeeController"
              :params="fetchOrganizationEmployeeParams"
              v-model="item.employee"
              placeholder="Select Employee"
              class="mt-4 mr-2 input"
              label="Employee"
              @update:model-value="UpdateData"
            />
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
        <span class="add-text" v-if="!(index >= 0 && index !== Answers.length - 1)"
          >Add another result</span
        >
      </div>
    </div>
  </div>
</template>
