<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import CreateRiskAssessmentParams from '../../../Core/params/RiskAssessment/CreateRiskAssessmentParams'
import CreateRiskAssessmentController from '../../controllers/RiskAssessment/CreateRiskAssessmentController'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)
const listPath = `/organization/project-details/${projectId}/risk-assessments`
const form = ref({ activity: '', desctiprion: '', workAreaStrign: '', date: '', employeeApproverId: 0, attachents: '' })
const saving = ref(false)
const error = ref('')

async function create() {
  error.value = ''
  const params = new CreateRiskAssessmentParams(
    form.value.activity.trim(), form.value.desctiprion.trim(), form.value.workAreaStrign.trim(),
    form.value.date, Number(form.value.employeeApproverId),
    form.value.attachents.split('\n').map((value) => value.trim()).filter(Boolean),
  )
  const validation = params.validate()
  if (!validation.isValid) {
    error.value = validation.errors.map((item) => item.message).join(', ')
    return
  }
  saving.value = true
  try {
    const controller = CreateRiskAssessmentController.getInstance()
    const state = await controller.execute(params)
    if (controller.isDataSuccess()) await router.push(listPath)
    else error.value = state.value.error?.title ?? 'Could not create risk assessment'
  } catch {
    error.value = 'Could not create risk assessment'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="create-page">
    <RouterLink class="back-link" :to="listPath">← Risk assessments</RouterLink>
    <div class="form-shell">
      <header class="form-header"><span class="eyebrow">PROJECT SAFETY / NEW RECORD</span><h1>Create risk assessment</h1><p>Record the activity, work area and approving employee.</p></header>
      <form @submit.prevent="create">
        <div class="form-grid">
          <label class="field"><span>Activity <b>*</b></span><input v-model="form.activity" required placeholder="e.g. Working at height" /></label>
          <label class="field"><span>Work area <b>*</b></span><input v-model="form.workAreaStrign" required placeholder="e.g. North building" /></label>
          <label class="field"><span>Date <b>*</b></span><input v-model="form.date" type="date" required /></label>
          <label class="field"><span>Approver employee ID <b>*</b></span><input v-model.number="form.employeeApproverId" type="number" min="1" required placeholder="Employee ID" /></label>
          <label class="field full"><span>Description <b>*</b></span><textarea v-model="form.desctiprion" rows="5" required placeholder="Describe the work and its risks" /></label>
          <label class="field full"><span>Attachments</span><textarea v-model="form.attachents" rows="4" placeholder="One attachment URL per line" /><small>Enter one attachment URL per line.</small></label>
        </div>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <footer><RouterLink class="cancel-button" :to="listPath">Cancel</RouterLink><button type="submit" :disabled="saving">{{ saving ? 'Creating…' : 'Create assessment' }}</button></footer>
      </form>
    </div>
  </main>
</template>

<style scoped>
.create-page{max-width:1020px;margin:auto;padding:26px;color:var(--text-primary,#172334)}.back-link{display:inline-block;margin-bottom:20px;color:var(--PrimaryColor,#087d80);font-weight:750;text-decoration:none}.form-shell{border:1px solid var(--main-border,#e5eaf0);border-radius:24px;background:var(--surface-2,#fff);box-shadow:0 20px 55px rgba(22,45,65,.07);overflow:hidden}.form-header{padding:34px;background:radial-gradient(circle at 90% 5%,color-mix(in srgb,var(--PrimaryColor,#087d80) 16%,transparent),transparent 38%),var(--surface-1,#f8fafb);border-bottom:1px solid var(--main-border,#e5eaf0)}.eyebrow{font-size:.72rem;letter-spacing:.14em;font-weight:800;color:var(--PrimaryColor,#087d80)}h1{font-size:clamp(1.7rem,3vw,2.4rem);margin:9px 0}p{color:var(--text-secondary,#687787);margin:0}form{padding:30px 34px}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.field{display:grid;gap:8px;font-weight:700}.field b{color:var(--status-danger,#bf3333)}input,textarea{width:100%;padding:13px 15px;border:1px solid var(--main-border,#d9e1e8);border-radius:12px;background:var(--surface-1,#fff);color:inherit;font:inherit;font-weight:400;outline:none}input:focus,textarea:focus{border-color:var(--PrimaryColor,#087d80);box-shadow:0 0 0 3px color-mix(in srgb,var(--PrimaryColor,#087d80) 14%,transparent)}textarea{resize:vertical}.full{grid-column:1/-1}small{color:var(--text-secondary,#687787);font-weight:400}.error{margin-top:20px;color:var(--status-danger,#bf3333)}footer{display:flex;justify-content:flex-end;align-items:center;gap:14px;margin-top:30px;padding-top:22px;border-top:1px solid var(--main-border,#e5eaf0)}footer button{border:0;border-radius:12px;padding:13px 20px;background:var(--PrimaryColor,#087d80);color:#fff;font-weight:750;cursor:pointer}footer button:disabled{opacity:.55;cursor:wait}.cancel-button{color:var(--text-secondary,#687787);text-decoration:none;font-weight:700}@media(max-width:650px){.create-page{padding:12px}.form-grid{grid-template-columns:1fr}form,.form-header{padding:22px}}
</style>
