<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import SidebarUnicon from '@/shared/icons/SidebarUnicon.vue'

const props = defineProps<{ open: boolean }>()

const route = useRoute()
interface Routes {
  link: string | {}
  name: string
  permissions: PermissionsEnum[]
  icon: string
}
const { t } = useI18n()

const GauideRoutes = ref<Routes[]>([
  {
    link: '/organization/project-progress',
    name: t('overview'),
    icon: 'dashboard',
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.PROJECT_PROGRESS_ALL,
      PermissionsEnum.ORGANIZATION_ALL,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },
])

const OperationsRoutes = ref<Routes[]>([
  {
    link: '/organization/projects',
    name: t('Projects'),
    icon: 'briefcase-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipments',
    name: t('equipment'),
    icon: 'hard-hat',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/Investigating',
    name: t('investigations'),
    icon: 'search-alt',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/capa',
    name: t('CAPA'),
    icon: 'shield-check',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/incedant?isAll=1',
    name: t('Incidents'),
    icon: 'exclamation-triangle',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/observation?isAll=1&type=2',
    name: t('observations'),
    icon: 'eye',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
  {
    link: '/organization/equipment-mangement/inspection?inspectionType=1',
    name: t('Inspection'),
    icon: 'clipboard-notes',
    permissions: [PermissionsEnum.ADMIN, PermissionsEnum.ORGANIZATION_EMPLOYEE],
  },
])

const OrganizationRoutes = ref<Routes[]>([
  {
    link: '/organization/system-identity',
    name: t('system_identity'),
    icon: 'palette',
    permissions: [
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORGANIZATION_ALL,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },
  {
    link: '/organization/certificate',
    name: t('certificates'),
    icon: 'award',
    permissions: [
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_CREATE,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/template',
    name: t('templates'),
    icon: 'book-open',
    permissions: [
      PermissionsEnum.ORG_TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_CREATE,
      PermissionsEnum.ORG_TEMPLATE_DELETE,
      PermissionsEnum.ORG_TEMPLATE_FETCH,
      PermissionsEnum.ORG_TEMPLATE_UPDATE,
    ],
  },
  {
    link: '/organization/herikaly',
    name: t('positions'),
    icon: 'sitemap',
    permissions: [
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_CREATE,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
    ],
  },
  {
    link: '/organization/organization-employee',
    name: t('employees'),
    icon: 'users-alt',
    permissions: [
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ],
  },
  {
    link: '/organization/team',
    name: t('team'),
    icon: 'user-check',
    permissions: [
      PermissionsEnum.ORG_TEAM_ALL,
      PermissionsEnum.ORG_TEAM_CREATE,
      PermissionsEnum.ORG_TEAM_DELETE,
      PermissionsEnum.ORG_TEAM_FETCH,
      PermissionsEnum.ORG_TEAM_UPDATE,
    ],
  },
  {
    link: '/organization/contractor',
    name: t('contractors'),
    icon: 'constructor',
    permissions: [
      PermissionsEnum.ORG_CONTRACTOR_ALL,
      PermissionsEnum.ORG_CONTRACTOR_CREATE,
      PermissionsEnum.ORG_CONTRACTOR_DELETE,
      PermissionsEnum.ORG_CONTRACTOR_FETCH,
      PermissionsEnum.ORG_CONTRACTOR_UPDATE,
    ],
  },
  {
    link: '/organization/role',
    name: t('roles'),
    icon: 'shield-check',
    permissions: [
      PermissionsEnum.ORG_ROLE_ALL,
      PermissionsEnum.ORG_ROLE_CREATE,
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORG_ROLE_FETCH,
      PermissionsEnum.ORG_ROLE_UPDATE,
    ],
  },
  {
    link: '/organization/notification-plan',
    name: t('notification_plan'),
    icon: 'ticket',
    permissions: [
      PermissionsEnum.NOTIFICATION_PLAN_ALL,
      PermissionsEnum.NOTIFICATION_PLAN_CREATE,
      PermissionsEnum.NOTIFICATION_PLAN_FETCH,
      PermissionsEnum.NOTIFICATION_PLAN_UPDATE,
    ],
  },
  {
    link: '/organization/scope',
    name: t('contractor_scope'),
    icon: 'crosshair',
    permissions: [
      PermissionsEnum.SCOPE_ALL,
      PermissionsEnum.SCOPE_CREATE,
      PermissionsEnum.SCOPE_DELETE,
      PermissionsEnum.SCOPE_FETCH,
      PermissionsEnum.SCOPE_UPDATE,
    ],
  },
  {
    link: '/organization/where-house',
    name: t('warehouse'),
    icon: 'store',
    permissions: [
      PermissionsEnum.WHIERE_HOUSE_ALL,
      PermissionsEnum.WHIERE_HOUSE_CREATE,
      PermissionsEnum.WHIERE_HOUSE_DELETE,
      PermissionsEnum.WHIERE_HOUSE_FETCH,
      PermissionsEnum.WHIERE_HOUSE_UPDATE,
    ],
  },
  {
    link: '/organization/employee-certificate',
    name: t('employee_certificate'),
    icon: 'file-plus-alt',
    permissions: [
      PermissionsEnum.EMPLOYEE_CERTIFICATE_ALL,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_CREATE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_DELETE,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_FETCH,
      PermissionsEnum.EMPLOYEE_CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/serial-number',
    name: t('coding_system'),
    icon: 'qrcode-scan',
    permissions: [
      PermissionsEnum.CODING_SYSTEM_ALL,
      PermissionsEnum.CODING_SYSTEM_CREATE,
      PermissionsEnum.CODING_SYSTEM_DELETE,
      PermissionsEnum.CODING_SYSTEM_FETCH,
      PermissionsEnum.CODING_SYSTEM_UPDATE,
    ],
  },
  {
    link: '/organization/hazard',
    name: t('risk'),
    icon: 'shield-exclamation',
    permissions: [
      PermissionsEnum.ORG_HAZARD_ALL,
      PermissionsEnum.ORG_HAZARD_CREATE,
      PermissionsEnum.ORG_HAZARD_DELETE,
      PermissionsEnum.ORG_HAZARD_FETCH,
      PermissionsEnum.ORG_HAZARD_UPDATE,
    ],
  },
  {
    link: '/organization/factory',
    name: t('Hazard factor'),
    icon: 'exclamation-octagon',
    permissions: [
      PermissionsEnum.ORG_FACTORY_ALL,
      PermissionsEnum.ORG_FACTORY_CREATE,
      PermissionsEnum.ORG_FACTORY_DELETE,
      PermissionsEnum.ORG_FACTORY_FETCH,
      PermissionsEnum.ORG_FACTORY_UPDATE,
    ],
  },
  {
    link: '/organization/factories-items',
    name: t('Hazard factor item'),
    icon: 'circle-layer',
    permissions: [
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },
  {
    link: '/organization/document-refrence',
    name: 'Document Refrence',
    icon: 'file-contract',
    permissions: [
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_ALL,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_CREATE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_DELETE,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_FETCH,
      PermissionsEnum.ORG_DOCUMENTATION_REFERENCE_UPDATE,
    ],
  },
  {
    link: '/organization/shifts',
    name: t('shifts'),
    icon: 'clock',
    permissions: [
      PermissionsEnum.ORG_SHIFT_ALL,
      PermissionsEnum.ORG_SHIFT_CREATE,
      PermissionsEnum.ORG_SHIFT_DELETE,
      PermissionsEnum.ORG_SHIFT_FETCH,
      PermissionsEnum.ORG_SHIFT_UPDATE,
    ],
  },
])

const TicketRoutes = ref<Routes[]>([
  {
    link: '/organization/ticket',
    name: t('support'),
    icon: 'ticket',
    permissions: [
      PermissionsEnum.TICKET_ALL,
      PermissionsEnum.TICKET_CREATE,
      PermissionsEnum.TICKET_DELETE,
      PermissionsEnum.TICKET_FETCH,
      PermissionsEnum.TICKET_UPDATE,
    ],
  },
])
const LocationRoutes = ref<Routes[]>([
  {
    link: '/organization/countries',
    name: t('country'),
    icon: 'globe',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/states',
    name: t('state'),
    icon: 'map-marker-alt',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/cities',
    name: t('city'),
    icon: 'map',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/areas',
    name: t('location'),
    icon: 'location-point',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/project-zone',
    name: t('zones'),
    icon: 'map-pin-alt',
    permissions: [
      PermissionsEnum.PROJECT_ZONE_ALL,
      PermissionsEnum.PROJECT_ZONE_CREATE,
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.PROJECT_ZONE_FETCH,
      PermissionsEnum.PROJECT_ZONE_UPDATE,
    ],
  },
])

const LockUpsRoutes = ref<Routes[]>([
  {
    link: '/organization/where-house-type',
    name: t('warehouse_types'),
    icon: 'store-alt',
    permissions: [
      PermissionsEnum.WHIERE_HOUSE_TYPE_ALL,
      PermissionsEnum.WHIERE_HOUSE_TYPE_FETCH,
      PermissionsEnum.WHIERE_HOUSE_TYPE_DETAILS,
      PermissionsEnum.WHIERE_HOUSE_TYPE_CREATE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_UPDATE,
      PermissionsEnum.WHIERE_HOUSE_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/hazard-type',
    name: t('hazard_classifications'),
    icon: 'shield-exclamation',
    permissions: [
      PermissionsEnum.HAZARD_TYPE_ALL,
      PermissionsEnum.HAZARD_TYPE_FETCH,
      PermissionsEnum.HAZARD_TYPE_DETAILS,
      PermissionsEnum.HAZARD_TYPE_CREATE,
      PermissionsEnum.HAZARD_TYPE_UPDATE,
      PermissionsEnum.HAZARD_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/accidents-type',
    name: t('incident_types'),
    icon: 'exclamation-octagon',
    permissions: [
      PermissionsEnum.ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ACCIDENTS_TYPE_FETCH,
      PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
      PermissionsEnum.ACCIDENTS_TYPE_CREATE,
      PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ACCIDENTS_TYPE_DELETE,
    ],
  },
  // {
  //   link: '/organization/incident-category',
  //   name: t('incident_categories'),
  //   icon: 'list-ui-alt',
  //   permissions: [
  //     PermissionsEnum.ACCIDENTS_TYPE_ALL,
  //     PermissionsEnum.ACCIDENTS_TYPE_FETCH,
  //     PermissionsEnum.ACCIDENTS_TYPE_DETAILS,
  //     PermissionsEnum.ACCIDENTS_TYPE_CREATE,
  //     PermissionsEnum.ACCIDENTS_TYPE_UPDATE,
  //     PermissionsEnum.ACCIDENTS_TYPE_DELETE,
  //   ],
  // },
  {
    link: '/organization/observation-type',
    name: t('observation_type'),
    icon: 'eye',
    permissions: [
      PermissionsEnum.OBSERVATION_TYPE_ALL,
      PermissionsEnum.OBSERVATION_TYPE_FETCH,
      PermissionsEnum.OBSERVATION_TYPE_DETAILS,
      PermissionsEnum.OBSERVATION_TYPE_CREATE,
      PermissionsEnum.OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.OBSERVATION_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/equipment-types',
    name: t('equipment_types'),
    icon: 'wrench',
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
    ],
  },
  {
    link: '/organization/root-causes',
    name: t('root_causes'),
    icon: 'sitemap',
    permissions: [
      PermissionsEnum.ROOT_CAUSES_ALL,
      PermissionsEnum.ROOT_CAUSES_CREATE,
      PermissionsEnum.ROOT_CAUSES_DELETE,
      PermissionsEnum.ROOT_CAUSES_FETCH,
      PermissionsEnum.ROOT_CAUSES_UPDATE,
    ],
  },
  {
    link: '/organization/injury',
    name: t('injury'),
    icon: 'medical-square',
    permissions: [
      PermissionsEnum.INJURY_ALL,
      PermissionsEnum.INJURY_CREATE,
      PermissionsEnum.INJURY_DELETE,
      PermissionsEnum.INJURY_FETCH,
      PermissionsEnum.INJURY_UPDATE,
    ],
  },
])

const { user } = useUserStore()

interface RouteGroup {
  key: string
  label: string
  eyebrow: string
  icon: string
  routes: Routes[]
  permissions: PermissionsEnum[]
  adminOnly?: boolean
}

const flattenPermissions = (routes: Routes[]) =>
  routes.map((item) => item.permissions.map((permission) => permission)).flat()

const routeGroups = computed<RouteGroup[]>(() => [
  {
    key: 'overview',
    label: t('overview'),
    eyebrow: t('overview'),
    icon: 'dashboard',
    routes: GauideRoutes.value,
    permissions: flattenPermissions(GauideRoutes.value),
    adminOnly: true,
  },
  {
    key: 'operations',
    label: t('project managment'),
    eyebrow: t('project managment'),
    icon: 'briefcase-alt',
    routes: OperationsRoutes.value,
    permissions: flattenPermissions(OperationsRoutes.value),
  },
  {
    key: 'organization',
    label: t('organization_setting'),
    eyebrow: t('organization_setting'),
    icon: 'setting',
    routes: OrganizationRoutes.value,
    permissions: flattenPermissions(OrganizationRoutes.value),
  },
  {
    key: 'locations',
    label: t('location'),
    eyebrow: t('location'),
    icon: 'map-marker-alt',
    routes: LocationRoutes.value,
    permissions: [PermissionsEnum?.LOCATION_ORG_ALL],
  },
  {
    key: 'lockups',
    label: t('Lockups'),
    eyebrow: t('Lockups'),
    icon: 'lock',
    routes: LockUpsRoutes.value,
    permissions: flattenPermissions(LockUpsRoutes.value),
  },
  {
    key: 'support',
    label: t('support'),
    eyebrow: t('support'),
    icon: 'ticket',
    routes: TicketRoutes.value,
    permissions: flattenPermissions(TicketRoutes.value),
  },
])

const activeGroupKey = ref('operations')
const searchTerm = ref('')
const isPaneVisible = ref(false)
let closePaneTimer: number | undefined

const isLinkActive = (link: Routes['link']) => {
  if (typeof link !== 'string') return false

  const [pathOnly] = link.split('?')

  return route.fullPath === link || route.path === pathOnly
}

const groupHasActiveRoute = (group: RouteGroup) =>
  group.routes.some((item) => isLinkActive(item.link))

const activeGroup = computed(() => {
  return (
    routeGroups.value.find((group) => group.key === activeGroupKey.value) || routeGroups.value[0]
  )
})

const isSearching = computed(() => searchTerm.value.trim().length > 0)

const visibleRouteGroups = computed<RouteGroup[]>(() => {
  const query = searchTerm.value.trim().toLocaleLowerCase()
  const groups = query ? routeGroups.value : activeGroup.value ? [activeGroup.value] : []

  return groups
    .filter((group) => !group.adminOnly || user?.employeeType == EmployeeStatusEnum.Admin)
    .map((group) => {
      const routes = query
        ? group.routes.filter((item) => {
            const routeName = t(item.name).toLocaleLowerCase()
            const groupName = group.label.toLocaleLowerCase()

            return routeName.includes(query) || groupName.includes(query)
          })
        : group.routes

      return {
        ...group,
        routes,
      }
    })
    .filter((group) => group.routes.length > 0)
})

const selectGroup = (groupKey: string) => {
  activeGroupKey.value = groupKey
  searchTerm.value = ''
}

const clearClosePaneTimer = () => {
  if (!closePaneTimer) return

  window.clearTimeout(closePaneTimer)
  closePaneTimer = undefined
}

const openGroup = (groupKey: string) => {
  clearClosePaneTimer()
  selectGroup(groupKey)
  isPaneVisible.value = true
}

const keepPaneOpen = () => {
  clearClosePaneTimer()
}

const hidePane = () => {
  clearClosePaneTimer()
  isPaneVisible.value = false
  searchTerm.value = ''
}

const scheduleClosePane = () => {
  clearClosePaneTimer()

  closePaneTimer = window.setTimeout(() => {
    hidePane()
  }, 160)
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      hidePane()
    }
  },
)

watch(
  () => route.fullPath,
  () => {
    const routeGroup = routeGroups.value.find((group) => groupHasActiveRoute(group))

    if (routeGroup) {
      activeGroupKey.value = routeGroup.key
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  clearClosePaneTimer()
})
</script>

<template>
  <div class="modern-sidebar">
    <nav class="side-rail-nav" aria-label="Main sidebar groups">
      <template v-for="group in routeGroups" :key="group.key">
        <PermissionBuilder
          v-if="!group.adminOnly || user?.employeeType == EmployeeStatusEnum.Admin"
          :code="group.permissions"
        >
          <button
            type="button"
            :class="[
              'side-rail-btn',
              {
                'is-selected': activeGroupKey === group.key,
                'is-active': groupHasActiveRoute(group),
              },
            ]"
            :title="group.label"
            @click="openGroup(group.key)"
            @mouseenter="openGroup(group.key)"
            @mouseleave="scheduleClosePane"
            @focus="openGroup(group.key)"
            @blur="scheduleClosePane"
          >
            <SidebarUnicon :name="group.icon" class="strip-icon" />
            <span>{{ group.label }}</span>
          </button>
        </PermissionBuilder>
      </template>
    </nav>

    <Transition name="side-pane">
      <aside
        v-if="isPaneVisible && activeGroup"
        class="side-pane"
        @mouseenter="keepPaneOpen"
        @mouseleave="scheduleClosePane"
        @focusin="keepPaneOpen"
        @focusout="scheduleClosePane"
      >
        <header class="side-pane-header">
          <div class="side-pane-heading">
            <span class="side-pane-icon">
              <SidebarUnicon :name="activeGroup.icon" />
            </span>
            <div>
              <strong>{{ activeGroup.label }}</strong>
              <span>{{ activeGroup.eyebrow }}</span>
            </div>
          </div>

          <label class="sidebar-search">
            <SidebarUnicon name="search" class="sidebar-search__icon" />
            <input
              v-model="searchTerm"
              type="search"
              class="sidebar-search__input"
              :placeholder="$t('Search') || 'Search all routes...'"
              aria-label="Search all sidebar routes"
              @keydown.esc="hidePane"
            />
          </label>
        </header>

        <nav class="side-pane-routes" :aria-label="`${activeGroup.label} routes`">
          <div class="side-pane-routes__inner">
            <template v-for="group in visibleRouteGroups" :key="group.key">
              <PermissionBuilder v-if="isSearching" :code="group.permissions">
                <p class="side-route-group-title">{{ group.label }}</p>
              </PermissionBuilder>

              <PermissionBuilder
                v-for="sidebarRoute in group.routes"
                :key="`${group.key}-${String(sidebarRoute.link)}`"
                :code="sidebarRoute.permissions"
              >
                <router-link
                  :to="sidebarRoute.link"
                  :class="['side-btn', { active: isLinkActive(sidebarRoute.link) }]"
                  :title="$t(sidebarRoute.name)"
                  @click="hidePane"
                >
                  <SidebarUnicon :name="sidebarRoute.icon" class="side-icon" />
                  <span class="side-label-wrap">
                    <span class="side-label">{{ $t(sidebarRoute.name) }}</span>
                    <span v-if="isSearching" class="side-label-parent">{{ group.label }}</span>
                  </span>
                  <span class="side-link-arrow">›</span>
                </router-link>
              </PermissionBuilder>
            </template>

            <p v-if="!visibleRouteGroups.length" class="side-pane-empty">
              {{ $t('No Data Found') }}
            </p>
          </div>
        </nav>
      </aside>
    </Transition>
  </div>
</template>

<style scoped>
.side-pane-icon :deep(svg) {
  width: 35px !important;
  height: 35px !important;
}
.modern-sidebar {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  color: var(--text-on-brand);
  overscroll-behavior-x: none;
}

.side-rail-nav {
  display: flex;
  flex: 0 0 74px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  min-height: 0;
  padding: 8px 0 18px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  scrollbar-width: none;
}

.side-rail-nav::-webkit-scrollbar {
  display: none;
}

.side-rail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  width: 74px;
  min-height: 58px;
  padding: 7px 6px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: var(--brand-primary-100);
  cursor: pointer;
  text-align: center;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.side-rail-btn:hover,
.side-rail-btn.is-selected,
.side-rail-btn.is-active {
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 12%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-700) 18%, transparent);
  color: var(--text-on-brand);
  transform: translateY(-1px);
}

.side-rail-btn span {
  max-width: 62px;
  overflow: hidden;
  color: inherit;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.strip-icon,
.side-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: currentColor;
}

.strip-icon :deep(svg),
.side-icon :deep(svg),
.side-pane-icon :deep(svg),
.sidebar-search__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.side-pane {
  position: fixed;
  inset-block: 0;
  inset-inline-start: 90px;
  z-index: 10060;
  display: flex;
  width: 316px;
  height: 100vh;
  max-width: calc(100vw - 90px);
  flex-direction: column;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  padding: 22px 16px 14px;
  background:
    radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--surface-1) 10%, transparent) 0 18%, transparent 34%),
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--brand-primary-300) 9%, transparent) 0 16%, transparent 34%),
    linear-gradient(155deg, var(--brand-primary-600) 0%, var(--brand-primary-700) 44%, var(--brand-primary-800) 100%);
  border-inline-end: 1px solid color-mix(in srgb, var(--surface-1) 12%, transparent);
  box-shadow:
    18px 0 42px color-mix(in srgb, var(--brand-primary-700) 28%, transparent),
    inset -1px 0 0 color-mix(in srgb, var(--shadow-color) 12%, transparent);
}

