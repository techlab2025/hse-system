<script setup lang="ts">

interface Item {
  title: string;
  addRoute: string;
  image: string;
  indexRoute: string;
  description: string;
}
const { item } = defineProps<{
  item: Item
}>()
</script>


<template>
  <div class="card">
    <div class="card-header">
      <div class="info">
        <div class="image">
          <img :src="item.image" alt="">

        </div>
        <h4 class="card-header-title">{{ item.title }}</h4>


      </div>

      <RouterLink :to="item.addRoute" class="card-header-item">
        <span>{{ $t('add') }}</span>
<!--        <p>120</p>-->
      </RouterLink>
    </div>
    <div class="card-body">
      <p class="description">{{ item.description }}</p>
      <RouterLink :to="item.indexRoute" class="link">
        <span>{{ $t('show_all') }}</span>
      </RouterLink>
    </div>
  </div>
</template>
