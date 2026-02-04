<script lang="ts" setup>
import LikeIcon from '@/shared/icons/LikeIcon.vue';
import AvtiveTimeLineIcon from '@/shared/icons/AvtiveTimeLineIcon.vue';
import { ref, watch } from 'vue';
import type ProjectProgressItemModel from '../../Data/models/ProjectProgressItemModel';

const emit = defineEmits(['update:ActiveItem'])
const props = defineProps<{
  sidebarItems: ProjectProgressItemModel[]
}>()

const ActiveItem = ref(props.sidebarItems.find((el) => !el.progress)?.id)

watch(() => ActiveItem.value, (newVal) => {
  emit("update:ActiveItem", newVal)
}, { immediate: true })
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>
<template>
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <div class="timeline-line"></div>
      <div class="timeline-item" :style="{ animationDelay: `${0 * 0.15}s` }">
        <div class="timeline-marker">
          <div class="timeline-dot">
            <div class="timeline-dot-inner"></div>
            <div class="timeline-pulse"></div>
          </div>

          <div class="timeline-icon">
            <LikeIcon />
          </div>
        </div>
        <div class="timeline-content">
          <p class="first-item-title">{{ $t('organization_setup') }}</p>
          <p class="first-item-description">to personalize reports, compliance settings, and system behavior</p>
        </div>

      </div>
      <div class="timeline-item" v-for="(item, index) in sidebarItems" :key="index"
        :class="{ active: ActiveItem == item?.id || item.progress }" :style="{ animationDelay: `${index * 0.15}s` }"
        @click="ActiveItem = item?.id; scrollToTop()">
        <div class="timeline-marker" v-if="ActiveItem != item?.id && !item.progress">
          <div class="timeline-dot">
            <div class="timeline-dot-inner"></div>
            <div class="timeline-pulse"></div>
          </div>

          <div class="timeline-icon">
          </div>
        </div>
        <div class="timeline-marker" v-else>
          <AvtiveTimeLineIcon />
        </div>
        <div class="timeline-content">
          <p class="time-line-title"> {{ item.title }}</p>
        </div>

      </div>
    </div>
  </div>
</template>