.side-pane-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
}

.side-pane-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.side-pane-heading strong,
.side-pane-heading span {
  display: block;
}

.side-pane-heading strong {
  color: var(--text-on-brand);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.15;
}

.side-pane-heading div > span {
  margin-top: 3px;
  color: color-mix(in srgb, var(--brand-primary-100) 62%, transparent);
  font-size: 12px;
  font-weight: 700;
}

.side-pane-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 10%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-700) 20%, transparent);
  color: var(--text-on-brand);
}

.side-pane-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid color-mix(in srgb, var(--surface-1) 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-1) 7.5%, transparent);
  color: color-mix(in srgb, var(--brand-primary-100) 66%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 4%, transparent);
}

.sidebar-search__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.sidebar-search__input {
  min-width: 0;
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-on-brand);
  font-size: 12px;
  font-weight: 700;
}

.sidebar-search__input::placeholder {
  color: color-mix(in srgb, var(--brand-primary-100) 52%, transparent);
}

.side-pane-routes {
  min-height: 0;
  flex: 1 1 auto;
  margin-top: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-x: none;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--surface-1) 28%, transparent) transparent;
}

.side-pane-routes::-webkit-scrollbar {
  width: 4px;
}

.side-pane-routes::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: color-mix(in srgb, var(--surface-1) 28%, transparent);
}

