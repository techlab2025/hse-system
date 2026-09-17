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
const updateData = (event: Event) => {
  const zoneId = Number((event.target as HTMLInputElement).value)
  SelectedLocation.value = zoneId
  emit('update:data', zoneId)
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
    <div v-show="!isLoading" class="tabs-selction-container">
      <div class="tabs-selction-content">
        <div v-if="state.data?.length === 1" class="single-zone-selection" aria-live="polite">
          <span class="single-zone-icon" aria-hidden="true">Z</span>
          <span class="single-zone-copy">
            <small>{{ $t('selected') }} {{ $t('Zone') }}</small>
            <strong>{{ state.data?.[0]?.title || '—' }}</strong>
          </span>
          <span class="single-zone-check" aria-hidden="true">✓</span>
        </div>

        <div v-else class="select-container">
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
  background: linear-gradient(
    90deg,
    var(--brand-primary-50) 25%,
    var(--brand-primary-50) 50%,
    var(--brand-primary-50) 75%
  );
  background-size: 220% 100%;
  animation: tabs-selection-shimmer 1.15s linear infinite;
}

.tabs-selection-skeleton span:nth-child(2) {
  width: 180px;
}

.tabs-selection-skeleton span:nth-child(3) {
  width: 128px;
}

.single-zone-selection {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--identity-primary) 34%, var(--main-border));
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--identity-primary) 10%, var(--surface-1)),
    color-mix(in srgb, var(--identity-accent) 7%, var(--surface-1))
  );
}

.single-zone-icon,
.single-zone-check {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  color: var(--text-on-brand);
  font-weight: 900;
}

.single-zone-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, var(--identity-primary), var(--identity-accent));
}

.single-zone-check {
  width: 28px;
  height: 28px;
  margin-inline-start: auto;
  border-radius: 50%;
  background: var(--identity-primary);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--identity-primary) 28%, transparent);
  font-size: 13px;
}

.single-zone-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.single-zone-copy small {
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 700;
}

.single-zone-copy strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 15px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
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
