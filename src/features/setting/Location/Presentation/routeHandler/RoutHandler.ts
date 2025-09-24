import { LocationEnum } from '../../Core/Enum/LocationEnum'

export default class LocationRouterHandler {
  public static LocationRouter(location: LocationEnum) {
    switch (location) {
      case LocationEnum.COUNTRY:
        return '/admin/countries'
        break
      case LocationEnum.CITY:
        return '/admin/cities'
        break
      case LocationEnum.STATE:
        return '/admin/states'
        break
      case LocationEnum.AREA:
        return '/admin/areas'
        break
      default:
        return '/admin/countries'
    }
  }
}
