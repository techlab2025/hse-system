<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'

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
    <div class="timeline-item" v-for="(item, index) in Answers" :key="index" :class="{ active: index === 0 }"
      :style="{ animationDelay: `${index * 0.15}s` }">
      <div class="timeline-content">
        <div class="timeline-contect-select w-full flex gap-2">
          <div class=" input-wrapper w-50">
            <label for="question">{{ $t('question') }}</label>
            <textarea id="question" v-model="item.question" class="input" placeholder="add your question"
              @input="UpdateData"></textarea>
          </div>
          <div class=" input-wrapper w-50">
            <label for="answer">{{ $t('answer') }}</label>
            <textarea id="answer" v-model="item.answer" class="input" placeholder="add your answer"
              @input="UpdateData"></textarea>
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
            <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
              @click="DeleteItem(index)" />
            <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
            <!-- <span>aaaa</span> -->
          </div>
        </div>
        <span class="add-text cursor-pointer" @click="addNewAnswer"
          v-if="!(index >= 0 && index !== Answers.length - 1)">Add another
          result</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-50 {
  width: 50%;
}
</style>
