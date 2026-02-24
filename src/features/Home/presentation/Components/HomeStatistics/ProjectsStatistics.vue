<script setup lang="ts">
import AllProjects from '@/assets/images/AllProjects.png'
import ProjectStatisticsCard from './HomeStatisticsCards/ProjectStatisticsCard.vue';
import type ProjectStatisticsModel from '@/features/Home/data/Model/ProjectStatisticsModel';
import ProjectCard from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectCard.vue';
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel';
import ProjectCardSkelaton from '@/features/Organization/Project/Presentation/components/ProjectUtils/ProjectCardSkelaton.vue';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'

const props = defineProps<{
  projectStatistics: ProjectModel[]
}>()


</script>
<template>


  <div class="project-statistics">
    <div class="header">

      <div class="header-container">
        <img class="header-img" :src="AllProjects" alt="all-projects">
        <div class="title-content">
          <div class="content-info">
            <span class="title">{{ $t('all_projects') }}</span>
            <span class="count">{{ $t('total') }} : <span class="counter">{{ projectStatistics?.length
                }}</span></span>
          </div>
          <span class="description">{{ $t('In short, project progress and task statuses') }}</span>
        </div>
      </div>
      <!-- <div class="actions">
        <button class="btn btn-primary">all</button>
        <button class="btn btn-secondary">active</button>
        <button class="btn btn-secondary">holded</button>
      </div> -->
    </div>

    <!-- <div class="statistics-content">
      <ProjectStatisticsCard v-for="(project, index) in projectStatistics?.Projects" :key="index"
        :projectStatisticsCard="project" />
    </div> -->
    <div class="modern-table-responsive statistics-content mt-2 ">
      <ProjectCard v-for="item in projectStatistics" :key="item.id" :data="item" />
    </div>
  </div>

</template>
