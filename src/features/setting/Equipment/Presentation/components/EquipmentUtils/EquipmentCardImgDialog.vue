<script setup lang=ts>
import Dialog from 'primevue/dialog';
import { ref, watch } from "vue";

const props = defineProps<{
  img: string
  Visable: boolean
}>()

const DialogVisable = ref(props.Visable);
watch(() => props.Visable, () => DialogVisable.value = props.Visable)

</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="DialogVisable" modal :dismissable-mask="true" :header="`Certificate Image `"
      :style="{ width: '40rem' }">
      <img class="img" :src="img" alt="img">
    </Dialog>
  </div>
</template>
