<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import AddAnswer from '@/shared/icons/AddAnswer.vue';
import DangerIcon from '@/shared/icons/DangerIcon.vue';
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue';
import { ref } from 'vue';

const Answers = ref<TitleInterface[]>([
  {
    id: 1,
    title: '',
  }
]);

const addNewAnswer = () => {
  Answers.value.push({
    id: Date.now(),
    title: ''
  });
}


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
                  @click="Answers.splice(index, 1)" />
                <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
              </div>
            </div>

            <div class="timeline-content">
              <div class="dropdown-type input-wrapper">
                <input type="text" v-model="item.title" class="input" placeholder="Enter text" />
                <DangerIcon class="icon cursor-pointer" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>
