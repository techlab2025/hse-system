<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import ProjectCard from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectCard.vue'
import ProjectIcon from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectIcon.vue'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'

defineProps<{
  projectStatistics: ProjectModel[]
  totalNumOfProjects?: number
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
  <section class="hse-identity hse-home-projects" :aria-label="$t('all_projects')">
    <div class="hse-home-projects__heading">
      <div class="hse-home-projects__intro">
        <span class="hse-home-projects__icon"><ProjectIcon name="folder" /></span>
        <div>
          <div class="hse-home-projects__title-row">
            <h2>{{ $t('all_projects') }}</h2>
            <span class="hse-home-projects__count">
              {{ $t('total') }} · {{ totalNumOfProjects ?? projectStatistics?.length ?? 0 }}
            </span>
          </div>
          <p>{{ $t('In short, project progress and task statuses') }}</p>
        </div>
      </div>
      <div v-if="projectStatistics?.length" class="hse-home-projects__navigation">
        <button
          type="button"
          :aria-label="$t('previous')"
          :disabled="atStart"
          @click="carousel?.slidePrev()"
        >
          <ProjectIcon name="arrow-right" class="previous-arrow" />
        </button>
        <button
          type="button"
          :aria-label="$t('next')"
          :disabled="atEnd"
          @click="carousel?.slideNext()"
        >
          <ProjectIcon name="arrow-right" />
        </button>
      </div>
    </div>

    <Swiper
      v-if="projectStatistics?.length"
      :key="locale"
      class="hse-home-projects__swiper"
      :dir="locale.startsWith('ar') ? 'rtl' : 'ltr'"
      :modules="[A11y, Keyboard]"
      :keyboard="{ enabled: true, onlyInViewport: true }"
      :slides-per-view="1"
      :space-between="18"
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
      <SwiperSlide v-for="item in projectStatistics" :key="item.id" v-slot="{ isVisible }">
        <div class="hse-home-projects__slide" :inert="!isVisible || undefined">
          <ProjectCard studio class="hse-identity" :data="item" />
        </div>
      </SwiperSlide>
    </Swiper>
    <p v-else class="hse-home-projects__empty">{{ $t('No data available') }}</p>
  </section>
</template>

<style scoped>
.hse-home-projects {
  min-width: 0;
  padding: 24px;
  background: var(--hse-project-surface);
  color: var(--hse-project-ink);
}
.hse-home-projects__heading,
.hse-home-projects__intro,
.hse-home-projects__title-row,
.hse-home-projects__navigation {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hse-home-projects__heading {
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--hse-project-line-soft);
}
.hse-home-projects__intro {
  min-width: 0;
}
.hse-home-projects__title-row {
  flex-wrap: wrap;
  gap: 8px;
}
.hse-home-projects__icon {
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  height: 42px;
  border: 1px solid var(--hse-project-line);
  border-radius: 12px;
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
}
.hse-home-projects h2 {
  margin: 0;
  font: 700 20px/1.3 var(--hse-project-font);
}
.hse-home-projects__intro p {
  margin: 6px 0 0;
  color: var(--hse-project-muted);
  font: 400 12px/1.5 var(--hse-project-font);
}
.hse-home-projects__count {
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
  font: 600 11px/1.5 var(--hse-project-font);
}
.hse-home-projects__navigation {
  gap: 6px;
  margin-inline-start: auto;
}
.hse-home-projects__navigation button {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--hse-project-line);
  border-radius: var(--hse-control-radius);
  background: var(--hse-project-surface);
  color: var(--hse-project-ink);
  cursor: pointer;
}
.hse-home-projects__navigation button:hover:not(:disabled) {
  background: var(--hse-project-ice);
  color: var(--hse-project-blue);
  border-color: var(--hse-project-blue);
}
.hse-home-projects__navigation button:disabled {
  opacity: 0.4;
  cursor: default;
}
.hse-home-projects__navigation .previous-arrow {
  transform: rotate(180deg);
}
.hse-home-projects__navigation:dir(rtl) svg {
  transform: rotate(180deg);
}
.hse-home-projects__navigation:dir(rtl) .previous-arrow {
  transform: none;
}
.hse-home-projects__swiper {
  width: 100%;
  min-width: 0;
  padding: 4px 0 16px;
  transform: none !important;
}
.hse-home-projects__swiper :deep(.swiper-slide) {
  height: auto;
}
.hse-home-projects__slide {
  height: 100%;
}
.hse-home-projects__slide :deep(.hse-project-card) {
  height: 100%;
  --hse-project-font: var(--hse-control-font);
}
.hse-home-projects__empty {
  padding: 32px 12px;
  text-align: center;
  color: var(--hse-project-muted);
}
@media (max-width: 600px) {
  .hse-home-projects {
    padding: 16px;
  }
  .hse-home-projects h2 {
    font-size: 18px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hse-home-projects__swiper :deep(.swiper-wrapper) {
    transition-duration: 0ms !important;
  }
}
</style>
