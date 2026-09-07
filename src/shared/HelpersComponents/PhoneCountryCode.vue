<script setup lang="ts">
import { ref, watch } from 'vue'
import Select from 'primevue/select'

type CountryCode = {
  name: string
  iso: string
  dialCode: string
}

const countries = ref<CountryCode[]>([
  { name: 'Egypt', iso: 'EG', dialCode: '+20' },
  { name: 'Saudi Arabia', iso: 'SA', dialCode: '+966' },
  { name: 'United Arab Emirates', iso: 'AE', dialCode: '+971' },
  { name: 'Kuwait', iso: 'KW', dialCode: '+965' },
  { name: 'Qatar', iso: 'QA', dialCode: '+974' },
  { name: 'United States', iso: 'US', dialCode: '+1' },
  { name: 'United Kingdom', iso: 'GB', dialCode: '+44' },
])

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  {
    modelValue: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const selectedCountry = ref<CountryCode | null>(
  countries.value.find((country) => country.dialCode === props.modelValue) ?? null,
)

watch(
  () => props.modelValue,
  (countryCode) => {
    selectedCountry.value =
      countries.value.find((country) => country.dialCode === countryCode) ?? null
  },
)

const updatePhoneCode = (value: CountryCode | null) => {
  emit('update:modelValue', value?.dialCode ?? '')
}
</script>

<template>
  <Select
    v-model="selectedCountry"
    :options="countries"
    optionLabel="name"
    filter
    input-id="phone-country-code"
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
