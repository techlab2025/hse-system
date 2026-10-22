<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { ppeMatrixTabs } from '@/features/Organization/PPEMatrix/ppeMatrixTabs'
const IndexPPEActivity = defineAsyncComponent(
  () => import('@/features/Organization/PPEActivity/Presentation/components/IndexPPEActivity.vue'),
)
const IndexPPETool = defineAsyncComponent(
  () => import('@/features/Organization/PPETool/Presentation/components/IndexPPETool.vue'),
)

const route = useRoute()
const router = useRouter()
const tabs = computed(() =>
  ppeMatrixTabs.filter((tab) => PermissionHandler.Instance.handle(tab.permissions)),
)
const selectedTab = computed({
  get: () => tabs.value.find((tab) => tab.key === route.query.tab)?.key ?? tabs.value[0]?.key ?? '',
  set: (value: string | number) => {
    if (!tabs.value.some((tab) => tab.key === value)) return
    void router.replace({ query: { ...route.query, tab: value }, hash: route.hash })
  },
})
</script>

<template>
  <section class="ppe-matrix-settings hse-identity">
    <h1>{{ $t('PPE Matrix') }}</h1>
    <Tabs v-if="tabs.length" v-model:value="selectedTab" lazy>
      <TabList>
        <Tab v-for="tab in tabs" :key="tab.key" :value="tab.key">{{ $t(tab.label) }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.key" :value="tab.key">
          <IndexPPEActivity v-if="selectedTab === 'activities' && tab.key === 'activities'" />
          <IndexPPETool v-if="selectedTab === 'tools' && tab.key === 'tools'" />
        </TabPanel>
      </TabPanels>
    </Tabs>
    <p v-else role="status">{{ $t('permission_denied') }}</p>
  </section>
</template>

<style scoped>
:deep(.p-tab) {
  width: 50% !important;

}
.ppe-matrix-settings {
  display: grid;
  gap: 20px;
  min-width: 0;
}
.ppe-matrix-settings h1 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1.5rem;
}
.ppe-matrix-settings :deep(.p-tabpanels) {
  padding: 20px 0;
  background: transparent;
}
:deep(.p-tablist-tab-list) {
  border-bottom: none;
}
</style>
