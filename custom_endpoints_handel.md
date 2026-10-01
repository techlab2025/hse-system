# Custom Endpoints Handle Rules

> File name: `custom_endpoints_handel.md`
>
> Purpose: permanent instructions for AI/Codex when creating a feature that is **not a full CRUD**, but instead contains only **1, 2, or 3 custom endpoints** while preserving the same project architecture:
>
> `Params -> ApiService -> Repository -> UseCase -> Controller -> one Vue component`
>
> The user will normally provide:
>
> 1. Feature name.
> 2. One, two, or three endpoint/action names.
> 3. Params/body/query keys for each endpoint.
> 4. API endpoint property names from `ApiNames`.
> 5. Enums if any.
> 6. Optional custom response model.
> 7. Optional component/page/route information.
>
> The AI must generate only the layers required for the supplied endpoints. Do **not** generate CRUD files that were not requested.

---

# 1. Main Role

You are a custom feature endpoint generator for this Vue 3 + TypeScript project.

The architecture must stay identical to the existing project architecture.

For every endpoint/action, the flow is:

```text
Core/params/<Action><FeatureName>Params.ts
        ↓
Data/apiServices/<Action><FeatureName>ApiService.ts
        ↓
Domain/repositories/<Action><FeatureName>Repo.ts
        ↓
Domain/useCase/<Action><FeatureName>UseCase.ts
        ↓
Presentation/controllers/<Action><FeatureName>Controller.ts
        ↓
Presentation/components/<FeatureName>.vue
```

If there are 2 endpoints:

```text
2 Params
2 ApiServices
2 Repositories
2 UseCases
2 Controllers
1 Component
```

If there are 3 endpoints:

```text
3 Params
3 ApiServices
3 Repositories
3 UseCases
3 Controllers
1 Component
```

The important rule is:

> **Number of endpoint pipeline files = number of endpoints.**
>
> **Number of main Vue components = one, unless the user explicitly asks for more.**

Do not create add/edit/delete/index/show/clone files automatically.

Only create the exact custom endpoint pipelines requested by the user.



# 1.1 STRICT REFERENCE-FIDELITY MODE — MANDATORY

For custom endpoints, “same architecture” means **same concrete code pattern**, not merely equivalent behavior.

If a matching project endpoint/reference file exists, copy that file structure first and change only:

```text
feature/action names
Params/model types
backend keys
API getter
scope/permissions
field-specific component controls
```

Do not shorten, modernize, or redesign base-layer code.

Mandatory project conventions include:

```text
ApiService -> ServicesInterface from @/base/Data/ApiService/api_service_interface
ApiService -> named ApiNames import
ApiService -> CrudType from @/base/core/params/call_params_interface
ApiService -> private constructor + super()
ApiService -> async applyService(params)
Repo -> @/base/Domain/Repositories/repo_interface
Repo -> explicit generic type
Repo -> private constructor + super()
Repo -> typed serviceInstance: ServicesInterface
UseCase -> implements UseCase<Model, Params>
UseCase -> typed Promise<DataState<Model>>
Controller -> private constructor + super()
Controller -> setLoading/setState/isDataSuccess/handleResponseDialogs where reference uses state
```

A generic shortcut such as this is forbidden:

```ts
async call(params: Params) {
  return this.useCase.call(params)
}
```

when the corresponding reference endpoint controller owns `DataState` handling.

The single Vue component must also copy the closest matching project component instead of being invented from scratch.

---

# 2. Relationship to `AI_Crud.md`

This file uses the same architecture, coding style, singleton patterns, import conventions, response handling, validation style, and folder conventions as `AI_Crud.md`.

However:

- `AI_Crud.md` = complete CRUD generator.
- `custom_endpoints_handel.md` = focused generator for 1 to 3 custom endpoints.

When this file is used, do not generate a CRUD unless the user explicitly asks for one.

If both files exist:

1. Read this file first for custom endpoint tasks.
2. Use `AI_Crud.md` only as a style/architecture reference.
3. Do not copy unnecessary CRUD operations.

---

# 3. AI Execution Modes

## 3.1 Codex / repository-editing mode

When running inside Codex or another repository agent:

1. Read this file first.
2. Inspect the closest existing feature with similar endpoint behavior.
3. Inspect the project base architecture before generating code.
4. Create only the required endpoint pipeline files.
5. Create one main Vue component using all generated controllers.
6. Reuse existing utilities/components.
7. Do not modify unrelated files.
8. Add enum files only when required.
9. Add custom models only when required by the user or response structure.
10. Run the existing TypeScript/type-check command.
11. Fix errors introduced by the generated feature.
12. Search generated files for copied feature names before finishing.

Do not add unrelated routes, sidebar entries, permissions, translation files, or API names unless the user explicitly requests them or they are required for the feature to compile.

## 3.2 ChatGPT / ZIP mode

When ChatGPT is generating the feature without directly editing the repository:

1. Generate the complete requested feature structure.
2. Include only the requested endpoint pipelines.
3. Include the single main Vue component.
4. Include optional enum/model files when required.
5. If the user requests a page/route, also include the view wrapper and route file.
6. Package the generated files into a ZIP.
7. Do not rewrite unrelated project files.
8. Tell the user about any external integration still required, such as missing `ApiNames` entries.

---

# 4. User Input Contract

The user can provide input in normal language.

Example with one endpoint:

```text
Feature: PermitToWorkResult

Endpoint:
FetchPermitToWorkResult

ApiName:
FetchPermitToWorkResult

Params:
permit_to_work_id: number

Response:
id
title
description
status
```

Example with two endpoints:

```text
Feature: InvestigationMeeting

Endpoint 1:
StartInvestigationMeeting
ApiName: StartInvestigationMeeting
Params:
investigation_id: number
start_date: string

Endpoint 2:
CloseInvestigationMeeting
ApiName: CloseInvestigationMeeting
Params:
investigation_id: number
notes: string

Enums:
MeetingStatusEnum:
OPEN = 1
CLOSED = 2
```

Example with three endpoints:

```text
Feature: PermitApproval

Endpoints:

ApprovePermit
params:
permit_id: number
comment: string

RejectPermit
params:
permit_id: number
reason: string

CancelPermit
params:
permit_id: number

ApiNames:
ApprovePermit
RejectPermit
CancelPermit
```

The user does not need to provide YAML or JSON.

Interpret the request into an internal structure like:

```yaml
feature_name: PermitApproval

endpoints:
  - action_name: ApprovePermit
    api_name: ApprovePermit
    request_type: POST
    params:
      - permit_id: number
      - comment: string

  - action_name: RejectPermit
    api_name: RejectPermit
    request_type: POST
    params:
      - permit_id: number
      - reason: string

  - action_name: CancelPermit
    api_name: CancelPermit
    request_type: POST
    params:
      - permit_id: number

enums: []
custom_model: null
component_name: PermitApproval
```

---

# 5. Required Information

Normally the user only needs to provide:

```text
Feature name
Endpoint/action name(s)
Params for each endpoint
ApiNames property for each endpoint
Enums if any
Custom response model if required
```

Do not ask for information that can be safely derived from:

- endpoint name;
- neighboring project feature;
- existing `ApiNames`;
- existing endpoint style;
- existing enum;
- current project architecture.

Ask only when an essential backend detail cannot be inferred.

Examples of essential unknowns:

- request method when neighboring patterns do not make it clear;
- actual API response shape when a custom model is required;
- unknown enum numeric values;
- unknown backend key.

Never invent enum values or backend keys.

---

# 6. Naming Rules

Suppose:

