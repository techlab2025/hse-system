<script setup lang="ts">
import EmptyData from "@/assets/images/EmptyData.png"
</script>
<template>
  <div class="data-empty">
    <div class="data-empty-background">
    </div>
    <div class="data-empty-content">
      <div class="data-empty-content-text">
        <h2 class="oops-message">opps ! ...the page you are looking for is not found</h2>
      </div>
      <div class="data-not-found-image-container">
        <img class="data-empty-image" :src="EmptyData" alt="empty-data">
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-empty {
  height: 100vh;

  .data-empty-content {
    display: flex;
    flex-direction: column;
    align-items: center !important;
    justify-content: center;

    .oops-message {
      text-align: center;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .data-not-found-image-container {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
