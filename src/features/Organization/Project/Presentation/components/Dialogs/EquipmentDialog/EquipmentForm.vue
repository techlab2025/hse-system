<script setup lang="ts">
import { ref } from 'vue';
import BlueBack from '@/assets/images/BgGroup.png';
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue';
import TitleInterface from '@/base/Data/Models/title_interface';
import yelloecircle from '@/assets/images/yelloecircle.png';
const SelectedLocation = ref(1)
const Locations = ref([
  {
    id: 1,
    title: 'Location 1',
  },
  {
    id: 2,
    title: 'Location 2',
  },
  {
    id: 3,
    title: 'Location 3',
  },
])
const Equipment = ref<TitleInterface>()
const Equipments = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Equipment 1', subtitle: '' }),
  new TitleInterface({ id: 2, title: 'Equipment 2', subtitle: '' }),
  new TitleInterface({ id: 3, title: 'Equipment 3', subtitle: '' }),
])
const setEquipments = (data: TitleInterface) => {
  Equipment.value = data
}

const Device = ref<TitleInterface>()
const Devices = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Device 1', subtitle: '' }),
  new TitleInterface({ id: 2, title: 'Device 2', subtitle: '' }),
  new TitleInterface({ id: 3, title: 'Device 3', subtitle: '' }),
])
const setDevices = (data: TitleInterface) => {
  Device.value = data
}
const Tool = ref<TitleInterface>()
const Tools = ref<TitleInterface[]>([
  new TitleInterface({ id: 1, title: 'Tool 1', subtitle: '' }),
  new TitleInterface({ id: 2, title: 'Tool 2', subtitle: '' }),
  new TitleInterface({ id: 3, title: 'Tool 3', subtitle: '' }),
])
const setTool = (data: TitleInterface) => {
  Tool.value = data
}

</script>

<template>
  <div class="equipment-form">
    <form>
      <div class="select-container">
        <div class="select-item" v-for="(item, index) in Locations" :key="index"
          :class="SelectedLocation === item.id ? 'active' : ''">
          <div class="left-back-img">
            <img :src="BlueBack" alt="blue">
            <img class="left-yellow" :src="yelloecircle" alt="yellow">
          </div>
          <input type="radio" :id="`radio-${item.id}`" name="radio" :value="item.id">
          <label class="item" @click="SelectedLocation = item.id" :for="`radio-${item.id}`">{{ item.title }}</label>
          <div class="right-back-img">
            <img :src="BlueBack" alt="blue">
            <img class="right-yellow"  :src="yelloecircle" alt="blue">
          </div>
        </div>
      </div>

      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Equipment" :static-options="Equipments" class="input" label="Equipment"
            id="Employee" placeholder="Select Your Equipment" @update:modelValue="setEquipments" />
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Device" :static-options="Devices" class="input" label="Devices" id="Devices"
            placeholder="Select Your Device" @update:modelValue="setDevices" />
        </div>
        <div class="input-wrapper">
          <CustomSelectInput :modelValue="Device" :static-options="Tools" class="input" label="Tools" id="Tools"
            placeholder="Select Your Tools" @update:modelValue="setTool" />
        </div>

      </div>

      <div class="submit-btn">
        <button class="btn btn-ptimary">confirm</button>
      </div>
    </form>
  </div>
</template>