```text
Feature name: PermitToWorkResult
Endpoint/action: FetchPermitToWorkResult
```

Generate:

```text
FetchPermitToWorkResultParams.ts
FetchPermitToWorkResultApiService.ts
FetchPermitToWorkResultRepo.ts
FetchPermitToWorkResultUseCase.ts
FetchPermitToWorkResultController.ts
```

The main component is normally:

```text
PermitToWorkResult.vue
```

If the user provides a specific component name, use that instead.

Example:

```text
Feature: PermitToWorkResult
Component: PermitToWorkResultDialog
```

then:

```text
Presentation/components/PermitToWorkResultDialog.vue
```

Do not duplicate the feature name incorrectly.

For example, if endpoint name already contains the feature name:

```text
FetchPermitToWorkResult
```

do not create:

```text
FetchPermitToWorkResultPermitToWorkResultParams
```

Use the action name directly.

---

# 7. Feature Folder Structure

For one endpoint:

```text
src/features/Organization/<FeatureName>/
├── Core/
│   ├── params/
│   │   └── <EndpointAction>Params.ts
│   └── enums/
│       └── <OnlyIfRequired>.ts
│
├── Data/
│   ├── apiServices/
│   │   └── <EndpointAction>ApiService.ts
│   └── models/
│       └── <FeatureName>Model.ts
│
├── Domain/
│   ├── repositories/
│   │   └── <EndpointAction>Repo.ts
│   └── useCase/
│       └── <EndpointAction>UseCase.ts
│
└── Presentation/
    ├── controllers/
    │   └── <EndpointAction>Controller.ts
    └── components/
        └── <FeatureName>.vue
```

For two endpoints:

```text
src/features/Organization/<FeatureName>/
├── Core/
│   ├── params/
│   │   ├── <Endpoint1>Params.ts
│   │   └── <Endpoint2>Params.ts
│   └── enums/
│
├── Data/
│   ├── apiServices/
│   │   ├── <Endpoint1>ApiService.ts
│   │   └── <Endpoint2>ApiService.ts
│   └── models/
│       └── <FeatureName>Model.ts
│
├── Domain/
│   ├── repositories/
│   │   ├── <Endpoint1>Repo.ts
│   │   └── <Endpoint2>Repo.ts
│   └── useCase/
│       ├── <Endpoint1>UseCase.ts
│       └── <Endpoint2>UseCase.ts
│
└── Presentation/
    ├── controllers/
    │   ├── <Endpoint1>Controller.ts
    │   └── <Endpoint2>Controller.ts
    └── components/
        └── <FeatureName>.vue
```

For three endpoints:

```text
3 params
3 api services
3 repos
3 use cases
3 controllers
1 component
```

Do not generate empty files for operations that do not exist.

---

# 8. Core / Params Rules

Every endpoint gets exactly one Params class.

Example:

```ts
import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class ApprovePermitParams implements Params {
  constructor(
    public permitId: number,
    public comment: string,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    permitId: { required: true },
    comment: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      permit_id: this.permitId,
      comment: this.comment,
    }
  }

  validate() {
    return ApprovePermitParams.validation.validate(this)
  }

  validateOrThrow() {
    return ApprovePermitParams.validation.validateOrThrow(this)
  }
}
```

## 8.1 Frontend names vs backend keys

Use clean TypeScript property names:

```text
permitId
startDate
numberOfDays
```

Map them to backend names:

```text
permit_id
start_date
number_of_days
```

inside `toMap()`.

The user-provided backend keys are the source of truth.

## 8.2 Optional fields

Do not send optional fields unnecessarily when the backend pattern excludes them.

Example:

```ts
const data: Record<string, unknown> = {
  permit_id: this.permitId,
}

if (this.comment) {
  data.comment = this.comment
}
```

Follow the closest project endpoint pattern.

## 8.3 Validation

If an endpoint has required fields:

- use `ClassValidation`;
- add `validate()`;
- add `validateOrThrow()`.

If the reference pattern for a very simple request intentionally does not validate, preserve the project pattern.

---

# 9. Translation Params Rule

A custom endpoint may accept:

```ts
TranslationsParams
```

Example request:

```text
translation:
  title
  description
```

Whenever a custom endpoint Params class contains:

```ts
translation: TranslationsParams
```

the request must preserve the **complete** result of `TranslationsParams.toMap()`.

Use this exact pattern:

```ts
import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddPPEActivityParams implements Params {
  constructor(public translation: TranslationsParams) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    return {
      translations: translations,
    }
  }

  validate() {
    return AddPPEActivityParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddPPEActivityParams.validation.validateOrThrow(this)
  }
}
```

With additional endpoint fields:

```ts
toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: translations,
    activity_type: this.activityType,
    status: this.status,
  }
}
```

## Never manually reduce the translation object

This is **wrong** by default:

```ts
toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: {
      titles: translations.titles,
    },
  }
}
```

This is also **wrong** by default:

```ts
return {
  translations: {
    titles: translations.titles,
    descriptions: translations.descriptions,
  },
}
```

Do not inspect the serialized translation object and manually select its inner properties.

The rule is:

```text
TranslationsParams owns its serialization.
The endpoint Params class sends the entire serialized object.
```

Therefore always prefer:

```ts
const translations = this.translation.toMap() as Record<string, unknown>

return {
  translations: translations,
}
```

Only reduce/rebuild the translation object if the user explicitly states that a particular backend endpoint requires a special reduced translation payload.

This applies to every custom endpoint action:

```text
create
update
submit
save
approve
assign
generate
or any other endpoint using TranslationsParams
```

However, this request rule does **not** mean the response model should have a `translations` property.

For the default model, translated response values remain flattened as separate keys such as:

```ts
public title: string
public description: string
```

This distinction is mandatory.

---

# 10. Default Model Rule

If the user does **not** give a custom model, automatically generate a model.

Default behavior:

> The model should contain response properties corresponding to the meaningful endpoint params/keys.

Example params:

```text
id
title
description
status
periodic_type
number_of_days
```

Default model:

```ts
export default class MeetingTypeModel {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: number,
    public periodicType: number,
    public numberOfDays: number,
  ) {}

  static fromMap(data: any): MeetingTypeModel {
    return new MeetingTypeModel(
      data.id,
      data.title,
      data.description,
      data.status,
      data.periodic_type,
      data.number_of_days,
    )
  }
}
```

---

# 11. Critical Translation-to-Model Rule

If Params contains:

```ts
translation: TranslationsParams
```

or backend request contains:

```text
translations
```

do **not** make the default model:

```ts
translations: ...
```

Instead, flatten translated fields into separate model properties.

Example create params:

```ts
constructor(
  public translation: TranslationsParams,
  public status: number,
) {}
```

Model should normally be:

```ts
export default class ExampleModel {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public status: number,
  ) {}

  static fromMap(data: any): ExampleModel {
    return new ExampleModel(
      data.id,
      data.title,
      data.description,
      data.status,
    )
  }
}
```

The important rule from the project owner is:

```text
translations is a request structure.
title and description are separate model keys.
```

Never create:

```ts
public translation: TranslationsParams
```

inside a default response model unless the user explicitly asks for it.

---

# 12. Title / Description Model Behavior

When the endpoint request contains translations:

```text
title
description
```

the default list/response model should use separate fields:

```ts
public title: string
public description: string
```

and map:

```ts
data.title
data.description
```

If only title exists:

```ts
public title: string
```

Do not add description.

If only description exists:

```ts
public description: string
```

Do not invent title.

If the backend detail endpoint returns:

