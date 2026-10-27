<script lang="ts" setup>
import NumberOfProjectInfo from '@/shared/icons/NumberOfProjectInfo.vue'

const props = defineProps<{ numberOfProjects: number }>()
</script>
<template>
  <div class="number-of-projects-container">
    <div class="number-of-projects-header">
      <span class="subtitle">{{ $t('Business') }}</span>
      <h2 class="title">{{ $t('Number of Projects') }}</h2>
    </div>
    <div class="number-of-projects-body">
      <span class="number">{{ props.numberOfProjects }}</span>
      <span class="label">{{ $t('projects') }}</span>
    </div>
    <div class="number-of-projects-footer">
      <NumberOfProjectInfo />
      <span class="footer-label">{{
        $t('This is the number of accidents since the beginning of the organization')
      }}</span>
    </div>
  </div>
</template>
