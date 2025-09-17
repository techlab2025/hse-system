 <script setup lang="ts">
import Header from "@/shared/LayoutComponents/Header.vue";
import Sidebar from "@/shared/LayoutComponents/Sidebar.vue";
 </script>

<template>
  <main class="content">
    <Sidebar  />
    <section class="content-wrapper">
      <Header  />
      <div class="main-content">
        <slot></slot>
      </div>
    </section>
  </main>

</template>

<style scoped></style>
