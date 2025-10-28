<script setup lang="ts">
import { ref } from 'vue'
import BlueBack from '@/assets/images/BgGroup.png'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import yelloecircle from '@/assets/images/yelloecircle.png'
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
      <div class="input-container">
        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="Equipment"
            :static-options="Equipments"
            class="input"
            :label="$t('team_type')"
            id="team type"
            :placeholder="$t('team_type')"
            @update:modelValue="setEquipments"
          />
        </div>
        <div class="input-wrapper">
          <CustomSelectInput
            :modelValue="Device"
            :static-options="Devices"
            class="input"
            :label="$t('employee')"
            id="employee"
            :placeholder="$t('employee')"
            @update:modelValue="setDevices"
          />
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-ptimary">confirm</button>
      </div>
    </form>
  </div>
</template>
