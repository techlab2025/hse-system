<script setup lang="ts">
import PagesHeader from '@/shared/HelpersComponents/PagesHeader.vue'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import ProjectCustomLocationController from '../../../controllers/ProjectCustomLocationController'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
import DataEmpty from '@/shared/DataStatues/DataEmpty.vue'
import DataFailed from '@/shared/DataStatues/DataFailed.vue'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'
import EmptyEquimentsProjectZones from '../PorjectUtils/EmptyEquimentsProjectZones.vue'
import ProjectEquipmentCard from './ProjectEquipmentCard.vue'
import ExportPdf from '@/shared/HelpersComponents/ExportPdf.vue'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'
import { EquipmentTypesEnum } from '@/features/setting/Template/Core/Enum/EquipmentsTypeEnum'

const route = useRoute()
const id = route.params.project_id

const projectCustomLocationController = ProjectCustomLocationController.getInstance()
const state = ref(projectCustomLocationController.state.value)
const selectedEquipmentType = ref<EquipmentTypesEnum>(EquipmentTypesEnum.EQUIPMENT)
const equipmentTypeOptions = [
  { value: EquipmentTypesEnum.EQUIPMENT, label: 'Equipment', icon: 'truck' },
  { value: EquipmentTypesEnum.DEVICE, label: 'device', icon: 'desktop' },
  { value: EquipmentTypesEnum.TOOL, label: 'tool', icon: 'wrench' },
]
const locations = computed(() => state.value.data ?? [])

const totalZones = computed(() =>
  locations.value.reduce((total, location) => total + (location.locationZones?.length ?? 0), 0),
)

const totalEquipments = computed(() =>
  locations.value.reduce(
    (locationTotal, location) =>
      locationTotal +
      (location.locationZones?.reduce(
        (zoneTotal, zone) => zoneTotal + (zone.projectZoonEquipments?.length ?? 0),
        0,
      ) ?? 0),
    0,
  ),
)

const GetProjectLocationsEqipments = async (
  equipmentType: EquipmentTypesEnum = selectedEquipmentType.value,
) => {
  const projectCustomLocationParams = new ProjectCustomLocationParams(
    Number(id),
    [ProjectCustomLocationEnum.ZOON, ProjectCustomLocationEnum.ZOON_EQUIPMENT],
    undefined,
    equipmentType,
  )
  await projectCustomLocationController.getData(projectCustomLocationParams)
}

const filterByEquipmentType = async (equipmentType: EquipmentTypesEnum) => {
  if (selectedEquipmentType.value === equipmentType) return

  selectedEquipmentType.value = equipmentType
  await GetProjectLocationsEqipments(equipmentType)
}

onMounted(() => {
  GetProjectLocationsEqipments()
})

const emptyZones = computed(() =>
  locations.value.flatMap(
    (location) =>
      location.locationZones?.filter((zone) => !zone.projectZoonEquipments?.length) ?? [],
  ),
)

