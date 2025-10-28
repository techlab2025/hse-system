<script setup lang="ts">
import { ref } from 'vue'
import BlueBack from '@/assets/images/BgGroup.png'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import yelloecircle from '@/assets/images/yelloecircle.png'

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
            :modelValue="Device"
            :static-options="Devices"
            class="input"
            :label="$t('functional Hierarchy')"
            id="employee"
            :placeholder="$t('functional Hierarchy')"
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
