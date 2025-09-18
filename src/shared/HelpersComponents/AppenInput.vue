<script setup lang="ts">
import { ref, watch } from "vue";

// Props
const props = defineProps<{
  modelValue: { title: string }[];
}>();

// Emit
const emit = defineEmits<{
  (e: "update:modelValue", value: { title: string }[]): void;
}>();

// Local copy of inputs
const inputs = ref([...props.modelValue]);

// Sync when parent updates
watch(
  () => props.modelValue,
  (newVal) => {
    inputs.value = [...newVal];
  },
  { deep: true }
);

// Sync back to parent
watch(
  inputs,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true }
);

// Add new input
const addInput = () => {
  inputs.value.push({ title: "" });
};

// Remove input by index
const removeInput = (index: number) => {
  inputs.value.splice(index, 1);
};
</script>

<template>
  <div>
    <div
      class="input-append"
      v-for="(input, index) in inputs"
      :key="index"
    >
      <!-- Add button for first row -->
      <button
        type="button"
        class="btn-add"
        :class="{ added: inputs.length > 1 }"
        v-if="index === 0"
        @click="addInput"
      >
        <IconAdd />
      </button>

      <!-- Remove button for all other rows -->
      <button
        type="button"
        class="btn-minus"
        v-if="index !== 0"
        @click="removeInput(index)"
      >
        <IconMinus />
      </button>

      <!-- Input -->
      <div class="input-wrapper">
        <label for="">Title</label>
        <input
          type="text"
          v-model="input.title"
          placeholder="Enter Title"
        />
      </div>
      <div class="file">


      </div>
    </div>
  </div>
</template>
