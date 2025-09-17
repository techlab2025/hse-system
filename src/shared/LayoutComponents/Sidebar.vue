<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import { computed, defineProps, defineEmits} from "vue";
import IconsHome from "@/shared/icons/home.vue";
import IconsEmployee from "@/shared/icons/employee.vue";
import IconsClipboardText from "@/shared/icons/clipboardText.vue";
import IconsElement from "@/shared/icons/element.vue";
import IconsClipBoard from "@/shared/icons/clipBoard.vue";
import IconsTag from "@/shared/icons/tag.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  open: {
    type: Boolean,
    default: true,
  },
});

const isOpen = computed(() => props.open);
</script>

<template>
  <aside :class="['sidebar', isOpen ? 'open' : 'close']">

  </aside>
</template>

<style scoped></style>
