import type TitleInterface from '@/base/Data/Models/title_interface'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
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
      if (projectId) {
        return projectId
      }
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
      AllProjects,
      setAllProjects,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)
