<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import CloseSidebar from '@/shared/icons/CloseSidebar.vue'

import { ref } from 'vue'
import IconArrowDown from '@/shared/icons/IconArrowDown.vue'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const active = ref('0')
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">
    <div class="logo">
      <img src="@/assets/images/logo.svg" alt="logo" />
      <h2>HSE.Cloud.Ai</h2>
    </div>
    <button class="close-sidebar" @click="toggleSidebar">
      <CloseSidebar />
    </button>

    <div class="links">
      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader> Header I </AccordionHeader>

          <AccordionContent
            ><ul>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Header II</AccordionHeader>
          <AccordionContent>
            <ul>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
            </ul>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Header III</AccordionHeader>
          <AccordionContent>
            <ul>
              <li>
                <router-link to="/">
                  <IconHome />
                  <span>Home</span>
                </router-link>
              </li>
            </ul>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </aside>
</template>

<style scoped></style>
