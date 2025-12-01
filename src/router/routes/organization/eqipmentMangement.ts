import type { RouteRecordRaw } from '@/router/types'
import { observationRoutes } from './observation'
import { hazardRoutes } from './hazard'
import { InspectionRoutes } from './inspection'
import { IncedantRoutes } from './Incedant'
// import IndexEquipmentMangement from '@/features/Organization/ObservationFactory/Presentation/components/indexEquipmentMangement.vue'
// import IndexObservation from '@/views/Organization/ObservationFactory/Observation/IndexObservation.vue'
// import { addSuffix } from '@/router/helpers'

export const EquipmentMangementRoutes: RouteRecordRaw[] = [
  {
    path: 'equipment',
    name: 'Equipment Mangement',
    // component: () => IndexEquipmentMangement,
    children: [
      ...IncedantRoutes,
      ...InspectionRoutes,
      ...hazardRoutes,
      ...observationRoutes,
      // ...addSuffix(sharedRoutes, 'Organization'),
    ],
  },
]
