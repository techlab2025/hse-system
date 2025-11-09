<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isDragging = ref(false);
const startY = ref(0);
const currentY = ref(0);
const translateY = ref(0);
const expanded = ref(false);
const barRef = ref<HTMLElement | null>(null);

const maxSlide = 400;
const minSlide = 0;

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  startY.value = "touches" in e ? e.touches[0].clientY : e.clientY;
};

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  currentY.value = clientY - startY.value;

  let newTranslate = expanded.value
    ? maxSlide + currentY.value
    : currentY.value;

  newTranslate = Math.max(minSlide, Math.min(newTranslate, maxSlide));
  translateY.value = newTranslate;
};

const stopDrag = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  if (translateY.value > maxSlide / 2) {
    expanded.value = true;
    translateY.value = maxSlide;
  } else {
    expanded.value = false;
    translateY.value = minSlide;
  }

};

onMounted(() => {
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("touchend", stopDrag);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("touchend", stopDrag);
});


</script>

<template>
  <div class="page-overlay" v-if="expanded" @mousedown="startDrag" @touchstart="startDrag"></div>
  <div ref="barRef" class="notification-bar" :class="{ dragging: isDragging, expanded: expanded }"
    :style="{ transform: `translate(-50%,-${maxSlide - translateY}px)` }" @mousedown="startDrag"
    @touchstart="startDrag">

    <div class="grab-area"></div>
    <div class="bar-content">
      The new notification system is now live! Check it out!
    </div>
  </div>
</template>
