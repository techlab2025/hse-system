// userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type ProjectProgressModel from '@/features/Organization/ProjectPrgoress/Data/models/ProjectProgressModel'
import { SertialNumberStatusEnum } from '@/features/Organization/SerialNumber/Core/Enums/SerialNumberStatusEnum'

export const useProjectStatusStore = defineStore(
  'projectStatus',
  () => {
    const projectStatus = ref<ProjectProgressModel | null>(null)

    function setProjectStatus(newUser: ProjectProgressModel) {
      projectStatus.value = newUser
    }

    function getProjectStatus() {
      return projectStatus.value
    }

    // function isSerialNumberAuto() {
    //   return projectStatus.value?.codeSystemType === SertialNumberStatusEnum.AUTO
    // }
    return {
      projectStatus,
      setProjectStatus,
      getProjectStatus,
      // isSerialNumberAuto,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)
