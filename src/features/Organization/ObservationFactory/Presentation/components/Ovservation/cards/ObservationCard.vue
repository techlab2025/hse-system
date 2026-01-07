<script setup lang="ts">

interface Item {
  title: string;
  addRoute: string;
  image: string;
  indexRoute: string;
  overdueRoute: string;
  inspectionFormRoute: string;
  dragInspectionRoute: string;
  resultInspectionRoute: string;
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
      </div>
    </div>
    <div class="card-content">
      <h4 class="card-header-title">{{ item.title }}</h4>
      <p class="description">{{ item.description }}</p>
    </div>
    <div class="card-options">
      <RouterLink v-if="item.addRoute" :to="item.addRoute" class="btn btn-secondary">{{ $t('add') }}</RouterLink>
      <RouterLink v-if="item.indexRoute" :to="item.indexRoute" class="btn btn-secondary">{{ $t('show') }}</RouterLink>
      <RouterLink v-if="item.overdueRoute" :to="item.overdueRoute" class="btn btn-secondary">{{ $t('over_due') }}
      </RouterLink>
      <RouterLink v-if="item.inspectionFormRoute" :to="item.inspectionFormRoute" class="btn btn-secondary">{{
        $t('inspection_form') }}
      </RouterLink>
      <RouterLink v-if="item.dragInspectionRoute" :to="item.dragInspectionRoute" class="btn btn-secondary">{{
        $t('drag_inspection') }}
      </RouterLink>
      <RouterLink v-if="item.resultInspectionRoute" :to="item.resultInspectionRoute" class="btn btn-secondary">{{
        $t('inspections_results') }}
      </RouterLink>
    </div>
  </div>
</template>
<!-- <RouterLink :to="item.addRoute" class="card-header-item">
        <span>{{ $t('add') }}</span>
      </RouterLink> --> <!-- <RouterLink :to="item.indexRoute" class="link">
        <span>{{ $t('show_all') }}</span>
      </RouterLink> -->
<!-- </div> -->
<!-- <div class="card-body"> -->
