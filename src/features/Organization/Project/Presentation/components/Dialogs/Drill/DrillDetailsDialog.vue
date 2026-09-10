<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import type DrillModel from '@/features/Organization/Project/Data/models/Drill/DrillModel'
import DrillTimelineEditor from './DrillTimelineEditor.vue'

defineProps<{ drill: DrillModel; projectId: number }>()
const emit = defineEmits<{ (event: 'saved'): void }>()
const visible = ref(false)
const editorMode = ref<'planning' | 'action' | null>(null)

const saved = () => {
  editorMode.value = null
  emit('saved')
}
</script>

<template>
  <button class="drill-card" type="button" @click="visible = true">
    <span class="drill-card-accent"></span>
    <span class="drill-card-main">
      <span class="drill-card-kicker">{{ drill.drillType.title || $t('Drill') }}</span>
      <strong>{{ drill.serialNumber || `Drill #${drill.id}` }}</strong>
      <small>{{ drill.date || '—' }} · {{ drill.time || '—' }}</small>
    </span>
    <span class="drill-card-status"><i></i>{{ drill.actions.length ? $t('Action recorded') : drill.planning.length ? $t('Planned') : $t('New') }}</span>
    <span class="drill-card-arrow">→</span>
  </button>

  <Dialog v-model:visible="visible" modal dismissable-mask :style="{ width: 'min(68rem, calc(100vw - 24px))' }" @hide="editorMode = null">
    <template #header>
      <div class="details-heading"><span>DR</span><div><small>{{ drill.drillType.title }}</small><h2>{{ drill.serialNumber || `Drill #${drill.id}` }}</h2><p>{{ drill.projectTeam.title }}</p></div></div>
    </template>

    <div class="drill-detail-summary">
      <div><span>{{ $t('date') }}</span><strong>{{ drill.date || '—' }}</strong></div>
      <div><span>{{ $t('time') }}</span><strong>{{ drill.time || '—' }}</strong></div>
      <div><span>{{ $t('Project Team') }}</span><strong>{{ drill.projectTeam.title || '—' }}</strong></div>
      <div><span>{{ $t('Drill Type') }}</span><strong>{{ drill.drillType.title || '—' }}</strong></div>
    </div>

    <div class="drill-detail-copy">
      <article><span>{{ $t('Evaluation') }}</span><p>{{ drill.evaluation || '—' }}</p></article>
      <article><span>{{ $t('Improvement') }}</span><p>{{ drill.improvement || '—' }}</p></article>
      <article><span>{{ $t('notes') }}</span><p>{{ drill.notes || '—' }}</p></article>
    </div>

    <div class="drill-workflow-actions">
      <button type="button" :class="{ active: editorMode === 'planning' }" @click="editorMode = editorMode === 'planning' ? null : 'planning'"><span>01</span><div><strong>{{ $t('Add Planning') }}</strong><small>{{ $t('Build the drill preparation timeline') }}</small></div></button>
      <button type="button" :class="{ active: editorMode === 'action' }" @click="editorMode = editorMode === 'action' ? null : 'action'"><span>02</span><div><strong>{{ $t('Add Actions') }}</strong><small>{{ $t('Record execution, evidence and notes') }}</small></div></button>
    </div>

    <DrillTimelineEditor v-if="editorMode" :key="editorMode" :mode="editorMode" :drill-id="drill.id" :project-id="projectId" @saved="saved" />

    <section v-else-if="drill.planning.length || drill.actions.length" class="saved-timelines">
      <div v-if="drill.planning.length" class="saved-timeline-group">
        <div class="saved-title"><span>01</span><div><h3>{{ $t('Planning timeline') }}</h3><p>{{ drill.planning.length }} {{ $t('entries') }}</p></div></div>
        <article v-for="(item, index) in drill.planning" :key="`planning-${item.id}-${index}`" class="saved-entry"><span>{{ index + 1 }}</span><div><small>{{ item.date }} · {{ item.time }}</small><p>{{ item.description }}</p></div></article>
      </div>
      <div v-if="drill.actions.length" class="saved-timeline-group">
        <div class="saved-title"><span>02</span><div><h3>{{ $t('Action timeline') }}</h3><p>{{ drill.actions.length }} {{ $t('entries') }}</p></div></div>
        <article v-for="(item, index) in drill.actions" :key="`action-${item.id}-${index}`" class="saved-entry"><span>{{ index + 1 }}</span><div><small>{{ item.date }} · {{ item.time }}<template v-if="item.photographerName"> · {{ item.photographerName }}</template></small><p>{{ item.description }}</p><em v-if="item.notes">{{ item.notes }}</em><div v-if="item.images.length" class="saved-images"><img v-for="image in item.images" :key="image" :src="image" alt="Drill evidence" /></div></div></article>
      </div>
    </section>
    <div v-else class="empty-workflow"><strong>{{ $t('No planning or actions yet') }}</strong><p>{{ $t('Use the buttons above to build the drill workflow.') }}</p></div>
  </Dialog>
