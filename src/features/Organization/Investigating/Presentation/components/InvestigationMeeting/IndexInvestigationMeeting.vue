<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import Image from 'primevue/image'

import IndexFilter from './InvestigationMeetingUtils/IndexFilter.vue'
import FilterDialog from './InvestigationMeetingUtils/FilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestigatingSidebar from '../Investigating/InvestigatingSidebar.vue'
import google from '../../../../../../assets/images/google-meet.png'
import link from '../../../../../../assets/images/link.png'
import live from '../../../../../../assets/images/live.png'
const InvestigatingData = [
  {
    title: 'Incedant',
    serial: 'Investigation Meeting',
    date: '2025-01-05 10:00 AM',
    observer: { name: 'Ahmed Ali' },
    description: 'Oil leakage detected near the main engine.',
    zoon: { title: '2025-01-05 10:00 AM' },
    equipment: { title: 'Elsayed hassan ' },
    status: { title: '12' },
    image: google,
    google: 'Google Meet',
  },
  {
    title: 'High observation',
    serial: 'Investigation Meeting',
    date: '2025-02-10 11:30 AM',
    observer: { name: 'Sara Mohamed' },
    description: 'Hydraulic failure detected.',
    zoon: { title: '2025-01-05 10:00 AM' },
    equipment: { title: 'Elsayed hassan ' },
    status: { title: '12' },
    image: google,
    google: 'Google Meet',
  },
  {
    title: 'Medium observation',
    serial: 'Investigation Meeting',
    date: '2025-03-15 09:45 AM',
    observer: { name: 'Khaled Samir' },
    description: 'Electrical issue near main control panel.',
    zoon: { title: '2025-01-05 10:00 AM' },
    equipment: { title: 'Elsayed hassan ' },
    status: { title: '12' },
    image: google,
    google: 'Google Meet',
  },
]

const InvestigatingList = ref(InvestigatingData)

const ShowDetails = ref<boolean[]>([])

onMounted(() => {
  ShowDetails.value = InvestigatingList.value.map(() => false)
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 index-investigationMeeting">
    <!-- Sidebar -->
    <InvestigatingSidebar />

    <!-- Main content (Cards) -->
    <div class="col-span-9">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <IndexFilter :filters="Filters" />
        <div class="btns-filter">
          <FilterDialog />
          <!-- <router-link :to="`/organization/investigationMeeting/add`">
            <button class="btn btn-primary">Create Investigating</button>
          </router-link> -->
        </div>
      </div>

      <!-- CARDS -->
      <div class="table-responsive">
        <div class="index-table-card-container">
          <div class="index-table-card" v-for="(item, index) in InvestigatingList" :key="index">
            <div class="card-header-container" :class="ShowDetails[index] ? '' : 'show'">
              <div class="first-container">
                <div class="first-card">
                  <div class="first-card-header">
                    <div class="header">
                      <p class="first-label-item-primary" :class="{
                        'high-observation': item.title === 'High observation',
                        'medium-observation': item.title === 'Medium observation',
                      }">
                        {{ item.title }} <span>_OBS-2025-0112</span>
                      </p>
                      <p class="new">New</p>
                    </div>
                    <div class="first-card-details">
                      <p class="label-item">
                        Date & Time: <span>{{ item.date }}</span>
                      </p>
                      <p class="label-item">
                        The victim: <span>{{ item.observer.name }}</span>
                      </p>
                      <p class="show-details">show details</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- second container -->
              <div class="header-container">
                <div class="card-content">
                  <div class="card-header">
                    <p class="label-item-secondary">
                      {{ item.serial }}
                    </p>
                    <p class="google-icon">
                      <img :src="item.image" alt="meeting" />
                      {{ item.google }}
                    </p>
                  </div>
                  <div class="card-details">
                    <div class="project-details">
                      <p class="label-item-primary">
                        Date & Time : <span class="date-color">{{ item.zoon.title }}</span>
                      </p>
                      <p class="label-item-primary">
                        Investigation team leader : <span>{{ item.equipment.title }}</span>
                      </p>
                      <p class="label-item-primary">
                        Num Of Team: <span>{{ item.status.title }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <img :src="link" alt="link" />
                <p class="link-text">Https://meet.google.com/abc-defg-hij</p>
                <p class="join-now">
                  join now
                  <img :src="live" alt="live" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
