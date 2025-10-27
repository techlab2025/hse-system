<script setup lang="ts">
import EquipmentSection from './Equipment/EquipmentSection.vue';
import LocationsTeamsSection from './LocationsTeams/LocationsTeamsSection.vue';
import MainObjectivesSection from './Objectives/MainObjectivesSection.vue';
import ProjectSiteSection from './ProjectSite/ProjectSiteSection.vue';

</script>
<template>
  <div class="project-details-section">
    <MainObjectivesSection />
    <ProjectSiteSection />
    <LocationsTeamsSection />
    <EquipmentSection />
  </div>
</template>