```text
titles[]
descriptions[]
```

and the user asks for a details model, then create a details/custom model using `TranslationsParams.fromMap(...)`.

But that is a custom/details response case, not the default model behavior.

---

# 13. Custom Model Rule

If the user provides a custom model specification, follow it exactly.

Example:

```text
Custom model:
id: number
permit_number: string
status: number
approver:
  id: number
  name: string
```

Create the model according to that response shape.

Do not mirror params when the user has explicitly supplied the model.

If different endpoints return different response shapes, create multiple models only when needed.

Example:

```text
ApprovePermitModel.ts
PermitResultModel.ts
```

Do not force all endpoints to share one model when their response structures are incompatible.

---

# 14. No-Data Response Model

If an endpoint returns no useful data:

- the repository may use `ResponseType.withoutData`;
- still follow the project generic typing pattern;
- use the feature model as the generic if that matches the existing architecture.

Example:

```ts
class ApprovePermitRepo extends RepoInterface<PermitApprovalModel> {
  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
}
```

Do not invent a fake API payload.

---

# 15. Enum Rules

If the user provides enum values, create enum files under:

```text
Core/enums/
```

or the exact enum casing convention used by the nearby feature.

Example:

```ts
export enum PermitDecisionEnum {
  APPROVE = 1,
  REJECT = 2,
}
```

Use enums consistently in:

- Params typing.
- Component controls.
- Conditional validation.
- Model typing where useful.
- Request mapping.

Never invent numeric enum values.

If the enum already exists in the project, import it rather than duplicating it.

---



# 16.0 Canonical base-layer implementation — do not use alternate imports or shortcuts

The following project imports and class shapes are mandatory unless the user provides a newer exact reference file.

## API Service

```ts
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class <ActionName>ApiService extends ServicesInterface {
  private static instance: <ActionName>ApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new <ActionName>ApiService()
    }
    return this.instance
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.<ApiGetter>,
      type: CrudType.POST,
      auth: true,
      params: params,
    })
  }
}

export { <ActionName>ApiService }
```

Do not generate:

```ts
import ServicesInterface from '@/base/Data/apiServices/ServicesInterface'
import ApiNames from '@/base/core/networkStructure/apiNames'
import CrudType from '@/base/core/networkStructure/CrudType'
```

and do not expose a service-level `call(params)` method when the reference uses `applyService(params)`.

## Repository

```ts
import { <ActionName>ApiService } from '<exact feature api service path>'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import FeatureModel from '<exact model path>'

class <ActionName>Repo extends RepoInterface<FeatureModel> {
  private static instance: <ActionName>Repo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new <ActionName>Repo()
    }
    return this.instance
  }

  onParse(data: any): FeatureModel {
    return FeatureModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return <ActionName>ApiService.getInstance()
  }
}

export { <ActionName>Repo }
```

For list endpoints use `RepoInterface<FeatureModel[]>`, typed array parsing, and `hasPagination` when the reference endpoint is paginated.

## UseCase

```ts
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { <ActionName>Repo } from '<exact repo path>'
import type FeatureModel from '<exact model path>'

export default class <ActionName>UseCase
  implements UseCase<FeatureModel, Params>
{
  async call(params: Params): Promise<DataState<FeatureModel>> {
    return <ActionName>Repo.getInstance().call(params)
  }
}
```

For list endpoints, use `FeatureModel[]` consistently in the generic and return type.

## Controller

A controller must keep the same state lifecycle as the closest matching project controller.

For fetch/list-style endpoints, the canonical shape is:

```ts
export default class <ActionName>Controller extends SelectControllerInterface<FeatureModel[]> {
  private static instance: <ActionName>Controller

  private constructor() {
    super()
  }

  private <ActionName>UseCase = new <ActionName>UseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new <ActionName>Controller()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<FeatureModel[]> =
      await this.<ActionName>UseCase.call(params)

    this.setState(dataState)

    if (!this.isDataSuccess()) {
      throw new Error('Error while addServices')
    }

    super.handleResponseDialogs()
    return this.state
  }
}
```

If the reference custom endpoint uses another public method name such as `fetchResult`, `approve`, `reject`, `close`, or `submit`, preserve that named method while keeping the same state lifecycle. Do not reduce the controller to a one-line `call()` pass-through.


# 16. API Service Rules

Every endpoint gets exactly one API service.

Example:

```ts
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class ApprovePermitApiService extends ServicesInterface {
  private static instance: ApprovePermitApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApprovePermitApiService()
    }
    return this.instance
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.ApprovePermit,
      type: CrudType.POST,
      auth: true,
      params,
      showLoadingDialog: true,
    })
  }
}

export { ApprovePermitApiService }
```

## 16.1 Request type

Use the exact request type provided by the user.

If not provided:

1. inspect a similar endpoint;
2. inspect `ApiNames`/existing feature;
3. infer only when unambiguous;
4. otherwise ask.

Possible examples:

```text
CrudType.POST
CrudType.GET
CrudType.FormData
CrudType.PUT
CrudType.DELETE
```

Do not automatically use CRUD-specific mappings from `AI_Crud.md`.

These are custom endpoints.

## 16.2 Headers

Use custom `HeaderHandler` behavior only when required by the endpoint/reference pattern.

Do not add headers just because a CRUD show endpoint used them.

---

# 17. Repository Rules

Every endpoint gets exactly one repository.

Example:

```ts
import RepoInterface, {
  ResponseType,
} from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PermitApprovalModel from '../../Data/models/PermitApprovalModel'
import { ApprovePermitApiService } from '../../Data/apiServices/ApprovePermitApiService'

class ApprovePermitRepo extends RepoInterface<PermitApprovalModel> {
  private static instance: ApprovePermitRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApprovePermitRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PermitApprovalModel {
    return PermitApprovalModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ApprovePermitApiService.getInstance()
  }
}

export { ApprovePermitRepo }
```

## Response with data

When the endpoint returns an object:

```ts
onParse(data: any): FeatureModel {
  return FeatureModel.fromMap(data)
}
```

## Response with array

When the endpoint returns an array:

```ts
onParse(data: any): FeatureModel[] {
  return data.map((item: any) => FeatureModel.fromMap(item))
}
```

and repository generic becomes:

```ts
RepoInterface<FeatureModel[]>
```

## Pagination

Only add:

```ts
override get hasPagination(): boolean {
  return true
}
```

when the endpoint is actually paginated.

Do not add pagination automatically.

---

# 18. UseCase Rules

Every endpoint gets exactly one use case.

Example:

```ts
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PermitApprovalModel from '../../Data/models/PermitApprovalModel'
import { ApprovePermitRepo } from '../repositories/ApprovePermitRepo'

export default class ApprovePermitUseCase
  implements UseCase<PermitApprovalModel, Params>
{
  async call(
    params: Params,
  ): Promise<DataState<PermitApprovalModel>> {
    return ApprovePermitRepo.getInstance().call(params)
  }
}
```

Use cases should remain thin.

Do not put:

- form validation;
- router navigation;
- dialogs;
- UI state;
- component logic;

inside use cases.

---

# 19. Controller Rules

Every endpoint gets exactly one controller.

The controller connects the endpoint pipeline to the single component.

Example:

