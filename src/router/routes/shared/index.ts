import type { RouteRecordRaw } from '@/router/types'
import { accidentsRoutes } from './accidents'
import { certificateRoutes } from './certificate'
import { equipmentRoutes } from './equipment'
import { factoryRoutes } from './factory'
import { hazardRoutes } from './hazard'
import { templateRoutes } from './template'
import { templateItemRoutes } from './templateItem'

export const sharedRoutes: RouteRecordRaw[] = [
  ...accidentsRoutes,
  ...certificateRoutes,
  ...equipmentRoutes,
  ...factoryRoutes,
  ...hazardRoutes,
  ...templateRoutes,
  ...templateItemRoutes,

]
