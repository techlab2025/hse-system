<script setup lang="ts">
import ObjectivesDetails from './ObjectivesDetails.vue'

const props = defineProps<{
  description: string | undefined
}>()
</script>

<template>
  <section class="main-objective">
    <span class="objective-orbit" aria-hidden="true"></span>

    <div class="objective-header">
      <div class="objective-heading">
        <span class="objective-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <path d="m15 9 5-5M16 4h4v4" />
          </svg>
        </span>
        <div class="objective-copy">
          <span class="objective-eyebrow"><i></i>{{ $t('Project direction') }}</span>
          <h2>{{ $t('project_scope_of_work') }}</h2>
          <p>{{ $t('defining_the_main_objectives_and_expected_outcomes_of_the_project') }}</p>
        </div>
      </div>

      <span class="scope-badge">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3 3 7-7" /></svg>
        {{ $t('Core scope') }}
      </span>
    </div>

    <div class="objective-details">
      <!-- <span class="statement-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h5" />
        </svg>
      </span> -->
      <div class="statement-copy">
        <!-- <span>{{ $t('Scope statement') }}</span> -->
        <ObjectivesDetails :object_details="description" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main-objective {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  flex-direction: column;
  gap: 15px;
  padding: 20px !important;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border)) !important;
  border-radius: 23px !important;
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--brand-secondary-500) 9%, transparent),
      transparent 32%
    ),
    var(--surface-1) !important;
  box-shadow: 0 14px 34px color-mix(in srgb, var(--brand-primary-900) 7%, transparent) !important;
  font-family: 'Regular';
}

.main-objective::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--brand-secondary-500), var(--PrimaryColor));
  content: '';
}

.objective-orbit {
  position: absolute;
  inset-inline-end: -48px;
  bottom: -86px;
  width: 170px;
  height: 170px;
  border: 18px solid color-mix(in srgb, var(--brand-secondary-500) 4%, transparent);
  border-radius: 50%;
  pointer-events: none;
}

.objective-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--main-border);
}

.objective-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 13px;
}

.objective-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  border-radius: 16px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--brand-secondary-500), var(--PrimaryColor));
  box-shadow: 0 9px 20px color-mix(in srgb, var(--brand-secondary-500) 20%, transparent);
}

.objective-mark svg {
  width: 25px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.objective-copy {
  min-width: 0;
}

.objective-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-secondary-500);
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.objective-eyebrow i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-secondary-500);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-secondary-500) 10%, transparent);
}

.objective-copy h2 {
  margin: 3px 0 1px;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.3;
}

.objective-copy p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.69rem;
  line-height: 1.45;
}

.scope-badge {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid color-mix(in srgb, var(--status-success) 18%, var(--main-border));
  border-radius: 999px;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 7%, transparent);
  font-size: 0.61rem;
  font-weight: 850;
}

.scope-badge svg {
  width: 14px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.objective-details {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 92px;
  gap: 12px;
  padding: 16px !important;
  border: 1px solid color-mix(in srgb, var(--brand-secondary-500) 13%, var(--main-border)) !important;
  border-radius: 17px !important;
  background:
    linear-gradient(
      120deg,
      color-mix(in srgb, var(--brand-secondary-500) 6%, transparent),
      transparent 34%
    ),
    color-mix(in srgb, var(--surface-2) 45%, var(--surface-1)) !important;
}

.statement-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 12px;
  color: var(--brand-secondary-500);
  background: color-mix(in srgb, var(--brand-secondary-500) 9%, var(--surface-1));
}

.statement-icon svg {
  width: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.statement-copy {
  min-width: 0;
  flex: 1;
}

.statement-copy > span {
  display: block;
  margin-bottom: 5px;
  color: var(--brand-secondary-500);
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.statement-copy :deep(.objectives) {
  min-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

.statement-copy :deep(.objectives p) {
  margin: 0;
  color: var(--text-strong);
  font-size: 0.75rem;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .main-objective {
    padding: 16px !important;
    border-radius: 19px !important;
  }

  .objective-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .scope-badge {
    margin-inline-start: 63px;
  }
}

@media (max-width: 430px) {
  .objective-heading {
    align-items: flex-start;
  }

  .objective-mark {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }

  .scope-badge {
    margin-inline-start: 0;
  }

  .objective-details {
    padding: 13px !important;
  }
}
</style>
