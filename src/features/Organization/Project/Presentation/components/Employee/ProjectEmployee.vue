<script setup lang="ts">
import { useRoute } from 'vue-router'
import PagesHeader from '../../../../../../shared/HelpersComponents/PagesHeader.vue'
import ProjectEmployeeSection from './ProjectEmployeeSection.vue'

const route = useRoute()
</script>
<template>
  <main class="project-people-page">
    <!-- <PagesHeader
      :title="$t('Teams by Operational location')"
      :subtitle="$t('View all working teams assigned to each operational zone')"
    /> -->
    <ProjectEmployeeSection />

    <div class="page-footer">
      <router-link
        class="back-btn"
        :to="`/organization/project-details/${route.params.project_id}`"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        {{ $t('Back to details') }}
      </router-link>
    </div>
  </main>
</template>

<style scoped lang="scss">
.project-people-page {
  width: 100%;
  padding-bottom: 20px;
}

.page-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--surface-1);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 28%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  color: var(--PrimaryColor);
  font-weight: 800;
  text-decoration: none;
  transition: 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-2px);
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
}

.back-btn svg {
  width: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

:global([dir='rtl']) .back-btn svg {
  transform: rotate(180deg);
}

@media (max-width: 540px) {
  .page-footer,
  .back-btn {
    width: 100%;
  }
}
</style>
