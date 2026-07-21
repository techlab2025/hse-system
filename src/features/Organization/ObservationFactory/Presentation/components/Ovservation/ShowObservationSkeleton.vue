<template>
  <div class="show-observation-skeleton" aria-busy="true" aria-label="Loading observation details">
    <div class="skeleton-alert">
      <span class="skeleton-block alert-icon"></span>
      <span class="skeleton-block alert-copy"></span>
    </div>

    <section class="skeleton-card skeleton-summary-card">
      <header class="skeleton-card-header">
        <div class="skeleton-heading">
          <span class="skeleton-block heading-mark"></span>
          <div>
            <span class="skeleton-block eyebrow-line"></span>
            <span class="skeleton-block title-line"></span>
          </div>
        </div>
        <span class="skeleton-block status-pill"></span>
      </header>

      <div class="skeleton-card-content">
        <div class="skeleton-description">
          <span class="skeleton-block copy-line copy-line-wide"></span>
          <span class="skeleton-block copy-line"></span>
        </div>

        <div class="skeleton-meta-grid">
          <div v-for="item in 5" :key="item" class="skeleton-meta-item">
            <span class="skeleton-block meta-icon"></span>
            <div>
              <span class="skeleton-block meta-label"></span>
              <span class="skeleton-block meta-value"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="skeleton-card skeleton-general-card">
      <div class="skeleton-section-heading">
        <span class="skeleton-block section-icon"></span>
        <div>
          <span class="skeleton-block section-title"></span>
          <span class="skeleton-block section-subtitle"></span>
        </div>
      </div>

      <div class="skeleton-general-grid">
        <div class="skeleton-metrics">
          <div v-for="item in 3" :key="item" class="skeleton-metric-card">
            <span class="skeleton-block metric-label"></span>
            <span class="skeleton-block metric-value"></span>
          </div>
          <div class="skeleton-action-panel">
            <span class="skeleton-block action-icon"></span>
            <div>
              <span class="skeleton-block action-title"></span>
              <span class="skeleton-block action-copy"></span>
              <span class="skeleton-block action-copy action-copy-short"></span>
            </div>
          </div>
        </div>

        <div class="skeleton-media-panel">
          <span class="skeleton-block media-label"></span>
          <span class="skeleton-block media-preview"></span>
          <div class="media-thumbnails">
            <span v-for="item in 3" :key="item" class="skeleton-block media-thumbnail"></span>
          </div>
        </div>
      </div>
    </section>

    <section class="skeleton-card skeleton-details-card">
      <div class="skeleton-section-heading">
        <span class="skeleton-block section-icon"></span>
        <div>
          <span class="skeleton-block section-title section-title-long"></span>
          <span class="skeleton-block section-subtitle"></span>
        </div>
      </div>

      <div class="skeleton-detail-rows">
        <div v-for="item in 3" :key="item" class="skeleton-detail-row">
          <span class="skeleton-block row-number"></span>
          <div>
            <span class="skeleton-block row-title"></span>
            <span class="skeleton-block row-copy"></span>
          </div>
          <span class="skeleton-block row-status"></span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.show-observation-skeleton {
  --skeleton-base: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-2));
  --skeleton-highlight: color-mix(in srgb, white 58%, var(--surface-1));
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.skeleton-block {
  display: block;
  overflow: hidden;
  border-radius: 8px;
  background: var(--skeleton-base);
  position: relative;
}

.skeleton-block::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    transparent 20%,
    var(--skeleton-highlight) 48%,
    transparent 76%
  );
  transform: translateX(-110%);
  animation: observation-skeleton-shimmer 1.55s ease-in-out infinite;
}

.skeleton-alert {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 54px;
  padding: 11px 15px;
  border: 1px solid color-mix(in srgb, var(--status-danger) 16%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--status-danger) 5%, var(--surface-1));
}

.alert-icon {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  border-radius: 9px;
}

.alert-copy {
  width: min(360px, 70%);
  height: 12px;
}

.skeleton-card {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.skeleton-card-header,
.skeleton-section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--main-border);
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
}

.skeleton-card-header {
  justify-content: space-between;
}

.skeleton-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}

.skeleton-heading > div,
.skeleton-section-heading > div,
.skeleton-meta-item > div,
.skeleton-action-panel > div,
.skeleton-detail-row > div {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 7px;
}

.heading-mark {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 15px;
}

.eyebrow-line {
  width: 82px;
  height: 8px;
}

.title-line {
  width: min(340px, 55vw);
  height: 17px;
}

.status-pill {
  width: 96px;
  height: 30px;
  border-radius: 999px;
}

.skeleton-card-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
}

.skeleton-description {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copy-line {
  width: 67%;
  height: 10px;
}

.copy-line-wide {
  width: 88%;
}

.skeleton-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.skeleton-meta-item {
  display: flex;
  align-items: center;
  min-height: 68px;
  gap: 10px;
  padding: 11px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 62%, transparent);
}

.meta-icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 11px;
}

.meta-label {
  width: 46%;
  height: 7px;
}

.meta-value {
  width: 78%;
  height: 11px;
}

.section-icon {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 13px;
}

.section-title {
  width: 150px;
  height: 13px;
}

.section-title-long {
  width: 215px;
}

.section-subtitle {
  width: min(310px, 48vw);
  height: 8px;
}

.skeleton-general-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  gap: 16px;
  padding: 18px 20px 20px;
}

.skeleton-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: start;
  gap: 10px;
}

.skeleton-metric-card {
  display: flex;
  min-height: 84px;
  flex-direction: column;
  gap: 11px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 62%, transparent);
}

.metric-label {
  width: 58%;
  height: 8px;
}

.metric-value {
  width: 74%;
  height: 14px;
}

.skeleton-action-panel {
  display: flex;
  grid-column: 1 / -1;
  min-height: 96px;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
}

.action-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 12px;
}

.action-title {
  width: 130px;
  height: 10px;
}

.action-copy {
  width: 88%;
  height: 8px;
}

.action-copy-short {
  width: 61%;
}

.skeleton-media-panel {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 64%, transparent);
}

.media-label {
  width: 70px;
  height: 8px;
}

.media-preview {
  width: 100%;
  min-height: 145px;
  flex: 1;
  border-radius: 12px;
}

.media-thumbnails {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
}

.media-thumbnail {
  height: 38px;
  border-radius: 8px;
}

.skeleton-detail-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 20px 20px;
}

.skeleton-detail-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 11px 12px;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: color-mix(in srgb, var(--surface-2) 58%, transparent);
}

.row-number {
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.row-title {
  width: 42%;
  height: 10px;
}

.row-copy {
  width: 76%;
  height: 8px;
}

.row-status {
  width: 76px;
  height: 28px;
  border-radius: 999px;
}

@keyframes observation-skeleton-shimmer {
  to {
    transform: translateX(110%);
  }
}

@media (max-width: 820px) {
  .skeleton-meta-grid,
  .skeleton-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .skeleton-general-grid {
    grid-template-columns: 1fr;
  }

  .skeleton-media-panel {
    min-height: 210px;
  }
}

@media (max-width: 540px) {
  .skeleton-alert {
    display: none;
  }

  .skeleton-card {
    border-radius: 17px;
  }

  .skeleton-card-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .skeleton-meta-grid,
  .skeleton-metrics {
    grid-template-columns: 1fr;
  }

  .skeleton-action-panel {
    grid-column: auto;
  }

  .skeleton-detail-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .row-status {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-block::after {
    animation: none;
  }
}
</style>
