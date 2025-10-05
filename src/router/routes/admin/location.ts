import type { RouteRecordRaw } from '@/router/types'
import { createLocationRoutes } from '@/router/helpers'

export const locationRoutes: RouteRecordRaw[] = [
  ...createLocationRoutes('countries', 'Country'),
  ...createLocationRoutes('states', 'State'),
  ...createLocationRoutes('cities', 'City'),
  ...createLocationRoutes('areas', 'Area'),
]
