<script setup lang="ts">
type ProjectSkeletonVariant = 'details' | 'hierarchy' | 'assignment' | 'people'

withDefaults(
  defineProps<{
    variant: ProjectSkeletonVariant
  }>(),
  {
    variant: 'details',
  },
)
</script>

<template>
  <div
    class="project-page-skeleton"
    :class="`is-${variant}`"
    aria-busy="true"
    aria-live="polite"
    role="status"
  >
    <span class="sr-only">{{ $t('Loading') }}</span>

    <template v-if="variant === 'details'">
      <section class="project-header-skeleton skeleton-panel">
        <div class="skeleton-avatar skeleton-shape"></div>
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-sm skeleton-shape"></span>
          <span class="skeleton-line line-title skeleton-shape"></span>
          <span class="skeleton-line line-md skeleton-shape"></span>
        </div>
        <div class="header-metrics">
          <span v-for="item in 3" :key="item" class="metric-skeleton skeleton-shape"></span>
        </div>
      </section>

      <section class="objective-skeleton skeleton-panel">
        <span class="skeleton-icon skeleton-shape"></span>
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-label skeleton-shape"></span>
          <span class="skeleton-line line-wide skeleton-shape"></span>
          <span class="skeleton-line line-medium skeleton-shape"></span>
        </div>
      </section>

      <section class="operations-skeleton skeleton-shell">
        <div class="operations-heading skeleton-panel">
          <span class="skeleton-icon skeleton-shape"></span>
          <div class="skeleton-copy grow">
            <span class="skeleton-line line-sm skeleton-shape"></span>
            <span class="skeleton-line line-title skeleton-shape"></span>
            <span class="skeleton-line line-wide skeleton-shape"></span>
          </div>
        </div>

        <div class="details-section-skeleton" v-for="section in 3" :key="section">
          <header>
            <span class="skeleton-icon skeleton-shape"></span>
            <div class="skeleton-copy grow">
              <span class="skeleton-line line-label skeleton-shape"></span>
              <span class="skeleton-line line-md skeleton-shape"></span>
            </div>
            <span class="skeleton-button skeleton-shape"></span>
          </header>
          <div class="resource-grid">
            <article v-for="card in section === 1 ? 3 : 2" :key="card" class="resource-card">
              <span class="skeleton-card-image skeleton-shape"></span>
              <span class="skeleton-line line-medium skeleton-shape"></span>
              <span class="skeleton-line line-sm skeleton-shape"></span>
            </article>
          </div>
        </div>
      </section>
    </template>

    <template v-else-if="variant === 'hierarchy'">
      <section class="setup-hero skeleton-panel">
        <span class="hero-icon skeleton-shape"></span>
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-label skeleton-shape"></span>
          <span class="skeleton-line line-title skeleton-shape"></span>
          <span class="skeleton-line line-wide skeleton-shape"></span>
        </div>
        <span class="selection-pill skeleton-shape"></span>
      </section>

      <section class="setup-workspace skeleton-panel">
        <header class="workspace-header">
          <span class="skeleton-icon skeleton-shape"></span>
          <div class="skeleton-copy grow">
            <span class="skeleton-line line-sm skeleton-shape"></span>
            <span class="skeleton-line line-md skeleton-shape"></span>
          </div>
          <span class="status-pill skeleton-shape"></span>
        </header>
        <div class="form-guide-skeleton">
          <span class="guide-number skeleton-shape"></span>
          <div class="skeleton-copy grow">
            <span class="skeleton-line line-medium skeleton-shape"></span>
            <span class="skeleton-line line-wide skeleton-shape"></span>
          </div>
        </div>
        <div class="field-skeleton">
          <span class="skeleton-line line-label skeleton-shape"></span>
          <span class="skeleton-input skeleton-shape"></span>
        </div>
      </section>

      <footer class="action-footer skeleton-panel">
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-md skeleton-shape"></span>
          <span class="skeleton-line line-medium skeleton-shape"></span>
        </div>
        <div class="action-list">
          <span v-for="action in 3" :key="action" class="skeleton-button skeleton-shape"></span>
        </div>
      </footer>
    </template>

    <template v-else-if="variant === 'assignment'">
      <section class="setup-hero skeleton-panel">
        <span class="hero-icon skeleton-shape"></span>
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-label skeleton-shape"></span>
          <span class="skeleton-line line-title skeleton-shape"></span>
          <span class="skeleton-line line-wide skeleton-shape"></span>
        </div>
        <div class="assignment-metrics">
          <span class="metric-skeleton skeleton-shape"></span>
          <span class="metric-skeleton skeleton-shape"></span>
        </div>
      </section>

      <section class="assignment-workspace skeleton-panel">
        <header class="workspace-header">
          <span class="skeleton-icon skeleton-shape"></span>
          <div class="skeleton-copy grow">
            <span class="skeleton-line line-sm skeleton-shape"></span>
            <span class="skeleton-line line-md skeleton-shape"></span>
          </div>
          <span class="status-pill skeleton-shape"></span>
        </header>
        <div class="position-grid-skeleton">
          <article v-for="position in 3" :key="position" class="position-card-skeleton">
            <header>
              <span class="position-number skeleton-shape"></span>
              <div class="skeleton-copy grow">
                <span class="skeleton-line line-sm skeleton-shape"></span>
                <span class="skeleton-line line-medium skeleton-shape"></span>
              </div>
            </header>
            <span class="skeleton-line line-label skeleton-shape"></span>
            <span class="skeleton-input skeleton-shape"></span>
          </article>
        </div>
      </section>

      <footer class="action-footer skeleton-panel">
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-md skeleton-shape"></span>
          <span class="skeleton-line line-medium skeleton-shape"></span>
        </div>
        <div class="action-list">
          <span v-for="action in 3" :key="action" class="skeleton-button skeleton-shape"></span>
        </div>
      </footer>
    </template>

    <template v-else>
      <section class="people-overview-skeleton skeleton-panel">
        <div class="skeleton-copy grow">
          <span class="skeleton-line line-label skeleton-shape"></span>
          <span class="skeleton-line line-title skeleton-shape"></span>
          <span class="skeleton-line line-wide skeleton-shape"></span>
        </div>
        <div class="people-metrics">
          <span v-for="metric in 3" :key="metric" class="metric-skeleton skeleton-shape"></span>
        </div>
      </section>

      <article class="location-card-skeleton skeleton-panel" v-for="location in 2" :key="location">
        <header class="location-card-header">
          <span class="position-number skeleton-shape"></span>
          <span class="skeleton-avatar skeleton-shape"></span>
          <div class="skeleton-copy grow">
            <span class="skeleton-line line-md skeleton-shape"></span>
            <span class="skeleton-line line-medium skeleton-shape"></span>
          </div>
          <div class="action-list">
            <span v-for="action in 2" :key="action" class="skeleton-button skeleton-shape"></span>
          </div>
        </header>
        <div class="people-content-grid">
          <section v-for="content in 2" :key="content" class="people-content-block">
            <header>
              <span class="skeleton-icon skeleton-shape"></span>
              <div class="skeleton-copy grow">
                <span class="skeleton-line line-md skeleton-shape"></span>
                <span class="skeleton-line line-sm skeleton-shape"></span>
              </div>
            </header>
            <div class="member-grid">
              <span v-for="member in 3" :key="member" class="member-card skeleton-shape"></span>
            </div>
          </section>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped lang="scss">
