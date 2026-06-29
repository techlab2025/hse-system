<script lang="ts" setup>
import type { CapaTaskDetailsModel } from '../../Data/models/ShowCapaDetailsModel'

defineProps<{
  correctiveTasks: CapaTaskDetailsModel[]
  preventiveTasks: CapaTaskDetailsModel[]
}>()

const statusLabel = (status?: number) => {
  switch (status) {
    case 1:
      return 'Closed'
    case 2:
      return 'In progress'
    default:
      return 'Open'
  }
}
</script>

<template>
  <section class="saved-action-plan">
    <div class="section-heading">
      <span>Saved action plan</span>
      <h2>Current corrective and preventive tasks</h2>
    </div>

    <div class="saved-action-grid">
      <article class="saved-task-lane corrective">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Corrective</span>
            <h3>Corrective tasks</h3>
          </div>
          <strong>{{ correctiveTasks.length }}</strong>
        </div>

        <div v-if="correctiveTasks.length" class="task-list">
          <div v-for="task in correctiveTasks" :key="task.id" class="task-card">
            <div class="task-card-header">
              <h4>{{ task.title || 'Untitled task' }}</h4>
              <span>{{ statusLabel(task.status) }}</span>
            </div>
            <div class="task-meta">
              <p>
                <span>Due date</span>
                <strong>{{ task.dueDate || 'N/A' }}</strong>
              </p>
              <p>
                <span>Assigned to</span>
                <strong>{{ task.assignedToName || 'N/A' }}</strong>
              </p>
              <p>
                <span>Responsible</span>
                <strong>{{ task.responsiblePersonName || 'N/A' }}</strong>
              </p>
            </div>
          </div>
        </div>

        <p v-else class="empty-lane">No corrective tasks yet.</p>
      </article>

      <article class="saved-task-lane preventive">
        <div class="lane-header">
          <div>
            <span class="lane-kicker">Preventive</span>
            <h3>Preventive tasks</h3>
          </div>
          <strong>{{ preventiveTasks.length }}</strong>
        </div>

        <div v-if="preventiveTasks.length" class="task-list">
          <div v-for="task in preventiveTasks" :key="task.id" class="task-card">
            <div class="task-card-header">
              <h4>{{ task.title || 'Untitled task' }}</h4>
              <span>{{ statusLabel(task.status) }}</span>
            </div>
            <div class="task-meta">
              <p>
                <span>Due date</span>
                <strong>{{ task.dueDate || 'N/A' }}</strong>
              </p>
              <p>
                <span>Assigned to</span>
                <strong>{{ task.assignedToName || 'N/A' }}</strong>
              </p>
              <p>
                <span>Responsible</span>
                <strong>{{ task.responsiblePersonName || 'N/A' }}</strong>
              </p>
            </div>
          </div>
        </div>

        <p v-else class="empty-lane">No preventive tasks yet.</p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.saved-action-plan {
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: var(--BgWhite);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--Black) 10%, transparent);
  padding: 1.25rem;
}

.section-heading {
  margin-bottom: 1rem;

  span {
    color: var(--PrimaryColor);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0;
    color: var(--header-page-color);
    font-size: 1.35rem;
    font-weight: 900;
  }
}

.saved-action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.saved-task-lane {
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--Gray-1);
  padding: 1rem;
}

.saved-task-lane.corrective {
  border-top: 4px solid var(--danger-color);
}

.saved-task-lane.preventive {
  border-top: 4px solid var(--green);
}

.lane-header,
.task-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.lane-kicker {
  color: var(--GrayText-1);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lane-header h3,
.task-card h4 {
  margin: 0.25rem 0 0;
  color: var(--header-page-color);
  font-weight: 900;
}

.lane-header h3 {
  font-size: 1.05rem;
}

.lane-header > strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--main-border);
  border-radius: 999px;
  background: var(--BgWhite);
  color: var(--PrimaryColor);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1rem;
}

.task-card {
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: var(--BgWhite);
  padding: 1rem;
}

.task-card h4 {
  font-size: 0.98rem;
  line-height: 1.5;
}

.task-card-header > span {
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--primary-dark);
  color: var(--PrimaryColor);
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.35rem 0.7rem;
}

.task-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.task-meta p,
.empty-lane {
  margin: 0;
}

.task-meta p {
  border-radius: 12px;
  background: var(--Gray-1);
  padding: 0.75rem;

  span {
    display: block;
    color: var(--GrayText-1);
    font-size: 0.75rem;
    font-weight: 800;
  }

  strong {
    display: block;
    margin-top: 0.25rem;
    color: var(--header-page-color);
    font-size: 0.88rem;
    line-height: 1.4;
    word-break: break-word;
  }
}

.empty-lane {
  margin-top: 1rem;
  border-radius: 14px;
  background: var(--BgWhite);
  color: var(--GrayText-1);
  font-weight: 700;
  padding: 1rem;
}

@media (max-width: 1100px) {
  .saved-action-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .task-card-header {
    flex-direction: column;
  }

  .task-meta {
    grid-template-columns: 1fr;
  }
}
</style>