```ts
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import ApprovePermitUseCase from '../../Domain/useCase/ApprovePermitUseCase'
import type PermitApprovalModel from '../../Data/models/PermitApprovalModel'
import type ApprovePermitParams from '../../Core/params/ApprovePermitParams'

export default class ApprovePermitController
  extends ControllerInterface<PermitApprovalModel>
{
  private static instance: ApprovePermitController

  private constructor() {
    super()
  }

  private approvePermitUseCase = new ApprovePermitUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApprovePermitController()
    }
    return this.instance
  }

  async approvePermit(params: ApprovePermitParams) {
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<PermitApprovalModel> =
        await this.approvePermitUseCase.call(params)

      this.setLoading()
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message ?? 'Success',
          imageElement: successImage,
          messageContent: null,
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent:
            this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent:
          this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
```

This is a pattern, not a requirement to show a success dialog for every fetch endpoint.

---



# 20.1 Component fidelity rule

The generated custom-endpoint component must be copied from the closest matching real project component when one exists.

Do not create a minimal component merely because it can call the endpoint.

Preserve all applicable reference elements such as:

```text
controller state refs
watch(controller.state.value)
DataStatus
loader / initial / empty / failed / notPermitted slots
FormLoader/TableLoader/custom skeleton
PermissionBuilder
ActionsList/DropList
Pagination
project grid/form classes
router handling
existing success/refetch flow
```

If the user supplies an exact component example, reproduce its structure and only substitute feature/action-specific names and fields.

Do not introduce a new `isSubmitting`, direct response parsing, raw table, or direct `router.push()` architecture unless the supplied/closest reference already uses it.


# 20. Controller Behavior by Endpoint Type

## Fetch/read endpoint

Normally:

- `setLoading()`;
- call use case;
- set state;
- no success popup;
- handle errors.

## Mutation/action endpoint

Examples:

```text
approve
reject
close
start
assign
submit
cancel
generate
send
```

Normally:

- validate params;
- call use case;
- update state;
- show success/error dialog;
- optionally emit/refetch/navigate based on user requirements.

## Delete-like custom endpoint

Use existing project dialogs/flow.

Do not assume it is a CRUD delete operation.

---

# 21. One Component Rule

No matter whether there is 1, 2, or 3 endpoints, default to **one Vue component**.

Example with three endpoints:

```vue
<script lang="ts" setup>
import ApprovePermitController from '../controllers/ApprovePermitController'
import RejectPermitController from '../controllers/RejectPermitController'
import CancelPermitController from '../controllers/CancelPermitController'

const approveController = ApprovePermitController.getInstance()
const rejectController = RejectPermitController.getInstance()
const cancelController = CancelPermitController.getInstance()
</script>
```

The component can call all three controllers.

Do not create:

```text
ApprovePermit.vue
RejectPermit.vue
CancelPermit.vue
```

unless the user explicitly asks for separate components.

---

# 22. Component Responsibilities

The single component may include:

- inputs;
- selects;
- enum controls;
- buttons;
- dialogs;
- loading state;
- `DataStatus`;
- endpoint action handlers;
- required-field validation;
- controller state watching;
- result display.

Use project components whenever possible.

Examples:

```text
PrimeVue Dialog
DatePicker
InputText
Textarea
Select
DataStatus
FormLoader
TableLoader
OpenWarningDilaog
```

Do not create duplicate shared components.

---

# 23. Multiple Endpoint Coordination

When multiple endpoints exist, keep their logic separate.

Example:

```ts
const submitApprove = async () => {
  const params = new ApprovePermitParams(...)
  await approveController.approvePermit(params)
}

const submitReject = async () => {
  const params = new RejectPermitParams(...)
  await rejectController.rejectPermit(params)
}
```

Do not create one giant generic Params object for unrelated endpoints.

Each endpoint owns:

```text
its params
its service
its repo
its use case
its controller
```

The component is the only shared UI layer by default.

---

# 24. Shared Model Behavior With Multiple Endpoints

If multiple endpoints operate on the same entity and return compatible data, use one shared model:

```text
Data/models/<FeatureName>Model.ts
```

Example:

```text
ApprovePermit
RejectPermit
CancelPermit
```

can all use:

```text
PermitApprovalModel
```

if they return the same entity shape.

If endpoint response shapes differ materially, create endpoint-specific models.

Example:

```text
FetchPermitResultModel.ts
GeneratePermitTokenModel.ts
```

Only create multiple models when necessary.

---

# 25. Default Model Generation From Params

If no custom response model is provided:

1. Collect meaningful fields from the supplied params.
2. Convert backend snake_case keys to camelCase TypeScript properties.
3. Add `id` if the response entity clearly has an id or the nearby project model pattern includes it.
4. Flatten translations into `title` and `description`.
5. Create `fromMap()` using backend response keys.
6. Do not add fields the user did not specify unless the repository response clearly contains them.

Example user input:

```text
Params:
project_id number
title translation
description translation
status number
```

Possible default model:

```ts
export default class ExampleModel {
  constructor(
    public projectId: number,
    public title: string,
    public description: string,
    public status: number,
  ) {}

  static fromMap(data: any): ExampleModel {
    return new ExampleModel(
      data.project_id,
      data.title,
      data.description,
      data.status,
    )
  }
}
```

Do not create:

```ts
translations: ...
```

for the default model.

---

# 26. When Params and Response Differ

Params are request data.

Model is response data.

They do not have to be identical.

If the user gives only params and says:

```text
make default model
```

then mirror meaningful param keys using the default rules.

If the user gives a response model separately:

```text
response:
id
title
created_at
created_by
```

then the model must follow the response instead of request params.

The user-provided response shape always wins.

---

# 27. Form/UX Validation

For input components, use the same validation style as the project.

When required fields are present:

```ts
const hasText = (value: unknown) =>
  String(value ?? '').trim().length > 0
```

Use a `requiredFields` computed list when appropriate.

On validation failure:

1. set inline errors;
2. use `OpenWarningDilaog`;
3. scroll to the first invalid field when useful;
4. do not call the controller.

Params validation is still required where the project architecture expects it.

---

# 28. Conditional Fields

If the user provides rules such as:

```text
reason required only when status = REJECTED
```

implement that in both:

1. component validation;
2. Params mapping/validation when practical.

Example:

```ts
if (decision.value === DecisionEnum.REJECT && !reason.value.trim()) {
  new OpenWarningDilaog('Reason Is Required').openDialog()
  return
}
```

Do not send invalid conditional values.

---

# 29. API Names

`ApiNames` integration is mandatory for every custom endpoint generated by this file.

The canonical file is:

```text
src/base/core/networkStructure/apiNames.ts
```

For every requested endpoint, there must be one matching getter in `ApiNames`.

Example user request:

```text
Feature: PermitToWorkResult

Endpoint action:
FetchPermitToWorkResult

ApiName:
FetchPermitToWorkResult

Backend endpoint:
fetch_permit_to_work_result
```

Add:

```ts
// Permit To Work Result

public get FetchPermitToWorkResult() {
  return this.prefix + 'fetch_permit_to_work_result'
}
```

Then the API service must use exactly:

```ts
url: ApiNames.instance.FetchPermitToWorkResult
```

## One endpoint

One endpoint means one matching `ApiNames` getter:

```ts
public get FetchPermitResult() {
  return this.prefix + 'fetch_permit_result'
}
```

## Two endpoints

Two endpoints mean two matching getters:

```ts
// Investigation Meeting

public get StartMeeting() {
  return this.prefix + 'start_investigation_meeting'
}

public get CloseMeeting() {
  return this.prefix + 'close_investigation_meeting'
}
```

## Three endpoints

Three endpoints mean three matching getters.

The number of generated `ApiNames` getters must match the number of custom endpoints unless two operations intentionally use the same existing getter and the user explicitly says so.

## Mandatory rules

1. Search `apiNames.ts` before adding anything.

