<script setup lang="ts">
import BlueBack from '@/assets/images/BgGroup.png'
import yelloecircle from '@/assets/images/yelloecircle.png'
import { onMounted, ref } from 'vue'
import { watch } from 'vue'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import { useRouter } from 'vue-router'

const emit = defineEmits(['update:data', 'update:loading'])
const router = useRouter()
const props = defineProps<{
  ProjectId: number
}>()
const updateData = (data) => {
  emit('update:data', data.target.value)
}
const fetchMyZonesController = FetchMyZonesController.getInstance()
const state = ref(fetchMyZonesController.state.value)
const SelectedLocation = ref(state.value.data?.[0]?.ProjectZoneId)
const isLoading = ref(false)

const FetchMyZones = async () => {
  const fetchMyZonesParams = new FetchMyZonesParams(props.ProjectId)
  isLoading.value = true
  emit('update:loading', true)

  try {
    await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router)
  } finally {
    isLoading.value = false
    emit('update:loading', false)
  }
}
onMounted(() => {
  FetchMyZones()
})

watch(
  () => fetchMyZonesController.state.value,
  (newState) => {
    state.value = newState
  },
)

watch(
  () => props.ProjectId,
  () => {
    FetchMyZones()
  },
)
watch(
  () => state.value.data,
  (zones) => {
    if (zones && zones.length > 0) {
      SelectedLocation.value = zones[0].ProjectZoneId
      emit('update:data', SelectedLocation.value)
    }
  },
  { immediate: true },
)
</script>
<template>
  <div class="w-full">
    <div v-if="isLoading" class="tabs-selection-skeleton" aria-hidden="true">
      <span v-for="item in 3" :key="item"></span>
    </div>
    <div class="tabs-selction-container">
      <div v-show="!isLoading" class="tabs-selction-content">
        <div class="select-container">
          <div
            class="select-item"
            v-for="zoon in state.data"
            :key="zoon.ProjectZoneId"
            :class="SelectedLocation === zoon.ProjectZoneId ? 'active' : ''"
          >
            <div class="left-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="left-yellow" :src="yelloecircle" alt="yellow" />
            </div>
            <input
              type="radio"
              :id="`radio-${zoon.ProjectZoneId}`"
              name="radio"
              :value="zoon.ProjectZoneId"
              @change="updateData"
            />
            <label
              class="item"
              @click="SelectedLocation = zoon.ProjectZoneId"
              :for="`radio-${zoon.ProjectZoneId}`"
              v-if="zoon?.title"
              >{{ zoon.title || `--` }}</label
            >
            <div class="right-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="right-yellow" :src="yelloecircle" alt="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs-selection-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  overflow: hidden;
}

.tabs-selection-skeleton span {
  width: 150px;
  height: 58px;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--brand-primary-50) 25%, var(--brand-primary-50) 50%, var(--brand-primary-50) 75%);
  background-size: 220% 100%;
  animation: tabs-selection-shimmer 1.15s linear infinite;
}

.tabs-selection-skeleton span:nth-child(2) {
  width: 180px;
}

.tabs-selection-skeleton span:nth-child(3) {
  width: 128px;
}

@keyframes tabs-selection-shimmer {
  0% {
    background-position: 220% 0;
  }

  100% {
    background-position: -220% 0;
  }
}

@media (max-width: 768px) {
  .tabs-selection-skeleton span {
    min-width: 112px;
    width: 112px;
  }
}
</style>
