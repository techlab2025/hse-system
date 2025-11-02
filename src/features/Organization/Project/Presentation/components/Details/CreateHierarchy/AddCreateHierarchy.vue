<script setup lang="ts">
import LocationColor from '@/shared/icons/locationColor.vue'
import Breadcrumbs from '../DetailsHeader/Breadcrumbs.vue'
import HeaderPage from '../DetailsHeader/HeaderPage.vue'
import CreateHierarchyForm from './CreateHierarchyForm.vue'
</script>

<template>
  <div class="add-hierarchy">
    <Breadcrumbs />

    <HeaderPage
      :title="'add your hierarchy'"
      :subtitle="'select your hierarchy for each location from your main hierarchy'"
      :number="1"
    />
    <div class="hierarchy-form" v-for="i in 3" :key="i">
      <div class="title">
        <LocationColor />
        <h5>Alexandria</h5>
      </div>
      <CreateHierarchyForm />
    </div>

    <div class="submit-btn">
      <button class="btn btn-cancel">{{ $t('cancel') }}</button>
      <button class="btn btn-ptimary">{{ $t('confirm') }}</button>
    </div>
  </div>
</template>
