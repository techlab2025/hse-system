import type TitleInterface from '@/base/Data/Models/title_interface'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectSelectStore = defineStore(
  'ProjectSelect',
  () => {
    const project = ref<TitleInterface | null>(null)
    const AllProjects = ref<ProjectModel[]>([])

    function setAllProjects(newAllProjects: ProjectModel[]) {
      AllProjects.value = newAllProjects
    }

    function clearProject() {
      project.value = null
    }

    function setProjectId(newProjectId: TitleInterface | null) {
      if (!newProjectId || newProjectId.id === -1) {
        clearProject()
        return
      }

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

    function SelectedProjectId(projectId?: number | number[] | null) {
      const validId = (value: unknown) => {
        const id = Number(value)
        return Number.isSafeInteger(id) && id > 0 ? id : undefined
      }
      const headerId = validId(getProjectId())
      if (Array.isArray(projectId)) {
        const ids = [
          ...new Set(projectId.map(validId).filter((id): id is number => id !== undefined)),
        ]
        return ids.length ? ids : headerId ? [headerId] : null
      }
      return validId(projectId) ?? headerId ?? null
    }

    return {
      project,
      setProjectId,
      clearProject,
      getProjectId,
      SelectedProjectId,
      getProject,
      showProjectsFilter,
      AllProjects,
      setAllProjects,
    }
  },
  {
    persist: {
      pick: ['project', 'AllProjects'],
    },
  },
)
