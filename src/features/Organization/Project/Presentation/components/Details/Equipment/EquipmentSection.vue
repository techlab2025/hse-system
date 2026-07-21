<script lang="ts" setup>
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import Equipment from '@/assets/images/Equipment.png'
import type SohwProjectZoonModel from '@/features/Organization/Project/Data/models/ShowProjectZone'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import AccordArrowDown from '@/shared/icons/AccordArrowDown.vue'
import AccordArrowRight from '@/shared/icons/AccordArrowRight.vue'
import ProjectEquipmentCard from './ProjectEquipmentCard.vue'
import AddNewEquipmentEmptyDialog from './AddNewEquipmentEmptyDialog.vue'

const { project_zoons } = defineProps<{
  project_zoons: SohwProjectZoonModel[] | undefined
}>()
const route = useRoute()
const id = route.params.id
const ProjectZones = ref(project_zoons)
const OpenAccordion = ref<string[]>([])
const CheckEquipemtnsEmpty = computed(
  () =>
    project_zoons?.map((p) => p?.projectZoonEquipments?.length).reduce((a, b) => a + b, 0) === 0,
)
const totalEquipment = computed(
  () =>
    project_zoons?.reduce((total, zone) => total + (zone?.projectZoonEquipments?.length || 0), 0) ||
    0,
)

const updatetabValue = (value: any) => {
  OpenAccordion.value = value
}

watch(
  () => project_zoons,
  (newValue) => {
    ProjectZones.value = newValue
  },
)
</script>

<template>
  <div class="equipment-section">
    <div class="equipment-section-header">
      <HeaderSection
        :img="Equipment"
        title="Equipment_tools_&_devices_by_zone"
        subtitle="view_and_manage_all_equipment_assigned_to_each_operational_zone"
      />
      <div class="equipment-header-actions">
        <div class="equipment-summary">
          <span
            ><strong>{{ project_zoons?.length || 0 }}</strong
            >{{ $t('Zones') }}</span
          >
          <span
            ><strong>{{ totalEquipment }}</strong
            >{{ $t('Equipment') }}</span
          >
        </div>
        <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">
          {{ $t('Show all') }} <i aria-hidden="true">→</i>
        </router-link>
      </div>
    </div>

    <Accordion
      class="equipment-accordion"
      :value="OpenAccordion"
      multiple
      @update:value="updatetabValue"
    >
      <AccordionPanel
        v-for="(zone, index) in ProjectZones?.slice(0, 2)"
        :key="index"
        :value="index"
      >
        <AccordionHeader>
          <div class="location-container w-full flex items-center gap-2 justify-between">
            <div class="location flex items-start">
              <AccordArrowDown v-if="OpenAccordion.includes(String(index))" class="arrow-accord" />
              <AccordArrowRight v-else class="arrow-right" />
              <div class="flex flex-col items-start gap-0">
                <p class="location-title">{{ zone?.zoonTitle }}</p>
                <div class="location-info-statics flex items-center gap-2">
                  <p>
                    {{ zone?.projectZoonEquipments?.length }}
                    <span>{{ $t('Equipment & Devices') }}</span>
                  </p>
                </div>
              </div>
              <div></div>
            </div>
            <AddNewEquipmentEmptyDialog
              class="zone-equipment-action"
              :project_zone_id="zone?.projectZoonId"
              :isEmpty="false"
              @click.stop
            />
          </div>
        </AccordionHeader>
        <AccordionContent>
          <div class="teams-container equipment" v-if="zone?.projectZoonEquipments?.length > 0">
            <div class="project-equipment-card-container grid grid-cols-2 gap-4">
              <ProjectEquipmentCard
                v-for="(tool, index) in zone?.projectZoonEquipments.slice(0, 4)"
                :key="index"
                :tool="tool"
              />
            </div>
          </div>
          <div class="empty-teams" v-else>
            <AddNewEquipmentEmptyDialog :project_zone_id="zone?.projectZoonId" :isEmpty="true" />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
<style scoped lang="scss">
.equipment-section {
  gap: 18px;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 23px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 4%, transparent),
      transparent 42%
    ),
    var(--surface-1);
}

.equipment-section-header,
.equipment-header-actions,
.equipment-summary,
.show-all {
  display: flex;
  align-items: center;
  color:white !important;

}

.equipment-section-header {
  justify-content: space-between;
  gap: 16px;
}

.equipment-header-actions {
  gap: 9px;
}

.equipment-summary {
  gap: 6px;
}

.equipment-summary span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 34px;
  padding: 6px 9px;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--text-soft);
  font-size: 0.64rem;
  font-weight: 750;
}

.equipment-summary strong {
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.77rem;
}

.show-all {
  justify-content: center;
  min-width: 96px;
  min-height: 36px;
  gap: 7px;
  padding: 7px 8px 7px 11px;
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: white !important;
  font-size: 0.68rem;
  font-weight: 900;
  text-decoration: none;
  width: 120px;
}

.show-all i {
  font-style: normal;
}

[dir='rtl'] .show-all i {
  transform: rotate(180deg);
}

.equipment-accordion {
  width: 100%;
}

.equipment-accordion :deep(.p-accordionpanel) {
  overflow: hidden;
  margin-bottom: 11px;
  border: 1px solid var(--main-border) !important;
  border-radius: 17px !important;
  background: var(--surface-1);
  box-shadow: 0 10px 25px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.equipment-accordion :deep(.p-accordionheader) {
  padding: 15px 16px;
  border: 0 !important;
  background: color-mix(in srgb, var(--surface-2) 72%, transparent) !important;
}

.equipment-accordion :deep(.p-accordioncontent-content) {
  padding: 15px !important;
  border-top: 1px solid var(--main-border) !important;
  background: var(--surface-1);
}

.location-container .location {
  align-items: center;
  gap: 10px;
}

.location-title {
  margin: 0;
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.9rem;
  font-weight: 900;
}

.location-info-statics p {
  margin-top: 4px;
  padding: 4px 7px;
  border-radius: 8px;
  background: var(--surface-1);
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.65rem;
}

.location-info-statics span {
  color: var(--text-soft);
  font-family: 'Regular';
}

.project-equipment-card-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
  padding: 0;
}

@media (max-width: 900px) {
  .project-equipment-card-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .equipment-section {
    padding: 16px;
    border-radius: 19px;
  }

  .equipment-section-header,
  .equipment-header-actions {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
