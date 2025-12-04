<script lang="ts" setup>
import { ref } from 'vue'
import RadioButton from 'primevue/radiobutton'
import FactorItemIcon from '@/shared/icons/FactorItemIcon.vue'

const selectedFactor = ref('')
const selectedSubItem = ref('')

const subItemsMap = {
  factor1: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub11' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub12' },
  ],
  factor2: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub21' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub22' },
  ],
  item1: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub31' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub32' },
  ],
  item2: [
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub41' },
    { label: 'Lorem Ipsum is simply dummy text', value: 'sub42' },
  ],
}

const emit = defineEmits(['update:data'])
const UpdateData = () => {
  emit('update:data', {
    selectedFactor: selectedFactor.value,
    selectedSubItem: selectedSubItem.value,
  })
}
</script>

<template>
  <div class="col-span-6 md:col-span-6 input-wrapper w-full factor-item factor-items">
    <label class="flex gap-2 factot-title">
      <FactorItemIcon />
      <span>Factors & Items</span>
    </label>

    <div class="radio-grid">
      <div class="radio-column">
        <!-- Radio 1 -->
        <div class="radio-item">
          <RadioButton v-model="selectedFactor" inputId="factor1" name="factors" value="factor1"
            @update:modelValue="UpdateData" />
          <label class="radio-label" for="factor1">Lorem Ipsum 1</label>
        </div>

        <!-- sub items -->
        <div v-if="selectedFactor === 'factor1'" class="sub-radio-group">
          <div class="sub-radio-item" v-for="sub in subItemsMap['factor1']" :key="sub.value">
            <RadioButton v-model="selectedSubItem" :inputId="sub.value" name="sub-items" :value="sub.value"
              @update:modelValue="UpdateData" />
            <label :for="sub.value" class="sub-radio-label">{{ sub.label }}</label>
          </div>
        </div>

        <!-- Radio 2 -->
        <div class="radio-item">
          <RadioButton v-model="selectedFactor" inputId="factor2" name="factors" value="factor2"
            @update:modelValue="UpdateData" />
          <label class="radio-label" for="factor2">Lorem Ipsum 2</label>
        </div>

        <!-- sub items -->
        <div v-if="selectedFactor === 'factor2'" class="sub-radio-group">
          <div class="sub-radio-item" v-for="sub in subItemsMap['factor2']" :key="sub.value">
            <RadioButton v-model="selectedSubItem" :inputId="sub.value" name="sub-items" :value="sub.value" />
            <label :for="sub.value" class="sub-radio-label">{{ sub.label }}</label>
          </div>
        </div>
      </div>

      <div class="radio-column">
        <!-- item1 -->
        <div class="radio-item">
          <RadioButton v-model="selectedFactor" inputId="item1" name="factors" value="item1" />
          <label class="radio-label" for="item1">Lorem Ipsum 3</label>
        </div>

        <div v-if="selectedFactor === 'item1'" class="sub-radio-group">
          <div class="sub-radio-item" v-for="sub in subItemsMap['item1']" :key="sub.value">
            <RadioButton v-model="selectedSubItem" :inputId="sub.value" name="sub-items" :value="sub.value" />
            <label :for="sub.value" class="sub-radio-label">{{ sub.label }}</label>
          </div>
        </div>

        <!-- item2 -->
        <div class="radio-item">
          <RadioButton v-model="selectedFactor" inputId="item2" name="factors" value="item2" />
          <label class="radio-label" for="item2">Lorem Ipsum 4</label>
        </div>

        <div v-if="selectedFactor === 'item2'" class="sub-radio-group">
          <div class="sub-radio-item" v-for="sub in subItemsMap['item2']" :key="sub.value">
            <RadioButton v-model="selectedSubItem" :inputId="sub.value" name="sub-items" :value="sub.value" />
            <label :for="sub.value" class="sub-radio-label">{{ sub.label }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
