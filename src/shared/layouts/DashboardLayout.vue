 <script setup lang="ts">
import Header from "@/shared/LayoutComponents/Header.vue";
import Sidebar from "@/shared/LayoutComponents/Sidebar.vue";
import { ref } from "vue";

const open = ref<boolean>(true);

const openSideBar = () => {
  open.value = !open.value;
};
</script>

<template>
  <Sidebar :open="open" @close="openSideBar" />
  <div class="flex flex-col wrapper overflow-hidden	max-w-full">
    <Header @open="openSideBar" :open="open" />
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