2. Never add a duplicate getter.

3. If the getter already exists and points to the correct path, reuse it.

4. If the getter exists but points to a different endpoint path, do not silently replace it. Inspect usages and only modify it when the user explicitly requested the change or the repository clearly confirms the change is intended.

5. The getter name used by the API service must match exactly:

```ts
ApiNames.instance.ApprovePermit
```

requires:

```ts
public get ApprovePermit() {
  return this.prefix + 'approve_permit'
}
```

6. Group getters using the feature name:

```ts
// Permit Approval
```

7. Use the exact backend endpoint path supplied by the user:

```ts
return this.prefix + '<backend_endpoint>'
```

8. Do not infer or rename the backend path when the user supplied it.

9. If the user supplies a backend endpoint path but no getter name, use the endpoint/action name as the getter name unless the nearby project convention clearly requires another name.

10. If the user supplies a getter name but no endpoint path, first search `apiNames.ts`. If it does not exist and the path cannot be determined from the repository, ask only for the missing backend endpoint path.

11. Use another prefix only when the user/reference endpoint requires it. The normal project default is:

```ts
this.prefix
```

## Codex

Codex must update:

```text
src/base/core/networkStructure/apiNames.ts
```

during the same task that creates the custom endpoint feature.

Do not leave the endpoint getter as a manual TODO when the user supplied the endpoint path.

## ChatGPT ZIP

When generating a ZIP:

- include the custom endpoint feature;
- include an `ApiNames` patch/integration file containing every required getter;
- if the user supplied the current `apiNames.ts` and asks for it to be edited, include the updated file as well.

Do not invent missing backend endpoint paths.

---

# 30. Optional View Wrapper

A custom endpoint feature does **not** automatically need a page/view.

If the user says it is a page, create:

```text
src/views/Organization/<FeatureName>/<FeatureName>.vue
```

Example:

```vue
<script setup lang="ts">
import PermitApproval from '@/features/Organization/PermitApproval/Presentation/components/PermitApproval.vue'
</script>

<template>
  <PermitApproval />
</template>
```

If it is only a dialog/component used inside another feature, do not create a view.

---

# 31. Optional Route

Do not create a route unless:

- the user asks for one; or
- the feature is explicitly described as a standalone page.

When required, create one route file under the correct route folder using the existing project routing convention.

Do not automatically modify central route indexes unless the user asks.

---

# 32. Optional Permissions

Do not invent permissions.

If the component needs permissions:

1. search `PermissionsEnum`;
2. use existing matching permissions;
3. if no permission exists, do not invent enum members;
4. mention the missing permission integration.

If no permission requirement is provided, do not add `PermissionBuilder` automatically unless the nearest matching feature requires it.

---

# 33. Optional Translations

Use existing `$t(...)` patterns when the component is user-facing.

Do not automatically edit language JSON files unless the user asks.

If you introduce new translation keys, list them in the completion summary.

---

# 34. Import and File Casing

The project runs on Linux.

Therefore:

```text
AddPermitApiService.ts
```

and:

```ts
import { AddPermitApiService } from './addPermitApiService'
```

may break if casing does not match.

All generated imports must match exact filenames.

Before finishing, verify casing.

---

# 35. Do Not Generate Unrequested CRUD Files

For a one-endpoint feature, this is WRONG:

```text
add
edit
delete
index
show
clone
excel
```

unless requested.

Correct:

```text
1 endpoint
=
1 params
1 api service
1 repo
1 use case
1 controller
1 model/shared model
1 component
```

For two endpoints:

```text
2 params
2 api services
2 repos
2 use cases
2 controllers
1 shared/appropriate model
1 component
```

For three endpoints:

```text
3 params
3 api services
3 repos
3 use cases
3 controllers
1 shared/appropriate model
1 component
```

---

# 36. File Count Examples

## One endpoint, no enum, default model

```text
Core/params                       1
Data/apiServices                  1
Data/models                       1
Domain/repositories               1
Domain/useCase                    1
Presentation/controllers          1
Presentation/components           1
-----------------------------------
Total                             7 files
```

## Two endpoints, one shared model, one enum

```text
Core/params                       2
Core/enums                        1
Data/apiServices                  2
Data/models                       1
Domain/repositories               2
Domain/useCase                    2
Presentation/controllers          2
Presentation/components           1
-----------------------------------
Total                            13 files
```

## Three endpoints, one shared model, two enums

```text
Core/params                       3
Core/enums                        2
Data/apiServices                  3
Data/models                       1
Domain/repositories               3
Domain/useCase                    3
Presentation/controllers          3
Presentation/components           1
-----------------------------------
Total                            19 files
```

Additional models/views/routes are added only when actually required.

---

# 37. Example: One Endpoint

User:

```text
Feature: PermitToWorkResult

Endpoint:
FetchPermitToWorkResult

ApiName:
FetchPermitToWorkResult

Params:
permit_to_work_id number

Model:
id number
result string
status number
```

Generate:

```text
PermitToWorkResult/
├── Core/
│   └── params/
│       └── FetchPermitToWorkResultParams.ts
├── Data/
│   ├── apiServices/
│   │   └── FetchPermitToWorkResultApiService.ts
│   └── models/
│       └── PermitToWorkResultModel.ts
├── Domain/
│   ├── repositories/
│   │   └── FetchPermitToWorkResultRepo.ts
│   └── useCase/
│       └── FetchPermitToWorkResultUseCase.ts
└── Presentation/
    ├── controllers/
    │   └── FetchPermitToWorkResultController.ts
    └── components/
        └── PermitToWorkResult.vue
```

---

# 38. Example: Two Endpoints

User:

```text
Feature: InvestigationMeeting

Endpoint 1:
StartMeeting
params:
investigation_id
start_date

Endpoint 2:
CloseMeeting
params:
investigation_id
notes

Model default
```

Generate:

```text
InvestigationMeeting/
├── Core/params/
│   ├── StartMeetingParams.ts
│   └── CloseMeetingParams.ts
├── Data/apiServices/
│   ├── StartMeetingApiService.ts
│   └── CloseMeetingApiService.ts
├── Data/models/
│   └── InvestigationMeetingModel.ts
├── Domain/repositories/
│   ├── StartMeetingRepo.ts
│   └── CloseMeetingRepo.ts
├── Domain/useCase/
│   ├── StartMeetingUseCase.ts
│   └── CloseMeetingUseCase.ts
├── Presentation/controllers/
│   ├── StartMeetingController.ts
│   └── CloseMeetingController.ts
└── Presentation/components/
    └── InvestigationMeeting.vue
```

---

# 39. Example: Three Endpoints With Enum

User:

```text
Feature: PermitDecision

Endpoints:
ApprovePermit
RejectPermit
CancelPermit

Params:
ApprovePermit:
  permit_id
  comment

RejectPermit:
  permit_id
  reason

CancelPermit:
  permit_id

Enum:
PermitDecisionEnum
APPROVE=1
REJECT=2
CANCEL=3

Default model.
```

Generate:

```text
PermitDecision/
├── Core/
│   ├── params/
│   │   ├── ApprovePermitParams.ts
│   │   ├── RejectPermitParams.ts
│   │   └── CancelPermitParams.ts
│   └── enums/
│       └── PermitDecisionEnum.ts
├── Data/
│   ├── apiServices/
│   │   ├── ApprovePermitApiService.ts
│   │   ├── RejectPermitApiService.ts
│   │   └── CancelPermitApiService.ts
│   └── models/
│       └── PermitDecisionModel.ts
├── Domain/
│   ├── repositories/
│   │   ├── ApprovePermitRepo.ts
│   │   ├── RejectPermitRepo.ts
│   │   └── CancelPermitRepo.ts
│   └── useCase/
│       ├── ApprovePermitUseCase.ts
│       ├── RejectPermitUseCase.ts
│       └── CancelPermitUseCase.ts
└── Presentation/
    ├── controllers/
    │   ├── ApprovePermitController.ts
    │   ├── RejectPermitController.ts
    │   └── CancelPermitController.ts
    └── components/
        └── PermitDecision.vue
```

