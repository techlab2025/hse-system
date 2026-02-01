<script setup lang="ts">
import { ref } from "vue";
import Dialog from 'primevue/dialog';
import ChatForward from "@/assets/images/ChatForward.png"
import CreateInvestigationTaskResultController from "../../../controllers/investegationResult/CreateInvestigationTaskResultController";
import CreateInvestigationTaskResultParams from "@/features/Organization/Investigating/Core/params/investegationResult/CreateInvestigationTaskResultParams";
import { useRoute, useRouter } from "vue-router";
import ShowInvestigatingResultController from "../../../controllers/investegationResult/ShowInvestigatingResultController";
import ShowInvestigationResultParams from "@/features/Organization/Investigating/Core/params/investegationResult/ShowInvestigationResultParams";

const visible = ref(false);
const props = defineProps<{
  task: string
  taskId: number
}>()
const answer = ref()
const emit = defineEmits(['update:data'])
// const UpdateData = () => {
//   emit("update:data", answer.value)
//   visible.value = false
// }
const router = useRouter()
const route = useRoute()
const CreateInvestegationTaskResult = async () => {
  const createInvestigationTaskResultController = CreateInvestigationTaskResultController.getInstance()
  const createInvestigationTaskResultParams = new CreateInvestigationTaskResultParams(
    props.taskId, answer.value
  );
  await createInvestigationTaskResultController.CreateInvestigationTaskResult(createInvestigationTaskResultParams, router, null, route);

  visible.value = false

}
</script>

<template>
  
  <button class="btn btn-primary" @click="visible = true">Answer</button>
  <Dialog v-model:visible="visible" modal :style="{ width: '40rem' }">

    <template #header>
      <div class="investigation-answer-header flex justify-start items-center gap-2">
        <img :src="ChatForward" alt="chat" width="40" height="40">
        <h3 class="title">Add your answer</h3>
      </div>
    </template>

    <div class="answer-content">
      <p class="questions-title">{{ task }}</p>
      <div class="input-wrapper">
        <label class="answer-label" for="answer">your answer</label>
        <textarea name="answer" id="answer" class="input" v-model="answer"></textarea>
      </div>
      <button @click="CreateInvestegationTaskResult" class="btn btn-primary w-full"
        style="margin-top: 10px;">Confirm</button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.investigation-answer-header {
  border-bottom: 1px solid #ccc;
  width: 100%;
  padding-bottom: 15px;

}

.investigation-answer-header .title {
  width: 100%;
  font-size: 24px;
  font-weight: 700;
}

.answer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;

  .questions-title {
    border: 1px solid #D9DBE9;
    padding: 12px;
    border-radius: 30px;
    width: 100%;
  }

  .answer-label {
    color: #202020;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