watch(
  () => projectCustomLocationController.state.value,
  (newState) => {
    state.value = newState
  },
)
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <!-- <PagesHeader
        :title="$t('Equipment_tools_&_devices_by_zone')"
        :subtitle="$t('view_and_manage_all_equipment_assigned_to_each_operational_zone')"
        :actions="true"
      >
        <template #actions>

        </template>
      </PagesHeader> -->

      <EmptyEquimentsProjectZones
        v-if="emptyZones.length"
        :zonesNumber="emptyZones.length"
        :zones="emptyZones"
      />

      <div class="project-equipments-pdf-content">
        <section class="equipment-overview" aria-label="Equipment overview">
          <div class="overview-copy">
            <span class="overview-kicker">{{ $t('project_equipment_inventory') }}</span>
            <h2>{{ $t('Equipment_tools_&_devices_by_zone') }}</h2>
            <p>{{ $t('view_and_manage_all_equipment_assigned_to_each_operational_zone') }}</p>
          </div>

          <div class="overview-stats">
            <div class="overview-stat location-stat">
              <span class="stat-icon"><SidebarUnicon name="map-marker" /></span>
              <span class="stat-copy">
                <strong>{{ locations.length }}</strong>
                <small>{{ $t('project_equipment_locations') }}</small>
              </span>
            </div>
            <div class="overview-stat zone-stat">
              <span class="stat-icon"><SidebarUnicon name="layer-group" /></span>
              <span class="stat-copy">
                <strong>{{ totalZones }}</strong>
                <small>{{ $t('project_equipment_operational_zones') }}</small>
              </span>
            </div>
            <div class="overview-stat equipment-stat">
              <span class="stat-icon"><SidebarUnicon name="wrench" /></span>
              <span class="stat-copy">
                <strong>{{ totalEquipments }}</strong>
                <small>{{ $t('project_equipment_assigned_assets') }}</small>
              </span>
            </div>
            <div class="overview-stat equipment-stat" data-html2canvas-ignore="true">
              <ExportPdf
                target-selector=".project-equipments-pdf-content"
                :filename="`project-${id}-equipment-by-area.pdf`"
                class="export-pdf"
              />
            </div>

            <div
              class="equipment-type-filter"
              role="radiogroup"
              :aria-label="$t('project_equipment_filter_type')"
              data-html2canvas-ignore="true"
            >
              <!-- <span class="filter-label">
                <SidebarUnicon name="filter" />
                {{ $t('project_equipment_filter_type') }}
              </span> -->

              <div class="filter-options">
                <button
                  v-for="option in equipmentTypeOptions"
                  :key="option.value"
                  type="button"
                  class="filter-option"
                  :class="{ active: selectedEquipmentType === option.value }"
                  role="radio"
                  :aria-checked="selectedEquipmentType === option.value"
                  @click="filterByEquipmentType(option.value)"
                >
                  <SidebarUnicon :name="option.icon" />
                  <span>{{ $t(option.label) }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <article
          v-for="(location, locationIndex) in locations"
          :key="location.projectLocationId || location.id || locationIndex"
          class="location-section"
        >
          <header class="location-header">
            <div class="location-identity">
              <span class="location-number">{{ String(locationIndex + 1).padStart(2, '0') }}</span>
              <span class="location-icon"><SidebarUnicon name="map-marker" /></span>
              <div>
                <small>{{ $t('project_equipment_location') }}</small>
                <h2>{{ location.title || '—' }}</h2>
              </div>
            </div>

            <div class="location-counts">
              <span>
                <strong>{{ location.locationZones?.length ?? 0 }}</strong>
                {{ $t('zones') }}
              </span>
              <span>
                <strong>{{
                  location.locationZones?.reduce(
                    (total, zone) => total + (zone.projectZoonEquipments?.length ?? 0),
                    0,
                  ) ?? 0
                }}</strong>
                {{ $t('equipments') }}
              </span>
            </div>
          </header>

          <div v-if="location.locationZones?.length" class="zones-list">
            <section
              v-for="(zone, zoneIndex) in location.locationZones"
              :key="zone.projectZoonId || zone.zoonId || zoneIndex"
              class="zone-section"
              :class="{ 'zone-section--empty': !zone.projectZoonEquipments?.length }"
            >
              <header class="zone-header">
                <div class="zone-identity">
                  <span class="zone-line" aria-hidden="true"></span>
                  <span class="zone-icon"><SidebarUnicon name="layer-group" /></span>
                  <div>
                    <small>{{ $t('project_equipment_zone') }} {{ zoneIndex + 1 }}</small>
                    <h3>{{ zone.title || zone.zoonTitle || '—' }}</h3>
                  </div>
                </div>

                <span class="equipment-count">
                  <SidebarUnicon name="wrench" />
                  <strong>{{ zone.projectZoonEquipments?.length ?? 0 }}</strong>
                  {{ $t('equipments') }}
                </span>
              </header>

              <div v-if="zone.projectZoonEquipments?.length" class="equipment-grid">
                <ProjectEquipmentCard
                  v-for="tool in zone.projectZoonEquipments"
                  :key="tool.projectZoonEquipmentId || tool.id"
                  :tool="tool"
                />
              </div>

              <div v-else class="zone-empty-state">
                <span><SidebarUnicon name="wrench" /></span>
                <div>
                  <strong>{{ $t('project_equipment_zone_empty_title') }}</strong>
                  <p>{{ $t('project_equipment_zone_empty_description') }}</p>
                </div>
              </div>
            </section>
          </div>

          <div v-else class="location-empty-state">
            <SidebarUnicon name="layer-group" />
            <p>{{ $t('project_equipment_no_zones') }}</p>
          </div>
        </article>
      </div>
    </template>
    <template #loader>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #initial>
      <TableLoader :cols="8" :rows="10" />
    </template>
    <template #empty>
      <DataEmpty
        :link="`/organization/project/add`"
        addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project"
      />
    </template>
    <template #failed>
      <DataFailed
        :link="`/organization/project/add`"
        addText="Add Project"
        description="Sorry .. You have no Project .. All your joined customers will appear here when you add your customer data"
        title="..ops! You have No Project"
      />
    </template>
  </DataStatus>
</template>
<style scoped lang="scss">
.export-pdf {
  border: none !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 0 !important;
}
.project-equipments-pdf-content {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  padding: 0.2rem;
}

.equipment-overview {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(440px, 0.8fr);
  align-items: center;
  gap: 1.5rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--identity-accent) 16%, transparent),
      transparent 34%
    ),
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 10%, var(--surface-1)),
      var(--surface-1) 58%
    );
  padding: clamp(1.15rem, 2.4vw, 2rem);
  box-shadow: 0 18px 42px color-mix(in srgb, var(--brand-primary-900) 9%, transparent);
}

