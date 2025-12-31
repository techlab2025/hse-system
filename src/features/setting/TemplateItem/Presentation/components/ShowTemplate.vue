<script setup lang="ts">
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
import ShowTemplateIcon from '@/shared/icons/ShowTemplateIcon.vue';
import TemplateDocument from "./TemplateDocument.vue";
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController';
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import type TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
const route = useRoute()
const id = route.params.parent_id
const AllDocument = ref<TemplateDetailsModel>()
const showTemplateController = ShowTemplateController.getInstance()
const state = ref(showTemplateController.state.value)
const FetchTemplateDocument = async () => {
  const showTemplateParams = new ShowTemplateParams(id)
  const Response = await showTemplateController.showTemplate(showTemplateParams)
  if (Response.value.data) {
    AllDocument.value = Response.value.data
  }
}
onMounted(() => {
  FetchTemplateDocument()
})
watch(
  () => showTemplateController.state.value,
  (newState) => {
    if (newState) {
      state.value = newState;
    }
  },
  {
    deep: true,
  },
);
</script>
<template>
  <DataStatus :controller="state">
    <template #success>
      <div class="show-template-container">
        <div class="left-header-background">
          <img class="left-blue-background" :src="EmployeeBg" alt="bg">
          <img class="left-yellow-background" :src="Yellowback" alt="bg">
        </div>
        <div class="template-title">
          <h2 class="title">Templet show</h2>
          <ShowTemplateIcon />
        </div>
        <div class="template-document">
          <TemplateDocument @update:data="FetchTemplateDocument" :allData="state.data" />
        </div>

        <div class="right-header-background">
          <img class="right-yellow-background" :src="Yellowback" alt="bg">
          <img class="right-blue-background" :src="EmployeeBg" alt="bg">
        </div>
      </div>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>

</template>
