<template>
  <main class="result-page-skeleton" aria-busy="true" aria-label="Loading inspection results">
    <section class="result-skeleton-hero">
      <div class="result-skeleton-hero__copy">
        <span class="result-skeleton-block result-skeleton-block--eyebrow"></span>
        <span class="result-skeleton-block result-skeleton-block--hero-title"></span>
        <span class="result-skeleton-block result-skeleton-block--subtitle"></span>

        <div class="result-skeleton-meta">
          <span v-for="item in 3" :key="item" class="result-skeleton-meta__item">
            <i class="result-skeleton-block result-skeleton-block--meta-icon"></i>
            <span class="result-skeleton-meta__copy">
              <i class="result-skeleton-block result-skeleton-block--meta-label"></i>
              <i class="result-skeleton-block result-skeleton-block--meta-value"></i>
            </span>
          </span>
        </div>
      </div>
      <span class="result-skeleton-block result-skeleton-block--illustration"></span>
    </section>

    <section class="result-skeleton-panel">
      <header class="result-skeleton-heading">
        <span>
          <i class="result-skeleton-block result-skeleton-block--section-label"></i>
          <i class="result-skeleton-block result-skeleton-block--section-title"></i>
        </span>
        <i class="result-skeleton-block result-skeleton-block--badge"></i>
      </header>

      <div class="result-skeleton-stats">
        <article v-for="statistic in 5" :key="statistic" class="result-skeleton-stat">
          <i class="result-skeleton-block result-skeleton-block--stat-icon"></i>
          <span>
            <i class="result-skeleton-block result-skeleton-block--stat-value"></i>
            <i class="result-skeleton-block result-skeleton-block--stat-label"></i>
          </span>
        </article>
      </div>
    </section>

    <section class="result-skeleton-panel">
      <header class="result-skeleton-heading">
        <span>
          <i class="result-skeleton-block result-skeleton-block--section-label"></i>
          <i class="result-skeleton-block result-skeleton-block--section-title"></i>
        </span>
        <i class="result-skeleton-block result-skeleton-block--badge"></i>
      </header>

      <div class="result-skeleton-table">
        <div class="result-skeleton-table__header">
          <i v-for="column in 5" :key="column" class="result-skeleton-block"></i>
        </div>
        <div v-for="row in 5" :key="row" class="result-skeleton-table__row">
          <i class="result-skeleton-block result-skeleton-block--serial"></i>
          <span class="result-skeleton-employee">
            <i class="result-skeleton-block result-skeleton-block--avatar"></i>
            <i class="result-skeleton-block result-skeleton-block--employee-name"></i>
          </span>
          <i class="result-skeleton-block result-skeleton-block--cell"></i>
          <i class="result-skeleton-block result-skeleton-block--cell"></i>
          <i class="result-skeleton-block result-skeleton-block--action"></i>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.result-page-skeleton {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 64%, transparent);
  border-radius: 30px;
  background: color-mix(in srgb, var(--surface-1) 96%, var(--brand-primary-50));
}

.result-skeleton-block {
  position: relative;
  overflow: hidden;
  display: block;
  min-width: 0;
  border-radius: 8px;
  background: color-mix(in srgb, var(--brand-primary-100) 54%, var(--surface-2));
}

.result-skeleton-block::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    100deg,
    transparent 15%,
    color-mix(in srgb, var(--surface-1) 78%, transparent) 48%,
    transparent 80%
  );
  transform: translateX(-110%);
  animation: resultSkeletonShimmer 1.45s ease-in-out infinite;
}

.result-skeleton-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 250px;
  align-items: center;
  gap: 1.5rem;
  min-height: 290px;
  padding: clamp(1.4rem, 3vw, 2.25rem);
  border-radius: 26px;
  background: linear-gradient(
    130deg,
    color-mix(in srgb, var(--brand-primary-900) 90%, #fff),
    color-mix(in srgb, var(--brand-primary-600) 78%, #fff)
  );
}

.result-skeleton-hero .result-skeleton-block {
  background: rgb(255 255 255 / 16%);
}

.result-skeleton-hero__copy {
  min-width: 0;
}

.result-skeleton-block--eyebrow {
  width: 155px;
  height: 28px;
  border-radius: 999px;
}

.result-skeleton-block--hero-title {
  width: min(460px, 82%);
  height: 48px;
  margin-top: 13px;
}

.result-skeleton-block--subtitle {
  width: min(590px, 92%);
  height: 17px;
  margin-top: 12px;
}

.result-skeleton-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 1.35rem;
}