.equipment-overview::after {
  position: absolute;
  inset-block-start: -75px;
  inset-inline-end: -55px;
  width: 190px;
  height: 190px;
  border: 28px solid color-mix(in srgb, var(--PrimaryColor) 7%, transparent);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.overview-copy {
  position: relative;
  z-index: 1;
}

.overview-kicker,
.location-identity small,
.zone-identity small {
  color: var(--PrimaryColor);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.overview-copy h2 {
  margin: 0.35rem 0 0;
  color: var(--text-strong);
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 900;
  line-height: 1.25;
}

.overview-copy p {
  max-width: 650px;
  margin: 0.55rem 0 0;
  color: var(--text-soft);
  font-size: 0.86rem;
  line-height: 1.65;
}

.overview-stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.overview-stat {
  --stat-tone: var(--PrimaryColor);
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid color-mix(in srgb, var(--stat-tone) 18%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-1) 91%, transparent);
  padding: 0.8rem;
  box-shadow: 0 9px 22px color-mix(in srgb, var(--shadow-color) 55%, transparent);
}

.equipment-type-filter {
  display: flex;
  grid-column: 1 / -1;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border));
  border-radius: 15px;
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
  padding: 0.45rem;
  box-shadow: 0 9px 22px color-mix(in srgb, var(--shadow-color) 42%, transparent);
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding-inline: 0.45rem;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 900;
  white-space: nowrap;
}

.filter-label > :first-child {
  color: var(--PrimaryColor);
  font-size: 0.95rem;
}

.filter-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.35rem;
  width: 100%;
}

.filter-option {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.45rem 0.65rem;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.filter-option:hover {
  border-color: color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
  background: var(--brand-primary-50);
  color: var(--PrimaryColor);
}

.filter-option.active {
  border-color: color-mix(in srgb, var(--PrimaryColor) 34%, transparent);
  background: var(--brand-primary-100);
  color: var(--PrimaryColor);
  box-shadow: 0 6px 14px color-mix(in srgb, var(--PrimaryColor) 13%, transparent);
}

.filter-option:active {
  transform: scale(0.98);
}

.filter-option:focus-visible {
  outline: 2px solid var(--PrimaryColor);
  outline-offset: 2px;
}

.filter-option > :first-child {
  flex: 0 0 auto;
  font-size: 0.95rem;
}

.zone-stat {
  --stat-tone: var(--identity-accent);
}

.equipment-stat {
  --stat-tone: var(--status-success);
}

.stat-icon,
.location-icon,
.zone-icon {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 12px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  background: color-mix(in srgb, var(--stat-tone) 11%, var(--surface-1));
  color: var(--stat-tone);
  font-size: 1.1rem;
}

.stat-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.stat-copy strong {
  color: var(--text-strong);
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1;
}

.stat-copy small {
  overflow: hidden;
  margin-top: 0.25rem;
  color: var(--text-muted);
  font-size: 0.64rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-section {
  overflow: hidden;
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 14px 36px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

.location-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)),
    var(--surface-1)
  );
  padding: 1rem 1.2rem;
}

