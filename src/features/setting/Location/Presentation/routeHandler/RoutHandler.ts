import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { LocationEnum } from '../../Core/Enum/LocationEnum'

export default class LocationRouterHandler {
  public static LocationRouter(location: LocationEnum, user) {
    switch (location) {
      case LocationEnum.COUNTRY:
        return user?.type == OrganizationTypeEnum.ADMIN
          ? '/admin/countries'
          : '/organization/countries'
        break
      case LocationEnum.CITY:
        return user?.type == OrganizationTypeEnum.ADMIN ? '/admin/cities' : '/organization/cities'
        break
      case LocationEnum.STATE:
        return user?.type == OrganizationTypeEnum.ADMIN ? '/admin/states' : '/organization/states'
        break
      case LocationEnum.AREA:
        return user?.type == OrganizationTypeEnum.ADMIN ? '/admin/areas' : '/organization/areas'
        break
      default:
        return '/admin/countries'
    }
  }
}
