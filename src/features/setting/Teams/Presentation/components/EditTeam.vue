<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataStatus from '@/shared/DataStatues/DataStatusBuilder.vue'
import FormLoader from '@/shared/DataStatues/FormLoader.vue'
import type Params from '@/base/core/params/params'
import EditTeamController from '../controllers/editTeamController'
import ShowTeamParams from '../../Core/params/showTeamParams'
import ShowTeamController from '../controllers/showTeamController'
import TeamForm from './TeamForm.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const params = ref<Params | null>(null)

const showTeamController = ShowTeamController.getInstance()
const state = ref(showTeamController.state.value)

const fetchTeamDetails = async () => {
  const TeamParams = new ShowTeamParams(Number(id))

  await showTeamController.showTeamType(TeamParams)
}

onMounted(() => {
  fetchTeamDetails()
})

const EditTeam = async (draft: boolean) => {
  if (draft) {
    await EditTeamController.getInstance().editTeam(params.value!, router)
  } else {
    await EditTeamController.getInstance().editTeam(params.value!, router)
  }
}

watch(
  () => showTeamController.state.value,
  (newState) => {
    if (newState) {
      console.log(newState)
      state.value = newState
    }
  },
)

const setParams = (data: Params) => {
  params.value = data
}
</script>

<template>
  <DataStatus :controller="state">
    <template #success>
      <!--      <pre>-->
      <!--              {{ state.data?.titles }}-->

      <!--      </pre>-->
      <form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="EditTeam">
        <TeamForm @update:data="setParams" :data="state.data!" />
        <div class="col-span-4 button-wrapper">
          <button type="submit" class="btn btn-primary">Edit</button>
        </div>
      </form>
    </template>
    <template #loader>
      <FormLoader :inputsCount="5" />
    </template>
  </DataStatus>
</template>

<style scoped></style>
