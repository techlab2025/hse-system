<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import tasks from '@/assets/images/tasks.png'
import FactorInvestigating from '../FactorInvestigating.vue'
</script>
<template>
  <div class="cause-of-accidant">

    <HeaderPage
      :title="`tasks`"
      :subtitle="` Add the tasks is measures that will be taken to prevent a recurrence of this incident.`"
      :img="tasks"
      class="title-header"
    />


  </div>
</template>
