<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

import mark from '@/assets/images/mark.png'
const visible = ref(false)

const observation = {
  title: 'Observation Details',
  summary: 'All observation details and attached photos',
  description:
    'The worker operating the shale shaker was not wearing safety goggles while cleaning the mud screen.',
}
</script>

<template>
  <button label="Show" @click="visible = true" class="show-details-btn">show details</button>

  <Dialog
    v-model:visible="visible"
    modal
    :dismissableMask="true"
    :style="{ width: '90vw', maxWidth: '60rem' }"
  >
    <template #header>
      <div class="dialog-header">
        <h3>{{ observation.title }}</h3>
        <p>{{ observation.summary }}</p>
      </div>
    </template>

    <div class="investigation-show-details">
      <div class="dialog-content">
        <div class="all-text-content">
          <div class="observer-info">
            <div class="name">
              <h4>Ahmed Hassan <span>( observer )</span></h4>
            </div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and
            </p>
            <div class="info-row">
              <div class="info-item">
                <img :src="mark" alt="zone" class="zone-img" />
                <h5>Zone :</h5>
                <span>Observation Type</span>
              </div>
              <div class="info-item">
                <h5>Machine :</h5>
                <span>Observation Type</span>
              </div>
              <div class="info-item">
                <h5>Status :</h5>
                <span>Observation Type</span>
              </div>
            </div>
          </div>
          <div class="description">
            <h4>preventive action:</h4>
            <p>
              The worker operating the shale shaker was not wearing safety goggles while cleaning
              the mud screen. Mud splashes could potentially cause eye injury. mud screen. Mud
              splashes could potentially cause eye injury.
            </p>
          </div>
          <router-link to="/organization"> show the observation </router-link>
        </div>

        <div class="img-side">
          <img src="@/assets/images/observation-dialoge.png" alt="" />
        </div>
      </div>
    </div>
  </Dialog>
</template>
