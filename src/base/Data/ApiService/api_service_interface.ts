import type Params from '@/base/core/params/params'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import NetworkService from '@/base/core/networkStructure/networking/network_service'
import type ServiceCallParams from '@/base/core/params/call_params_interface'
import ShowLoader from '@/base/Presentation/Dialogs/LoaderDialogs/loader'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  MethodNotAllowedException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  InternalServerException,
  NotImplementedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  UnKnownException,
} from '@/base/core/Constance/exception_constants'

export const enum CrudType {
  FormData = 'formData',
  POST = 'post',
  GET = 'get',
  DELETE = 'delete',
  PUT = 'put',
  PATCH = 'patch',
}

// Define the ServicesInterface
export default abstract class ServicesInterface {
  private networkService = NetworkService.instance

  async call({
    url,
    type,
    auth = false,
    showLoadingDialog = false,
    headers,
    params,
    details,
  }: ServiceCallParams): Promise<{ data: any; statusCode: number }> {
    let response: AxiosResponse | undefined
    if (showLoadingDialog) {
      // console.log(ShowLoader.getInstance().dialogElement)
      ShowLoader.instance.showLoader()

      // TODO : Fire Loader
    }
    try {
      // console.log('params', params?.toMap());
      switch (type) {
        case CrudType.POST:
          response = await this.networkService.post({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details ?? {},
            isAuth: auth,
          })
          break
        case CrudType.GET:
          response = await this.networkService.get({
            url: url,
            headers: headers,
            queryParams: details,
            isAuth: auth,
          })
          break
        case CrudType.FormData:
          response = await this.networkService.postFormData({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details ?? {},
            isAuth: auth,
          })
          break
        case CrudType.DELETE:
          response = await this.networkService.delete({
            url: url,
            headers: headers,
            queryParams: details,
            isAuth: auth,
          })
          break
        case CrudType.PUT:
          response = await this.networkService.put({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details,
            isAuth: auth,
          })
          break
        case CrudType.PATCH:
          response = await this.networkService.patch({
            url: url,
            data: params?.toMap() ?? {},
            headers: headers,
            queryParams: details,
            isAuth: auth,
          })
          break
        default:
          break
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status
        switch (statusCode) {
          case 400:
            console.error(`BadRequestException >> ${statusCode}`)
            throw new BadRequestException(error.response?.data.message)
          case 403:
            console.error(`ForbiddenException >> ${statusCode}`)
            throw new ForbiddenException(error.response?.data.message ?? 'Forbidden')
          case 404:
            console.error(`NotFoundException >> ${statusCode}`)
            throw new NotFoundException(error.response?.data.message ?? 'Not found')
          case 405:
            console.error(`MethodNotAllowedException >> ${statusCode}`)
            throw new MethodNotAllowedException(
              error.response?.data.message ?? 'Method not allowed',
            )
          case 406:
            console.error(`NotAcceptableException >> ${statusCode}`)
            throw new NotAcceptableException(error.response?.data.message ?? 'Not acceptable')
          case 408:
            console.error(`RequestTimeoutException >> ${statusCode}`)
            throw new RequestTimeoutException(error.response?.data.message ?? 'Request timeout')
          case 409:
            console.error(`ConflictException >> ${statusCode}`)
            throw new ConflictException(error.response?.data.message ?? 'Conflict')
          case 422: {
            console.error(`ConflictException >> ${statusCode}`)
            const errors = error.response?.data?.errors
            let message = 'Validation error'
            if (Array.isArray(errors)) {
              message = errors.join('\n')
            } else if (errors && typeof errors === 'object') {
              message = Object.values(errors).flat().join('\n')
            }
            throw new ConflictException(message)
          }
          case 500:
            console.error(`InternalServerException >> ${statusCode}`)
            throw new InternalServerException(
              error.response?.data.message ?? 'Internal server error',
            )
          case 501:
            console.error(`NotImplementedException >> ${statusCode}`)
            throw new NotImplementedException(error.response?.data.message ?? 'Not implemented')
          case 502:
            console.error(`BadGatewayException >> ${statusCode}`)
            throw new BadGatewayException(error.response?.data.message ?? 'Bad gateway')
          case 503:
            console.error(`ServiceUnavailableException >> ${statusCode}`)
            throw new ServiceUnavailableException(
              error.response?.data.message ?? 'Service unavailable',
            )
          case 504:
            console.error(`GatewayTimeoutException >> ${statusCode}`)
            throw new GatewayTimeoutException(error.response?.data.message ?? 'Gateway timeout')
          default:
            console.error(`UnKnownException >> ${statusCode}`)
            throw new UnKnownException(error.response?.data.errros ?? 'Unknown error')
        }
      } else {
        console.error('UnKnownException')
        throw new UnKnownException('Unknown error')
      }
    } finally {
      if (showLoadingDialog) {
        ShowLoader.instance.hideLoader()
        // TODO : Close Loader
      }
    }

    if (response) {
      // console.log(`Response is not null ${response.data} - ${response.status}`)
      return {
        data: response.data,
        statusCode: response.status,
      }
    } else {
      // console.error('Response is null')
      throw new UnKnownException('Unknown error')
    }
  }

  abstract applyService(params: Params): Promise<{ data: any; statusCode: number }>
}
