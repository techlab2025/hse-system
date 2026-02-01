<script setup lang="ts">
import Dialog from 'primevue/dialog';
import AddEmployee from '@/assets/images/AddEmployee.png';
import { ref } from "vue";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import AddHierarchyCard from './AddHierarchyCard.vue';
import AddEmployeeCard from './AddEmployeeCard.vue';
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue';

const visible = ref(false);
</script>

<template>
  <button @click="visible = true">{{ $t('Add Employee') }}</button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '65%' }">
    <template #header>
      <div class="add-employee-header">
        <HeaderSection :img="AddEmployee" title="add your employees"
          subtitle="follow the steps to add your employees easly" />
      </div>
    </template>
    <div class="employee-dialog-data">
      <hr class="add-employee-hr" />
      <Tabs value="0">
        <TabList>
          <Tab value="0">
            {{ $t('select the Hierarchy in each location') }}</Tab>
          <Tab value="1">{{ $t('add your employees') }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <AddHierarchyCard />
          </TabPanel>
          <TabPanel value="1">
            <AddEmployeeCard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </Dialog>
</template>