.result-skeleton-meta__item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  background: rgb(255 255 255 / 7%);
}

.result-skeleton-block--meta-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
}

.result-skeleton-meta__copy {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 6px;
}

.result-skeleton-block--meta-label {
  width: 58%;
  height: 8px;
}

.result-skeleton-block--meta-value {
  width: 82%;
  height: 12px;
}

.result-skeleton-block--illustration {
  width: 180px;
  height: 180px;
  justify-self: center;
  border-radius: 50%;
}

.result-skeleton-panel {
  padding: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 82%, transparent);
  border-radius: 24px;
  background: var(--surface-1);
}

.result-skeleton-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.result-skeleton-heading > span {
  display: grid;
  gap: 7px;
}

.result-skeleton-block--section-label {
  width: 90px;
  height: 9px;
}

.result-skeleton-block--section-title {
  width: 205px;
  height: 23px;
}

.result-skeleton-block--badge {
  width: 82px;
  height: 28px;
  border-radius: 999px;
}

.result-skeleton-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(145px, 1fr));
  gap: 0.75rem;
}

.result-skeleton-stat {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
  min-height: 108px;
  padding: 0.85rem;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 58%, var(--surface-2));
  border-radius: 19px;
}

.result-skeleton-stat > span {
  display: grid;
  gap: 8px;
}

.result-skeleton-block--stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 15px;
}

.result-skeleton-block--stat-value {
  width: 44px;
  height: 24px;
}

.result-skeleton-block--stat-label {
  width: 90%;
  height: 11px;
}

.result-skeleton-table {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 72%, transparent);
  border-radius: 19px;
}

.result-skeleton-table__header,
.result-skeleton-table__row {
  display: grid;
  grid-template-columns: 0.7fr 2fr 1fr 1fr 72px;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
}

.result-skeleton-table__header {
  background: color-mix(in srgb, var(--brand-primary-50) 58%, var(--surface-1));
}

.result-skeleton-table__header .result-skeleton-block {
  width: 55%;
  height: 9px;
}

.result-skeleton-table__row {
  border-top: 1px solid color-mix(in srgb, var(--brand-primary-100) 56%, transparent);
}

.result-skeleton-block--serial {
  width: 54px;
  height: 28px;
}

.result-skeleton-employee {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.result-skeleton-block--avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 13px;
}

.result-skeleton-block--employee-name {
  width: 120px;
  height: 13px;
}

.result-skeleton-block--cell {
  width: 78px;
  height: 13px;
}

.result-skeleton-block--action {
  width: 42px;
  height: 42px;
  justify-self: center;
  border-radius: 13px;
}

@keyframes resultSkeletonShimmer {
  to {
    transform: translateX(110%);
  }
}

@media (max-width: 1200px) {
  .result-skeleton-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .result-page-skeleton {
    padding: 1rem;
    border-radius: 24px;
  }

  .result-skeleton-hero {
    grid-template-columns: minmax(0, 1fr);
  }

  .result-skeleton-block--illustration {
    display: none;
  }

  .result-skeleton-table {
    overflow-x: auto;
  }

  .result-skeleton-table__header,
  .result-skeleton-table__row {
    min-width: 720px;
  }
}

@media (max-width: 700px) {
  .result-skeleton-meta,
  .result-skeleton-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .result-page-skeleton {
    gap: 0.85rem;
    padding: 0.7rem;
  }

  .result-skeleton-hero,
  .result-skeleton-panel {
    border-radius: 19px;
  }

  .result-skeleton-hero {
    padding: 1.15rem;
  }

  .result-skeleton-meta,
  .result-skeleton-stats {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .result-skeleton-block::after {
    animation: none;
  }
}
</style>
