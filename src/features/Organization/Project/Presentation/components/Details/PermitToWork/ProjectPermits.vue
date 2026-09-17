<script lang="ts" setup>
import FetchPermitsParams from '@/features/Organization/Project/Core/params/PermitToWork/fetchPermitsParams'
import FetchProjectPermitsController from '../../../controllers/PermitToWork/FetchProjectPermitsController'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const fetchProjectPermitsController = FetchProjectPermitsController.getInstance()
const state = computed(() => fetchProjectPermitsController.state.value)
const fetchProjectPermitsParams = new FetchPermitsParams({
  projectId: Number(route.params.project_id),
})

const FetchProjectPermits = async () => {
  await fetchProjectPermitsController.FetchProjectPermits(fetchProjectPermitsParams, router)
}

onMounted(FetchProjectPermits)
</script>
<template>
  <div>
    {{ state.data }}
  </div>
</template>
