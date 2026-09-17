<script setup lang="ts">
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import ProjectLocationZoonDialog from './ProjectLocationZoonDialog.vue'
import EmptyZoons from './EmptyZoons.vue'

const { title, zoneLength, zoons, LocationId, projectId } = defineProps<{
  title: string | undefined
  zoneLength: number | undefined
  zoons: SohwProjectZoonModel[] | undefined
  LocationId: number | undefined
  projectId: number | undefined
}>()
</script>

<template>
  <div class="location-card">
    <div class="card-header">
      <div class="location-header-container">
        <div class="location-header">
          <span class="location-mark" aria-hidden="true">
            <i></i>
          </span>
          <div class="location-title-copy">
            <span class="location-label">{{ $t('Operational location') }}</span>
            <p class="title">{{ title || '—' }}</p>
          </div>
          <p class="zone">
            <strong>{{ zoneLength || 0 }}</strong> {{ $t('zone') }}
          </p>
        </div>
        <ProjectLocationZoonDialog :LocationId="LocationId" :projectId="projectId" />
      </div>
    </div>

    <hr class="card-hr" />

    <div class="locations">
      <div
        class="location-title"
        v-if="zoons && zoons?.length > 0"
        v-for="(zoon, index) in zoons"
        :key="zoon.projectZoonId || zoon.zoonId || index"
      >
        <span class="zone-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span>{{ zoon.title || zoon.zoonTitle }}</span>
      </div>
      <EmptyZoons v-else />
    </div>
  </div>
</template>
<style scoped lang="scss">
.location-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 210px;
  padding: 17px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 19px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 38%
    ),
    var(--surface-1);
  box-shadow: 0 13px 30px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.location-card::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--status-success));
}

.location-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 32%, var(--main-border));
  box-shadow: 0 18px 38px color-mix(in srgb, var(--brand-primary-900) 11%, transparent);
}

.location-header-container,
.location-header {
  display: flex;
  align-items: center;
}

.location-header-container {
  justify-content: space-between;
  gap: 12px;
}

.location-header {
  min-width: 0;
  gap: 10px;
}

.location-mark {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
}

.location-mark::before {
  content: '';
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.location-mark i {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.location-title-copy {
  min-width: 0;
}

.location-label {
  display: block;
  margin-bottom: 2px;
  color: var(--text-soft);
  font-size: 0.61rem;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.location-title-copy .title {
  overflow: hidden;
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.94rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-header .zone {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, transparent);
  color: var(--text-soft);
  font-size: 0.65rem;
  white-space: nowrap;
}

.location-header .zone strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
}

.card-hr {
  height: 1px;
  margin: 15px 0;
  border: 0;
  background: var(--main-border);
}

.locations {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 8px;
}

.locations .location-title {
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  gap: 8px;
  padding: 6px 10px 6px 7px;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  background: color-mix(in srgb, var(--surface-2) 72%, transparent);
  color: var(--text-strong);
  font-size: 0.72rem;
  font-weight: 750;
}

.zone-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.59rem;
}

@media (max-width: 560px) {
  .location-card {
    min-height: 0;
    padding: 14px;
    border-radius: 16px;
  }

  .location-header-container {
    align-items: stretch;
    flex-direction: column;
  }

  .location-header .zone {
    margin-inline-start: auto;
  }
}
</style>
