<script setup lang="ts">
import EmployeeBg from '@/assets/images/EmployeeBg.png'
import Yellowback from '@/assets/images/Yellowback.png'
import ShowTemplateIcon from '@/shared/icons/ShowTemplateIcon.vue';
import TemplateDocument from "./TemplateDocument.vue";
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import TemplateItemTagController from '@/features/setting/Template/Presentation/controllers/TemplateItemTagController';
import TemplateItemTagParams from '@/features/setting/Template/Core/params/TemplateItemTagParams';
import type TemplateItemTagModel from '@/features/setting/Template/Data/models/TemplateItemTagModel';
const route = useRoute()
const id = route.params.parent_id
const AllDocument = ref<TemplateItemTagModel[]>()
const templateItemTagController = TemplateItemTagController.getInstance()
const state = ref(templateItemTagController.state.value)


const FetchTemplateDocument = async () => {
  const templateItemTagParams = new TemplateItemTagParams(id)
  const Response = await templateItemTagController.TemplateItemTag(templateItemTagParams)
  if (Response.value.data) {
    AllDocument.value = Response.value.data
  }
}
onMounted(() => {
  FetchTemplateDocument()
})
watch(
  () => templateItemTagController.state.value,
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