.project-page-skeleton {
  --skeleton-base: color-mix(in srgb, var(--text-soft) 10%, var(--surface-2));
  --skeleton-light: color-mix(in srgb, var(--surface-1) 80%, white);
  display: grid;
  width: 100%;
  gap: 18px;
  padding: 12px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.skeleton-shape {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--skeleton-base);
}

.skeleton-shape::after {
  position: absolute;
  inset: 0;
  content: '';
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, var(--skeleton-light), transparent);
  animation: project-skeleton-shimmer 1.45s ease-in-out infinite;
}

.skeleton-panel,
.skeleton-shell {
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
}

.grow {
  min-width: 0;
  flex: 1;
}

.skeleton-copy {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.skeleton-line {
  height: 10px;
  border-radius: 999px;
}

.line-sm {
  width: 88px;
}
.line-label {
  width: 120px;
}
.line-md {
  width: min(210px, 78%);
}
.line-medium {
  width: min(310px, 86%);
}
.line-wide {
  width: min(580px, 94%);
}
.line-title {
  width: min(380px, 82%);
  height: 18px;
}

.skeleton-avatar,
.skeleton-icon,
.hero-icon,
.position-number,
.guide-number {
  flex: 0 0 auto;
  border-radius: 15px;
}

.skeleton-avatar {
  width: 62px;
  height: 62px;
}
.skeleton-icon {
  width: 46px;
  height: 46px;
}
.hero-icon {
  width: 54px;
  height: 54px;
}
.position-number,
.guide-number {
  width: 38px;
  height: 38px;
}

.project-header-skeleton,
.setup-hero,
.people-overview-skeleton {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 112px;
  padding: 20px;
}

.header-metrics,
.people-metrics,
.assignment-metrics,
.action-list {
  display: flex;
  align-items: center;
  gap: 9px;
}

.metric-skeleton {
  width: 104px;
  height: 54px;
  border-radius: 14px;
}

.objective-skeleton,
.operations-heading,
.workspace-header,
.form-guide-skeleton,
.location-card-header,
.people-content-block > header,
.position-card-skeleton > header {
  display: flex;
  align-items: center;
  gap: 13px;
}

.objective-skeleton {
  padding: 18px;
}

.skeleton-shell {
  display: grid;
  gap: 16px;
  padding: 18px;
  background: var(--surface-2);
}

.operations-heading {
  padding: 17px;
}

.details-section-skeleton,
.setup-workspace,
.assignment-workspace,
.location-card-skeleton {
  display: grid;
  gap: 16px;
  padding: 18px;
}

.details-section-skeleton {
  border: 1px solid var(--main-border);
  border-radius: 19px;
  background: var(--surface-1);
}

.details-section-skeleton > header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skeleton-button {
  width: 118px;
  height: 42px;
  border-radius: 12px;
}

.resource-grid,
.position-grid-skeleton,
.member-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.resource-card,
.position-card-skeleton,
.people-content-block {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-2);
}

