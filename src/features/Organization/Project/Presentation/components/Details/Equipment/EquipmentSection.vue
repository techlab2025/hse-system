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
        title="Equipment , tools & Devices by Site "
        subtitle="View and manage all equipment assigned to each operational zone"
      />
      <router-link :to="`/organization/project-equipment/project/${id}`" class="show-all">{{
        $t('Show all')
      }}</router-link>
    </div>

    <Accordion :value="OpenAccordion" multiple @update:value="updatetabValue">
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
            <AddNewEquipmentEmptyDialog :project_zone_id="zone?.projectZoonId" :isEmpty="false" />
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
