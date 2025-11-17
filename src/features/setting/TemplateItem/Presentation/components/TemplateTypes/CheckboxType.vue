<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import AddAnswer from '@/shared/icons/AddAnswer.vue';
import DangerIcon from '@/shared/icons/DangerIcon.vue';
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue';
import RedDangerIcon from '@/shared/icons/RedDangerIcon.vue';
import { onMounted, ref } from 'vue';

const emit = defineEmits(['update:data'])
const Answers = ref([
  {
    title: '',
    isDanger: false
  }
]);

const addNewAnswer = () => {
  Answers.value.push({
    title: '',
    isDanger: false
  });
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
                <input type="text" v-model="item.title" class="input" placeholder="Enter text" @input="UpdateData" />
                <DangerIcon class="icon cursor-pointer" v-if="!Answers[index].isDanger"
                  @click="Answers[index].isDanger = true; UpdateData()" />
                <RedDangerIcon class="icon cursor-pointer" v-if="Answers[index].isDanger"
                  @click="Answers[index].isDanger = false; UpdateData()" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