.skeleton-card-image {
  width: 100%;
  height: 74px;
  border-radius: 12px;
}

.selection-pill,
.status-pill {
  width: 128px;
  height: 42px;
  border-radius: 13px;
}

.form-guide-skeleton {
  padding: 14px;
  border-radius: 16px;
  background: var(--surface-2);
}

.field-skeleton {
  display: grid;
  gap: 9px;
  padding: 8px 2px 14px;
}

.skeleton-input {
  width: 100%;
  height: 48px;
  border-radius: 24px;
}

.action-footer {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 15px;
}

.assignment-workspace {
  gap: 20px;
}
.position-card-skeleton {
  min-height: 162px;
}
.people-overview-skeleton {
  justify-content: space-between;
}

.location-card-header {
  padding-bottom: 15px;
  border-bottom: 1px solid var(--main-border);
}

.people-content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.member-card {
  height: 74px;
  border-radius: 14px;
}

@keyframes project-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shape::after {
    animation: none;
  }
}

@media (max-width: 900px) {
  .project-header-skeleton,
  .setup-hero,
  .people-overview-skeleton,
  .action-footer {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .header-metrics,
  .people-metrics,
  .assignment-metrics,
  .action-list {
    width: 100%;
  }

  .metric-skeleton,
  .skeleton-button {
    flex: 1;
  }
  .people-content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .project-page-skeleton {
    gap: 12px;
    padding: 4px;
  }
  .project-header-skeleton,
  .setup-hero,
  .people-overview-skeleton,
  .details-section-skeleton,
  .setup-workspace,
  .assignment-workspace,
  .location-card-skeleton,
  .skeleton-shell {
    padding: 14px;
    border-radius: 17px;
  }

  .resource-grid,
  .position-grid-skeleton,
  .member-grid {
    grid-template-columns: 1fr;
  }

  .project-header-skeleton .skeleton-copy,
  .setup-hero .skeleton-copy {
    flex-basis: calc(100% - 80px);
  }
  .header-metrics .metric-skeleton {
    min-width: 0;
  }
  .location-card-header .action-list {
    margin-top: 4px;
  }
}
</style>
