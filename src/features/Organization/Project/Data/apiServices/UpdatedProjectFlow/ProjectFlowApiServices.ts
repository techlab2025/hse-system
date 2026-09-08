import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'
import HeaderHandler from '@/base/core/networkStructure/networking/utils/header_handler'
import type BasicProjectParams from '../../../Core/params/UpdatedProjectFlow/BasicProjectParams'
import type ProjectEquipmentsParams from '../../../Core/params/UpdatedProjectFlow/ProjectEquipmentsParams'
import type ProjectHolidaysParams from '../../../Core/params/UpdatedProjectFlow/ProjectHolidaysParams'
import type ProjectLocationPositionEmployeesParams from '../../../Core/params/UpdatedProjectFlow/ProjectLocationPositionEmployeesParams'
import type ProjectTeamsParams from '../../../Core/params/UpdatedProjectFlow/ProjectTeamsParams'

abstract class ProjectFlowApiService extends ServicesInterface {
  protected abstract createUrl: string
  protected abstract updateUrl: string

  async applyService(params: Params) {
    const isUpdate = (params as { isUpdate?: boolean }).isUpdate === true
    return super.call({
      url: isUpdate ? this.updateUrl : this.createUrl,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: false,
    })
  }
}

export class BasicProjectApiService extends ProjectFlowApiService {
  protected get createUrl() {
    return ApiNames.instance.CreateBasicProject
  }
  protected get updateUrl() {
    return ApiNames.instance.UpdateBasicProject
  }
  applyService(params: BasicProjectParams) {
    return super.applyService(params)
  }
}

export class ProjectHolidaysApiService extends ProjectFlowApiService {
  protected get createUrl() {
    return ApiNames.instance.CreateProjectHolidays
  }
  protected get updateUrl() {
    return ApiNames.instance.UpdateProjectHolidays
  }
  applyService(params: ProjectHolidaysParams) {
    return super.applyService(params)
  }
}

export class ProjectLocationPositionEmployeesApiService extends ProjectFlowApiService {
  protected get createUrl() {
    return ApiNames.instance.CreateProjectLocationPositionEmployees
  }
  protected get updateUrl() {
    return ApiNames.instance.UpdateProjectLocationPositionEmployees
  }
  applyService(params: ProjectLocationPositionEmployeesParams) {
    return super.applyService(params)
  }
}

export class ProjectTeamsApiService extends ProjectFlowApiService {
  protected get createUrl() {
    return ApiNames.instance.CreateProjectTeams
  }
  protected get updateUrl() {
    return ApiNames.instance.UpdateProjectTeams
  }
  applyService(params: ProjectTeamsParams) {
    return super.applyService(params)
  }
}

export class ProjectEquipmentsApiService extends ProjectFlowApiService {
  protected get createUrl() {
    return ApiNames.instance.CreateProjectEquipments
  }
  protected get updateUrl() {
    return ApiNames.instance.UpdateProjectEquipments
  }
  applyService(params: ProjectEquipmentsParams) {
    return super.applyService(params)
  }
}

export class ProjectFlowDetailsApiService extends ServicesInterface {
  applyService(params: Params) {
    return super.call({
      url: ApiNames.instance.ShowProject,
      type: CrudType.FormData,
      auth: true,
      params,
      headers: HeaderHandler.Instance.getHeader(true, false),
      showLoadingDialog: false,
    })
  }
}