.side-pane-routes__inner {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 18px;
}

.side-route-group-title {
  margin: 12px 4px 0;
  color: color-mix(in srgb, var(--brand-primary-100) 72%, transparent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.side-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  min-height: 48px;
  padding: 12px 13px;
  border: 1px solid transparent;
  border-radius: 14px;
  color: color-mix(in srgb, var(--brand-primary-100) 84%, transparent);
  text-decoration: none;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.side-btn:hover,
.side-btn.active,
.side-btn.router-link-active {
  border-color: color-mix(in srgb, var(--surface-1) 12%, transparent);
  background: color-mix(in srgb, var(--surface-1) 14%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 6%, transparent),
    0 12px 24px color-mix(in srgb, var(--brand-primary-700) 18%, transparent);
  color: var(--text-on-brand);
  transform: translateX(2px);
}

.side-label-wrap {
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 3px;
}

.side-label {
  min-width: 0;
  overflow: hidden;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-label-parent {
  overflow: hidden;
  color: color-mix(in srgb, var(--brand-primary-100) 50%, transparent);
  font-size: 10px;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-link-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: color-mix(in srgb, var(--brand-primary-100) 50%, transparent);
  font-size: 20px;
  line-height: 1;
}

.side-pane-empty {
  margin: 18px 0 0;
  color: color-mix(in srgb, var(--brand-primary-100) 62%, transparent);
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.hover-tooltip {
  position: fixed;
  z-index: 10070;
  padding: 7px 11px;
  border-radius: 8px;
  background: var(--brand-primary-900);
  box-shadow:
    0 8px 18px color-mix(in srgb, var(--shadow-color) 24%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--shadow-color) 6%, transparent);
  color: var(--text-on-brand);
  font-family: 'Regular', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  pointer-events: none;
  transform: translateY(-50%);
  white-space: nowrap;
}

.side-pane-enter-active,
.side-pane-leave-active,
.hover-tooltip-fade-enter-active,
.hover-tooltip-fade-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.side-pane-enter-from,
.side-pane-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.hover-tooltip-fade-enter-from,
.hover-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}

html[dir='rtl'] .side-btn:hover,
html[dir='rtl'] .side-btn.active,
html[dir='rtl'] .side-btn.router-link-active {
  transform: translateX(-2px);
}

@media (max-width: 768px) {
  .side-pane {
    inset-inline-start: 90px;
    width: calc(100vw - 90px);
  }
}
</style>
