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
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
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
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.ACCIDENTS_TYPE_ALL,
                      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
                      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
                      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
                      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/accidents-types">
                      <SidebarVector />
                      <span>Accidents Types</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.FACTORY_ALL,
                      PermissionsEnum.FACTORY_CREATE,
                      PermissionsEnum.FACTORY_DELETE,
                      PermissionsEnum.FACTORY_FETCH,
                      PermissionsEnum.FACTORY_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/factories">
                      <SidebarVector />
                      <span>Factories</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.PROJECT_TYPE_ALL,
                      PermissionsEnum.PROJECT_TYPE_CREATE,
                      PermissionsEnum.PROJECT_TYPE_DELETE,
                      PermissionsEnum.PROJECT_TYPE_FETCH,
                      PermissionsEnum.PROJECT_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/project-types">
                      <SidebarVector />
                      <span>Project Types</span>
                      >
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
