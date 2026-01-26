<script setup lang="ts">
import AddAnswer from '@/shared/icons/AddAnswer.vue';
import DangerIcon from '@/shared/icons/DangerIcon.vue';
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue';
import RedDangerIcon from '@/shared/icons/RedDangerIcon.vue';
import TextAreaRequiredIcon from '@/shared/icons/TextAreaRequiredIcon.vue';
import TextAreaRequiredSelectedIcon from '@/shared/icons/TextAreaRequiredSelectedIcon.vue';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['update:data'])
const Answers = ref([
  {
    title: '',
    is_upload: false,
    isTextAreaRequired: false,
    textarea_type: 0,
    has_auto_observation: false
  }
]);

const addNewAnswer = () => {
  Answers.value.push({
    title: '',
    is_upload: false,
    isTextAreaRequired: false,
    textarea_type: 0,
    has_auto_observation: false
  });
  console.log(Answers.value, "Answers.value")
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value.filter(answer => answer.title.trim() !== ''))
}
onMounted(() => {
  emit('update:data', Answers.value.filter(answer => answer.title.trim() !== ''))
})
</script>
<template>
  <div class="template-container">

    <div class="dropdwon-title">
      <p class="title">Add Your Answers</p>
      <p class="subtitle">You must add at least two items and a maximum of 5 choices</p>
      <p class="alert">Active the alert to one danger case of your choices</p>
    </div>
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div class="timeline-item" v-for="(item, index) in Answers" :key="item.id" :class="{ active: index === 0 }"
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
              <div class="dropdown-type input-wrapper">
                <div class="input-wrapper flex flex-col">
                  <input type="text" v-model="item.title" class="input" placeholder="Enter text" @input="UpdateData" />
                  <div class="flex w-full space-between gap-2">
                    <input :disabled="!item.isTextAreaRequired" type="checkbox" value="1" v-model="item.textarea_type"
                      @change="UpdateData" :id="`textareaType-${index}`">
                    <label :class="!item.isTextAreaRequired ? 'disabled' : ''" :for="`textareaType-${index}`">Text
                      area Required</label>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <DangerIcon class="icon cursor-pointer" v-if="!Answers[index].is_upload"
                      @click="Answers[index].is_upload = true; UpdateData()" />
                    <RedDangerIcon class="icon cursor-pointer" v-if="Answers[index].is_upload"
                      @click="Answers[index].is_upload = false; UpdateData()" />
                    <TextAreaRequiredIcon class="icon cursor-pointer" v-if="!Answers[index].isTextAreaRequired"
                      @click="Answers[index].isTextAreaRequired = true; Answers[index].textarea_type = 1; UpdateData()" />
                    <TextAreaRequiredSelectedIcon class="icon cursor-pointer" v-if="Answers[index].isTextAreaRequired"
                      @click="Answers[index].isTextAreaRequired = false; Answers[index].textarea_type = 0; UpdateData()" />
                  </div>
                  <div class="flex w-full space-between gap-2">
                    <input type="checkbox" v-model="item.has_auto_observation" @change="UpdateData"
                      :id="`has_auto_observation-${index}`">
                    <label :for="`has_auto_observation-${index}`">Auto observation</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
