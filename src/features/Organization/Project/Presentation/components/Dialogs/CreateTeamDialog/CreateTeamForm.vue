<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexTeamController from '@/features/setting/Teams/Presentation/controllers/indexTeamController'
import IndexTeamParams from '@/features/setting/Teams/Core/params/indexTeamParams'
import IndexHierarchyEmployeeController from '../../../controllers/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeController'
import IndexLocationHierarchyEmployeeParams from '@/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/indexHierarchyEmployeeParams'
import CreateProjectLocationTeamEmployeeController from '../../../controllers/CreateProjectLocationTeamEmployeeController'
import CreateProjectLocationTeamEmployeeParams from '@/features/Organization/Project/Core/params/CreateProjectLocationTeamEmployeeParams'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddTeam from '@/features/setting/Teams/Presentation/components/AddTeam.vue'

const emit = defineEmits(['update:data'])
const { ProjectLocationId, LocationId, teamId, mode } = defineProps<{
  ProjectLocationId: number | undefined
  LocationId: number | undefined
  teamId?: number | undefined
  mode?: 'leader' | 'employee' | 'both'
}>()
const route = useRoute()
const id = Number(route.params.project_id || route.params.id)
const loading = ref(false)
const indexTeamController = IndexTeamController.getInstance()
const indexTeamsParams = new IndexTeamParams('', 1, 10, 1)
const TeamType = ref<TitleInterface | null>(null)
const Employees = ref<TitleInterface[]>([])
const TeamLeader = ref<TitleInterface | null>(null)
const indexHierarchyEmployeeController = IndexHierarchyEmployeeController.getInstance()
const indexLocationHierarchyEmployeeParams = new IndexLocationHierarchyEmployeeParams(
  id,
  LocationId!,
)

const setTeamType = (data: TitleInterface) => {
  TeamType.value = data
}

const setEmployees = (data: TitleInterface[]) => {
  Employees.value = data
  if (TeamLeader.value && !data.find((e) => e.id === TeamLeader.value?.id)) {
    TeamLeader.value = null
  }
}

const setTeamLeader = (data: TitleInterface) => {
  TeamLeader.value = data
}

const CreateProjectLocationTeamEmployee = async () => {
  // if (!TeamType.value || Employees.value.length === 0) {
  //   return
  // }

  const employees = Employees.value.map((emp) => ({
    employee_id: emp.id,
    is_leader:
      mode === 'leader' ? true : mode === 'employee' ? false : emp.id === TeamLeader.value?.id,
  }))

  const teams = [
    {
      project_location_id: ProjectLocationId!,
      team_id: (teamId ? teamId : TeamType.value?.id) as number,
      employees,
    },
  ]

  const createParams = new CreateProjectLocationTeamEmployeeParams(id, teams)
  const controller = CreateProjectLocationTeamEmployeeController.getInstance()

  try {
    loading.value = true
    await controller.CreatePorjectLocationTeamEmployee(createParams, route)
    emit('update:data')
  } finally {
    loading.value = false
  }
}

const TeamDialog = ref(false)
const canSubmit = computed(
  () =>
    Boolean(teamId || TeamType.value?.id) &&
    Employees.value.length > 0 &&
    (mode === 'leader' || mode === 'employee' || Boolean(TeamLeader.value?.id)),
)
</script>

<template>
  <div class="equipment-form team-form">
    <form @submit.prevent="CreateProjectLocationTeamEmployee">
      <!-- <div class="form-readiness" :class="{ ready: canSubmit }">
        <span
          ><i aria-hidden="true"></i
          >{{ canSubmit ? $t('Ready to assign') : $t('Complete required selections') }}</span
        >
        <strong>{{ Employees.length }} {{ $t('members selected') }}</strong>
      </div> -->
      <div class="input-container">
        <div class="input-wrapper modern-team-field" v-if="!teamId">
          <span class="field-step">01</span>
          <UpdatedCustomInputSelect
            :modelValue="TeamType"
            :controller="indexTeamController"
            :params="indexTeamsParams"
            class="input"
            :label="$t('team_type')"
            id="team-type"
            :placeholder="$t('team_type')"
            @update:modelValue="setTeamType"
            :isDialog="true"
            v-model:dialogVisible="TeamDialog"
          >
            <template #LabelHeader>
              <span class="add-dialog" @click="TeamDialog = true">{{ $t('New') }}</span>
            </template>
            <template #Dialog>
              <AddTeam @update:data="TeamDialog = false" />
            </template>
          </UpdatedCustomInputSelect>
        </div>

        <div class="input-wrapper modern-team-field">
          <span class="field-step">{{ teamId ? '01' : '02' }}</span>
          <CustomSelectInput
            :modelValue="Employees"
            :controller="indexHierarchyEmployeeController"
            :params="indexLocationHierarchyEmployeeParams"
            class="input"
            :label="$t('employee')"
            id="employee"
            :type="2"
            :placeholder="$t('employee')"
            @update:modelValue="setEmployees"
          />
        </div>

        <div
          class="input-wrapper modern-team-field"
          v-if="mode !== 'leader' && mode !== 'employee'"
        >
          <span class="field-step">03</span>
          <CustomSelectInput
            :modelValue="TeamLeader"
            class="input"
            :staticOptions="Employees"
            :label="$t('team_leader')"
            id="team-leader"
            :placeholder="$t('team_leader')"
            @update:modelValue="setTeamLeader"
          />
        </div>
      </div>

      <div class="submit-btn">
        <button class="btn btn-primary" type="submit" :disabled="loading || !canSubmit">
          {{ loading ? $t('loading') : $t('confirm') }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.team-form form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.form-readiness {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, var(--brand-accent-500) 20%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--brand-accent-500) 6%, var(--surface-2));
  color: var(--brand-accent-600);
  font-size: 0.66rem;
}

.form-readiness.ready {
  border-color: color-mix(in srgb, var(--status-success) 22%, var(--main-border));
  background: color-mix(in srgb, var(--status-success) 7%, var(--surface-2));
  color: var(--status-success);
}

.form-readiness span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 850;
}

.form-readiness i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.form-readiness strong {
  color: var(--text-strong);
  font-size: 0.65rem;
}

.input-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
}

.modern-team-field {
  position: relative;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--surface-2);
}

.modern-team-field:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.field-step {
  position: absolute;
  z-index: 2;
  top: 8px;
  inset-inline-end: 10px;
  color: var(--PrimaryColor);
  font-family: 'Bold';
  font-size: 0.58rem;
}

.add-dialog {
  padding: 4px 7px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.62rem;
  font-weight: 850;
  cursor: pointer;
}

.submit-btn {
  display: flex;
  justify-content: flex-end;
}

.submit-btn .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  min-height: 44px;
  gap: 9px;
  border-radius: 12px;
}

.submit-btn .btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 640px) {
  .input-container {
    grid-template-columns: 1fr;
  }

  .modern-team-field:last-child:nth-child(odd) {
    grid-column: auto;
  }

  .form-readiness {
    align-items: flex-start;
    flex-direction: column;
  }

  .submit-btn .btn {
    width: 100%;
  }
}
</style>
