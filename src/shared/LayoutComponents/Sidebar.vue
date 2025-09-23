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
import IconSetting from '@/shared/icons/IconSetting.vue'

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
            <AccordionHeader>
              <div class="links-header">
                <IconSetting />
                Settings
              </div>
            </AccordionHeader>

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
                      <span>languages</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.ADMIN,
                      PermissionsEnum?.LANGUAGE_ALL,
                      PermissionsEnum.INDUSTRY_ALL,
                      PermissionsEnum.INDUSTRY_CREATE,
                      PermissionsEnum.INDUSTRY_DELETE,
                      PermissionsEnum.INDUSTRY_FETCH,
                      PermissionsEnum.INDUSTRY_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/industry">
                      <SidebarVector />
                      <span>Industries</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
<<<<<<< HEAD

=======
>>>>>>> b89215bdc3ad695cc04beb6de62dad9106296d59
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.ADMIN,
                      PermissionsEnum.EQUIPMENT_TYPE_ALL,
                      PermissionsEnum.EQUIPMENT_TYPE_CREATE,
                      PermissionsEnum.EQUIPMENT_TYPE_DELETE,
                      PermissionsEnum.EQUIPMENT_TYPE_FETCH,
                      PermissionsEnum.EQUIPMENT_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/equipment-types">
                      <SidebarVector />
                      <span>Equipment Types</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.ADMIN,
<<<<<<< HEAD
                      PermissionsEnum.EQUIPMENT_ALL,
                      PermissionsEnum.EQUIPMENT_CREATE,
                      PermissionsEnum.EQUIPMENT_DELETE,
                      PermissionsEnum.EQUIPMENT_FETCH,
                      PermissionsEnum.EQUIPMENT_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/equipments">
                      <SidebarVector />
                      <span>Equipment</span>
=======
                      PermissionsEnum.HAZARD_TYPE_ALL,
                      PermissionsEnum.HAZARD_TYPE_CREATE,
                      PermissionsEnum.HAZARD_TYPE_DELETE,
                      PermissionsEnum.HAZARD_TYPE_FETCH,
                      PermissionsEnum.HAZARD_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/hazard-types">
                      <SidebarVector />
                      <span>Hazard Types</span>
>>>>>>> b89215bdc3ad695cc04beb6de62dad9106296d59
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