.location-header::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 5px;
  background: linear-gradient(var(--PrimaryColor), var(--identity-accent));
  content: '';
}

.location-identity,
.zone-identity,
.location-counts,
.equipment-count {
  display: flex;
  align-items: center;
}

.location-identity {
  min-width: 0;
  gap: 0.75rem;
}

.location-number {
  color: color-mix(in srgb, var(--PrimaryColor) 42%, var(--text-muted));
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.location-icon {
  width: 42px;
  height: 42px;
  background: var(--brand-primary-100);
  color: var(--PrimaryColor);
  font-size: 1.25rem;
}

.location-identity h2,
.zone-identity h3 {
  margin: 0.18rem 0 0;
  color: var(--text-strong);
  font-weight: 900;
}

.location-identity h2 {
  font-size: 1.15rem;
}

.location-counts {
  gap: 0.5rem;
}

.location-counts > span {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.45rem 0.7rem;
}

.location-counts strong {
  color: var(--text-strong);
  font-size: 0.88rem;
  font-weight: 900;
}

.zones-list {
  display: grid;
  gap: 1rem;
  background: color-mix(in srgb, var(--surface-2) 72%, var(--surface-1));
  padding: 1rem;
}

.zone-section {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--identity-accent) 14%, var(--main-border));
  border-radius: 17px;
  background: var(--surface-1);
}

.zone-section--empty {
  border-style: dashed;
}

.zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--main-border);
  padding: 0.8rem 1rem;
}

.zone-identity {
  position: relative;
  min-width: 0;
  gap: 0.65rem;
}

.zone-line {
  width: 3px;
  height: 34px;
  border-radius: 999px;
  background: linear-gradient(var(--identity-accent), var(--PrimaryColor));
}

.zone-icon {
  width: 35px;
  height: 35px;
  background: var(--brand-accent-100);
  color: var(--identity-accent);
  font-size: 1rem;
}

.zone-identity small {
  color: var(--text-muted);
  font-size: 0.62rem;
}

.zone-identity h3 {
  font-size: 0.98rem;
}

.equipment-count {
  flex: 0 0 auto;
  gap: 0.32rem;
  border-radius: 999px;
  background: var(--status-success-soft);
  color: var(--status-success);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.42rem 0.65rem;
}

.equipment-count > :first-child {
  font-size: 0.85rem;
}

.equipment-count strong {
  font-weight: 900;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.zone-empty-state,
.location-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: var(--text-muted);
  text-align: start;
}

.zone-empty-state {
  min-height: 120px;
  padding: 1rem;
}

.zone-empty-state > span {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 14px;
  background: var(--surface-3);
  color: var(--text-muted);
  font-size: 1.15rem;
}

.zone-empty-state strong {
  color: var(--text-strong);
  font-size: 0.84rem;
  font-weight: 900;
}

.zone-empty-state p,
.location-empty-state p {
  margin: 0.25rem 0 0;
  font-size: 0.76rem;
  line-height: 1.45;
}

.location-empty-state {
  min-height: 140px;
  flex-direction: column;
  background: var(--surface-2);
  font-size: 1.4rem;
  padding: 1.5rem;
  text-align: center;
}

@media (max-width: 1100px) {
  .equipment-overview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 780px) {
  .equipment-overview {
    border-radius: 18px;
  }

  .overview-stats,
  .equipment-grid {
    grid-template-columns: 1fr;
  }

  .equipment-type-filter {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-label {
    padding-block: 0.25rem;
  }

  .location-header,
  .zone-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .location-counts {
    padding-inline-start: 3.3rem;
  }

  .equipment-count {
    margin-inline-start: 3.4rem;
  }
}

@media (max-width: 480px) {
  .overview-stats {
    gap: 0.5rem;
  }

  .filter-options {
    grid-template-columns: 1fr;
  }

  .location-header,
  .zones-list,
  .zone-header,
  .equipment-grid {
    padding: 0.75rem;
  }

  .location-number {
    display: none;
  }

  .location-counts {
    padding-inline-start: 3rem;
  }
}
</style>
