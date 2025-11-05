<script setup lang="ts">
import { ref } from 'vue';
import ObjectivesDetails from './ObjectivesDetails.vue';
import HeaderSection from '../DetailsHeader/HeaderSection.vue';
import ObjectiveImg from "@/assets/images/objective.png"

const props = defineProps<{
  description: string
}>()

</script>

<template>
  <div class="main-objective">
    <HeaderSection :img="ObjectiveImg" :title="`main objectives`"
      :subtitle="`Defining the main objectives and expected outcomes of the project`" />
    <div class="objective-details">
      <ObjectivesDetails :object_details="description" />
    </div>
  </div>
</template>
