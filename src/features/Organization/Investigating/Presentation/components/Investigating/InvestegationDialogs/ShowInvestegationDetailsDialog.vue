<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import mark from '@/assets/images/mark.png'
import type InvestigatingModel from '@/features/Organization/Investigating/Data/models/investigatingModel'
import Galleria from 'primevue/galleria'

const visible = ref(false)

const props = defineProps<{
  item: InvestigatingModel
}>()

const staticData = ref({
  title: 'Investigation Details',
  description: 'here are all the observation details and photos the observer add ',
})
</script>

<template>
  <button label="Show" @click="visible = true" class="investigation-show-details-btn">
    show details
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    :dismissableMask="true"
    :style="{ width: '90vw', maxWidth: '60rem' }"
  >
    <template #header>
      <div class="show-investigation-dialog-header">
        <h3>{{ staticData?.title }}</h3>
        <p>{{ staticData?.description }}</p>
      </div>
    </template>
    <!-- <pre>{{ item }} </pre> -->

    <div class="investigation-show-details">
      <div class="dialog-content">
        <div class="all-text-content">
          <div class="observer-info">
            <div class="name">
              <h4>{{ item?.observation?.observer?.name }} <span>( observer )</span></h4>
            </div>
            <p>
              {{ item?.observation?.title }}
            </p>
            <div class="info-row">
              <div class="info-item">
                <img :src="mark" alt="zone" class="zone-img" />
                <h5>Zone :</h5>
                <span>{{ item?.observation?.zoon?.title }}</span>
              </div>
              <div class="info-item">
                <h5>Machine :</h5>
                <span>{{ item?.observation?.equipment?.title }}</span>
              </div>
              <div class="info-item">
                <h5>Status :</h5>
                <span>{{ item?.status }}</span>
              </div>
            </div>
          </div>
          <div class="description">
            <h4>preventive action:</h4>
            <p>
              {{ item?.action }}
            </p>
          </div>
          <router-link to="/organization"> show the observation </router-link>
        </div>

        <div class="img-side" v-if="item?.image?.length > 0">
          <img :src="item?.image" alt="investegation-image" loading="lazy" />

          <!-- <Galleria
            :value="item?.files"
            :responsiveOptions="responsiveOptions"
            :numVisible="5"
            :circular="true"
            containerStyle="max-width: 100% "
            :showItemNavigators="false"
            :showThumbnails="false"
            :showItemNavigatorsOnHover="false"
            :showIndicators="true"
          >
            <template #item="slotProps">
              <img :src="slotProps.item.img" alt="investigation image" loading="lazy" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.img" :alt="'image'" style="display: block" />
            </template>
          </Galleria> -->
        </div>
      </div>
    </div>
  </Dialog>
</template>
