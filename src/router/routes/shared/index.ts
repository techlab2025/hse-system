import type { RouteRecordRaw } from '@/router/types'
import { accidentsRoutes } from './accidents'
import { certificateRoutes } from './certificate'
import { equipmentRoutes } from './equipment'
import { factoryRoutes } from './factory'
import { hazardRoutes } from './hazard'
import { templateRoutes } from './template'
import { templateItemRoutes } from './templateItem'
import { methodsRoutes } from './methods'
import { teamsRoutes } from './team'
import { contractorsRoutes } from './contractor'
import { locationRoutes } from './location'
import { observerationRoutes } from './observeration'
import {observationRoutes} from './observation'



export const sharedRoutes: RouteRecordRaw[] = [
  ...accidentsRoutes,
  ...certificateRoutes,
  ...equipmentRoutes,
  ...factoryRoutes,
  ...hazardRoutes,
  ...templateRoutes,
  ...templateItemRoutes,
  ...methodsRoutes,
  ...teamsRoutes,
  ...contractorsRoutes,
  ...locationRoutes,
  ...observerationRoutes,
  ...observationRoutes


]
