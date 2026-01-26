import type TitleInterface from '@/base/Data/Models/title_interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectSelectStore = defineStore(
  'ProjectSelect',
  () => {
    const project = ref<TitleInterface | null>(null)

    function setProjectId(newProjectId: TitleInterface) {
      project.value = newProjectId
    }

    function getProjectId() {
      return project.value?.id
    }

    function showProjectsFilter(): boolean {
      return project.value?.id == -1 || project.value?.id == null
    }

    function getProject() {
      return project.value
    }

    function SelectedProjectId(projectId: number) {
      if (project.value?.id != -1 && project.value?.id != null) {
        return project.value.id
      } else if (project.value?.id != null) {
        return projectId
      }
      return null
    }

    return {
      project,
      setProjectId,
      getProjectId,
      SelectedProjectId,
      getProject,
      showProjectsFilter,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)
