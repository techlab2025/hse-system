<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'

const visible = ref(false)

const staticData = {
  title: 'Task Details',
  description: 'Thickening the electrical wires and reinforcing them with an insulating material',
}

const props = defineProps<{
  item: any
}>()
const taskAnswer = computed(
  () =>
    props.item?.answer ||
    props.item?.answerNotes ||
    props.item?.notes ||
    props.item?.investigation_task_results?.[0]?.notes ||
    props.item?.investigationTaskResults?.[0]?.notes ||
    props.item?.task_results?.[0]?.notes ||
    props.item?.taskResults?.[0]?.notes ||
    props.item?.task_result?.notes ||
    props.item?.taskResult?.notes ||
    '',
)
</script>

<template>
  <button label="Show" @click="visible = true" class="investigation-show-result-btn">
    view details
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :dismissableMask="true"
    :style="{ width: '90vw', maxWidth: '60rem' }"
  >
    <template #header>
      <div class="show-result-dialog-header">
        <span>Task details</span>
        <h3>{{ item?.title || staticData.title }}</h3>
      </div>
    </template>

    <!-- <pre>{{ item }}</pre> -->
    <div class="investigation-show-result">
      <div class="dialog-content">
        <div class="all-text-content">
          <div class="observer-info">
            <h3 class="main-title">
              {{ item?.title }}
            </h3>
            <div class="info-row">
              <div class="info-item">
                <h5>due date :</h5>
                <span> {{ item?.due_date || item?.dueDate || item?.date }}</span>
              </div>
              <div class="info-item">
                <h5>Responsible :</h5>
                <span>
                  {{
                    item?.responable_person?.name ||
                    item?.responablePerson?.name ||
                    item?.responsiblePersonName
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="notes">
            <h4>Answer</h4>
            <p>{{ taskAnswer || 'No answer has been added yet.' }}</p>
          </div>
        </div>

        <div class="user-img-side">
          <!-- <img src="@/assets/images/user-assign.png" alt="" /> -->
          <div class="name">
            <span>assigned to :</span>
            <p>{{ item?.assigned_to?.name || item?.assignedTo?.name || item?.assignedToName }}</p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  span {
    margin: 0 !important;
  }
}
.investigation-show-result-btn {
  min-height: 38px;
  border: 0;
  border-radius: 8px;
  background: rgba(29, 78, 216, 0.08);
  color: var(--PrimaryColor);
  cursor: pointer;
  font-family: 'Bold';
  font-size: 13px;
  font-weight: 800;
  padding: 9px 14px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(29, 78, 216, 0.12);
    box-shadow: 0 10px 18px rgba(29, 78, 216, 0.1);
  }
}

.show-result-dialog-header {
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    color: var(--PrimaryColor);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: #0f172a;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.35;
  }
}

.investigation-show-result {
  .dialog-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 16px;
  }

  .all-text-content,
  .user-img-side,
  .info-item,
  .notes {
    border: 1px solid #e6edf7;
    border-radius: 12px;
    background: #ffffff;
  }

  .all-text-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px;
  }

  .main-title {
    margin: 0 0 12px;
    color: #0f172a;
    font-size: 18px;
    font-weight: 900;
  }

  .info-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .info-item,
  .notes {
    padding: 12px;
    background: #f8fafc;

    h5,
    h4,
    p {
      margin: 0;
    }

    h5,
    h4 {
      color: #64748b;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }

    span,
    p {
      display: block;
      margin-top: 6px;
      color: #0f172a;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.7;
      white-space: pre-wrap;
    }
  }

  .user-img-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(180deg, rgba(239, 246, 255, 0.84), #ffffff);
    text-align: center;

    img {
      width: 96px;
      max-width: 100%;
    }

    span {
      color: #64748b;
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
    }

    p {
      margin: 4px 0 0;
      color: #0f172a;
      font-weight: 900;
    }
  }
}

@media (max-width: 720px) {
  .investigation-show-result {
    .dialog-content,
    .info-row {
      grid-template-columns: 1fr;
    }
  }
}
</style>
