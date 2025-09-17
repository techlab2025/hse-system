 <script setup lang="ts">
import Header from "@/shared/LayoutComponents/Header.vue";
import Sidebar from "@/shared/LayoutComponents/Sidebar.vue";
 </script>

<template>
  <main>
    <Sidebar  />
    <section class="flex flex-col wrapper overflow-hidden	max-w-full">
      <Header  />
      <div class="main-content">
        <slot></slot>
      </div>
    </section>
  </main>

</template>

<style scoped></style>
