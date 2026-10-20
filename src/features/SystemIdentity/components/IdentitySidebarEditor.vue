<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { organizationNavigation } from '@/shared/LayoutComponents/organizationNavigation'
import { defaultAppearance, type Appearance } from '../appearance'
import IdentityOrderList from './IdentityOrderList.vue'

const model = defineModel<Appearance>({ required: true })
const { t } = useI18n()
const groups = computed(() =>
  organizationNavigation.map((group) => ({
    key: group.key,
    label: t(group.label),
  })),
)
const menus = computed(() =>
  Object.fromEntries(
    organizationNavigation.map((group) => [
      group.key,
      {
        label: t(group.label),
        items: group.routes.map((route) => ({ key: route.name, label: t(route.name) })),
        children: Object.fromEntries(
          group.routes.map((route) => [
            route.name,
            (route.children ?? []).map((child) => ({ key: child.name, label: t(child.name) })),
          ]),
        ),
      },
    ]),
  ),
)
const reset = () => {
  const defaults = defaultAppearance()
  model.value.sidebarOrder = defaults.sidebarOrder
  model.value.sidebarItemOrder = defaults.sidebarItemOrder
}
</script>

<template>
  <section class="identity-editor identity-sidebar-editor">
    <div class="identity-editor-heading">
      <div>
        <h2>Sidebar layout</h2>
        <p>
          Drag groups to arrange the sidebar. Expand a group to arrange its menu items and submenus.
        </p>
      </div>
      <button type="button" @click="reset">Restore sidebar order</button>
    </div>
    <p>
      Arrow buttons work with a keyboard or touch screen. Menu access follows each user's
      permissions.
    </p>
    <IdentityOrderList v-model="model.sidebarOrder" :items="groups" label="Sidebar group order">
      <template #default="{ item }">
        <details class="identity-sidebar-details">
          <summary>{{ menus[item].label }} menu items</summary>
          <IdentityOrderList
            v-model="model.sidebarItemOrder[item]"
            :items="menus[item].items"
            :label="`${item} menu order`"
          >
            <template #default="{ item: routeName }">
              <div v-if="menus[item].children[routeName]?.length" class="identity-order-group">
                <p>Submenu items</p>
                <IdentityOrderList
                  v-model="model.sidebarItemOrder[`${item}/${routeName}`]"
                  :items="menus[item].children[routeName]"
                  :label="`${routeName} submenu order`"
                />
              </div>
            </template>
          </IdentityOrderList>
        </details>
      </template>
    </IdentityOrderList>
  </section>
</template>
