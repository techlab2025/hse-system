<script setup lang="ts">
import PagesHeader from '../../../../../../shared/HelpersComponents/PagesHeader.vue';
import ProjectEmployeeSection from './ProjectEmployeeSection.vue';

</script>
<template>
  <PagesHeader :title="$t('Teams by Operational location')"
    :subtitle="$t('View all working teams assigned to each operational zone')" />
  <ProjectEmployeeSection />
</template>
