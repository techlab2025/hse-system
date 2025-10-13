<script lang="ts" setup>
import CheckBoxButton from '@/shared/Checkbox/CheckBoxButton.vue';
import CheckBoxImg from "@/assets/images/CheckBoxImg.png"
import { ref } from 'vue';
import ActionsButtons from '@/shared/Actions/ActionsButtons.vue';
const ActionNumber = ref()
</script>
<template>
  <!-- <h1>Welcome</h1> -->
  <ActionsButtons @update:action="ActionNumber = $event" />




</template>



<style></style>
