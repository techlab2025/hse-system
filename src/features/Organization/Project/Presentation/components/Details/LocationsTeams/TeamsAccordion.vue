<script setup lang="ts">
import { vProjectPanels } from '../../../composables/projectPanels'

import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
</script>
<template>
  <div data-hse-project v-project-panels class="hse-project-root card">
    <Accordion :value="['0']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>{{ $t('Header I') }}</AccordionHeader>
        <AccordionContent> </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
