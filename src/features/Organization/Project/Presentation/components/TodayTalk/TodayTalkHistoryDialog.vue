<script setup lang="ts">
import Dialog from 'primevue/dialog'
import type TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'

defineProps<{
  visible: boolean
  talks: TodayTalkModel[]
  projectName?: string | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  select: [talk: TodayTalkModel]
}>()

const attendingCount = (talk: TodayTalkModel) =>
  talk.employees.filter((employee) => employee.isAttend).length

const formatDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed)
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    dismissable-mask
    class="talk-history-dialog"
    :style="{ width: 'min(62rem, calc(100vw - 24px))' }"
    @update:visible="emit('update:visible', $event)"
  >
    <template #header>
      <div class="history-heading">
        <span class="history-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" /></svg>
        </span>
        <div>
          <span>Safety conversation archive</span>
          <h2>Previous today talks</h2>
          <small>{{ projectName || 'This project' }} · {{ talks.length }} records</small>
        </div>
      </div>
    </template>

    <div class="history-list">
      <article
        v-for="talk in talks"
        :key="talk.id"
        class="history-card"
        role="button"
        tabindex="0"
        @click="emit('select', talk)"
        @keydown.enter="emit('select', talk)"
        @keydown.space.prevent="emit('select', talk)"
      >
        <header>
          <div>
            <strong>{{ formatDate(talk.date) }}</strong>
            <span>{{ talk.time || 'No time' }}</span>
          </div>
          <span class="talk-serial">{{ talk.serialName || `Talk #${talk.id}` }}</span>
        </header>

        <p>{{ talk.content }}</p>

        <footer>
          <div class="attendance-copy">
            <strong>{{ attendingCount(talk) }}</strong>
            <span>of {{ talk.employees.length }} attended</span>
          </div>
          <div class="history-employees" aria-label="Talk employees">
            <RouterLink
              v-for="employee in talk.employees.slice(0, 7)"
              :key="employee.id || employee.organizationEmployeeId"
              :to="`/organization/organization-employee/show/${employee.organizationEmployeeId}?type=3`"
              :class="{ attended: employee.isAttend }"
              :title="`${employee.title || `Employee #${employee.organizationEmployeeId}`} — ${employee.isAttend ? 'Attended' : 'Absent'}`"
              @click.stop="emit('update:visible', false)"
            >
              {{ (employee.title || '?').trim().charAt(0).toUpperCase() }}
            </RouterLink>
            <small v-if="talk.employees.length > 7">+{{ talk.employees.length - 7 }}</small>
          </div>
          <span class="open-details">
            Full details
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg>
          </span>
        </footer>
      </article>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
:global(.talk-history-dialog) { overflow: hidden; border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, var(--main-border)); border-radius: 24px; background: var(--surface-1); }
:global(.talk-history-dialog .p-dialog-header) { padding: 20px 22px; border-bottom: 1px solid var(--main-border); background: radial-gradient(circle at 90% 0, color-mix(in srgb, var(--PrimaryColor) 18%, transparent), transparent 42%), var(--surface-1); }
:global(.talk-history-dialog .p-dialog-content) { padding: 18px; background: var(--surface-2); }
.history-heading { display: flex; align-items: center; gap: 12px; }
.history-icon { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; border-radius: 14px; color: var(--text-on-brand); background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700)); }
.history-icon svg { width: 24px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
.history-heading > div { display: grid; gap: 2px; }
.history-heading span { color: var(--PrimaryColor); font-size: .63rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }
.history-heading h2 { margin: 0; color: var(--text-strong); font-size: 1.2rem; }
.history-heading small { color: var(--text-soft); font-size: .68rem; }
.history-list { display: grid; gap: 12px; max-height: min(72vh, 720px); overflow-y: auto; }
.history-card { padding: 17px; border: 1px solid var(--main-border); border-radius: 17px; outline: none; background: var(--surface-1); cursor: pointer; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease; }
.history-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--PrimaryColor) 38%, var(--main-border)); box-shadow: 0 12px 24px color-mix(in srgb, var(--brand-primary-900) 8%, transparent); }
.history-card:focus-visible { box-shadow: 0 0 0 4px color-mix(in srgb, var(--PrimaryColor) 14%, transparent); }
.history-card header, .history-card footer, .attendance-copy, .history-employees, .open-details { display: flex; align-items: center; }
.history-card header { justify-content: space-between; gap: 12px; }
.history-card header > div { display: grid; gap: 2px; }
.history-card header strong { color: var(--text-strong); font-size: .82rem; }
.history-card header span { color: var(--text-soft); font-size: .68rem; }
.talk-serial { padding: 5px 9px; border-radius: 999px; color: var(--PrimaryColor) !important; background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-1)); font-weight: 850; }
.history-card > p { margin: 14px 0; color: var(--text-strong); line-height: 1.65; white-space: pre-wrap; }
.history-card footer { flex-wrap: wrap; gap: 13px; padding-top: 12px; border-top: 1px solid var(--main-border); }
.attendance-copy { gap: 5px; }
.attendance-copy strong { color: var(--PrimaryColor); font-size: 1.15rem; }
.attendance-copy span { color: var(--text-soft); font-size: .7rem; }
.history-employees { gap: 4px; }
.history-employees a { display: grid; width: 27px; height: 27px; place-items: center; border: 2px solid var(--surface-1); border-radius: 50%; color: var(--text-soft); background: var(--surface-3); font-size: .62rem; font-weight: 900; text-decoration: none; }
.history-employees a.attended { color: var(--text-on-brand); background: var(--PrimaryColor); }
.history-employees small { color: var(--text-soft); font-size: .66rem; }
.open-details { gap: 5px; margin-inline-start: auto; color: var(--PrimaryColor); font-size: .68rem; font-weight: 900; }
.open-details svg { width: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; }
@media (max-width: 600px) { .history-card footer { align-items: flex-start; flex-direction: column; } .open-details { margin-inline-start: 0; } }
</style>
