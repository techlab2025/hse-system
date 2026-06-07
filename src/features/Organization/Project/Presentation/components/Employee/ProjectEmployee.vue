<script setup lang="ts">
import { useRoute } from 'vue-router'
import PagesHeader from '../../../../../../shared/HelpersComponents/PagesHeader.vue'
import ProjectEmployeeSection from './ProjectEmployeeSection.vue'

const route = useRoute()
</script>
<template>
  <PagesHeader
    :title="$t('Teams by Operational location')"
    :subtitle="$t('View all working teams assigned to each operational zone')"
  />
  <ProjectEmployeeSection />
  <router-link
    class="back-btn btn btn-primary"
    :to="`/organization/project-details/${route.params.project_id}`"
  >
    {{ $t('Back to details') }}
  </router-link>
</template>

<style scoped>
.back-btn {
}
</style>