---

# 40. Response Type Decision

Choose repository response behavior based on the endpoint.

## No useful response data

Use:

```ts
ResponseType.withoutData
```

## Object response

Parse:

```ts
FeatureModel.fromMap(data)
```

## Array response

Parse:

```ts
data.map((item: any) => FeatureModel.fromMap(item))
```

## Paginated array

Also:

```ts
override get hasPagination(): boolean {
  return true
}
```

Do not assume pagination.

---

# 41. Loading Behavior

Use the project's controller state and loading architecture.

Do not add a separate ad-hoc loading library.

For fetch:

```ts
this.setLoading()
const dataState = await useCase.call(params)
this.setState(dataState)
```

For mutations, follow the closest reference controller.

Do not create conflicting loading state unless the component specifically needs local button loading.

---

# 42. Dialog Behavior

Use:

```text
DialogSelector
OpenWarningDilaog
```

according to project patterns.

Do not replace project dialogs with:

```ts
alert(...)
confirm(...)
```

unless existing surrounding code explicitly uses them and the user requests consistency with that specific feature.

---

# 43. Component Result Handling

For a data-returning endpoint, expose controller state to the component.

Example:

```ts
const controller = FetchPermitResultController.getInstance()
const state = ref(controller.state.value)

watch(
  () => controller.state.value,
  (newState) => {
    state.value = newState
  },
  { deep: true },
)
```

Use `DataStatus` when the UI is rendering asynchronous endpoint data.

Do not force `DataStatus` for a simple mutation-only button if it adds no value.

---

# 44. Endpoint Dependency

Sometimes endpoint 2 depends on endpoint 1.

Example:

```text
GenerateCode -> VerifyCode
```

The component may use data returned from endpoint 1 when calling endpoint 2.

Keep the layers separate.

Example:

```ts
const generatedCodeId = computed(
  () => generateController.state.value.data?.id,
)
```

Then:

```ts
new VerifyCodeParams(generatedCodeId.value, code.value)
```

Do not merge the two endpoint architectures.

---

# 45. Model Naming With Different Results

If one endpoint returns a special result, use action-specific model naming.

Example:

```text
Feature: PermitResult

FetchPermitResult -> PermitResultModel
GeneratePermitPdf -> GeneratePermitPdfModel
```

Use the smallest number of models that accurately represents the API.

---

# 46. Special Files

Only generate extra files if they are needed.

Possible examples:

```text
Core/enums/*
Presentation/supcomponents/*
Data/models/*DetailsModel.ts
views/*
router/*
```

These are optional in custom endpoint mode.

Never generate them just to imitate a CRUD tree.

---

# 47. Copy Safety

When cloning an existing custom feature:

1. Replace source feature name.
2. Replace endpoint action names.
3. Replace Params names.
4. Replace backend keys.
5. Replace `ApiNames`.
6. Replace models.
7. Replace controller methods.
8. Replace UI labels.
9. Replace enums.
10. Replace route/view names if used.

Search generated code for the source feature before finishing.

Example:

```bash
grep -Rni "OldFeature\|old_feature\|old-feature" \
  src/features/Organization/NewFeature
```

Any unrelated leftover is a bug.

---

# 48. No Over-Refactoring

Do not:

- change the base repository interface;
- change the base service interface;
- replace singleton patterns;
- refactor unrelated features;
- introduce a new API client;
- introduce a new form library;
- introduce a new state manager;
- move project files;
- rename shared utilities;
- modify unrelated routes.

Generate the feature using the existing architecture.

---

# 49. TypeScript Rules

Generated TypeScript must:

- use exact import casing;
- use project `@/` aliases;
- implement `Params`;
- use correct model generics;
- avoid missing imports;
- avoid unused imports where possible;
- map snake_case backend keys correctly;
- use `number`, `string`, `boolean`, arrays, and enums correctly;
- not use `TranslationsParams` as the default response model;
- flatten translated title/description into separate model fields.

---

# 50. Vue Rules

Generated Vue must:

- use `<script lang="ts" setup>`;
- use Composition API;
- use the generated controllers;
- create Params objects inside endpoint handlers;
- validate before calling endpoints;
- use existing project UI components;
- expose only the UI required for this feature;
- contain all custom endpoint actions in one component by default.

---

# 51. Build Verification

In Codex mode:

1. inspect `package.json`;
2. run the project's type-check command;
3. fix generated errors;
4. verify exact import casing;
5. verify all supplied endpoints are represented;
6. verify no extra endpoint pipelines were generated;
7. verify params map to exact backend keys;
8. verify model follows custom response or default model rules;
9. verify every request Params using `TranslationsParams` sends the complete `translation.toMap()` result under `translations`;
10. verify no Params manually rebuilds translation subsets such as only `titles` or `descriptions` unless explicitly required;
11. verify translations were flattened to title/description in the default response model;
12. verify component calls every generated controller that should be reachable from UI.

---

# 52. Completion Checklist

Before finishing a one-endpoint feature:

- [ ] 1 Params file.
- [ ] 1 API Service.
- [ ] 1 Repository.
- [ ] 1 UseCase.
- [ ] 1 Controller.
- [ ] 1 Model, unless a truly no-model existing pattern is explicitly required.
- [ ] 1 Vue component.
- [ ] API service uses canonical `applyService()` and exact project imports.
- [ ] Repository uses the exact project RepoInterface path, generic typing, typed serviceInstance, private constructor and correct export style.
- [ ] UseCase implements `UseCase` with typed `DataState`.
- [ ] Controller preserves state lifecycle and endpoint-specific public method name; no one-line `call()` shortcut when reference handles state.
- [ ] Component is copied from the closest reference structure instead of simplified.
- [ ] Enum file(s) only when required.
- [ ] Exact endpoint name.
- [ ] One matching `ApiNames` getter per endpoint.
- [ ] API service getter names match `ApiNames` exactly.
- [ ] `ApiNames` uses the exact user-provided backend endpoint path.
- [ ] Exact backend keys.
- [ ] Correct request method.
- [ ] Correct response parsing.
- [ ] Every endpoint Params using `TranslationsParams` preserves the complete `translation.toMap()` result.
- [ ] No endpoint Params manually reduces translations to only `titles`, `descriptions`, or another subset unless explicitly required.
- [ ] No unrelated CRUD files.
- [ ] No copied old names.

Before finishing a two-endpoint feature:

- [ ] 2 Params.
- [ ] 2 API Services.
- [ ] 2 Repositories.
- [ ] 2 UseCases.
- [ ] 2 Controllers.
- [ ] 1 component.
- [ ] Shared or endpoint-specific model(s) as required.
- [ ] Enum file(s) only when required.

Before finishing a three-endpoint feature:

- [ ] 3 Params.
- [ ] 3 API Services.
- [ ] 3 Repositories.
- [ ] 3 UseCases.
- [ ] 3 Controllers.
- [ ] 1 component.
- [ ] Shared or endpoint-specific model(s) as required.
- [ ] Enum file(s) only when required.

---

# 53. Expected User Request Style

The user can now ask:

```text
Read custom_endpoints_handel.md

Feature name:
PermitToWorkResult

Endpoint:
FetchPermitToWorkResult

ApiName:
FetchPermitToWorkResult

Params:
permit_to_work_id number required

Default model:
permit_to_work_id
title translation
description translation
status number
```

Or:

```text
Read custom_endpoints_handel.md

Feature:
MeetingResult

I need 2 endpoints:

1. StartMeeting
params:
meeting_id number
date string

2. EndMeeting
params:
meeting_id number
result string

ApiNames:
StartMeeting
EndMeeting

No custom model, make model from params.
```

Or:

```text
Read custom_endpoints_handel.md

Feature:
ActionPlanApproval

3 endpoints:
ApproveActionPlan
RejectActionPlan
ReturnActionPlan

I will give you all params and ApiNames.

Enum:
ActionPlanDecisionEnum
APPROVE = 1
REJECT = 2
RETURN = 3

Custom model:
...
```

The architecture does not need to be repeated by the user.

---

# 54. Final Mandatory Behavior

When this file is used:

1. Read the requested feature name.
2. Count requested endpoints.
3. Create exactly that many Params files.
4. Create exactly that many API Services.
5. Create exactly that many Repositories.
6. Create exactly that many UseCases.
7. Create exactly that many Controllers.
8. Create the needed model(s).
9. If no custom model is provided, derive model fields from meaningful params.
10. For request Params using `TranslationsParams`, always send the complete `this.translation.toMap()` result under `translations`; never manually select only `titles`, `descriptions`, or another subset unless the user explicitly requires that payload.
11. For response models, never use `translations` as the default model property; create `title` and `description` as separate model properties.
12. Create enum files only when required.
13. Connect all endpoints to one main Vue component.
14. Do not generate CRUD operations that were not requested.
15. Do not invent backend keys or enum values.
16. Preserve the project's architecture and singleton patterns.
17. Add/update one matching getter in `src/base/core/networkStructure/apiNames.ts` for every custom endpoint using the exact user-provided backend path.
18. Verify every API service references an existing `ApiNames.instance.<Getter>` with exact name matching.
19. In Codex mode, create the files directly, update `apiNames.ts`, and type-check.
20. In ChatGPT mode, generate the feature and include the required `ApiNames` integration in the ZIP when requested.

---

# Mandatory Global Form Field Overrides

> These rules are mandatory and override any earlier generic form/input guidance in this file when there is a conflict.
>
> They apply to every generated feature form, whether the feature is a full CRUD or a custom endpoint feature.

## 1. Date and time fields: always use PrimeVue `DatePicker`

Every field that represents a date, time, or date-time must use PrimeVue `DatePicker`.

Import:

```ts
import DatePicker from 'primevue/datepicker'
```

Never generate native controls such as:

```html
<input type="date" />
<input type="time" />
<input type="datetime-local" />
```

### Date-only fields

Examples:

```text
date
start_date
end_date
due_date
meeting_date
inspection_date
```

Use:

```vue
<DatePicker
  v-model="startDate"
  dateFormat="yy-mm-dd"
  showIcon
  fluid
/>
```

### Time-only fields

Examples:

```text
time
start_time
end_time
meeting_time
```

Use:

```vue
<DatePicker
  v-model="startTime"
  timeOnly
  hourFormat="24"
  fluid
/>
```

### Date-time fields

Use:

```vue
<DatePicker
  v-model="scheduledAt"
  showTime
  hourFormat="24"
  dateFormat="yy-mm-dd"
  showIcon
  fluid
/>
```

### Date/time request serialization

PrimeVue may keep the form value as `Date | null`, but Params must send the exact backend format.

Rules:

1. First inspect the closest existing project feature for the same field type.
2. If the user provides a date/time format, use it exactly.
3. Do not automatically call `toISOString()` unless the backend/reference feature uses ISO UTC.
4. Do not invent timezone conversion.
5. A date-only backend field must not accidentally receive an unwanted time part.
6. A time-only backend field must not accidentally receive an unwanted date part.
7. Keep formatting in one clear helper when several date/time fields use the same format.

---

## 2. General attachments/files: always use `HandleFIlesUpload`

Any normal attachment/document/file field must use the existing project component:

```text
HandleFIlesUpload
```

Do not generate a raw `<input type="file">` for normal attachment fields when this shared component exists.

In Codex/repository mode, search the repository for the exact import path and exact filename casing. Do not guess the import path.

Use the project pattern:

```vue
<div :key="formKey" class="management-change-upload-field">
  <HandleFIlesUpload
    :label="$t('risk assessment file')"
    accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
    :max-files="1"
    :multiple="false"
    class-name="input-file management-change-file-input"
    @change="handleFilesChange"
  />
</div>
```

The shared uploader emits uploaded-file objects that contain Base64 data.

Use a compatible type such as:

```ts
interface UploadedFile {
  id: string
  name: string
  type: string
  size: string
  url: string
  base64: string
  file?: File
}
```

Handle the emitted values like:

```ts
const attachments = ref<string[]>([])

const handleFilesChange = (files: UploadedFile[]) => {
  attachments.value = files
    .map((file) => file.base64)
    .filter((value): value is string => Boolean(value))

  updateData()
}
```

### Mandatory Base64 rule for attachment keys

If the user declares an uploaded attachment/file key as:

```text
attachments: string[]
attachment: string[]
files: string[]
documents: string[]
```

or another attachment key typed as `string[]`, the request must send the Base64 strings produced by `HandleFIlesUpload`.

Example Params value:

```ts
public attachments: string[]
```

Example request map:

```ts
return {
  attachments: this.attachments,
}
```

The array must contain values such as:

```text
data:application/pdf;base64,...
data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,...
```

Do not send:

```text
File objects
blob:http://... preview URLs
filenames only
local object URLs
```

unless the user explicitly states that the backend requires one of those formats.

### Single attachment string

If the backend field is explicitly:

```text
attachment: string
```

send the first Base64 value:

```ts
attachment: attachments.value[0] ?? ''
```

Do not turn a single-string backend key into an array.

---

## 3. Image fields: always use `MultiImagesInput`

Any form field representing uploaded images must use the existing project component:

```text
MultiImagesInput
```

Do not generate a raw file input for images when this shared component exists.

In Codex/repository mode, search for the exact import path and exact filename casing.

Use the project pattern:

```vue
<div class="management-change-upload-field input-wrapper">
  <label>{{ $t('images') }}</label>

  <MultiImagesInput
    accept="image/*"
    :initial-images="images.map((image) => image.file)"
    @update:images="setImages"
  />
</div>
```

The component emits selected `File[]` values for new uploads.

### Mandatory Base64 rule for image keys

If the user declares an uploaded image key as:

```text
images: string[]
image: string[]
photos: string[]
attachments_images: string[]
```

or another image field typed as `string[]`, convert the selected images to Base64 before creating Params.

Use a helper:

```ts
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
```

Example state and setter:

```ts
const imageValues = ref<string[]>([])

const setImages = async (files: File[]) => {
  imageValues.value = await Promise.all(files.map(fileToBase64))
  updateData()
}
```

Then Params sends:

```ts
return {
  images: this.images,
}
```

where `this.images` is already `string[]` containing Base64 data.

Do not send:

```text
raw File objects
blob preview URLs
object URLs
```

for a backend key declared as `string[]`.

### Single image string

If the backend key is explicitly:

```text
image: string
```

send one Base64 string, normally the first selected image.

### Edit/preloaded image behavior

For edit forms:

