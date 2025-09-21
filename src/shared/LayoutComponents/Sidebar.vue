<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import CloseSidebar from '@/shared/icons/CloseSidebar.vue'

import { ref } from 'vue'
import IconArrowDown from '@/shared/icons/IconArrowDown.vue'
import SidebarVector from '@/shared/icons/SidebarVector.vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/employee/Core/Enum/permission_enum'

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
        <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
          <AccordionPanel value="0">
            <AccordionHeader> Header I </AccordionHeader>

            <AccordionContent
              ><ul>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />
                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />

                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />

                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />

                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
        </PermissionBuilder>

        <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
          <AccordionPanel value="1">
            <AccordionHeader>Header II</AccordionHeader>
            <AccordionContent>
              <ul>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />

                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
        </PermissionBuilder>

        <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
          <AccordionPanel value="2">
            <AccordionHeader>Header III</AccordionHeader>
            <AccordionContent>
              <ul>
                <li>
                  <PermissionBuilder :code="[PermissionsEnum?.AdminAll]">
                    <router-link to="/">
                      <SidebarVector />

                      <IconHome />
                      <span>Home</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
              </ul>
            </AccordionContent>
          </AccordionPanel>
        </PermissionBuilder>
      </Accordion>
    </div>
  </aside>
</template>

<style scoped></style>
