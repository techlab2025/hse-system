<script setup lang="ts">
import Location from '@/assets/images/Location.png'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import LocationCard from './LocationCard.vue'
import type LocationDetailsModel from '@/features/setting/Location/Data/models/LocationModel'
import ShowAllZonesDialog from './ShowAllZonesDialog.vue'
import { computed } from 'vue'

const { locations, projectId } = defineProps<{
  locations: LocationDetailsModel[] | undefined
  projectId: number | undefined
}>()

const totalZones = computed(
  () => locations?.reduce((total, location) => total + (location.zoons?.length || 0), 0) || 0,
)
const hasLocations = computed(() => (locations?.length || 0) > 0)
const remainingLocations = computed(() => Math.max((locations?.length || 0) - 2, 0))
</script>

<template>
  <div class="project-location">
    <span class="section-accent" aria-hidden="true"></span>
    <div class="project-location-header">
      <HeaderSection
        :img="Location"
        :title="$t('project_location_&_site_overview')"
        :subtitle="$t('mapping_each_main_site_with_its_associated_working_areas')"
      />

      <div class="section-summary-actions">
        <div class="site-summary">
          <span class="summary-item">
            <i class="summary-icon location-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </i>
            <span
              ><strong>{{ locations?.length || 0 }}</strong
              >{{ $t('Locations') }}</span
            >
          </span>
          <span class="summary-item">
            <i class="summary-icon zone-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m4 7 5-3 6 3 5-3v13l-5 3-6-3-5 3zM9 4v13M15 7v13" />
              </svg>
            </i>
            <span
              ><strong>{{ totalZones }}</strong
              >{{ $t('Zones') }}</span
            >
          </span>
        </div>
        <ShowAllZonesDialog :locations="locations" :projectId="projectId" />
      </div>
    </div>

    <div class="site-context" v-if="hasLocations">
      <div>
        <span class="context-dot" aria-hidden="true"></span>
        <span
          ><strong>{{ $t('Site coverage') }}</strong
          ><small>{{ $t('Operational locations and their mapped work zones') }}</small></span
        >
      </div>
      <span class="coverage-state"><i></i>{{ $t('Mapped') }}</span>
    </div>

    <div class="card-section" v-if="hasLocations">
      <LocationCard
        v-for="(card, index) in locations?.slice(0, 2)"
        :key="index"
        :title="card.title"
        :zoneLength="Number(card.zoons.length)"
        :zoons="card.zoons"
        :LocationId="Number(card?.id)"
        :projectId="Number(projectId)"
      />
      <div class="more-locations" v-if="remainingLocations > 0">
        <span>+{{ remainingLocations }}</span>
        <p>
          <strong>{{ $t('More locations available') }}</strong
          ><small>{{ $t('Use Show all to explore the complete site map.') }}</small>
        </p>
      </div>
    </div>

    <div class="site-empty" v-else>
      <span class="empty-map-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m4 7 5-3 6 3 5-3v13l-5 3-6-3-5 3zM9 4v13M15 7v13" /></svg>
      </span>
      <span
        ><strong>{{ $t('No project locations mapped yet') }}</strong
        ><small>{{
          $t('Add a location to start organizing operational zones and teams.')
        }}</small></span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-location {
  position: relative;
  overflow: hidden;
  gap: 18px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 23px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 5%, transparent),
      transparent 42%
    ),
    var(--surface-1);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.section-accent {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--brand-accent-500));
}

.project-location-header,
.section-summary-actions,
.site-summary {
  display: flex;
  align-items: center;
}

.project-location-header {
  justify-content: space-between;
  gap: 16px;
}

.section-summary-actions {
  gap: 10px;
}

.site-summary {
  gap: 6px;
}

.summary-item {
  display: inline-flex;
  align-items: center;
  min-height: 46px;
  gap: 8px;
  padding: 6px 11px 6px 7px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 76%, var(--surface-1));
}

.summary-item > span {
  display: flex;
  flex-direction: column;
  color: var(--text-soft);
  font-size: 0.58rem;
  font-weight: 750;
}

.site-summary strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.82rem;
  line-height: 1.1;
}

.summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  font-style: normal;
}

.summary-icon svg,
.empty-map-icon svg {
  width: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.zone-icon {
  color: var(--brand-accent-500);
  background: color-mix(in srgb, var(--brand-accent-500) 9%, transparent);
}
.summary-item:has(.zone-icon) strong {
  color: var(--brand-accent-500);
}

.site-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 17px 0 11px;
  padding: 10px 12px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 58%, transparent);
}

.site-context > div {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 9px;
}
.site-context > div > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}
.site-context strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.72rem;
}
.site-context small {
  color: var(--text-soft);
  font-size: 0.59rem;
}
.context-dot {
  width: 11px;
  height: 11px;
  flex: 0 0 11px;
  border: 3px solid color-mix(in srgb, var(--status-success) 22%, transparent);
  border-radius: 50%;
  background: var(--status-success);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--status-success) 9%, transparent);
}
.coverage-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 9%, transparent);
  font-size: 0.59rem;
  font-weight: 850;
}
.coverage-state i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.card-section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
  width: 100%;
}

.more-locations {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 13px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 13px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
}

.more-locations > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 30px;
  padding: 0 8px;
  border-radius: 10px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
  font-family: 'Bold';
  font-size: 0.7rem;
}
.more-locations p {
  display: flex;
  flex-direction: column;
  margin: 0;
}
.more-locations strong {
  color: var(--text-strong);
  font-size: 0.67rem;
}
.more-locations small {
  color: var(--text-soft);
  font-size: 0.58rem;
}

.site-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 130px;
  gap: 12px;
  margin-top: 17px;
  padding: 18px;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 17px;
  background: color-mix(in srgb, var(--PrimaryColor) 4%, transparent);
}

.empty-map-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 14px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}
.empty-map-icon svg {
  width: 23px;
}
.site-empty > span:last-child {
  display: flex;
  flex-direction: column;
}
.site-empty strong {
  color: var(--text-strong);
  font-size: 0.75rem;
}
.site-empty small {
  color: var(--text-soft);
  font-size: 0.61rem;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .project-location {
    padding: 16px;
    border-radius: 19px;
  }

  .project-location-header,
  .section-summary-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-summary-actions,
  .site-summary {
    width: 100%;
  }
  .summary-item {
    flex: 1;
  }

  .card-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 460px) {
  .site-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .site-context small {
    display: none;
  }
  .site-empty {
    align-items: flex-start;
  }
}
</style>
