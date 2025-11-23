<script setup lang="ts">
import ArrowLink from '@/shared/icons/ArrowLink.vue'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import InspectionsCard from './InspectionsCard.vue'
import HeaderSection from '../DetailsHeader/HeaderSection.vue'
import InspectionTemplateImage from '@/assets/images/check-list.png'
import TaskAssignTo from '@/features/Organization/Inspection/Presentation/components/InspectionUtils/TaskAssignTo.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import ZoneInspectionCollapse from './ZoneInspectionCollapse.vue'

const visible = ref(false)

const AssignToOptions = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Employee' }),
  new TitleInterface({ id: 2, title: 'Zone' }),
])

const activeInspection = ref<number>(1)

const GetSelectedAssigned = (data: number) => {
  activeInspection.value = data
}

const { showHeader, showArrowLink } = defineProps<{
  showHeader?: boolean
  showArrowLink?: boolean
}>()
</script>

<template>
  <div class="card flex justify-center">
    <button @click="visible = true">
      <ArrowLink />
    </button>
    <Dialog
      v-model:visible="visible"
      dismissableMask
      modal
      :style="{ width: '36vw' }"
      class="inspection-dialog"
    >
      <template #container="{ closeCallback }">
        <div class="!px-5 !mt-5">
          <HeaderSection
            :img="InspectionTemplateImage"
            title="Inspection Tasks"
            subtitle="Track and manage all inspection assignments"
          />

          <button class="btn btn-primary w-full !mt-3">{{ $t('add_task') }}</button>
        </div>

        <TaskAssignTo
          :title="``"
          :options="AssignToOptions"
          @update:data="GetSelectedAssigned"
          :showHeader="false"
          class="!mt-5"
        />

        <div class="inspections-sections">
          <div class="inspections">
            <div class="inspections-cards" v-show="activeInspection == 1">
              <InspectionsCard
                :showArrowLink="showArrowLink"
                :showHeader="showHeader"
                :isAssign="true"
                v-for="i in 6"
                :key="i"
              />
            </div>
            <div class="inspections-cards" v-show="activeInspection == 2">
              <ZoneInspectionCollapse v-for="i in 6" :key="i" />
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>