</template>

<style scoped lang="scss">
.drill-card { position: relative; display: grid; width: 100%; grid-template-columns: 5px 1fr auto auto; align-items: center; gap: 13px; overflow: hidden; padding: 13px; border: 1px solid var(--main-border); border-radius: 16px; text-align: start; cursor: pointer; background: var(--surface-2); transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease; }.drill-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border)); box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-900) 9%, transparent); }.drill-card-accent { align-self: stretch; border-radius: 9px; background: linear-gradient(var(--PrimaryColor), var(--brand-primary-700)); }.drill-card-main { display: flex; flex-direction: column; }.drill-card-kicker { color: var(--PrimaryColor); font-size: .62rem; font-weight: 900; text-transform: uppercase; }.drill-card-main strong { color: var(--text-strong); }.drill-card-main small { margin-top: 3px; color: var(--text-soft); }.drill-card-status { display: inline-flex; align-items: center; gap: 6px; padding: 6px 9px; border-radius: 999px; color: var(--text-soft); background: var(--surface-1); font-size: .62rem; }.drill-card-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--status-success); }.drill-card-arrow { color: var(--PrimaryColor); font-size: 1.2rem; }
.details-heading { display: flex; align-items: center; gap: 12px; }.details-heading > span { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 15px; color: white; background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700)); font-family: 'Bold'; }.details-heading small { color: var(--PrimaryColor); font-weight: 900; text-transform: uppercase; }.details-heading h2 { margin: 1px 0; color: var(--text-strong); }.details-heading p { margin: 0; color: var(--text-soft); }
.drill-detail-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }.drill-detail-summary > div { padding: 12px; border: 1px solid var(--main-border); border-radius: 13px; background: var(--surface-2); }.drill-detail-summary span, .drill-detail-copy span { display: block; color: var(--text-soft); font-size: .62rem; font-weight: 800; text-transform: uppercase; }.drill-detail-summary strong { display: block; margin-top: 4px; color: var(--text-strong); font-size: .76rem; }
.drill-detail-copy { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }.drill-detail-copy article { padding: 12px; border-radius: 13px; background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-2)); }.drill-detail-copy p { margin: 5px 0 0; color: var(--text-strong); font-size: .72rem; line-height: 1.5; }
.drill-workflow-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 16px 0; }.drill-workflow-actions button { display: flex; align-items: center; gap: 11px; padding: 13px; border: 1px solid color-mix(in srgb, var(--PrimaryColor) 20%, var(--main-border)); border-radius: 15px; text-align: start; cursor: pointer; background: var(--surface-2); }.drill-workflow-actions button.active { border-color: var(--PrimaryColor); background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-2)); }.drill-workflow-actions button > span { display: grid; width: 35px; height: 35px; place-items: center; border-radius: 11px; color: white; background: var(--PrimaryColor); font-family: 'Bold'; }.drill-workflow-actions strong, .drill-workflow-actions small { display: block; }.drill-workflow-actions strong { color: var(--text-strong); }.drill-workflow-actions small { margin-top: 2px; color: var(--text-soft); }
.saved-timelines { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }.saved-timeline-group { padding: 14px; border: 1px solid var(--main-border); border-radius: 16px; background: var(--surface-2); }.saved-title { display: flex; align-items: center; gap: 10px; margin-bottom: 13px; }.saved-title > span { display: grid; width: 33px; height: 33px; place-items: center; border-radius: 10px; color: white; background: var(--PrimaryColor); }.saved-title h3, .saved-title p { margin: 0; }.saved-title h3 { color: var(--text-strong); font-size: .84rem; }.saved-title p { color: var(--text-soft); font-size: .62rem; }.saved-entry { display: grid; grid-template-columns: 28px 1fr; gap: 9px; padding: 9px 0; border-top: 1px solid var(--main-border); }.saved-entry > span { display: grid; width: 25px; height: 25px; place-items: center; border-radius: 50%; color: var(--PrimaryColor); background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent); font-size: .62rem; font-weight: 900; }.saved-entry small { color: var(--PrimaryColor); }.saved-entry p { margin: 3px 0; color: var(--text-strong); font-size: .7rem; }.saved-entry em { color: var(--text-soft); font-size: .65rem; }.saved-images { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }.saved-images img { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; }.empty-workflow { padding: 24px; border: 1px dashed var(--main-border); border-radius: 16px; text-align: center; background: var(--surface-2); }.empty-workflow strong { color: var(--text-strong); }.empty-workflow p { margin: 4px 0 0; color: var(--text-soft); }
@media (max-width: 760px) { .drill-detail-summary, .drill-detail-copy, .saved-timelines { grid-template-columns: 1fr 1fr; }.drill-workflow-actions { grid-template-columns: 1fr; } } @media (max-width: 520px) { .drill-detail-summary, .drill-detail-copy, .saved-timelines { grid-template-columns: 1fr; }.drill-card { grid-template-columns: 5px 1fr auto; }.drill-card-status { display: none; } }
</style>
