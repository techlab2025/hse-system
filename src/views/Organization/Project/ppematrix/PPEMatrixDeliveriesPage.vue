<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PPEMatrixDeliveriesTable from '@/features/Organization/Project/Presentation/components/ppematrix/PPEMatrixDeliveriesTable.vue'

const route = useRoute()
const projectId = computed(() => Number(route.params.id))
</script>

<template>
  <main class="deliveries-page">
    <nav class="deliveries-navigation" aria-label="PPE navigation">
      <RouterLink :to="`/organization/project-details/${projectId}/ppe-matrix`">
        ← Activity and tool matrix
      </RouterLink>
      <RouterLink
        class="primary-link"
        :to="`/organization/project-details/${projectId}/ppe-delivery`"
      >
        Deliver PPE →
      </RouterLink>
    </nav>

    <PPEMatrixDeliveriesTable :project-id="projectId" />
  </main>
</template>

<style scoped>
.deliveries-page {
  display: grid;
  gap: 20px;
  width: 100%;
}

.deliveries-navigation {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.deliveries-navigation a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 17px;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--PrimaryColor);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}

.deliveries-navigation .primary-link {
  border-color: var(--PrimaryColor);
  background: var(--PrimaryColor);
  color: #fff;
}

@media (max-width: 600px) {
  .deliveries-navigation,
  .deliveries-navigation a {
    width: 100%;
  }
}
</style>