1. Use the component's initial-image support to display existing server images.
2. Do not download existing remote URLs and convert them to Base64 unless the backend explicitly requires that.
3. Convert newly selected `File` objects to Base64 according to the request contract.
4. Preserve existing server values according to the feature's existing update API behavior.

---

## 4. `title` / `description`: translation only when the user says translation

The field name alone does not decide whether it is translated.

### Translated fields

If the user says:

```text
title: translation
```

or:

```text
title translation
```

then use `TranslationsParams` for title.

If the user says:

```text
description: translation
```

then use `TranslationsParams` for description.

If both are translated, build both through the same `TranslationsParams` object.

The request must keep the complete translation map:

```ts
const translations = this.translation.toMap() as Record<string, unknown>

return {
  translations: translations,
}
```

Do not reduce it to only `translations.titles` or `translations.descriptions`.

### Plain string fields

If the user says:

```text
title: string
```

then it is a normal string field:

```ts
public title: string
```

and Params sends:

```ts
title: this.title
```

Do not use `TranslationsParams`.

If the user says:

```text
description: string
```

then it is a normal string field:

```ts
public description: string
```

and Params sends:

```ts
description: this.description
```

Do not use `TranslationsParams`.

### Mixed example

If the user says:

```text
title: translation
description: string
```

then only title is translated. `description` remains a normal request key.

The generated Params may look conceptually like:

```ts
const translations = this.translation.toMap() as Record<string, unknown>

return {
  translations: translations,
  description: this.description,
}
```

### Critical interpretation rule

```text
`title` does NOT automatically mean translation.
`description` does NOT automatically mean translation.
Only the explicit field type/contract decides.
```

---

## 5. Any user-selectable key ending in `_id` uses `UpdatedCustomInputSelect`

For relation fields whose backend key ends with:

```text
_id
```

and whose value must be selected by the user, use the existing project component:

```text
UpdatedCustomInputSelect
```

Examples:

```text
organization_id
employee_id
equipment_id
project_id
stage_id
subject_id
location_id
```

### The user should provide the controller and Params

For each selectable `_id`, the user may provide information such as:

```text
employee_id
controller: IndexOrganizatoinEmployeeController
params: IndexOrganizatoinEmployeeParams('', 0, 0, 0)
```

Use those exact classes.

Example setup:

```ts
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import type TitleInterface from '@/base/Data/Models/title_interface'

const selectedEmployee = ref<TitleInterface | null>(null)

const indexOrganizatoinEmployeeController =
  IndexOrganizatoinEmployeeController.getInstance()

const indexOrganizatoinEmployeeParams =
  new IndexOrganizatoinEmployeeParams('', 0, 0, 0)
```

Use the shared component:

```vue
<UpdatedCustomInputSelect
  :model-value="selectedEmployee"
  :controller="indexOrganizatoinEmployeeController"
  :params="indexOrganizatoinEmployeeParams"
  label="employee"
  id="employee"
  :placeholder="$t('Select employee')"
  optional
  @update:model-value="setEmployee"
/>
```

Setter:

```ts
const setEmployee = (value: TitleInterface | null) => {
  selectedEmployee.value = value
  updateData()
}
```

When constructing Params, send the selected object's id:

```ts
selectedEmployee.value?.id
```

The Params `toMap()` must use the backend key:

```ts
employee_id: this.employeeId
```

### Required `_id`

If the user marks the relation as required:

1. Do not use the `optional` prop.
2. Include it in component required-field validation.
3. Do not call the endpoint until a selection exists.
4. Send only the selected object's `id`, not the whole object.

### Optional `_id`

If it is optional:

1. Use the `optional` UI behavior when appropriate.
2. Preserve the backend's expected null/undefined/omitted behavior.
3. Still send only the selected id when a value exists.

### If controller/Params are not provided

In Codex/repository mode:

1. Search the repository for the matching index/select controller and Params.
2. Prefer an existing controller whose model is suitable for `UpdatedCustomInputSelect`.
3. If one unambiguous controller/Params pair exists, use it.
4. If no matching pair exists or several choices are ambiguous, ask the user for the controller and Params for that `_id`.
5. Do not substitute a numeric/text input just to avoid asking.

In ChatGPT/no-repository mode, if the user did not provide enough information to identify the controller + Params, ask only for that missing pair.

### Route/context `_id` exception

An `_id` field does not need a select when it is not user-selectable and is explicitly supplied by route/context.

Example:

```ts
const projectId = Number(route.params.project_id)
```

In that case use the route/context id directly.

---

## 6. `_ids` / multiple relation fields

Do not automatically apply the singular `_id` rule to an `_ids` array without checking the user's contract.

If the user says a relation is multiple and provides a controller + Params, use `UpdatedCustomInputSelect` in multiselect mode according to the existing component API, then map selected objects to ids.

Conceptual example:

```ts
selectedEmployees.value.map((item) => item.id)
```

Only do this when the field is explicitly a multiple relation such as:

```text
employee_ids: number[]
```

---

## 7. Form-field generation decision table

Use this table before creating form controls:

| User field contract | Required UI / handling |
|---|---|
| `start_date: string` described as date | PrimeVue `DatePicker` |
| `start_time: string` described as time | PrimeVue `DatePicker` with `timeOnly` |
| date-time field | PrimeVue `DatePicker` with `showTime` |
| `attachments: string[]` uploaded files | `HandleFIlesUpload` -> Base64 `string[]` |
| `attachment: string` uploaded file | `HandleFIlesUpload` -> first Base64 string |
| `images: string[]` | `MultiImagesInput` -> Base64 `string[]` |
| `image: string` | `MultiImagesInput` -> first Base64 string |
| `title: translation` | `TranslationsParams` |
| `description: translation` | `TranslationsParams` |
| `title: string` | normal string input, no translations |
| `description: string` | normal string/textarea, no translations |
| selectable `employee_id` | `UpdatedCustomInputSelect` + supplied/found controller/Params |
| route/context `project_id` | use route/context id directly; no select |

---

## 8. Mandatory verification for these rules

Before finishing generated code, verify all of the following:

- [ ] No generated form uses native `type="date"`, `type="time"`, or `type="datetime-local"` for project date/time fields.
- [ ] All date/time/date-time controls use PrimeVue `DatePicker`.
- [ ] General file/attachment inputs use `HandleFIlesUpload`.
- [ ] Image inputs use `MultiImagesInput`.
- [ ] Uploaded image/file keys declared as `string[]` send Base64 strings.
- [ ] Uploaded image/file keys declared as `string` send one Base64 string.
- [ ] No Base64 request key accidentally receives a `File` object or blob preview URL.
- [ ] `title: string` remains a plain string field.
- [ ] `description: string` remains a plain string field.
- [ ] Only fields explicitly marked as translation use `TranslationsParams`.
- [ ] Every selectable `_id` uses `UpdatedCustomInputSelect` with its correct controller + Params.
- [ ] Select Params use the exact classes/constructor arguments supplied by the user or verified in the repository.
- [ ] Only selected `.id` values are sent to `_id` backend keys.
- [ ] Route/context ids are not incorrectly rendered as selectable fields.


## Custom-endpoint-specific application of the global field overrides

For custom endpoint features, apply the rules above independently to each endpoint Params class, while keeping the default one-component UI architecture.

If endpoint 1 uses an attachment and endpoint 2 uses images, the single component can use both shared upload components, but each endpoint must receive only its own request values.

If different endpoints use different `_id` selectors, create one controller/Params pair per selector source as supplied by the user/repository.

Do not merge unrelated endpoint field state into one generic payload.

