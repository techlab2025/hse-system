<script lang="ts" setup>
import booksImage from '@/assets/images/books.png'
</script>

<template>
  <!-- Sidebar -->
  <div class="col-span-3">
    <div class="sidebar-container">
      <div class="sidebar-card">
        <div class="sidebar-card-header">
          <div class="sidebar-header">
            <p class="sidebar-label-item-primary">Investigation Meeting</p>
            <img :src="booksImage" alt="books" class="sidebar-img" />
          </div>
          <div class="sidebar-card-details">
            <ul class="sidebar-list">
              <li>High observation <span>(5)</span></li>
              <li>Medium observation <span>(6)</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
