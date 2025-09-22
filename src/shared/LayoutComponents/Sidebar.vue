<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import CloseSidebar from '@/shared/icons/CloseSidebar.vue'

import { ref } from 'vue'
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
        <PermissionBuilder :code="[PermissionsEnum?.ADMIN]">
          <AccordionPanel value="0">
            <AccordionHeader> Settings </AccordionHeader>

            <AccordionContent
              ><ul>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.ADMIN,
                      PermissionsEnum?.LANGUAGE_ALL,
                      PermissionsEnum.LANGUAGE_CREATE,
                      PermissionsEnum.LANGUAGE_UPDATE,
                      PermissionsEnum.LANGUAGE_DETAILS,
                      PermissionsEnum.LANGUAGE_DELETE,
                      PermissionsEnum.LANGUAGE_FETCH,
                    ]"
                  >
                    <router-link to="/admin/languages">
                      <SidebarVector />
                      <IconHome />
                      <span>languages</span>
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
