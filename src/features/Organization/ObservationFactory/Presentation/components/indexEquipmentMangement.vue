<script setup lang="ts">
</script>
<template>
  <div class="equipment-sidebar grid-cols">
    <ul>
      <router-link to="/organization/equipment/observation">
        <li>Observations</li>
      </router-link>
      <router-link to="/organization/equipment/hazard">
        <li>Hazard</li>
      </router-link>
      <router-link to="/organization/equipment/incident">
        <li>Incident</li>
      </router-link>
      <router-link to="/organization/equipment/inspection">
        <li>Inspection</li>
      </router-link>
    </ul>
  </div>
</template>
