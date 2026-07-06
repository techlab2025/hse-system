<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

const props = withDefaults(
  defineProps<{
    cols?: number
    rows?: number
  }>(),
  {
    cols: 3,
    rows: 10,
  },
)

const sections = [
  'General Identification',
  'Investigation Team Setup',
  'Events Timeline Builder',
  'Health Impact Integration',
  'Witness Management',
  'Immediate Action Evaluation',
  'Root Cause Analysis',
  'Action Plan',
  'Lessons Learned',
  'Similar incident Retrieval',
  'Attachments',
  'Another Meeting',
]
</script>

<template>
  <div class="investigation-skeleton" aria-hidden="true">
    <article v-for="(section, index) in sections" :key="section" class="skeleton-panel">
      <div class="panel-header">
        <Skeleton shape="circle" size="2.4rem" />
        <Skeleton height="1rem" :width="index === 7 ? '18rem' : '13rem'" />
      </div>

      <div v-if="index === 0" class="panel-body identification-grid">
        <div v-for="item in props.rows" :key="item" class="field-skeleton">
          <Skeleton height="0.65rem" width="35%" />
          <Skeleton height="2.65rem" />
        </div>
      </div>

      <div v-else-if="index === 1" class="panel-body team-layout">
        <div class="info-lines">
          <Skeleton v-for="item in 4" :key="item" height="0.9rem" :width="`${88 - item * 9}%`" />
        </div>
        <div class="team-members">
          <div v-for="item in props.cols" :key="item" class="member-row">
            <Skeleton shape="circle" size="3rem" />
            <div>
              <Skeleton height="0.9rem" width="8rem" />
              <Skeleton height="0.7rem" width="5rem" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="index === 2" class="panel-body timeline-layout">
        <div class="summary-block">
          <Skeleton height="0.75rem" width="9rem" />
          <Skeleton height="0.9rem" width="78%" />
        </div>
        <div v-for="item in 2" :key="item" class="timeline-row">
          <Skeleton shape="circle" size="2.3rem" />
          <div class="timeline-card">
            <Skeleton height="0.75rem" width="5rem" />
            <Skeleton height="1rem" width="9rem" />
            <div class="two-fields">
              <Skeleton height="3rem" />
              <Skeleton height="3rem" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="[3, 4, 7, 9].includes(index)" class="panel-body card-grid">
        <div v-for="item in props.cols" :key="item" class="mini-card">
          <Skeleton height="1.4rem" width="38%" />
          <Skeleton height="0.85rem" width="84%" />
          <Skeleton height="0.85rem" width="64%" />
        </div>
      </div>

      <div v-else-if="[5, 6, 8].includes(index)" class="panel-body form-layout">
        <div v-for="item in props.cols + 1" :key="item" class="field-skeleton">
          <Skeleton height="0.65rem" width="32%" />
          <Skeleton :height="index === 8 ? '6.5rem' : '3rem'" />
        </div>
      </div>

      <div v-else-if="index === 10" class="panel-body attachment-layout">
        <Skeleton height="3rem" width="100%" />
        <div class="attachment-previews">
          <Skeleton v-for="item in props.cols" :key="item" height="5rem" />
        </div>
      </div>

      <div v-else class="panel-body final-actions">
        <Skeleton height="3rem" width="100%" />
        <div class="action-buttons">
          <Skeleton height="2.75rem" />
          <Skeleton height="2.75rem" />
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.investigation-skeleton {
  display: grid;
  width: 100%;
  gap: 0.85rem;
}

.skeleton-panel {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--Black) 7%, transparent);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border-bottom: 1px solid var(--main-border);
  padding: 1rem 1.15rem;
}

.panel-body {
  padding: 1rem 1.15rem 1.2rem;
}

.identification-grid,
.form-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.field-skeleton {
  display: grid;
  gap: 0.55rem;
}

.team-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
  gap: 1rem;
}

.info-lines,
.team-members,
.member-row > div,
.timeline-card,
.summary-block,
.mini-card,
.attachment-layout {
  display: grid;
  gap: 0.7rem;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.timeline-layout {
  display: grid;
  gap: 1rem;
}

.summary-block,
.timeline-card,
.mini-card {
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 10%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 3%, white);
  padding: 1rem;
}

.timeline-row {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0.9rem;
  align-items: flex-start;
}

.two-fields,
.attachment-previews,
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.final-actions {
  display: grid;
  gap: 1rem;
}

@media (max-width: 992px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .team-layout,
  .identification-grid,
  .form-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .panel-header {
    padding: 0.9rem;
  }

  .panel-body {
    padding: 0.9rem;
  }

  .card-grid,
  .two-fields,
  .attachment-previews,
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
