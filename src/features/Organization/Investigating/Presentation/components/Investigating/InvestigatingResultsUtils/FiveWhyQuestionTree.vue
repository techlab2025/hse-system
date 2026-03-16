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


const Answers = ref([
  {
    answer: ' ',
    question: '',
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    answer: '',
    question: '',
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
            
              <div class="timeline-contect-select w-full flex flex-col">
                <div class=" input-wrapper w-full">
                  <label for="question">{{ $t('question') }}</label>
                  <input type="text" id="question" v-model="item.question" class="input" placeholder="add your question"
                    @input="UpdateData">
                </div>
                <div class=" input-wrapper w-full">
                  <label for="answer">{{ $t('answer') }}</label>
                  <textarea id="answer" v-model="item.answer" class="input" placeholder="add your answer"
                    @input="UpdateData"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.timeline-contect-select{
  display: flex;
  flex-direction: column !important;
  gap: 12px;
}
</style>
