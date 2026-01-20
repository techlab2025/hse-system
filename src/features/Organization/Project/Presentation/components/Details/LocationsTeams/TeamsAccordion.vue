<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

</script>
<template>
  <div class="card">
    <Accordion :value="['0']" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>Header I</AccordionHeader>
        <AccordionContent>

        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>
