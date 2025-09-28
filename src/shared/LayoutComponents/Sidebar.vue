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
    <div class="sidebar-wrapper">
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
                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.HAZARD_TYPE_ALL,-->
                <!--                      PermissionsEnum.HAZARD_TYPE_CREATE,-->
                <!--                      PermissionsEnum.HAZARD_TYPE_DELETE,-->
                <!--                      PermissionsEnum.HAZARD_TYPE_FETCH,-->
                <!--                      PermissionsEnum.HAZARD_TYPE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/hazard-types">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Hazard Types</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.ACCIDENTS_TYPE_ALL,-->
                <!--                      PermissionsEnum.ACCIDENTS_TYPE_CREATE,-->
                <!--                      PermissionsEnum.ACCIDENTS_TYPE_DELETE,-->
                <!--                      PermissionsEnum.ACCIDENTS_TYPE_FETCH,-->
                <!--                      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/accidents-types">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Accidents Types</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.FACTORY_ITEM_ALL,-->
                <!--                      PermissionsEnum.FACTORY_ITEM_CREATE,-->
                <!--                      PermissionsEnum.FACTORY_ITEM_DELETE,-->
                <!--                      PermissionsEnum.FACTORY_ITEM_FETCH,-->
                <!--                      PermissionsEnum.FACTORY_ITEM_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/factories-items">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Factories Items</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.FACTORY_ALL,-->
                <!--                      PermissionsEnum.FACTORY_CREATE,-->
                <!--                      PermissionsEnum.FACTORY_DELETE,-->
                <!--                      PermissionsEnum.FACTORY_FETCH,-->
                <!--                      PermissionsEnum.FACTORY_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/factories">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Factories</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->

                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.CERTIFICATE_ALL,-->
                <!--                      PermissionsEnum.CERTIFICATE_CREATE,-->
                <!--                      PermissionsEnum.CERTIFICATE_DELETE,-->
                <!--                      PermissionsEnum.CERTIFICATE_FETCH,-->
                <!--                      PermissionsEnum.CERTIFICATE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/certificates">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Certificates</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->

                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.TEMPLATE_ALL,-->
                <!--                      PermissionsEnum.TEMPLATE_CREATE,-->
                <!--                      PermissionsEnum.TEMPLATE_DELETE,-->
                <!--                      PermissionsEnum.TEMPLATE_FETCH,-->
                <!--                      PermissionsEnum.TEMPLATE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/templates">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Templates</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->

                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.CERTIFICATE_ALL,-->
                <!--                      PermissionsEnum.CERTIFICATE_CREATE,-->
                <!--                      PermissionsEnum.CERTIFICATE_DELETE,-->
                <!--                      PermissionsEnum.CERTIFICATE_FETCH,-->
                <!--                      PermissionsEnum.CERTIFICATE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/certificates">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Certificates</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->

                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.PROJECT_TYPE_ALL,-->
                <!--                      PermissionsEnum.PROJECT_TYPE_CREATE,-->
                <!--                      PermissionsEnum.PROJECT_TYPE_DELETE,-->
                <!--                      PermissionsEnum.PROJECT_TYPE_FETCH,-->
                <!--                      PermissionsEnum.PROJECT_TYPE_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/project-types">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Project Types</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->
                <!--                <li>-->
                <!--                  <PermissionBuilder-->
                <!--                    :code="[-->
                <!--                      PermissionsEnum.ORGANIZATION_ALL,-->
                <!--                      PermissionsEnum.ORGANIZATION_CREATE,-->
                <!--                      PermissionsEnum.ORGANIZATION_DELETE,-->
                <!--                      PermissionsEnum.ORGANIZATION_FETCH,-->
                <!--                      PermissionsEnum.ORGANIZATION_UPDATE,-->
                <!--                    ]"-->
                <!--                  >-->
                <!--                    <router-link to="/admin/organization">-->
                <!--                      <SidebarVector />-->
                <!--                      <span>Organization</span>-->
                <!--                    </router-link>-->
                <!--                  </PermissionBuilder>-->
                <!--                </li>-->
              </ul>
              </AccordionContent>
            </AccordionPanel>
          </PermissionBuilder>
        </Accordion>
        <!--      <Accordion value="1">-->
        <!--        <PermissionBuilder :code="[PermissionsEnum?.ADMIN]">-->
        <!--          <AccordionPanel value="1">-->
        <!--            <AccordionHeader>-->
        <!--              <div class="links-header">-->
        <!--                <IconSetting />-->
        <!--                Location-->
        <!--              </div>-->
        <!--            </AccordionHeader>-->

        <!--            <AccordionContent-->
        <!--              ><ul>-->
        <!--                <li>-->
        <!--                  <PermissionBuilder-->
        <!--                    :code="[-->
        <!--                      PermissionsEnum?.ADMIN,-->
        <!--                      PermissionsEnum?.LOCATION_ALL,-->
        <!--                      PermissionsEnum.LOCATION_CREATE,-->
        <!--                      PermissionsEnum.LOCATION_UPDATE,-->
        <!--                      PermissionsEnum.LOCATION_DETAILS,-->
        <!--                      PermissionsEnum.LOCATION_DELETE,-->
        <!--                      PermissionsEnum.LOCATION_FETCH,-->
        <!--                    ]"-->
        <!--                  >-->
        <!--                    <router-link to="/admin/countries">-->
        <!--                      <SidebarVector />-->
        <!--                      <span>Location Country</span>-->
        <!--                    </router-link>-->
        <!--                  </PermissionBuilder>-->
        <!--                </li>-->
        <!--                <li>-->
        <!--                  <PermissionBuilder-->
        <!--                    :code="[-->
        <!--                      PermissionsEnum?.ADMIN,-->
        <!--                      PermissionsEnum.LOCATION_ALL,-->
        <!--                      PermissionsEnum.LOCATION_CREATE,-->
        <!--                      PermissionsEnum.LOCATION_DELETE,-->
        <!--                      PermissionsEnum.LOCATION_FETCH,-->
        <!--                      PermissionsEnum.LOCATION_UPDATE,-->
        <!--                    ]"-->
        <!--                  >-->
        <!--                    <router-link to="/admin/states">-->
        <!--                      <SidebarVector />-->
        <!--                      <span>Location State</span>-->
        <!--                    </router-link>-->
        <!--                  </PermissionBuilder>-->
        <!--                </li>-->
        <!--                <li>-->
        <!--                  <PermissionBuilder-->
        <!--                    :code="[-->
        <!--                      PermissionsEnum?.ADMIN,-->
        <!--                      PermissionsEnum.LOCATION_ALL,-->
        <!--                      PermissionsEnum.LOCATION_CREATE,-->
        <!--                      PermissionsEnum.LOCATION_DELETE,-->
        <!--                      PermissionsEnum.LOCATION_FETCH,-->
        <!--                      PermissionsEnum.LOCATION_UPDATE,-->
        <!--                    ]"-->
        <!--                  >-->
        <!--                    <router-link to="/admin/cities">-->
        <!--                      <SidebarVector />-->
        <!--                      <span>Location City</span>-->
        <!--                    </router-link>-->
        <!--                  </PermissionBuilder>-->
        <!--                </li>-->
        <!--                <li>-->
        <!--                  <PermissionBuilder-->
        <!--                    :code="[-->
        <!--                      PermissionsEnum?.ADMIN,-->
        <!--                      PermissionsEnum.LOCATION_ALL,-->
        <!--                      PermissionsEnum.LOCATION_CREATE,-->
        <!--                      PermissionsEnum.LOCATION_DELETE,-->
        <!--                      PermissionsEnum.LOCATION_FETCH,-->
        <!--                      PermissionsEnum.LOCATION_UPDATE,-->
        <!--                    ]"-->
        <!--                  >-->
        <!--                    <router-link to="/admin/areas">-->
        <!--                      <SidebarVector />-->
        <!--                      <span>Location Area</span>-->
        <!--                    </router-link>-->
        <!--                  </PermissionBuilder>-->
        <!--                </li>-->
        <!--              </ul>-->
        <!--            </AccordionContent>-->
        <!--          </AccordionPanel>-->
        <!--        </PermissionBuilder>-->
        <!--      </Accordion>-->
        <Accordion value="2">
          <PermissionBuilder :code="[PermissionsEnum?.ADMIN]">
            <AccordionPanel value="2">
              <AccordionHeader>
                <div class="links-header">
                  <IconSetting />
                  Website
                </div>
              </AccordionHeader>

              <AccordionContent
              ><ul>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.WEBSITE,
                      PermissionsEnum?.CLIENT_OPINION_ALL,
                      PermissionsEnum.CLIENT_OPINION_CREATE,
                      PermissionsEnum.CLIENT_OPINION_UPDATE,
                      PermissionsEnum.CLIENT_OPINION_DETAILS,
                      PermissionsEnum.CLIENT_OPINION_DELETE,
                      PermissionsEnum.CLIENT_OPINION_FETCH,
                    ]"
                  >
                    <router-link to="/admin/client-opinions">
                      <SidebarVector />
                      <span>Client Opinion</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum?.WEBSITE,
                      PermissionsEnum?.HOME_CONTACT_US_ALL,
                      PermissionsEnum.HOME_CONTACT_US_CREATE,
                      PermissionsEnum.HOME_CONTACT_US_UPDATE,
                      PermissionsEnum.HOME_CONTACT_US_DETAILS,
                      PermissionsEnum.HOME_CONTACT_US_DELETE,
                      PermissionsEnum.HOME_CONTACT_US_FETCH,
                    ]"
                  >
                    <router-link to="/admin/home-contact-us">
                      <SidebarVector />
                      <span>Home Contact Us</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.CATEGORY_ALL,
                      PermissionsEnum.CATEGORY_CREATE,
                      PermissionsEnum.CATEGORY_DELETE,
                      PermissionsEnum.CATEGORY_FETCH,
                      PermissionsEnum.CATEGORY_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/categories">
                      <SidebarVector />
                      <span>Categories</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.SERVICE_ALL,
                      PermissionsEnum.SERVICE_CREATE,
                      PermissionsEnum.SERVICE_DELETE,
                      PermissionsEnum.SERVICE_FETCH,
                      PermissionsEnum.SERVICE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/services">
                      <SidebarVector />
                      <span>Services</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.HASHTAG_ALL,
                      PermissionsEnum.HASHTAG_CREATE,
                      PermissionsEnum.HASHTAG_DELETE,
                      PermissionsEnum.HASHTAG_FETCH,
                      PermissionsEnum.HASHTAG_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/hashtags">
                      <SidebarVector />
                      <span>Hashtags</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <!-- Term -->
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.TERM_ALL,
                      PermissionsEnum.TERM_CREATE,
                      PermissionsEnum.TERM_DELETE,
                      PermissionsEnum.TERM_FETCH,
                      PermissionsEnum.TERM_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/term/add">
                      <SidebarVector />
                      <span>Terms</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.HEADER_ALL,
                      PermissionsEnum.HEADER_CREATE,
                      PermissionsEnum.HEADER_DELETE,
                      PermissionsEnum.HEADER_FETCH,
                      PermissionsEnum.HEADER_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/headers">
                      <SidebarVector />
                      <span>Header</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.SERVICE_FEATURE_ALL,
                      PermissionsEnum.SERVICE_FEATURE_CREATE,
                      PermissionsEnum.SERVICE_FEATURE_DELETE,
                      PermissionsEnum.SERVICE_FEATURE_FETCH,
                      PermissionsEnum.SERVICE_FEATURE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/service_features">
                      <SidebarVector />
                      <span>Service Features</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.SERVICE_SECTION_ALL,
                      PermissionsEnum.SERVICE_SECTION_CREATE,
                      PermissionsEnum.SERVICE_SECTION_DELETE,
                      PermissionsEnum.SERVICE_SECTION_FETCH,
                      PermissionsEnum.SERVICE_SECTION_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/service_section">
                      <SidebarVector />
                      <span>Service Section</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.POWERFUL_FEATURE_ALL,
                      PermissionsEnum.POWERFUL_FEATURE_CREATE,
                      PermissionsEnum.POWERFUL_FEATURE_DELETE,
                      PermissionsEnum.POWERFUL_FEATURE_FETCH,
                      PermissionsEnum.POWERFUL_FEATURE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/powerfull-features">
                      <SidebarVector />
                      <span>PowerFull</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.SYSTEM_WORK_ALL,
                      PermissionsEnum.SYSTEM_WORK_CREATE,
                      PermissionsEnum.SYSTEM_WORK_DELETE,
                      PermissionsEnum.SYSTEM_WORK_FETCH,
                      PermissionsEnum.SYSTEM_WORK_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system-works">
                      <SidebarVector />
                      <span>System Work</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <!-- Privacy -->
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.PRIVACY_ALL,
                      PermissionsEnum.PRIVACY_CREATE_OR_UPDATE,
                      PermissionsEnum.PRIVACY_FETCH,
                    ]"
                  >
                    <router-link to="/admin/privacy/add">
                      <SidebarVector />
                      <span>Privacy</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.HOME_VIEW_PRICING_ALL,
                      PermissionsEnum.HOME_VIEW_PRICING_CREATE,
                      PermissionsEnum.HOME_VIEW_PRICING_DELETE,
                      PermissionsEnum.HOME_VIEW_PRICING_FETCH,
                      PermissionsEnum.HOME_VIEW_PRICING_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/home-view-pricing">
                      <SidebarVector />
                      <span>{{ $t('homeViewPricing') }}</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.SERVICE_LOG_ALL,
                      PermissionsEnum.SERVICE_LOG_CREATE,
                      PermissionsEnum.SERVICE_LOG_DELETE,
                      PermissionsEnum.SERVICE_LOG_FETCH,
                      PermissionsEnum.SERVICE_LOG_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/service_logs">
                      <SidebarVector />
                      <span>Service Logs</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <!-- Blog -->
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.BLOG_ALL,
                      PermissionsEnum.BLOG_CREATE,
                      PermissionsEnum.BLOG_DELETE,
                      PermissionsEnum.BLOG_FETCH,
                      PermissionsEnum.BLOG_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/blog">
                      <SidebarVector />
                      <span>Blogs</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.HOME_ABOUT_US_ALL,
                      PermissionsEnum.HOME_ABOUT_US_CREATE,
                      PermissionsEnum.HOME_ABOUT_US_DELETE,
                      PermissionsEnum.HOME_ABOUT_US_FETCH,
                      PermissionsEnum.HOME_ABOUT_US_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/home-about-us">
                      <SidebarVector />
                      <span>{{ $t('home_about_us') }}</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.ABOUT_US_FEATURE_ALL,
                      PermissionsEnum.ABOUT_US_FEATURE_CREATE,
                      PermissionsEnum.ABOUT_US_FEATURE_DELETE,
                      PermissionsEnum.ABOUT_US_FEATURE_FETCH,
                      PermissionsEnum.ABOUT_US_FEATURE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/about-us-features">
                      <SidebarVector />
                      <span>{{ $t('about_us_features') }}</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.ABOUT_US_CORE_ALL,
                      PermissionsEnum.ABOUT_US_CORE_CREATE,
                      PermissionsEnum.ABOUT_US_CORE_DELETE,
                      PermissionsEnum.ABOUT_US_CORE_FETCH,
                      PermissionsEnum.ABOUT_US_CORE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/about-us-core">
                      <SidebarVector />
                      <span>{{ $t('about_us_core') }}</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <!-- Faq -->
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.FAQ_ALL,
                      PermissionsEnum.FAQ_CREATE,
                      PermissionsEnum.FAQ_DELETE,
                      PermissionsEnum.FAQ_FETCH,
                      PermissionsEnum.FAQ_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/faq">
                      <SidebarVector />
                      <span>Faqs</span>
                    </router-link>
                  </PermissionBuilder>
                </li>

                <!-- system risk management -->
                <!-- <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum. OUR_SYSTEM_RISK_MANAGEMENT_ALL,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_CREATE,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_DELETE,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_FETCH,
                      PermissionsEnum.OUR_SYSTEM_RISK_MANAGEMENT_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system-risk-management">
                      <SidebarVector />
                      <span>System Risk Management</span>
                    </router-link>
                  </PermissionBuilder>
                </li> -->
              </ul>
              <!-- OUR SYSTEM STEP -->
              <ul>
                <!-- <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.OUR_SYSTEM_STEP_ALL,
                      PermissionsEnum.OUR_SYSTEM_STEP_CREATE,
                      PermissionsEnum.OUR_SYSTEM_STEP_DELETE,
                      PermissionsEnum.OUR_SYSTEM_STEP_FETCH,
                      PermissionsEnum.OUR_SYSTEM_STEP_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/our-system-step">
                      <SidebarVector />
                      <span>Our System Steps</span>
                    </router-link>
                  </PermissionBuilder>
                </li> -->
                <!-- <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.OUR_SYSTEM_BANNER_ALL,
                      PermissionsEnum.OUR_SYSTEM_BANNER_CREATE,
                      PermissionsEnum.OUR_SYSTEM_BANNER_DELETE,
                      PermissionsEnum.OUR_SYSTEM_BANNER_FETCH,
                      PermissionsEnum.OUR_SYSTEM_BANNER_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system_banner">
                      <SidebarVector />
                      <span>System Banner</span>
                    </router-link>
                  </PermissionBuilder>
                </li> -->
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.OUR_SYSTEM_FEATURE_ALL,
                      PermissionsEnum.OUR_SYSTEM_FEATURE_CREATE,
                      PermissionsEnum.OUR_SYSTEM_FEATURE_DELETE,
                      PermissionsEnum.OUR_SYSTEM_FEATURE_FETCH,
                      PermissionsEnum.OUR_SYSTEM_FEATURE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system_feature">
                      <SidebarVector />
                      <span>System Feature</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system_risk_type">
                      <SidebarVector />
                      <span>System Risk Type</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
                <li>
                  <PermissionBuilder
                    :code="[
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_ALL,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_CREATE,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_DELETE,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_FETCH,
                      PermissionsEnum.OUR_SYSTEM_RISK_TYPE_UPDATE,
                    ]"
                  >
                    <router-link to="/admin/system_components">
                      <SidebarVector />
                      <span>System Component</span>
                    </router-link>
                  </PermissionBuilder>
                </li>
              </ul>
              </AccordionContent>
            </AccordionPanel>
          </PermissionBuilder>
        </Accordion>
      </div>
    </div>

  </aside>
</template>

<style scoped></style>
