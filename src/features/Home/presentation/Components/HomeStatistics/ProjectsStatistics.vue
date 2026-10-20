<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import DashboardProjectCard from '../Dashboard/DashboardProjectCard.vue'
import DashboardPanel from '../Dashboard/DashboardPanel.vue'
import DashboardIcon from '../Dashboard/DashboardIcon.vue'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'

defineProps<{
  projectStatistics: ProjectModel[]
  totalNumOfProjects?: number
  state?: DataState<unknown>
}>()
const { locale } = useI18n()
const carousel = shallowRef<SwiperInstance>()
const atStart = ref(true)
const atEnd = ref(true)
const syncNavigation = (swiper: SwiperInstance) => {
  carousel.value = swiper
  atStart.value = swiper.isBeginning || swiper.isLocked
  atEnd.value = swiper.isEnd || swiper.isLocked
}
</script>

<template>
  <DashboardPanel
    :title="$t('Project portfolio')"
    :eyebrow="$t('From plan to progress')"
    :description="$t('A closer look at the work across your projects.')"
    icon="folder"
    :state="state"
    class="dashboard-portfolio"
  >
    <template #action
      ><router-link to="/organization/projects" class="dashboard-text-link"
        >{{ $t('View all projects') }}<DashboardIcon name="arrow" /></router-link
    ></template>
    <div class="dashboard-portfolio__summary">
      <span
        >{{ $t('total') }} <strong>{{ totalNumOfProjects ?? projectStatistics.length }}</strong>
        {{ $t('projects') }}</span
      ><small>{{ $t('Showing loaded projects', { count: projectStatistics.length }) }}</small>
      <div v-if="projectStatistics.length" class="dashboard-carousel-controls">
        <button
          type="button"
          :aria-label="$t('previous')"
          :disabled="atStart"
          @click="carousel?.slidePrev()"
        >
          <DashboardIcon name="arrow" class="previous-arrow" /></button
        ><button
          type="button"
          :aria-label="$t('next')"
          :disabled="atEnd"
          @click="carousel?.slideNext()"
        >
          <DashboardIcon name="arrow" />
        </button>
      </div>
    </div>
    <Swiper
      v-if="projectStatistics.length"
      :key="locale"
      class="dashboard-project-swiper"
      :dir="locale.startsWith('ar') ? 'rtl' : 'ltr'"
      :modules="[A11y, Keyboard]"
      :keyboard="{ enabled: true, onlyInViewport: true }"
      :slides-per-view="1"
      :space-between="16"
      breakpoints-base="container"
      :breakpoints="{ 640: { slidesPerView: 2 }, 1050: { slidesPerView: 3 } }"
      watch-overflow
      watch-slides-progress
      @swiper="syncNavigation"
      @slide-change="syncNavigation"
      @resize="syncNavigation"
      @breakpoint="syncNavigation"
      @lock="syncNavigation"
      @unlock="syncNavigation"
      @update="syncNavigation"
    >
      <SwiperSlide v-for="item in projectStatistics" :key="item.id" v-slot="{ isVisible }"
        ><div class="dashboard-project-slide" :inert="!isVisible || undefined">
          <DashboardProjectCard :project="item" /></div
      ></SwiperSlide>
    </Swiper>
    <div v-else class="dashboard-empty">
      <DashboardIcon name="folder" /><strong>{{ $t('No projects to display') }}</strong>
      <p>{{ $t('Your project portfolio will appear here.') }}</p>
      <router-link to="/organization/projects" class="dashboard-text-link"
        >{{ $t('View all projects') }}<DashboardIcon name="arrow"
      /></router-link>
    </div>
  </DashboardPanel>
</template>
