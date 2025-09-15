<script setup lang="ts">
import Popover from "primevue/popover";
import DeleteDialog from "../../base/presentation/Dialogs/MainDialogs/DeleteDialog.vue";
import { ref, defineProps } from "vue";
import IconDropList from "@/shared/icons/IconDropList.vue";

interface ActionItem {
  text: string;
  icon: any;
  link?: string;
  action?: () => void;
}

const emit = defineEmits(["delete"]);
defineOptions({ inheritAttrs: false });

const op = ref();
const toggle = (event: Event) => {
  op.value.toggle(event);
};

const props = defineProps<{
  actionList: ActionItem[];
}>();

const actions = props.actionList;
</script>

<template>
  <div class="list-trigger" @click="toggle">
    <IconDropList />
  </div>

  <Popover ref="op">
    <div class="list-body">
      <ul>
        <li class="list-item" v-for="action in actions" :key="action.text">
          <router-link
            v-if="action.link"
            :to="action.link"
            class="flex items-center gap-sm"
          >
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </router-link>
          <button
            v-if="action.action && action.text != $t('delete')"
            @click="action.action"
            class="flex items-center gap-sm"
          >
            <component :is="action.icon" />
            <span>{{ action.text }}</span>
          </button>
          <DeleteDialog
            v-if="action.text == $t('delete')"
            @delete="action.action"
          />
        </li>
      </ul>
    </div>
  </Popover>
</template>

<style scoped></style>
