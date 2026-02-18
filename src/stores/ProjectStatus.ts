// userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type ProjectProgressModel from '@/features/Organization/ProjectPrgoress/Data/models/ProjectProgressModel'
import { SertialNumberStatusEnum } from '@/features/Organization/SerialNumber/Core/Enums/SerialNumberStatusEnum'

export const useProjectAppStatusStore = defineStore(
  'projectAppStatusStore',
  () => {
    const projectAppStatus = ref<ProjectProgressModel | null>(null)

    function setProjectAppStatus(newUser: ProjectProgressModel) {
      projectAppStatus.value = { ...newUser }
    }

    function getProjectAppStatus() {
      return projectAppStatus.value
    }

    function isSerialNumberAuto() {
      return projectAppStatus.value?.codeSystemType == SertialNumberStatusEnum.AUTO
    }
    return {
      projectAppStatus,
      setProjectAppStatus,
      getProjectAppStatus,
      isSerialNumberAuto,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
