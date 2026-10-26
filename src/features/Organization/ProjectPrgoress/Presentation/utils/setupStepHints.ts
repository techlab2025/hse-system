import { ProjectProgressEnum as Step } from '../../Core/Enum/ProjectProgressEnum'

/** Translation names shared by the home reminder and the setup progress API's step IDs. */
export const setupStepHintKeys: Partial<Record<number, string>> = {
  [Step.PresetData]: 'preset',
  [Step.codingSystem]: 'coding',
  [Step.Certificate]: 'training',
  [Step.Tempalte]: 'templates',
  [Step.Employee]: 'employees',
  [Step.Department]: 'departments',
  [Step.Heirarchy]: 'positions',
  [Step.Country]: 'countries',
  [Step.State]: 'states',
  [Step.City]: 'cities',
  [Step.Locatio]: 'locations',
  [Step.Zone]: 'zones',
  [Step.ObservationType]: 'observation_types',
  [Step.IncidantType]: 'incident_types',
  [Step.HazardType]: 'hazard_classifications',
  [Step.Hazard]: 'risks',
  [Step.EquipmentType]: 'equipment_brands',
  [Step.Equipment]: 'equipment',
  [Step.Team]: 'teams',
  [Step.RootCause]: 'root_causes',
  [Step.Factor]: 'factors',
  [Step.DrillType]: 'drill_types',
  [Step.PpeItem]: 'ppe_items',
}
