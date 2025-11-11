<script setup lang="ts">
import Dialog from 'primevue/dialog';
import EquipmentImg from '@/assets/images/Equipment.png';
import { ref } from "vue";
import HeaderSection from '../../Details/DetailsHeader/HeaderSection.vue';
import EquipmentForm from './EquipmentForm.vue';
import AddTollIcon from '@/shared/icons/AddTollIcon.vue';
const visible = ref(false);
const props = defineProps<{
  zoonId: number
}>()

const UpdateData = () => {
  visible.value = false
}

</script>

<template>
  <AddTollIcon @click="visible = true" class="cursor-pointer" />
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :style="{ width: '50rem', height: '30%' }">
    <template #header>
      <div class="add-equipment-header">
        <HeaderSection :img="EquipmentImg" title="Equipment , Devices & Tools"
          subtitle="Choose for each zone all the equipment and devices you want." />
      </div>
    </template>
    <div class="equipment-dialog-data">
      <hr class="add-equipment-hr" />
      <EquipmentForm :zoonId="zoonId" @update:data="UpdateData" />
    </div>
  </Dialog>
</template>
