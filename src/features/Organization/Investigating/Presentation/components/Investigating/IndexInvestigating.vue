<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ShowMoreIcon from '@/shared/icons/ShowMoreIcon.vue'
import ViewIcon from '@/shared/icons/ViewIcon.vue'
import Image from 'primevue/image'

import IndexFilter from './InvestigatingUtils/IndexFilter.vue'
import FilterDialog from './InvestigatingUtils/FilterDialog.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import InvestigatingSidebar from './InvestigatingSidebar.vue'

const InvestigatingData = [
  {
    title: 'Incedant',
    serial:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry printing and',
    date: '2025-01-05 10:00 AM',
    observer: { name: 'Ahmed Ali' },
    description: 'Oil leakage detected near the main engine.',
    zoon: { title: 'Zone A' },
    equipment: { title: 'Excavator CAT 320' },
    status: { title: 'unsolve' },
    image: 'https://picsum.photos/220/150',
  },
  {
    title: 'High observation',
    serial: 'Another dummy text for testing card 2',
    date: '2025-02-10 11:30 AM',
    observer: { name: 'Sara Mohamed' },
    description: 'Hydraulic failure detected.',
    zoon: { title: 'Zone B' },
    equipment: { title: 'Bulldozer CAT D6' },
    status: { title: 'in_progress' },
    image: 'https://picsum.photos/221/150',
  },
  {
    title: 'Medium observation',
    serial: 'Third card dummy text',
    date: '2025-03-15 09:45 AM',
    observer: { name: 'Khaled Samir' },
    description: 'Electrical issue near main control panel.',
    zoon: { title: 'Zone C' },
    equipment: { title: 'Crane Liebherr' },
    status: { title: 'solved' },
    image: 'https://picsum.photos/222/150',
  },
]

const InvestigatingList = ref(InvestigatingData)

const ShowDetails = ref<boolean[]>([])

onMounted(() => {
  ShowDetails.value = InvestigatingList.value.map(() => false)
})
</script>

<template>
  <div class="grid grid-cols-12 gap-4 index-investigating">
    <!-- Sidebar -->
    <InvestigatingSidebar />

    <!-- Main content (Cards) -->
    <div class="col-span-9">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <IndexFilter :filters="Filters" />
        <div class="btns-filter">
          <FilterDialog />
          <router-link :to="`/organization/investigating/add`">
            <button class="btn btn-primary">Create Investigating</button>
          </router-link>
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
                      <p
                        class="first-label-item-primary"
                        :class="{
                          'high-observation': item.title === 'High observation',
                          'medium-observation': item.title === 'Medium observation',
                        }"
                      >
                        {{ item.title }} <span>_OBS-2025-0112</span>
                      </p>
                      <p class="new">New</p>
                    </div>
                    <div class="first-card-details">
                      <p class="label-item-secondary">
                        Date & Time: <span>{{ item.date }}</span>
                      </p>
                      <p class="title">
                        {{ item.observer.name }}
                        <span>(observer)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- second container -->
              <div class="header-container">
                <div class="card-content">
                  <div class="card-header">
                    <p class="label-item-secondary">{{ item.serial }}</p>
                  </div>

                  <div class="card-details">
                    <div class="project-details">
                      <p class="label-item-primary">
                        Zone: <span>{{ item.zoon.title }}</span>
                      </p>
                      <p class="label-item-primary">
                        Machine: <span>{{ item.equipment.title }}</span>
                      </p>
                      <p class="label-item-primary">
                        Status: <span>{{ item.status.title }}</span>
                      </p>
                    </div>
                  </div>

                  <div class="btns-container">
                    <button class="btn first-btn">
                      <span>{{ $t('show details') }}</span>
                    </button>

                    <button class="btn second-btn">
                      <span>{{ $t('assign investigation team') }}</span>
                    </button>
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
