<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import mark from '@/assets/images/mark.png'
import TasksModel from '@/features/Organization/Investigating/Data/models/Tasks/TasksModel'
const visible = ref(false)

const staticData = {
  title: 'Task Details',
  description: 'Thickening the electrical wires and reinforcing them with an insulating material',
}

const props = defineProps({
  item: TasksModel,
})
</script>

<template>
  <button label="Show" @click="visible = true" class="investigation-show-result-btn">
    view details
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissableMask="true"
    :style="{ width: '90vw', maxWidth: '60rem' }"
  >
    <template #header>
      <div class="show-result-dialog-header">
        <h3>{{ staticData.title }}</h3>
        <p>{{ staticData.description }}</p>
      </div>
    </template>

    <div class="investigation-show-result">
      <div class="dialog-content">
        <div class="all-text-content">
          <div class="observer-info">
            <h3 class="main-title">
              {{ item?.title }}
            </h3>
            <div class="info-row">
              <div class="info-item">
                <h5>due date :</h5>
                <span> {{ item?.date }}</span>
              </div>
              <div class="info-item">
                <h5>Responsible :</h5>
                <span> {{ item?.responablePerson }}</span>
              </div>
            </div>
          </div>
          <!-- <div class="notes">
            <h4>Notes</h4>
            <p>
              Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of
              the printing Lorem Ipsum is simply dummy text of the printing
            </p>
          </div> -->
        </div>

        <div class="user-img-side">
          <img src="@/assets/images/user-assign.png" alt="" />
          <div class="name">
            <span>assigned to :</span>
            <p>{{ item?.assignedTo }}</p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
