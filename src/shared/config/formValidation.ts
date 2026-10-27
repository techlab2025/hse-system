import { reactive } from 'vue'

/** Central switches and messages for form validation.
 * enabled: false disables every client-side check connected to this configuration.
 * Each form and field has its own enabled switch.
 * message accepts plain text or an existing translation key. An empty message keeps the form's dynamic message.
 * Keys match data-required-field attributes / the form's field rules.
 *
 * Quick changes (edit the values in the object below):
 * - All validation off: enabled: false
 * - Warehouse validation off: forms.WhereHouseForm.enabled: false
 * - Only the warehouse name off: forms.WhereHouseForm.fields.Name.enabled: false
 * - Rename the warning: forms.WhereHouseForm.fields.Name.message: 'Enter a warehouse name'
 * Request constraints (lengths, ranges, patterns) are in requestValidation below.
 * Field conditions remain in the component, so hidden/conditional inputs stay optional.
 * These switches control client validation; server validation is independent.
 */
export interface FormFieldValidationSetting {
  enabled: boolean
  message: string
}
export interface FormValidationSetting {
  enabled: boolean
  fields: Record<string, FormFieldValidationSetting>
}
export const formValidation: {
  enabled: boolean
  emptyFormMessage: string
  forms: Record<string, FormValidationSetting>
} = reactive({
  enabled: true,
  emptyFormMessage: 'Please complete the required form fields.',
  forms: {
    TraningTopicForm: {
      enabled: true,
      fields: {
        title: { enabled: true, message: 'title_required' },

        // title: { enabled: true, message: 'title_required_all_languages' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    OrganizationCertificateForm: {
      enabled: true,
      fields: {
        certification_name: { enabled: true, message: 'requiredFields.certificationName' },
        issuing_body: { enabled: true, message: 'requiredFields.issuingBody' },
        certificate_number: { enabled: true, message: 'requiredFields.certificateNumber' },
        issue_date: { enabled: true, message: 'requiredFields.issueDate' },
        expire_date: { enabled: true, message: 'requiredFields.expiryDate' },
        certificate_file: { enabled: true, message: '' },
      },
    },
    // src/features/setting/SubHazard/Presentation/components/HazardForm.vue
    HazardForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.riskName' },
        industry: { enabled: true, message: 'Industry Is Required' },
        HazardType: { enabled: true, message: 'requiredFields.hazardClassification' },
      },
    },
    // src/features/Organization/Injury/Presentation/components/InjuryForm.vue
    InjuryForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.injuryName' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/setting/ObserverationType/Presentation/components/ObserverationTypeForm.vue
    ObserverationTypeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.observationTypeName' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/setting/RootCauses/Presentation/components/RootCausesForm.vue
    RootCausesForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.rootCauseName' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/setting/EquipmentType/Presentation/components/EquipmentTypeForm.vue
    EquipmentTypeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.equipmentBrandName' },
        industry: { enabled: true, message: 'Industry Is Required' },
        image: { enabled: false, message: 'requiredFields.image' },
      },
    },
    // src/features/setting/HazardType/Presentation/components/HazardTypeForm.vue
    HazardTypeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.hazardClassificationName' },
        industry: { enabled: true, message: 'Industry Is Required' },
        Factor: { enabled: false, message: 'requiredFields.factor' },
      },
    },
    // src/features/setting/AccidentsTypes/Presentation/components/AccidentsTypeForm.vue
    AccidentsTypeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.incidentTypeName' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/Organization/AuditActivity/Presentation/components/AuditActivityForm.vue
    AuditActivityForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'audit_activity_title_required' },
      },
    },
    // src/features/Organization/AuditStandard/Presentation/components/AuditStandardForm.vue
    AuditStandardForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'audit_standard_title_required' },
      },
    },
    // src/features/Organization/DocumentCategory/Presentation/components/DocumentCategoryForm.vue
    DocumentCategoryForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'document_category_title_required' },
      },
    },
    // src/features/Organization/DrillType/Presentation/components/DrillTypeForm.vue
    DrillTypeForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Drill Type Title Is Required' },
        description: { enabled: false, message: 'Drill Type Description Is Required' },
      },
    },
    // src/features/Organization/Herikaly/Presentation/components/HerikalyForm.vue
    HerikalyForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'Title Is Required' },
        department: { enabled: true, message: 'requiredFields.department' },
      },
    },
    // src/features/Organization/Inspection/Presentation/components/InspectionForm.vue
    InspectionForm: {
      enabled: true,
      fields: {
        AuditTeam: {
          enabled: true,
          message: 'Please select the project team that will receive this audit.',
        },
        SelectedProject: {
          enabled: true,
          message:
            'Please select the Project where this inspection will be conducted before continuing.',
        },
        ProjectZoneId: {
          enabled: true,
          message:
            'Please select one of the Zones associated with the selected Project where this inspection will take place.',
        },
        SelectedEmployee: {
          enabled: true,
          message:
            'Please select the employee from the selected Project who will be assigned to this inspection.',
        },
        SelectedZone: {
          enabled: true,
          message:
            'Please select one of the Zones associated with the selected Project where this inspection will take place.',
        },
        InspectionGeneralForm: { enabled: true, message: 'Inspection Schedule Is Required' },
        InspectionTemplate: {
          enabled: true,
          message: 'Please select the Inspection Template that will be used before continuing.',
        },
        InspectionDate: { enabled: true, message: 'Inspection Date Is Required' },
        InspectionPeriodType: { enabled: true, message: 'Period Type Is Required' },
        InspectionPeriodValue: { enabled: true, message: 'Period Value Is Required' },
        InspectionFromDate: { enabled: true, message: 'From Date Is Required' },
      },
    },
    // src/features/Organization/Investigating/Presentation/components/Investigating/InvestigatingForm.vue
    InvestigatingForm: {
      enabled: true,
      fields: {
        SelectedTeam: { enabled: true, message: 'Investigation Team Is Required' },
        SelectedTeamLeader: { enabled: true, message: 'Team Leader Is Required' },
        date: { enabled: true, message: 'Meeting Date Is Required' },
        time: { enabled: true, message: 'Meeting Time Is Required' },
        SelectedPlatform: { enabled: true, message: 'Meeting Platform Is Required' },
        MeetingPlace: {
          enabled: true,
          message: 'Meeting Place Is Required When Platform Is Other',
        },
      },
    },
    // src/features/Organization/Investigating/Presentation/components/Investigating/InvestigatingResults.vue
    InvestigatingResults: {
      enabled: true,
      fields: {
        CauseOfAction: { enabled: true, message: 'Other Factor Is Required' },
      },
    },
    // src/features/Organization/MangementChangeTopicType/Presentation/components/MangementChangeTopicTypeForm.vue
    MangementChangeTopicTypeForm: {
      enabled: true,
      fields: {
        mangementChangeTopicType: {
          enabled: true,
          message: 'requiredFields.changeTopicType',
        },
        title: { enabled: true, message: 'requiredFields.changeTopicTypeTitle' },
      },
    },
    // src/features/Organization/MangementOfChange/Presentation/components/MangementChangeForm.vue
    MangementChangeForm: {
      enabled: true,
      fields: {
        initiatorEmployee: { enabled: true, message: 'Change Initiator Is Required' },
        area: { enabled: true, message: 'Area Is Required' },
        date: { enabled: true, message: 'Date Is Required' },
        changeType: { enabled: true, message: 'Change Type Is Required' },
        management: { enabled: true, message: 'Proposed Change Is Required' },
        topicEmployee: { enabled: true, message: 'Employee Is Required' },
        topicEquipment: { enabled: true, message: 'Equipment Is Required' },
        topicText: { enabled: true, message: 'Topic Is Required' },
        riskAssessmentDocument: { enabled: true, message: 'Risk Assessment Document Is Required' },
        changeApproval: { enabled: true, message: 'Change Approval Is Required' },
        approvalBy: { enabled: true, message: 'Approved / Rejected By Is Required' },
      },
    },
    // src/features/Organization/MeetingType/Presentation/components/MeetingTypeForm.vue
    MeetingTypeForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Meeting Type Title Is Required' },
        periodic_type: { enabled: true, message: 'Periodic Type Is Required' },
        number_of_days: { enabled: true, message: '' },
      },
    },
    // src/features/Organization/ObservationFactory/Presentation/components/FullForm/FullObservationFactoryForm.vue
    FullObservationFactoryForm: {
      enabled: true,
      fields: {
        SelectedProjectId: { enabled: true, message: 'project_required' },
        ZoneIds: { enabled: true, message: 'zone_required' },
        date: { enabled: true, message: 'date_required' },
        SelctedTime: { enabled: true, message: 'time_required' },
        SelectedObservationType: { enabled: true, message: 'observation_type_required' },
        AccidentsType: { enabled: true, message: 'incident_type_required' },
        HazardType: { enabled: true, message: 'hazard_classification_required' },
        SubHazardType: { enabled: true, message: 'hazard_required_for_negative_observation' },
        witnesses: { enabled: true, message: '' },
        Accidents: { enabled: true, message: '' },
        Fatalities: { enabled: true, message: '' },
      },
    },
    // src/features/Organization/OrganizationEmployee/Presentation/components/OrganizatoinEmployeeForm.vue
    OrganizatoinEmployeeForm: {
      enabled: true,
      fields: {
        Name: { enabled: true, message: 'Name Is Required' },
        Phone: { enabled: true, message: 'Phone Is Required' },
        Email: { enabled: true, message: 'Email Is Required' },
      },
    },
    // src/features/Organization/PPEActivity/Presentation/components/PPEActivityForm.vue
    PPEActivityForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'ppe_activity_title_required' },
      },
    },
    // src/features/Organization/PPETool/Presentation/components/PPEToolForm.vue
    PPEToolForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'ppe_tool_title_required' },
      },
    },
    // src/features/Organization/PTWType/Presentation/components/PTWTypeForm.vue
    PTWTypeForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Permit To Work Type Title Is Required' },
      },
    },
    // src/features/Organization/Project/Presentation/components/Induction/InductionForm.vue
    InductionForm: {
      enabled: true,
      fields: {
        instractor: { enabled: true, message: 'Instructor is required' },
        date: { enabled: true, message: 'Date is required' },
        trainingTopic: { enabled: true, message: 'Training topic is required' },
        organisationEmployee: { enabled: true, message: 'At least one employee is required' },
      },
    },
    // src/features/Organization/Project/Presentation/components/ProjectForm.vue
    ProjectForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'Project Name Is Required' },
        date: { enabled: true, message: 'Start Date Is Required' },
        endDate: { enabled: true, message: 'End Date Is Required' },
        location: { enabled: true, message: 'Location Is Required' },
        ZoneIds: { enabled: true, message: 'Zone Is Required' },
      },
    },
    // src/features/Organization/Scope/Presentation/components/ScopeForm.vue
    ScopeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'Name Is Required' },
      },
    },
    // src/features/Organization/VisitActivity/Presentation/components/VisitActivityForm.vue
    VisitActivityForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Visit Activity Title Is Required' },
      },
    },
    // src/features/Organization/VisitCategory/Presentation/components/VisitCategoryForm.vue
    VisitCategoryForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Visit Category Title Is Required' },
      },
    },
    // src/features/Organization/VisitTheme/Presentation/components/VisitThemeForm.vue
    VisitThemeForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'Visit Theme Title Is Required' },
      },
    },
    // src/features/Organization/WhereHouse/Presentation/components/WhereHouseForm.vue
    WhereHouseForm: {
      enabled: true,
      fields: {
        Name: { enabled: true, message: 'requiredFields.warehouse' },
        SelectedWhereHouseType: { enabled: true, message: 'Warehouse Type Is Required' },
      },
    },
    // src/features/Organization/WhereHouseType/Presentation/components/WhereHouseTypeForm.vue
    WhereHouseTypeForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'requiredFields.warehouseType' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/Organization/notificationPlan/presentation/components/AddNotificationPlan.vue
    AddNotificationPlan: {
      enabled: true,
      fields: {
        title: { enabled: true, message: 'notification_plan_title_required' },
        actions: { enabled: true, message: 'select_actions' },
        assignments: { enabled: true, message: 'select_employee_or_hierarchy_error' },
      },
    },
    // src/features/Organization/objectives/Presentation/components/ObjectivesForm.vue
    ObjectivesForm: {
      enabled: true,
      fields: {
        year: { enabled: true, message: 'Year Is Required' },
        objective: { enabled: true, message: 'Objective Is Required' },
        target_type: { enabled: true, message: 'Target Type Is Required' },
        direction: { enabled: true, message: 'Direction Is Required' },
        target: { enabled: true, message: 'Target Is Required' },
        baseline: { enabled: true, message: 'Baseline Is Required' },
        unit: { enabled: true, message: 'Unit Is Required' },
        frequency: { enabled: true, message: 'Frequency Is Required' },
        department: { enabled: true, message: 'Department Is Required' },
        follow_up_employee: { enabled: true, message: 'Follow-up Employee Is Required' },
      },
    },
    // src/features/Organization/ppeItem/Presentation/components/PpeItemForm.vue
    PpeItemForm: {
      enabled: true,
      fields: {
        industry: { enabled: true, message: 'Industry Is Required' },
        title: { enabled: true, message: 'PPE Item Title Is Required' },
      },
    },
    // src/features/setting/Certificate/Presentation/components/CertificateForm.vue
    CertificateForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'Name Is Required' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/setting/Equipment/Presentation/components/FullEquipmentFrom.vue
    FullEquipmentFrom: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: '' },
        equipmentType: { enabled: true, message: '' },
        deviceStatus: { enabled: true, message: 'Status Is Required' },
        SelectedContractor: { enabled: true, message: 'Contractor Is Required' },
        SelectedRentType: { enabled: true, message: 'Rent Type Is Required' },
        Rent: { enabled: true, message: 'Rent Period Is Required' },
        StartDate: { enabled: true, message: 'Rent Start Date Is Required' },
      },
    },
    // src/features/setting/IncidentCategories/Presentation/components/IncidentCategoryForm.vue
    IncidentCategoryForm: {
      enabled: true,
      fields: {
        incidentTypeId: { enabled: true, message: 'Incident Type Is Required' },
      },
    },
    // src/features/setting/Teams/Presentation/components/TeamForm.vue
    TeamForm: {
      enabled: true,
      fields: {
        langs: { enabled: true, message: 'Name Is Required' },
        industry: { enabled: true, message: 'Industry Is Required' },
      },
    },
    // src/features/setting/contractor/Presentation/components/ContractorForm.vue
    ContractorForm: {
      enabled: true,
      fields: {
        Name: { enabled: true, message: 'Contractor Name Is Required' },
        phoneNumber: { enabled: true, message: 'Contractor Phone Number Is Required' },
        contactPersonPhone: { enabled: true, message: 'Contact Person Phone Is Required' },
        date: { enabled: true, message: 'Contract Expiry Date Is Required' },
      },
    },
  },
})

