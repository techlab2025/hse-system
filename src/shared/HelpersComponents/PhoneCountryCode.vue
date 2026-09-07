<script setup lang="ts">
import { ref } from 'vue'
import Select from 'primevue/select'

type CountryCode = {
  name: string
  iso: string
  dialCode: string
}

const selectedCountry = ref<CountryCode | null>(null)

const countries = ref<CountryCode[]>([
  { name: 'Egypt', iso: 'EG', dialCode: '+20' },
  { name: 'Saudi Arabia', iso: 'SA', dialCode: '+966' },
  { name: 'United Arab Emirates', iso: 'AE', dialCode: '+971' },
  { name: 'Kuwait', iso: 'KW', dialCode: '+965' },
  { name: 'Qatar', iso: 'QA', dialCode: '+974' },
  { name: 'United States', iso: 'US', dialCode: '+1' },
  { name: 'United Kingdom', iso: 'GB', dialCode: '+44' },
])

const updatePhoneCode = (value: any) => {
  console.log(value, 'vall')
}
</script>

<template>
  <Select
    v-model="selectedCountry"
    :options="countries"
    optionLabel="name"
    filter
    placeholder="Country code"
    class="w-full"
    @update:modelValue="updatePhoneCode"
  >
    <!-- Selected value -->
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex items-center gap-2">
        <img
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${value.iso.toLowerCase()}`"
          width="22"
          alt=""
        />

        <span>{{ value.dialCode }}</span>
      </div>

      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <!-- Dropdown items -->
    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <img
          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
          :class="`flag flag-${option.iso.toLowerCase()}`"
          width="22"
          alt=""
        />

        <span class="flex-1">
          {{ option.name }}
        </span>

        <span class="text-gray-500">
          {{ option.dialCode }}
        </span>
      </div>
    </template>
  </Select>
</template>
