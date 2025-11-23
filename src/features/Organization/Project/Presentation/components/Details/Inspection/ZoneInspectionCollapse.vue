<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import PinIcons from '@/shared/icons/PinIcons.vue'
import InspectionsCard from './InspectionsCard.vue'
</script>

<template>
  <div class="card bg-white rounded-md">
    <Accordion value="0">
      <AccordionPanel value="0">
        <AccordionHeader>
          <span class="flex items-center gap-2 w-full">
            <div class="flex items-center justify-self-start gap-1">
              <div class="flex items-center justify-self-start">
                <PinIcons />
                <p class="text-black">Obour City</p>
              </div>
              <div class="text-slate-500 text-sm font-light">
                ( 10
                <span> {{ $t('tasks') }} </span>)
              </div>
            </div>
          </span>
          <span class="text-slate-500 text-sm font-light"> {{ $t('show_more') }}</span>
        </AccordionHeader>
        <AccordionContent>
          <InspectionsCard
            :showHeader="false"
            :showArrowLink="false"
            :isAssign="false"
            v-for="i in 6"
            :key="i"
            class="!mb-2"
          />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