/** Request-level constraints. Keys are stable source paths, including in production builds.
 * A formField links a request field to the form switch above.
 * Set required, minLength, maxLength, min, max, pattern or message here.
 * Specialized custom validators remain with their request classes.
 */
export interface RequestFieldValidationSetting {
  enabled: boolean
  message?: string
  formField?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
}
export interface RequestValidationSetting {
  enabled: boolean
  form?: string
  fields: Record<string, RequestFieldValidationSetting>
}
export const requestValidation: Record<string, RequestValidationSetting> = {
  'Organization/AuditActivity/Core/params/AddAuditActivityClonesParams': {
    enabled: true,
    form: 'AuditActivityForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/AuditActivity/Core/params/addAuditActivityParams': {
    enabled: true,
    form: 'AuditActivityForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/AuditStandard/Core/params/AddAuditStandardClonesParams': {
    enabled: true,
    form: 'AuditStandardForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/AuditStandard/Core/params/addAuditStandardParams': {
    enabled: true,
    form: 'AuditStandardForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/CheckList/Core/params/addCheckListParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/DocumentCategory/Core/params/AddDocumentCategoryClonesParams': {
    enabled: true,
    form: 'DocumentCategoryForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/DocumentCategory/Core/params/addDocumentCategoryParams': {
    enabled: true,
    form: 'DocumentCategoryForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/DocumentRefrence/Core/params/AddDocumentRefrenceParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/DrillType/Core/params/AddDrillTypeClonesParams': {
    enabled: true,
    form: 'DrillTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/DrillType/Core/params/addDrillTypeExcelParams': {
    enabled: true,
    form: 'DrillTypeForm',
    fields: {},
  },
  'Organization/DrillType/Core/params/addDrillTypeParams': {
    enabled: true,
    form: 'DrillTypeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/EmployeesCertificates/Core/params/AddEmplyeeCertificateParams': {
    enabled: true,
    fields: {
      certificateId: { enabled: true, message: '', required: true },
      organizationEmployeeId: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Injury/Core/params/AddInjuryExcelParams': {
    enabled: true,
    form: 'InjuryForm',
    fields: {},
  },
  'Organization/Injury/Core/params/AddinjuryCloneParams': {
    enabled: true,
    form: 'InjuryForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Injury/Core/params/addInjuryParams': {
    enabled: true,
    form: 'InjuryForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'langs',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/MangementChangeTopicType/Core/params/AddMangementChangeTopicTypeParams': {
    enabled: true,
    form: 'MangementChangeTopicTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/MangementChangeTopicType/Core/params/addMangementChangeTopicTypeExcelParams': {
    enabled: true,
    form: 'MangementChangeTopicTypeForm',
    fields: {},
  },
  'Organization/MangementChangeTopicType/Core/params/addMangementChangeTopicTypeParams': {
    enabled: true,
    form: 'MangementChangeTopicTypeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      status: { enabled: true, message: '', required: false },
    },
  },
  'Organization/MangementOfChange/Core/params/addMangementChangeParams': {
    enabled: true,
    form: 'MangementChangeForm',
    fields: {},
  },
  'Organization/MeetingType/Core/params/AddMeetingTypeClonesParams': {
    enabled: true,
    form: 'MeetingTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/MeetingType/Core/params/addMeetingTypeParams': {
    enabled: true,
    form: 'MeetingTypeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      periodicType: { enabled: true, message: '', required: true },
    },
  },
  'Organization/ObservationFactory/Core/params/addHazardParams': {
    enabled: true,
    form: 'FullObservationFactoryForm',
    fields: {},
  },
  'Organization/ObservationFactory/Core/params/editHazardParams': {
    enabled: true,
    form: 'FullObservationFactoryForm',
    fields: {
      title: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
    },
  },
  'Organization/OrganizationEmployee/Core/params/AddEmployeesIdToHierarchyParams': {
    enabled: true,
    form: 'OrganizatoinEmployeeForm',
    fields: {
      organization_employee_id: { enabled: true, message: '', required: true },
    },
  },
  'Organization/OrganizationEmployee/Core/params/AddEmployeesToHierarchyParams': {
    enabled: true,
    form: 'OrganizatoinEmployeeForm',
    fields: {
      hierarchyId: { enabled: true, message: '', required: true },
      employeeIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/OrganizationEmployee/Core/params/AddOrganizationEmployeeExcelParams': {
    enabled: true,
    form: 'OrganizatoinEmployeeForm',
    fields: {},
  },
  'Organization/OrganizationEmployee/Core/params/addOrganizatoinEmployeeParams': {
    enabled: true,
    form: 'OrganizatoinEmployeeForm',
    fields: {
      name: {
        enabled: true,
        message: '',
        formField: 'Name',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      positions: { enabled: true, message: '', required: true },
      phone: {
        enabled: true,
        message: '',
        formField: 'Phone',
        required: true,
        pattern: /^\+?[\d\s-()]+$/,
      },
      email: {
        enabled: true,
        message: '',
        formField: 'Email',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
    },
  },
  'Organization/OrganizationEmployee/Core/params/editOrganizatoinEmployeeParams': {
    enabled: true,
    form: 'OrganizatoinEmployeeForm',
    fields: {
      name: {
        enabled: true,
        message: '',
        formField: 'Name',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      phone: {
        enabled: true,
        message: '',
        formField: 'Phone',
        required: true,
        pattern: /^\+?[\d\s-()]+$/,
      },
      email: {
        enabled: true,
        message: '',
        formField: 'Email',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
  },
  'Organization/PPEActivity/Core/params/AddPPEActivityClonesParams': {
    enabled: true,
    form: 'PPEActivityForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/PPEActivity/Core/params/addPPEActivityParams': {
    enabled: true,
    form: 'PPEActivityForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/PPETool/Core/params/AddPPEToolClonesParams': {
    enabled: true,
    form: 'PPEToolForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/PPETool/Core/params/addPPEToolParams': {
    enabled: true,
    form: 'PPEToolForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/PTWType/Core/params/AddPTWTypeClonesParams': {
    enabled: true,
    form: 'PTWTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/PTWType/Core/params/addPTWTypeParams': {
    enabled: true,
    form: 'PTWTypeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      ptw_color: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Partner/Core/params/addPartnerParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      phone: {
        enabled: true,
        message: '',
        required: true,
        minLength: 11,
        maxLength: 20,
        pattern: /^\+?\d[\d\s\-()]{4,}$/,
      },
    },
  },
  'Organization/Project/Core/params/RiskAssessment/CreateRiskAssessmentParams': {
    enabled: true,
    fields: {
      activity: { enabled: true, message: '', required: true },
      desctiprion: { enabled: true, message: '', required: false },
      workAreaStrign: { enabled: true, message: '', required: true },
      date: { enabled: true, message: '', required: true },
      employeeApproverId: { enabled: true, message: '', required: true, min: 1 },
    },
  },
  'Organization/Project/Core/params/induction/addInductionParams': {
    enabled: true,
    form: 'InductionForm',
    fields: {
      instractor_id: { enabled: true, message: '', required: true },
      date: { enabled: true, message: '', formField: 'date', required: true },
      trainingTopic: { enabled: true, message: '', formField: 'trainingTopic', required: true },
      organisationEmployee: {
        enabled: true,
        message: '',
        formField: 'organisationEmployee',
        required: true,
      },
    },
  },
  'Organization/Project/Core/params/induction/editInductionParams': {
    enabled: true,
    form: 'InductionForm',
    fields: {
      id: { enabled: true, message: '', required: true },
      instractor_id: { enabled: true, message: '', required: true },
      date: { enabled: true, message: '', formField: 'date', required: true },
      trainingTopic: { enabled: true, message: '', formField: 'trainingTopic', required: true },
      organisationEmployee: {
        enabled: true,
        message: '',
        formField: 'organisationEmployee',
        required: true,
      },
    },
  },
  'Organization/ProjectPrgoress/Core/params/addProjectProgressParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      phone: {
        enabled: true,
        message: '',
        required: true,
        minLength: 11,
        maxLength: 20,
        pattern: /^\+?\d[\d\s\-()]{4,}$/,
      },
    },
  },
  'Organization/ProjectPrgoress/Core/params/cloneAllAdminDataParams': { enabled: true, fields: {} },
  'Organization/Scope/Core/params/addScopeParams': {
    enabled: true,
    form: 'ScopeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'langs',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/Shifts/Core/params/AddShiftParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
      startTime: { enabled: true, message: '', required: true },
      endTime: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Ticket/Core/params/closeTicketParams': {
    enabled: true,
    fields: {
      ticketId: { enabled: true, message: '', required: true },
      status: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Ticket/Core/params/editTicketParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/Ticket/Core/params/replaceTicketParams': {
    enabled: true,
    fields: {
      ticketId: { enabled: true, message: '', required: true },
      reply: { enabled: true, message: '', required: true },
    },
  },
  'Organization/TicketType/Core/params/addTicketTypeParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/TicketType/Core/params/editTicketTypeParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/TraningTopic/Core/params/AddTraningTopicClonesParams': {
    enabled: true,
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/TraningTopic/Core/params/addTraningTopicParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/TraningTopic/Core/params/editTraningTopicParams': {
    enabled: true,
    fields: {
      id: { enabled: true, message: '', required: true },
      translation: { enabled: true, message: '', required: true },
    },
  },
  'Organization/VisitActivity/Core/params/addVisitActivityParams': {
    enabled: true,
    form: 'VisitActivityForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/VisitCategory/Core/params/addVisitCategoryParams': {
    enabled: true,
    form: 'VisitCategoryForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/VisitTheme/Core/params/addVisitThemeParams': {
    enabled: true,
    form: 'VisitThemeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/WhereHouse/Core/params/addWhereHouseParams': {
    enabled: true,
    form: 'WhereHouseForm',
    fields: {},
  },
  'Organization/WhereHouseType/Core/params/AddWarehouseTypeClonesParams': {
    enabled: true,
    form: 'WhereHouseTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/WhereHouseType/Core/params/addWhereHouseTypeExcelParams': {
    enabled: true,
    form: 'WhereHouseTypeForm',
    fields: {},
  },
  'Organization/WhereHouseType/Core/params/addWhereHouseTypeParams': {
    enabled: true,
    form: 'WhereHouseTypeForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'langs',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'Organization/objectives/Core/params/addObjectivesParams': {
    enabled: true,
    form: 'ObjectivesForm',
    fields: {
      year: { enabled: true, message: '', formField: 'year', required: true },
      objective: {
        enabled: true,
        message: '',
        formField: 'objective',
        required: true,
        minLength: 2,
      },
      targetType: { enabled: true, message: '', required: true },
      departmentId: { enabled: true, message: '', required: true },
      followUpEmployeeId: { enabled: true, message: '', required: true },
    },
  },
  'Organization/objectives/Core/params/editObjectivesParams': {
    enabled: true,
    form: 'ObjectivesForm',
    fields: {
      id: { enabled: true, message: '', required: true },
      year: { enabled: true, message: '', formField: 'year', required: true },
      objective: {
        enabled: true,
        message: '',
        formField: 'objective',
        required: true,
        minLength: 2,
      },
      targetType: { enabled: true, message: '', required: true },
      departmentId: { enabled: true, message: '', required: true },
      followUpEmployeeId: { enabled: true, message: '', required: true },
    },
  },
  'Organization/objectives/ObjectiveProgress/Core/params/addObjectiveProgressParams': {
    enabled: true,
    form: 'ObjectivesForm',
    fields: {
      objectiveId: { enabled: true, message: '', required: true, min: 1 },
      draft: { enabled: true, message: '', required: true },
    },
  },
  'Organization/objectives/ObjectiveProgress/Core/params/editObjectiveProgressParams': {
    enabled: true,
    form: 'ObjectivesForm',
    fields: {
      objectiveId: { enabled: true, message: '', required: true, min: 1 },
      progressId: { enabled: true, message: '', required: true, min: 1 },
      draft: { enabled: true, message: '', required: true },
    },
  },
  'Organization/ppeItem/Core/params/AddPpeItemClonesParams': {
    enabled: true,
    form: 'PpeItemForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'Organization/ppeItem/Core/params/addPpeItemExcelParams': {
    enabled: true,
    form: 'PpeItemForm',
    fields: {},
  },
  'Organization/ppeItem/Core/params/addPpeItemParams': {
    enabled: true,
    form: 'PpeItemForm',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'title',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
  },
  'setting/AccidentsTypes/Core/params/AddAccidentsTypeExcelParams': {
    enabled: true,
    form: 'AccidentsTypeForm',
    fields: {},
  },
  'setting/AccidentsTypes/Core/params/addAccidentsTypeParams': {
    enabled: true,
    form: 'AccidentsTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/AccidentsTypes/Core/params/addSystemAccidentsTypeParams': {
    enabled: true,
    form: 'AccidentsTypeForm',
    fields: {
      cloneIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/AccidentsTypes/Core/params/editAccidentsTypeParams': {
    enabled: true,
    form: 'AccidentsTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/CatalogItems/Core/params/addCatalogItemsParams': {
    enabled: true,
    fields: {
      parentId: { enabled: true, message: '', required: true },
    },
  },
  'setting/CatalogItems/Core/params/editCatalogItemsParams': {
    enabled: true,
    fields: {
      parentId: { enabled: true, message: '', required: true },
    },
  },
  'setting/Equipment/Core/params/AddEquipmentExcelParams': {
    enabled: true,
    form: 'FullEquipmentFrom',
    fields: {},
  },
  'setting/Equipment/Core/params/addEquipmentParams': {
    enabled: true,
    form: 'FullEquipmentFrom',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'langs',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      equipmentTypeId: { enabled: true, message: '', required: true },
    },
  },
  'setting/Equipment/Core/params/editEquipmentParams': {
    enabled: true,
    form: 'FullEquipmentFrom',
    fields: {
      translation: {
        enabled: true,
        message: '',
        formField: 'langs',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      equipmentTypeId: { enabled: true, message: '', required: true },
    },
  },
  'setting/EquipmentType/Core/params/AddEquipmentTypeExcelParams': {
    enabled: true,
    form: 'EquipmentTypeForm',
    fields: {},
  },
  'setting/EquipmentType/Core/params/AddSystemEquipmentParams': {
    enabled: true,
    form: 'EquipmentTypeForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/EquipmentType/Core/params/addEquipmentTypeParams': {
    enabled: true,
    form: 'EquipmentTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
      type: { enabled: true, message: '', required: true },
    },
  },
  'setting/EquipmentType/Core/params/editEquipmentTypeParams': {
    enabled: true,
    form: 'EquipmentTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
      type: { enabled: true, message: '', required: true },
    },
  },
  'setting/FactoryItem/Core/params/addFactoryItemParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      factoryId: { enabled: true, message: '', required: true },
    },
  },
  'setting/FactoryItem/Core/params/cloneFactoryItemsParams': {
    enabled: true,
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/FactoryItem/Core/params/editFactoryItemParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      factoryId: { enabled: true, message: '', required: true },
    },
  },
  'setting/HazardType/Core/params/addHazardExcelParams': {
    enabled: true,
    form: 'HazardTypeForm',
    fields: {},
  },
  'setting/HazardType/Core/params/addHazardTypeParams': {
    enabled: true,
    form: 'HazardTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/HazardType/Core/params/addSystemHazardParams': {
    enabled: true,
    form: 'HazardTypeForm',
    fields: {
      cloneIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/HazardType/Core/params/editHazardTypeParams': {
    enabled: true,
    form: 'HazardTypeForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/IncidentCategories/Core/params/AddIncidentCategoryExcelParams': {
    enabled: true,
    form: 'IncidentCategoryForm',
    fields: {},
  },
  'setting/IncidentCategories/Core/params/addIncidentCategoryParams': {
    enabled: true,
    form: 'IncidentCategoryForm',
    fields: {
      translation: { enabled: true, message: '', required: true },
      incidentTypeId: {
        enabled: true,
        message: '',
        formField: 'incidentTypeId',
        required: true,
        min: 1,
      },
    },
  },
  'setting/IncidentCategories/Core/params/addSystemIncidentCategoryParams': {
    enabled: true,
    form: 'IncidentCategoryForm',
    fields: {
      cloneIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/IncidentCategories/Core/params/editIncidentCategoryParams': {
    enabled: true,
    form: 'IncidentCategoryForm',
    fields: {
      translation: { enabled: true, message: '', required: true },
      incidentTypeId: {
        enabled: true,
        message: '',
        formField: 'incidentTypeId',
        required: true,
        min: 1,
      },
    },
  },
  'setting/Industries/Core/Params/createIndustryParams': {
    enabled: true,
    fields: {
      title: { enabled: true, message: '', required: true },
    },
  },
  'setting/Industries/Core/Params/updateIndustryParams': {
    enabled: true,
    fields: {
      title: { enabled: true, message: '', required: true },
    },
  },
  'setting/Location/Core/params/addLocationParams': {
    enabled: true,
    fields: {
      title: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      type: { enabled: true, message: '', required: true },
    },
  },
  'setting/Organization/Core/params/addOrganizationParams': {
    enabled: true,
    fields: {
      name: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      phone: { enabled: true, message: '', required: true, pattern: /^\+?[\d\s-()]+$/ },
      email: { enabled: true, message: '', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      image: { enabled: true, message: '', required: false },
      website_link: { enabled: true, message: '', required: false, pattern: /^.+\..+$/ },
      industry_id: { enabled: true, message: '', required: false },
      language_ids: { enabled: true, message: '', required: false },
      location_ids: { enabled: true, message: '', required: false },
      link: { enabled: true, message: '', required: false },
    },
  },
  'setting/RootCauses/Core/params/AddRootCausesExcelParams': {
    enabled: true,
    form: 'RootCausesForm',
    fields: {},
  },
  'setting/RootCauses/Core/params/AddStstemRootCausesParams': {
    enabled: true,
    form: 'RootCausesForm',
    fields: {
      clonesIds: { enabled: true, message: '', required: true },
    },
  },
  'setting/RootCauses/Core/params/addRootCausesParams': {
    enabled: true,
    form: 'RootCausesForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/RootCauses/Core/params/editRootCausesParams': {
    enabled: true,
    form: 'RootCausesForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/SubHazard/Core/params/addHazardParams': {
    enabled: true,
    form: 'HazardForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/SubHazard/Core/params/editHazardParams': {
    enabled: true,
    form: 'HazardForm',
    fields: {
      translation: { enabled: true, message: '', formField: 'langs', required: true },
    },
  },
  'setting/Template/Core/params/addTemplateParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
    },
  },
  'setting/TemplateItem/Core/params/addTemplateItemParams': {
    enabled: true,
    fields: {
      title: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
    },
  },
  'setting/contractor/Core/params/addContractorParams': {
    enabled: true,
    form: 'ContractorForm',
    fields: {
      Name: {
        enabled: true,
        message: '',
        formField: 'Name',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      ContractorNumber: {
        enabled: true,
        message: '',
        required: true,
        minLength: 11,
        maxLength: 20,
        pattern: /^\+?\d[\d\s\-()]{4,}$/,
      },
      contactPersonPhone: {
        enabled: true,
        message: '',
        formField: 'contactPersonPhone',
        pattern: /^\+?\d[\d\s\-()]{4,}$/,
      },
    },
  },
  'setting/contractor/Core/params/editContractorParams': {
    enabled: true,
    form: 'ContractorForm',
    fields: {
      Name: {
        enabled: true,
        message: '',
        formField: 'Name',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      phoneNumber: {
        enabled: true,
        message: '',
        formField: 'phoneNumber',
        required: true,
        minLength: 11,
        maxLength: 20,
        pattern: /^\+?\d[\d\s\-()]{4,}$/,
      },
    },
  },
  'setting/languages/Core/params/addLangParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
      code: { enabled: true, message: '', required: true },
    },
  },
  'setting/languages/Core/params/editLangParams': {
    enabled: true,
    fields: {
      translation: { enabled: true, message: '', required: true },
      code: { enabled: true, message: '', required: true },
    },
  },
  'users/Admin/Core/Params/add_admin_params': {
    enabled: true,
    fields: {
      name: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      phone: { enabled: true, message: '', required: true, pattern: /^\+?[\d\s-()]+$/ },
      email: { enabled: true, message: '', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { enabled: true, message: '', required: true, minLength: 6, maxLength: 100 },
    },
  },
  'users/Admin/Core/Params/edit_admin_params': {
    enabled: true,
    fields: {
      name: { enabled: true, message: '', required: true, minLength: 2, maxLength: 100 },
      phone: { enabled: true, message: '', required: true, pattern: /^\+?[\d\s-()]+$/ },
      email: { enabled: true, message: '', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { enabled: true, message: '', required: true, minLength: 6, maxLength: 100 },
    },
  },
}
