<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import Image from 'primevue/image'

import IndexFilter from './InvestigatingUtils/IndexFilter.vue'
import FilterDialog from './InvestigatingUtils/FilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'

const InvestigatingList = ref([
  {
    serial: 'INV-001',
    date: '2025-01-05 10:00 AM',
    observer: { name: 'Ahmed Ali' },
    description: 'Oil leakage detected near the main engine.',
    zoon: { title: 'Zone A' },
    equipment: { title: 'Excavator CAT 320' },
    image: 'https://picsum.photos/220/150',
  },
  {
    serial: 'INV-002',
    date: '2025-01-08 01:15 PM',
    observer: { name: 'Mohamed Hassan' },
    description: 'High noise level coming from compressor.',
    zoon: { title: 'Zone C' },
    equipment: { title: 'Air Compressor X10' },
    image: 'https://picsum.photos/220/150',
  },
  {
    serial: 'INV-003',
    date: '2025-01-15 03:40 PM',
    observer: { name: 'Sara Youssef' },
    description: 'Broken cable found near hazardous area.',
    zoon: { title: 'Zone B' },
    equipment: { title: 'Generator G5' },
    image: 'https://picsum.photos/220/150',
  },
])

const ShowDetails = ref<boolean[]>([])

onMounted(() => {
  ShowDetails.value = InvestigatingList.value.map(() => false)
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 index-investigating">
    <!-- Header -->
    <div class="col-span-12">
      <div class="flex items-center justify-between">
        <IndexFilter :filters="Filters" />
        <div class="btns-filter">
          <FilterDialog />
          <button class="btn btn-primary">Create Investigating</button>
        </div>
      </div>
    </div>

    <!-- CARDS — ALWAYS DISPLAY -->
    <div class="col-span-12">
      <div class="table-responsive">
        <div class="index-table-card-container">
          <div class="index-table-card" v-for="(item, index) in InvestigatingList" :key="index">
            <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
              <div class="first-container">
                <div class="first-card">
                  <div class="first-card-header">
                    <div class="header">
                      <p class="first-label-item-primary">Incedant <span>_OBS-2025-0112</span></p>
                      <P>New</P>
                    </div>
                    <p class="label-item-secondary">
                      Date & Time: <span>{{ item.date }}</span>
                    </p>
                  </div>

                  <div class="card-details">
                    <p class="title">
                      {{ item.observer.name }}
                      <span>(observer)</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- second container -->
              <div class="header-container">
                <div class="card-content">
                  <div class="card-header">
                    <p class="label-item-primary">
                      Serial: <span>{{ item.serial }}</span>
                    </p>

                    <p class="label-item-secondary">
                      Date & Time: <span>{{ item.date }}</span>
                    </p>
                  </div>

                  <div class="card-details">
                    <p class="title">
                      {{ item.observer.name }}
                      <span>(observer)</span>
                    </p>

                    <p class="subtitle">{{ item.description }}</p>

                    <div class="project-details">
                      <p class="label-item-primary">
                        Zone: <span>{{ item.zoon.title }}</span>
                      </p>

                      <p class="label-item-primary">
                        Machine: <span>{{ item.equipment.title }}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="card-info">
                  <p class="title">Investigating Type</p>

                  <Image :src="item.image" alt="Image" preview>
                    <template #previewicon>
                      <div class="perview">
                        <span>view</span>
                        <ViewIcon />
                      </div>
                    </template>
                  </Image>
                </div>
              </div>

              <p class="show-more" @click="ShowDetails[index] = !ShowDetails[index]">
                <span v-if="ShowDetails[index]">Show Less</span>
                <span v-else>Show More</span>
                <ShowMoreIcon />
              </p>
            </div>

            <div v-if="ShowDetails[index]" class="card-description">
              <p class="title">Description</p>
              <p class="description">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
