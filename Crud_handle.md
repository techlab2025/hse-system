# AI CRUD Generator Rules

> File purpose: this file is the permanent source of truth for AI/Codex when generating a new CRUD feature in this Vue 3 + TypeScript project.
>
> The user will normally provide only:
> 1. CRUD/feature name.
> 2. Required request/parameter keys.
> 3. API endpoint names (and endpoint URLs if they are not already present in `ApiNames`).
> 4. Optional enum definitions or special field rules.
>
> The AI must generate the complete CRUD feature using the architecture and conventions below.

---

## 1. Main Role

You are a CRUD feature generator for this project.

When the user asks to create a CRUD feature, your job is to copy the **existing project architecture and behavior**, not invent a new architecture.

The primary reference CRUD is:

```text
src/features/Organization/DrillType
```

Use that feature as the structural source of truth when it exists in the repository.

Other existing CRUDs may be inspected only when needed to understand a field type, enum, special control, validation, or permission pattern.

### Critical naming rule

`DrillType`, `MeetingType`, and every other feature shown in examples are **examples only**.

Never keep an example feature name in generated code unless the requested CRUD actually has that name.

Every class name, filename, component name, import path, route name, variable name, API name, dialog text, Excel filename, translation key, model name, controller name, repository name, use case name, and system clone name must be generated from the CRUD name supplied by the user.



# 1.1 STRICT REFERENCE-FIDELITY MODE — MANDATORY

This is the most important rule in this file.

When a reference feature/file is supplied by the user or exists in the repository, **do not re-implement an equivalent architecture**. Copy the reference structure and code shape as closely as possible and change only what the new feature requires.

The goal is not merely “same behavior”. The goal is:

```text
same imports style
same base classes
same generic types
same singleton constructor pattern
same method names
same DataState handling
same exports
same component structure
same DataStatus usage
same loaders
same ActionsList/DropList structure
same permissions pattern
same routing pattern
same save/save-and-new behavior
same table/state handling
```

Only these things should normally change:

```text
feature name
class/file names
model type
params fields
backend keys
API getter/endpoints
permissions for the new feature
translation keys
route paths
field-specific UI controls
model-specific table columns
```

## Forbidden “equivalent rewrites”

Do **not** replace the project pattern with a shorter or cleaner alternative.

Examples of forbidden rewrites:

```ts
async call(params: Params) {
  return this.useCase.call(params)
}
```

when the reference controller uses:

```ts
async getData(params: Params) {
  this.setLoading()
  const dataState = await this.IndexFeatureUseCase.call(params)
  this.setState(dataState)
  ...
  super.handleResponseDialogs()
  return this.state
}
```

Do not replace state-driven components with local arrays such as:

```ts
const items = ref<Model[]>([])
```

when the reference component uses:

```ts
const state = ref(indexController.state.value)
```

Do not replace project components such as:

```text
DataStatus
TableLoader
DataEmpty
DataFailed
PermissionBuilder
DropList
ActionsList
Pagination
```

with raw HTML or custom local logic.

Do not replace the reference `Add`/`Edit` component with a new design using `isSubmitting`, a custom `formRef`, or a generic `save()` function unless that exact pattern exists in the chosen reference feature.

## Copy-first workflow

Before generating each file:

1. Open the corresponding reference file.
2. Copy its structure.
3. Replace only source-feature names with target-feature names.
4. Change Params/model/fields only where required.
5. Preserve project imports and base classes exactly.
6. Preserve method names and state handling used by that file category.
7. Run a diff mentally/programmatically and confirm no unnecessary structural rewrite was introduced.

If the user provides an exact desired code sample, that sample overrides a looser example elsewhere in this document.

---

# 2. AI Execution Modes

## Codex / repository-editing mode

When running inside Codex or another agent that has access to the repository:

1. Inspect the reference CRUD and the target directories before creating files.
2. Generate the complete feature directly inside the repository.
3. Reuse existing project utilities/components.
4. Do not create duplicate utilities.
5. Do not modify unrelated files.
6. Create the shared route file for the new CRUD.
7. **Do not add the route file to `src/router/routes/shared/index.ts` unless the user explicitly asks.**
8. Add every endpoint used by the generated CRUD to `src/base/core/networkStructure/apiNames.ts` when the user provides the endpoint path. Do not leave CRUD API getters for the user to add manually.
9. Add/update `PermissionsEnum`, the scope-specific permission handler(s), and the CRUD sidebar item(s).
10. Run the project type-check/lint command that already exists in `package.json`.
10. Fix errors caused by the generated CRUD before finishing.
11. Return a concise summary of created/modified files and any manual step still required.

## ChatGPT / no-repository-editing mode

When the user asks ChatGPT to create a CRUD but ChatGPT is not directly modifying the repository:

1. Generate the CRUD feature only.
2. Preserve the exact directory structure defined in this file.
3. Include the feature files, the four view wrapper files, and the shared route `.ts` file.
4. Do not rewrite unrelated project files.
5. Package the generated files into a `.zip`.
6. Give the user the ZIP file.
7. Mention any central project file that must be updated manually, such as:
   - `src/router/routes/shared/index.ts` to import/spread the new route file.
   - `PermissionsEnum` only if required permissions do not already exist.

`ApiNames` is part of the generated CRUD output: when the user provides endpoint paths, include the required `ApiNames` getters in the ZIP/instructions as an integration file or patch.

---

# 3. Input Contract

The user may provide input in normal language. Convert it internally into this specification:

```yaml
crud_name: MeetingType
endpoint_scope: admin | organization | shared

location:
  feature_root: src/features/Organization
  views_root: src/views/Organization
  route_root: src/router/routes/shared

fields:
  - name: title
    type: translation
    required: true
  - name: description
    type: translation
    required: true
  - name: periodic_type
    type: enum
    required: true
    enum: MeetingPeriodicTypeEnum
  - name: number_of_days
    type: number
    required_when: periodic_type != DAILY

endpoints:
  create: CreateMeetingType
  clone: CloneMeetingTypes
  delete: DeleteMeetingType
  edit: EditMeetingType
  index: IndexMeetingType
  show: ShowMeetingType

features:
  excel: true
  system_clone: true
  translations: true

route:
  plural_path: meeting-types
  singular_path: meeting-type
```

The user does not need to use YAML. This is only the internal interpretation.

### Minimum required information

Normally the AI needs:

- CRUD name.
- Endpoint scope when known: `admin`, `organization`/`org`, or `shared`.
- Create/edit fields.
- Backend key names when they differ from frontend names.
- API endpoint property names.
- Enum values/rules if there is an enum.

Do not ask unnecessary questions.

If one essential backend detail cannot be derived from the repository or the user's request, ask only for that missing detail.

---

# 4. Naming Rules

Given:

```text
CRUD name: MeetingType
```

derive:

```text
PascalCase: MeetingType
camelCase: meetingType
plural PascalCase: MeetingTypes
plural camelCase: meetingTypes
kebab singular: meeting-type
kebab plural: meeting-types
snake singular: meeting_type
snake plural: meeting_types
```

Examples:

```text
AddMeetingTypeParams
EditMeetingTypeController
MeetingTypeModel
IndexMeetingType.vue
meeting_type.ts
```

Do not mechanically pluralize an irregular English word if the repository/user already provides the plural form. Prefer the user-provided or existing project naming.

---

# 5. Required Feature Tree

For a standard CRUD, create this structure:

```text
src/features/Organization/<CrudName>/
├── Core/
│   ├── params/
│   │   ├── Add<CrudName>ClonesParams.ts
│   │   ├── add<CrudName>ExcelParams.ts
│   │   ├── add<CrudName>Params.ts
│   │   ├── delete<CrudName>Params.ts
│   │   ├── edit<CrudName>Params.ts
│   │   ├── index<CrudName>Params.ts
│   │   ├── show<CrudName>Params.ts
│   │   └── <AdditionalRelationIdParams.ts when a request contains multiple entity IDs>
│   └── enums/
│       └── <enum files only when required>
│
├── Data/
│   ├── apiServices/
│   │   ├── Add<CrudName>ClonesApiService.ts
│   │   ├── add<CrudName>ApiService.ts
│   │   ├── delete<CrudName>ApiService.ts
│   │   ├── edit<CrudName>ApiService.ts
│   │   ├── index<CrudName>ApiService.ts
│   │   └── show<CrudName>ApiService.ts
│   └── models/
│       ├── <CrudName>DetailsModel.ts
│       └── <CrudName>Model.ts
│
├── Domain/
│   ├── repositories/
│   │   ├── Add<CrudName>CloneRepo.ts
│   │   ├── add<CrudName>Repo.ts
│   │   ├── delete<CrudName>Repo.ts
│   │   ├── edit<CrudName>Repo.ts
│   │   ├── index<CrudName>Repo.ts
│   │   └── show<CrudName>Repo.ts
│   └── useCase/
│       ├── add<CrudName>CloneUseCase.ts
│       ├── add<CrudName>UseCase.ts
│       ├── delete<CrudName>UseCase.ts
│       ├── edit<CrudName>UseCase.ts
│       ├── index<CrudName>UseCase.ts
│       └── show<CrudName>UseCase.ts
│
└── Presentation/
    ├── components/
    │   ├── Add<CrudName>.vue
    │   ├── <CrudName>ActionsButtons.vue
    │   ├── <CrudName>Form.vue
    │   ├── Edit<CrudName>.vue
    │   ├── Index<CrudName>.vue
    │   └── Upload<CrudName>ExcelSheet.vue
    ├── controllers/
    │   ├── add<CrudName>CloneController.ts
    │   ├── add<CrudName>Controller.ts
    │   ├── delete<CrudName>Controller.ts
    │   ├── edit<CrudName>Controller.ts
    │   ├── index<CrudName>Controller.ts
    │   ├── indexSystem<CrudName>Controller.ts
    │   └── show<CrudName>Controller.ts
    └── supcomponents/
        ├── System<CrudPlural>.vue
        ├── <CrudName>SystemDataHeader.vue
        └── <CrudName>TableSkeleton.vue
```

If the reference feature uses a slightly different filename casing, follow the current repository convention consistently.

Do not delete a standard layer merely because it looks repetitive.

The standard CRUD has 7 primary Params files, but relation-list fields may require additional nested ID Params helper files. These extra Params files are mandatory when the request contains multiple entity/relation IDs.

---

# 6. Core Layer Rules

## 6.1 Create params

`add<CrudName>Params.ts`:

- Implements `Params`.
- Contains all fields required for create.
- Uses `ClassValidation`.
- Uses `TranslationsParams` for localized title/description fields.
- `toMap()` must use backend keys, not arbitrary frontend names.
- Add `validate()` and `validateOrThrow()`.

For a translation-only CRUD, always preserve the full `TranslationsParams.toMap()` result exactly.

Use this pattern:

```ts
constructor(public translation: TranslationsParams) {}

toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: translations,
  }
}
```

This is the required translation request pattern for CRUD params.

For extra fields, still preserve the entire translation map:

```ts
toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: translations,
    periodic_type: this.periodicType,
    number_of_days: this.numberOfDays,
  }
}
```

Use the exact backend keys supplied by the user or found in the existing API contract.


## 6.1.1 Mandatory translation serialization rule

Whenever any CRUD Params class contains:

```ts
translation: TranslationsParams
```

the `toMap()` implementation must send the **complete** result of:

```ts
this.translation.toMap()
```

Use:

```ts
toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: translations,
  }
}
```

If the Params class has additional request fields:

```ts
toMap(): Record<string, unknown> {
  const translations = this.translation.toMap() as Record<string, unknown>

  return {
    translations: translations,
    status: this.status,
    periodic_type: this.periodicType,
  }
}
```

### Never manually extract translation subkeys

The following pattern is **wrong** unless the user explicitly says the backend accepts only that reduced structure:

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

Also do not manually rebuild:

```ts
translations: {
  titles: translations.titles,
  descriptions: translations.descriptions,
}
```

The Params class must not guess the internal output shape of `TranslationsParams`.

The source of truth is:

```ts
this.translation.toMap()
```

Therefore:

```text
TranslationsParams owns translation serialization.
CRUD Params only wraps the complete serialized object under `translations`.
```

This rule applies to:

- Add Params.
- Edit Params.
- Custom create/update Params inside a CRUD.
- Any other CRUD request using `TranslationsParams`.

If the feature uses only `title`, `TranslationsParams.toMap()` still decides the request structure.

If the feature uses `title` and `description`, `TranslationsParams.toMap()` still decides the request structure.

Do not strip `descriptions`, locales, or any other translation data returned by `TranslationsParams.toMap()`.


## 6.2 Edit params

`edit<CrudName>Params.ts`:

- Includes the item `id`.
- Includes the same editable fields used by create.
- If it contains `TranslationsParams`, it must use the same complete translation serialization rule from section 6.1.1.
- Sends the backend id key, for example:

```ts
data['meeting_type_id'] = this.id
```

Do not assume the ID key. Derive it from the user's backend specification/reference endpoint.

## 6.3 Delete params

`delete<CrudName>Params.ts`:

```ts
constructor(public id: number) {}

toMap(): Record<string, number> {
  return {
    <backend_id_key>: this.id,
  }
}
```

## 6.4 Show params

Same ID behavior as delete.

## 6.5 Index params

The standard index params must preserve the project pattern:

```ts
word
withPage
perPage
pageNumber
isPaginate
isSystemOnly?
```

`toMap()` must support:

```text
word
paginate
page
limit
is_system_only
```

Preserve the existing project's current pagination semantics, even if the variable naming is unusual.

## 6.6 Clone params

`Add<CrudName>ClonesParams.ts`:

```ts
clonesIds: number[]
```

backend:

```ts
clones_ids
```

Use validation requiring at least the field itself. If the project validation utility supports minimum array length, follow the current repository pattern.

## 6.7 Multiple relation helper Params

When any create/edit/custom CRUD request contains multiple selected entity IDs, create one nested helper Params class per relation and serialize the parent collection with:

```ts
data['<outer_collection_key>'] = this.<collectionProperty>.map((el) => el.toMap())
```

Never send a flat `<relation>_ids: number[]` array for entity relations. See the mandatory multiple-relation rule later in this file.

## 6.8 Excel params

`add<CrudName>ExcelParams.ts` contains:

```ts
interface Data {
  // one property per Excel/backend import field
}
```

and:

```ts
public data: Data[]
```

`toMap()` returns:

```ts
{
  data: this.data
}
```

Excel rows use normal backend create keys, not translation objects, unless the backend explicitly requires another format.

---

# 7. Enum Rules

If the feature has an enum:

1. Put it under:

```text
Core/enums/
```

unless the current feature area consistently uses `Core/Enum/`; in that case follow the repository convention.

2. Use numeric values exactly as provided by the user/backend.

Example:

```ts
export enum PeriodicTypeEnum {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  YEARLY = 4,
  DATES = 5,
}
```

3. Use the enum in:
   - params typing,
   - form options,
   - validation,
   - Excel transformation if applicable,
   - model typing when useful.

4. Apply conditional validation exactly as specified.

Example:

```text
DAILY   => number_of_days hidden/not required
WEEKLY  => number_of_days required and < 7
MONTHLY => number_of_days required and < 30
YEARLY  => number_of_days required and < 365
```

Never invent enum values.

---

# 8. Data Layer Rules

## 8.1 API services

Create six services:

```text
add
clone
delete
edit
index
show
```

Every service:

- extends `ServicesInterface`;
- uses the singleton `getInstance()` pattern;
- accepts `Params`;
- calls `super.call(...)`;
- uses `auth: true`.

Use the endpoint property supplied by the user:

```ts
url: ApiNames.instance.Create<CrudName>
```

### Standard HTTP/CrudType pattern

Use the current reference CRUD behavior unless the user/backend specifies otherwise:

```text
create -> CrudType.POST
clone  -> CrudType.POST
delete -> CrudType.FormData
edit   -> CrudType.POST
index  -> CrudType.POST
show   -> CrudType.FormData
```

For show, preserve:

```ts
headers: HeaderHandler.Instance.getHeader(true, false)
```

when the reference feature excludes `Accept-Language`.

Do not invent a new request type if the reference CRUD already establishes the pattern.

## 8.2 API names

`ApiNames` integration is a mandatory part of CRUD generation.

The canonical file is:

```text
src/base/core/networkStructure/apiNames.ts
```

Every generated CRUD endpoint used by an API service must have a getter in `ApiNames`.

Use the getter name used by the service and the exact backend endpoint path supplied by the user.

Example for `DrillType`:

```ts
// Drill Type

public get CreateDrillType() {
  return this.prefix + 'create_drill_type'
}

public get IndexDrillType() {
  return this.prefix + 'fetch_drill_types'
}

public get ShowDrillType() {
  return this.prefix + 'fetch_drill_type_details'
}

public get EditDrillType() {
  return this.prefix + 'update_drill_type'
}

public get DeleteDrillType() {
  return this.prefix + 'delete_drill_type'
}
```

If the CRUD supports system clone, also add the clone endpoint getter using the exact name/path supplied by the user, for example:

```ts
public get CloneDrillTypes() {
  return this.prefix + 'clone_drill_types'
}
```


## Endpoint scope/type: `admin`, `organization`, or `shared`

Every generated CRUD/custom endpoint belongs to one of three API scopes:

```text
admin
organization
shared
```

The user may say, for example:

```text
admin CRUD
organization endpoint
org endpoint
shared CRUD
shared endpoint
```

The selected scope controls **how the getter is named and how its URL is built inside `ApiNames`**.

### 1. Admin endpoint

For an `admin` CRUD/endpoint, use the normal action/feature getter naming convention unless the user explicitly supplies another getter name.

Examples:

```ts
public get IndexSubscriptionApplication() {
  return this.prefix + 'fetch_subscription_applications'
}

public get ApproveSubscriptionApplication() {
  return this.prefix + 'approve_subscription_application'
}

public get RejectSubscriptionApplication() {
  return this.prefix + 'reject_subscription_application'
}
```

Admin rule:

```text
Getter style: PascalCase action/feature name
URL base: this.prefix
```

Example service usage:

```ts
url: ApiNames.instance.IndexSubscriptionApplication
```

Do not change the admin getter to a snake_case getter unless the user explicitly provides that getter name.

### 2. Organization / org endpoint

For an `organization` or `org` CRUD/endpoint, use the organization URL explicitly:

```ts
this.baseUrl + this.organizationPrefix + '<backend_endpoint>'
```

Examples:

```ts
public get DeleteNotificationPlan() {
  return this.baseUrl + this.organizationPrefix + 'delete_notification_plan'
}

public get RefreshNotification() {
  return this.baseUrl + this.organizationPrefix + 'register_notification_socket_user'
}

public get CloneAllData() {
  return this.baseUrl + this.organizationPrefix + 'clone_all_data'
}
```

Organization rule:

```text
Getter style: PascalCase action/feature name unless the user supplies an exact getter name
URL base: this.baseUrl + this.organizationPrefix
```

Example service usage:

```ts
url: ApiNames.instance.DeleteNotificationPlan
```

Do **not** replace the organization URL with `this.prefix` when the user says the endpoint is organization/org scoped.

### 3. Shared endpoint

For a `shared` CRUD/endpoint, preserve the endpoint getter name exactly as supplied by the user. Shared endpoint getters are commonly snake_case and may intentionally match the backend endpoint name.

Example:

```ts
// PPE Tool

public get fetch_ppe_tools() {
  return this.prefix + 'fetch_ppe_tools'
}

public get fetch_ppe_toll_deails() {
  return this.prefix + 'fetch_ppe_toll_deails'
}

public get create_ppe_toll() {
  return this.prefix + 'create_ppe_toll'
}

public get update_ppe_tool() {
  return this.prefix + 'update_ppe_tool'
}

public get delete_ppe_tool() {
  return this.prefix + 'delete_ppe_tool'
}

public get clone_ppe_tool() {
  return this.prefix + 'clone_ppe_tool'
}
```

Shared rule:

```text
Getter style: preserve the exact user-provided endpoint/getter identifier
URL base: this.prefix
```

The API service must use the exact same getter name:

```ts
url: ApiNames.instance.fetch_ppe_tools
```

Do not automatically convert a shared getter like:

```text
fetch_ppe_tools
```

into:

```text
IndexPpeTool
FetchPpeTools
```

unless the user explicitly asks for that naming.

Also do not silently correct spelling in a user-provided shared endpoint identifier. For example, if the backend/getter is supplied as:

```text
fetch_ppe_toll_deails
```

keep it exactly unless the user asks to rename/fix it.

### Scope decision rules

1. If the user explicitly says `admin`, use the admin rule.
2. If the user explicitly says `organization` or `org`, use the organization rule.
3. If the user explicitly says `shared`, use the shared rule.
4. If the scope is not supplied, inspect the closest existing feature/API pattern.
5. If the scope still cannot be determined unambiguously, ask only:

```text
Is this endpoint/CRUD admin, organization, or shared?
```

Do not guess when the scope changes the URL construction or getter naming.

### Backend path is still authoritative

Scope controls the prefix/naming convention, but the backend endpoint path supplied by the user remains the source of truth.

Examples:

```text
admin + fetch_subscription_applications
=> this.prefix + 'fetch_subscription_applications'

organization + delete_notification_plan
=> this.baseUrl + this.organizationPrefix + 'delete_notification_plan'

shared + fetch_ppe_tools
=> this.prefix + 'fetch_ppe_tools'
```

Never derive a different backend path merely from the feature/class name.


### Mandatory rules

1. The API service and `ApiNames` getter name must match exactly.

Example:

```ts
url: ApiNames.instance.CreateMeetingType
```

requires:

```ts
public get CreateMeetingType() {
  return this.prefix + 'create_meeting_type'
}
```

2. Never create duplicate getters. Search `apiNames.ts` first.

3. If the getter already exists with the correct endpoint path, reuse it and do not add another one.

4. If the getter exists but points to a different endpoint, do not silently overwrite it. Inspect usages and only change it when the user explicitly requested that endpoint change or it is clearly part of the requested feature migration.

5. Group the new getters under a feature comment:

```ts
// Meeting Type
```

6. Build the getter URL according to the endpoint scope rules above:

```text
admin       -> this.prefix + '<backend_endpoint>'
organization -> this.baseUrl + this.organizationPrefix + '<backend_endpoint>'
shared      -> this.prefix + '<backend_endpoint>'
```

For shared endpoints, preserve the exact getter identifier supplied by the user, including snake_case. For admin/organization endpoints, use the normal PascalCase action/feature getter style unless an exact getter name is supplied.

7. Do not derive a backend URL string from the getter name when the user has supplied an explicit path. The user's endpoint path is the source of truth.

8. If the user gives only the backend path but not the getter name, derive it according to scope:

```text
admin / organization:
create -> Create<CrudName>
index/fetch list -> Index<CrudName>
details/show -> Show<CrudName>
update -> Edit<CrudName>
delete -> Delete<CrudName>
clone -> Clone<CrudPlural>

shared:
preserve/use the endpoint identifier itself as the getter name, for example fetch_ppe_tools or create_ppe_toll.
```

9. If the user gives the getter name but not the backend endpoint path and it cannot be found in the repository, ask only for the missing backend endpoint path. Do not invent it.

### Codex behavior

Codex must directly update:

```text
src/base/core/networkStructure/apiNames.ts
```

as part of creating the CRUD.

### ChatGPT ZIP behavior

When returning a CRUD ZIP, include an integration patch/file showing the exact `ApiNames` getters that must be added, or include the updated `apiNames.ts` only when the original file was supplied and can be safely patched.

Do not finish a generated CRUD without accounting for all API getters used by its API services.

---

# 9. Models

## 9.1 `<CrudName>Model.ts`

For standard title/description CRUDs:

- extend `TitleInterface`;
- add other list fields;
- implement `fromMap`;
- implement `example`;
- implement `transformData` for Excel preview/import.

Example structure:

```ts
export default class <CrudName>Model extends TitleInterface {
  public description: string

  constructor(id: number, title: string, description: string = '') {
    super({ id, title })
    this.description = description
  }

  static fromMap(data: any): <CrudName>Model {
    return new <CrudName>Model(
      data.id,
      data.title,
      data.description,
    )
  }
}
```

Add fields according to the CRUD specification.

## 9.2 `<CrudName>DetailsModel.ts`

For translated fields:

- use `TranslationsParams.fromMap(...)`;
- expose `titles`;
- expose `descriptions` when description exists;
- add all additional detail fields returned by show endpoint;
- implement `fromMap`.

Do not include `description` if the requested CRUD has no description.

---

# 10. Domain Layer Rules

For each operation create a repository and use case.

## Repository standard

- extends `RepoInterface`.
- singleton pattern.
- `serviceInstance` returns the matching API service.
- `onParse()` returns the correct model.
- index repository returns `<CrudName>Model[]`.
- show repository returns `<CrudName>DetailsModel`.
- add/edit/delete/clone normally use:

```ts
override get responseType(): ResponseType {
  return ResponseType.withoutData
}
```

when the reference endpoint returns no useful payload.

- index repository preserves:

```ts
override get hasPagination(): boolean {
  return true
}
```

## Use case standard

A use case only delegates to its repository:

```ts
export default class Add<CrudName>UseCase
  implements UseCase<<CrudName>Model, Params>
{
  async call(params: Params): Promise<DataState<<CrudName>Model>> {
    return Add<CrudName>Repo.getInstance().call(params)
  }
}
```

Do not move validation or UI navigation into repositories/use cases.

---



# 10.1 Canonical Layer Templates — DO NOT SIMPLIFY

The following signatures are the canonical project pattern for CRUD endpoint pipelines. Do not substitute alternate imports/classes just because they compile.

## API Service canonical template

Use these imports and this class shape:

```ts
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class Index<CrudName>ApiService extends ServicesInterface {
  private static instance: Index<CrudName>ApiService

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Index<CrudName>ApiService()
    }
    return this.instance
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.Index<CrudName>,
      type: CrudType.POST,
      auth: true,
      params: params,
    })
  }
}

export { Index<CrudName>ApiService }
```

Mandatory details:

- `ApiNames` is a **named import**.
- `ServicesInterface` comes from `@/base/Data/ApiService/api_service_interface`.
- `CrudType` comes from `@/base/core/params/call_params_interface`.
- endpoint services implement `async applyService(...)`.
- do not create a public `call()` wrapper in the service.
- singleton constructor is private and calls `super()`.
- export style is the named export used by the reference.

Use the same template for create/show/update/delete/clone, changing only the class name, API getter, request type, headers/loading options required by that operation.

## Repository canonical template for index/list

```ts
import { Index<CrudName>ApiService } from '@/features/Organization/<CrudName>/Data/apiServices/index<CrudName>ApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import <CrudName>Model from '@/features/Organization/<CrudName>/Data/models/<CrudName>Model'

class Index<CrudName>Repo extends RepoInterface<<CrudName>Model[]> {
  private static instance: Index<CrudName>Repo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Index<CrudName>Repo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): <CrudName>Model[] {
    return data.map((item: any) => <CrudName>Model.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return Index<CrudName>ApiService.getInstance()
  }
}

export { Index<CrudName>Repo }
```

Mandatory details:

- use `@/base/Domain/Repositories/repo_interface` exactly;
- keep the generic `RepoInterface<Model[]>`;
- keep private constructor + `super()`;
- keep typed `onParse`;
- keep typed `serviceInstance: ServicesInterface`;
- keep `hasPagination` for paginated index;
- do not use an untyped `extends RepoInterface` shortcut;
- do not default-export the repo when the reference uses a named export.

## UseCase canonical template

```ts
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { Index<CrudName>Repo } from '@/features/Organization/<CrudName>/Domain/repositories/index<CrudName>Repo'
import type <CrudName>Model from '@/features/Organization/<CrudName>/Data/models/<CrudName>Model'

export default class Index<CrudName>UseCase
  implements UseCase<<CrudName>Model[], Params>
{
  async call(params: Params): Promise<DataState<<CrudName>Model[]>> {
    return Index<CrudName>Repo.getInstance().call(params)
  }
}
```

Do not reduce this to an untyped class with an inferred return type.

## Index Controller canonical template

```ts
import <CrudName>Model from '@/features/Organization/<CrudName>/Data/models/<CrudName>Model'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import Index<CrudName>UseCase from '@/features/Organization/<CrudName>/Domain/useCase/index<CrudName>UseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'

export default class Index<CrudName>Controller extends SelectControllerInterface<
  <CrudName>Model[]
> {
  private static instance: Index<CrudName>Controller

  private constructor() {
    super()
  }

  private Index<CrudName>UseCase = new Index<CrudName>UseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new Index<CrudName>Controller()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()

    const dataState: DataState<<CrudName>Model[]> =
      await this.Index<CrudName>UseCase.call(params)

    this.setState(dataState)

    if (this.isDataSuccess()) {
      // success state is already stored
    } else {
      throw new Error('Error while addServices')
    }

    super.handleResponseDialogs()
    return this.state
  }
}
```

Mandatory details:

- method name for the CRUD index controller is `getData`, not generic `call`;
- call `this.setLoading()`;
- create a typed `DataState<Model[]>`;
- call `this.setState(dataState)`;
- preserve `isDataSuccess()` handling;
- call `super.handleResponseDialogs()`;
- return `this.state`;
- keep private constructor + `super()`.

Other CRUD controllers (`add`, `edit`, `delete`, `show`, `clone`) must be copied from the matching reference controller, including dialog behavior, state handling, router arguments and method names. Do not collapse them into generic `call()` methods.


# 11. Presentation Controllers

Create:

```text
add
clone
delete
edit
index
indexSystem
show
```

Follow the singleton patterns used by the reference CRUD.

## Add controller

Must:

1. Accept normal create params and Excel params.
2. Validate normal params.
3. Validate Excel rows before request.
4. Call add use case.
5. Update controller state.
6. Show success/error dialogs using `DialogSelector`.
7. Support normal Save and Save & New behavior from the component.
8. Navigate back to the correct CRUD index after success unless the supplied router intentionally stays on the page.

Use dynamic admin/organization root:

```ts
const root = router.currentRoute.value.path.startsWith('/admin')
  ? '/admin'
  : '/organization'
```

## Edit controller

- calls edit use case;
- shows success/error dialog;
- returns to the CRUD index route.

## Delete controller

- calls delete use case;
- index component refetches after successful deletion.

## Index controller

Must extend:

```ts
SelectControllerInterface<<CrudName>Model[]>
```

It must use the canonical `getData(params)` implementation in section 10.1. Do not expose only a generic `call(params)` method.

## System index controller

Use the same index use case with `is_system_only = true` supplied by `Index<CrudName>Params`.

## Clone controller

After successful cloning:

1. show success dialog;
2. refresh the normal CRUD index using the normal index controller;
3. allow the dialog component to clear selection and close.

## Show controller

Returns `<CrudName>DetailsModel`.

---

# 12. Main Vue Components


## 12.0 Component fidelity rule — copy the reference component, do not redesign it

CRUD Vue components must be produced by copying the corresponding reference component and replacing only feature-specific names/fields.

### Add component canonical structure

Use the same structure as the project reference:

```ts
import { createStayOnPageRouter } from '@/shared/utils/createStayOnPageRouter'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import <CrudName>Form from '@/features/Organization/<CrudName>/Presentation/components/<CrudName>Form.vue'
import Add<CrudName>Controller from '@/features/Organization/<CrudName>/Presentation/controllers/add<CrudName>Controller.ts'
import Add<CrudName>Params from '@/features/Organization/<CrudName>/Core/params/add<CrudName>Params.ts'
import type Params from '@/base/core/params/params'

const router = useRouter()
const stayOnPageRouter = createStayOnPageRouter(router)
const route = useRoute()
const params = ref<Params | null>(null)
const formKey = ref(0)
const emit = defineEmits(['update:data'])
const add<CrudName>Controller = Add<CrudName>Controller.getInstance()
```

The submit functions must follow the reference pattern:

```ts
const add<CrudName> = async () => {
  add<CrudName>Controller.setLoading()
  await add<CrudName>Controller.add<CrudName>(
    params.value as Add<CrudName>Params,
    router,
  )
  if (add<CrudName>Controller.isDataSuccess()) emit('update:data')
}

const saveAndNew = async () => {
  add<CrudName>Controller.setLoading()
  await add<CrudName>Controller.add<CrudName>(
    params.value as Add<CrudName>Params,
    stayOnPageRouter,
    true,
  )
  if (add<CrudName>Controller.isDataSuccess()) {
    params.value = null
    formKey.value++
  }
}
```

Use the reference form/template structure:

```vue
<form class="grid grid-cols-1 md:grid-cols-4 gap-4" @submit.prevent="add<CrudName>">
  <<CrudName>Form :key="formKey" @update:data="setParams" />

  <div class="col-span-4 button-wrapper create-form-actions">
    <button type="button" @click.prevent="saveAndNew" class="btn btn-secondary">
      {{ $t('save and new') }}
    </button>
    <button type="submit" class="btn btn-primary">
      {{ route.path.includes('project-progress') ? $t('save and next step') : $t('save') }}
    </button>
  </div>
</form>
```

Do **not** replace this with a new `formRef + validateRequiredFields + isSubmitting + save(stay)` architecture unless the chosen reference feature itself uses that pattern.

### Edit component canonical structure

The edit component must retain:

```text
useRoute/useRouter
show controller instance
state = ref(showController.state.value)
show params created from route id
fetch on mounted
watch controller.state.value
DataStatus
success slot with form
FormLoader in loader slot
shared form receiving :data="state.data!"
```

Do not replace `DataStatus` with manual booleans or local loading state.

### Index component canonical structure

The index component must be copied from the closest CRUD reference rather than recreated from scratch.

For lookup-style CRUDs, preserve the project structure containing:

```text
ref state from indexController.state.value
fetch function using IndexParams
indexController.getData(...)
onMounted fetch
debounced search
page + perPage handlers
watch on controller.state.value
delete controller then refetch
useUserStore + OrganizationTypeEnum
actionList() with per-action permissions
ActionsList for header actions
PermissionBuilder around feature/table access
DataStatus
main-table markup
DropList per row
Pagination using state.pagination
loader slot
initial slot
empty slot
failed slot
notPermitted handling
Excel export/template/upload dialog
system clone component for organization/shared CRUDs when enabled
```

The reference index component uses controller state directly. Do not manually transform the repository response again inside the component.

### Absolutely forbidden simplified index pattern

Do not generate patterns like:

```ts
const items = ref<Model[]>([])
const response: any = await IndexController.getInstance().call(...)
items.value = Array.isArray(response) ? response.map(Model.fromMap) : []
```

That bypasses the project controller/DataState architecture.

Do not output a bare HTML `<table v-if="items.length">` with ad-hoc buttons when the reference uses `DataStatus`, `DropList`, `ActionsList`, `PermissionBuilder`, `Pagination`, `DataEmpty`, `DataFailed`, and loaders.


## 12.1 `Add<CrudName>.vue`

Use the standard pattern:

- `useRouter()`;
- `createStayOnPageRouter(router)`;
- `params` ref;
- form component ref;
- `validateRequiredFields()`;
- normal `save`;
- `saveAndNew`;
- emit `update:data` when appropriate.

The form itself emits the params object.

## 12.2 `Edit<CrudName>.vue`

Must:

1. read `route.params.id`;
2. call show controller on mount;
3. display `DataStatus`;
4. pass show data into `<CrudName>Form`;
5. validate form;
6. submit edit controller.

## 12.3 `<CrudName>Form.vue`

This is the single shared form for create and edit.

Responsibilities:

- Fetch available languages.
- Prefer `user.user.languages` if available.
- Fall back to `IndexLangController`.
- Use `LangTitleInput` for localized text.
- Build `TranslationsParams`.
- Emit `Add<CrudName>Params` when creating.
- Emit `Edit<CrudName>Params` when editing.
- Support all extra fields required by the feature.
- Expose:

```ts
defineExpose({ validateRequiredFields })
```

### Translation fields

For title:

```ts
translations.setTranslation('title', locale, value)
```

For description:

```ts
translations.setTranslation('description', locale, value)
```

Only generate fields that the CRUD actually uses.

### Validation

Use:

- project `ClassValidation` in params for request-level validation;
- component-level `requiredFields` + `OpenWarningDilaog` for immediate UX validation;
- conditional validation for enum-dependent inputs.

When a required field fails:

1. set inline error;
2. open warning dialog;
3. scroll to the first invalid field.

## 12.4 `Index<CrudName>.vue`

Must include the standard CRUD list behavior:

- search;
- debounce;
- pagination;
- page-size change;
- index controller;
- delete action;
- edit action;
- `DataStatus`;
- `TableLoader`;
- `DataEmpty`;
- `DataFailed`;
- `PermissionBuilder`;
- `DropList`;
- `ActionsList`;
- Excel export;
- Excel template download;
- Excel upload dialog;
- system data clone entry for non-admin users.

Table columns must match the model fields provided by the user.

Do not keep `title`/`description` columns when the new CRUD does not have them.

### Base path

Support both admin and organization:

```ts
const basePath = computed(() =>
  user?.type === OrganizationTypeEnum.ADMIN
    ? '/admin'
    : '/organization',
)
```

### Permissions are mandatory for every CRUD

Every generated CRUD must integrate its permissions into the project. This is not optional.

The canonical enum import used by the project is:

```ts
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
```

Before generating permissions, read the existing permission enum and search for the feature. Reuse existing entries when they already exist. Add only missing entries.

#### Permission scope

Use the CRUD scope supplied by the user:

```text
admin
organization / org
shared
```

The permission sets are:

```text
admin CRUD        -> admin permission set only
organization CRUD -> ORG_ permission set only
shared CRUD       -> BOTH admin and ORG_ permission sets
```

#### Standard CRUD permission names

For feature `MeetingType`, the normal admin set is:

```ts
// Meeting Type (Admin)
MEETING_TYPE_ALL = 'MTI00',
MEETING_TYPE_FETCH = 'MTI01',
MEETING_TYPE_DETAILS = 'MTI02',
MEETING_TYPE_CREATE = 'MTI03',
MEETING_TYPE_UPDATE = 'MTI04',
MEETING_TYPE_DELETE = 'MTI05',
```

Organization:

```ts
// Meeting Type (Organization)
ORG_MEETING_TYPE_ALL = 'OMTI00',
ORG_MEETING_TYPE_FETCH = 'OMTI01',
ORG_MEETING_TYPE_DETAILS = 'OMTI02',
ORG_MEETING_TYPE_CREATE = 'OMTI03',
ORG_MEETING_TYPE_UPDATE = 'OMTI04',
ORG_MEETING_TYPE_DELETE = 'OMTI05',
```

The standard operation suffixes are:

```text
00 = ALL
01 = FETCH
02 = DETAILS
03 = CREATE
04 = UPDATE
05 = DELETE
```

Use all six for a normal generated CRUD unless the user explicitly says the backend/permission model omits one.

#### Permission code prefix

If the user provides a permission code prefix, use it exactly.

If no prefix is supplied:

1. derive a short uppercase mnemonic from the feature name;
2. inspect every existing `PermissionsEnum` value;
3. ensure the new prefix does not collide with an existing feature code;
4. if it collides, extend/change the mnemonic until it is unique;
5. for the organization variant normally prefix the code with `O`.

Examples from the project:

```text
DRILL_TYPE               -> DT00 ... DT05
ORG_DRILL_TYPE           -> ODT00 ... ODT05
PPE_ITEM                  -> PPEI00 ... PPEI05
ORG_PPE_ITEM              -> OPPEI00 ... OPPEI05
MANAGEMENT_CHANGE_TOPIC   -> MCTT00 ... MCTT05
ORG_MANAGEMENT_CHANGE...  -> OMCTT00 ... OMCTT05
```

Never reuse an existing permission code for a different feature.

#### Permission handler integration

The project has separate admin and organization permission trees.

Find the files by their exported objects if paths differ:

```ts
export const adminPermissions: PermissionItem = { ... }
export const OrgPermissions: PermissionItem = { ... }
```

Scope rules:

```text
admin CRUD        -> add the feature group to adminPermissions only
organization CRUD -> add the feature group to OrgPermissions only
shared CRUD       -> add the admin group to adminPermissions AND the ORG_ group to OrgPermissions
```

Admin handler example:

```ts
{
  key: PermissionsEnum.MEETING_TYPE_ALL,
  code: PermissionsEnum.MEETING_TYPE_ALL,
  label: 'Meeting Type',
  permissions: [
    { key: PermissionsEnum.MEETING_TYPE_ALL, code: PermissionsEnum.MEETING_TYPE_ALL, label: 'All' },
    { key: PermissionsEnum.MEETING_TYPE_FETCH, code: PermissionsEnum.MEETING_TYPE_FETCH, label: 'Fetch' },
    { key: PermissionsEnum.MEETING_TYPE_DETAILS, code: PermissionsEnum.MEETING_TYPE_DETAILS, label: 'Details' },
    { key: PermissionsEnum.MEETING_TYPE_CREATE, code: PermissionsEnum.MEETING_TYPE_CREATE, label: 'Create' },
    { key: PermissionsEnum.MEETING_TYPE_UPDATE, code: PermissionsEnum.MEETING_TYPE_UPDATE, label: 'Update' },
    { key: PermissionsEnum.MEETING_TYPE_DELETE, code: PermissionsEnum.MEETING_TYPE_DELETE, label: 'Delete' },
  ],
}
```

Organization handler follows the local convention where fetch is commonly labelled `Table`:

```ts
{
  key: PermissionsEnum.ORG_MEETING_TYPE_ALL,
  code: PermissionsEnum.ORG_MEETING_TYPE_ALL,
  label: 'Meeting Type',
  permissions: [
    { key: PermissionsEnum.ORG_MEETING_TYPE_ALL, code: PermissionsEnum.ORG_MEETING_TYPE_ALL, label: 'All' },
    { key: PermissionsEnum.ORG_MEETING_TYPE_FETCH, code: PermissionsEnum.ORG_MEETING_TYPE_FETCH, label: 'Table' },
    { key: PermissionsEnum.ORG_MEETING_TYPE_DETAILS, code: PermissionsEnum.ORG_MEETING_TYPE_DETAILS, label: 'Details' },
    { key: PermissionsEnum.ORG_MEETING_TYPE_CREATE, code: PermissionsEnum.ORG_MEETING_TYPE_CREATE, label: 'Create' },
    { key: PermissionsEnum.ORG_MEETING_TYPE_UPDATE, code: PermissionsEnum.ORG_MEETING_TYPE_UPDATE, label: 'Update' },
    { key: PermissionsEnum.ORG_MEETING_TYPE_DELETE, code: PermissionsEnum.ORG_MEETING_TYPE_DELETE, label: 'Delete' },
  ],
}
```

Preserve the formatting/parent group used by nearby features in each permission-handler file.

#### Component permission mapping

Every CRUD action must use its matching permission. Do not protect the whole CRUD only with generic `ADMIN` or `ORGANIZATION_EMPLOYEE`.

Admin permission arrays:

```ts
const fetchPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_FETCH,
]

const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_CREATE,
]

const detailsPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_DETAILS,
]

const updatePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_UPDATE,
]

const deletePermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_DELETE,
]
```

Organization permission arrays use:

```ts
PermissionsEnum.ORGANIZATION_EMPLOYEE
PermissionsEnum.ORG_<FEATURE>_ALL
PermissionsEnum.ORG_<FEATURE>_<ACTION>
```

Shared CRUD components may include both sets so the same component works under both route roots:

```ts
const createPermissions = [
  PermissionsEnum.ADMIN,
  PermissionsEnum.ORGANIZATION_EMPLOYEE,
  PermissionsEnum.<FEATURE>_ALL,
  PermissionsEnum.<FEATURE>_CREATE,
  PermissionsEnum.ORG_<FEATURE>_ALL,
  PermissionsEnum.ORG_<FEATURE>_CREATE,
]
```

Apply permissions to all relevant UI actions:

```text
index/table access       -> ALL + FETCH
add button               -> ALL + CREATE
Save/Create form         -> ALL + CREATE
Excel upload             -> ALL + CREATE
system clone             -> ALL + CREATE
edit row action          -> ALL + UPDATE
delete row action        -> ALL + DELETE
details/show link        -> ALL + DETAILS
export/read-only actions -> ALL + FETCH (or DETAILS when the action depends on details)
```

`PermissionBuilder`, `ActionsList.permission`, and `DropList` row action permissions must all use the generated feature permissions consistently.


### CRUD sidebar integration is mandatory

Sidebar integration is performed for CRUD features only. Custom endpoint-only features follow `custom_endpoints_handel.md` and do not get a sidebar item unless explicitly requested.

Search the existing admin and organization sidebar files instead of assuming their paths. They can be identified by route arrays such as:

```text
SettingsRoutes
OrganizationRoutes
LockUpsRoutes
```

#### Shared CRUD

A shared CRUD must be added to `LockUpsRoutes` in **both** sidebars:

```text
admin sidebar        -> /admin/<crud-plural-path>
organization sidebar -> /organization/<crud-plural-path>
```

Admin example:

```ts
{
  link: '/admin/meeting-types',
  name: t('meeting_types'),
  icon: 'medical-square',
  permissions: [
    PermissionsEnum.MEETING_TYPE_ALL,
    PermissionsEnum.MEETING_TYPE_FETCH,
    PermissionsEnum.MEETING_TYPE_DETAILS,
    PermissionsEnum.MEETING_TYPE_CREATE,
    PermissionsEnum.MEETING_TYPE_UPDATE,
    PermissionsEnum.MEETING_TYPE_DELETE,
  ],
}
```

Organization example:

```ts
{
  link: '/organization/meeting-types',
  name: 'meeting-types',
  icon: 'medical-square',
  permissions: [
    PermissionsEnum.ORG_MEETING_TYPE_ALL,
    PermissionsEnum.ORG_MEETING_TYPE_FETCH,
    PermissionsEnum.ORG_MEETING_TYPE_DETAILS,
    PermissionsEnum.ORG_MEETING_TYPE_CREATE,
    PermissionsEnum.ORG_MEETING_TYPE_UPDATE,
    PermissionsEnum.ORG_MEETING_TYPE_DELETE,
  ],
}
```

#### Admin-only CRUD

Add it only to the admin sidebar. For a lookup CRUD, default to the admin `LockUpsRoutes` group unless the user names another group or the nearest project feature clearly belongs elsewhere.

#### Organization-only CRUD

Add it only to the organization sidebar. For a lookup CRUD, default to the organization `LockUpsRoutes` group unless the user names another group or the nearest project feature clearly belongs elsewhere.

#### Sidebar rules

1. Use the route path generated for the CRUD.
2. Use the correct scope-specific permission set.
3. Never put admin permissions on an organization-only sidebar item or ORG permissions on an admin-only item.
4. Shared CRUD gets two sidebar entries, one per sidebar, with the matching permission family.
5. Do not invent a new icon component. If the user does not specify an icon, reuse an existing icon string already used by a nearby lookup item.
6. Do not add a custom-endpoint-only feature to the sidebar unless explicitly requested.

### DataStatus + loading skeleton are mandatory for CRUD data views

Every CRUD index/table must handle the controller state through `DataStatus`.

Create a feature-specific skeleton component:

```text
Presentation/supcomponents/<CrudName>TableSkeleton.vue
```

It may wrap the shared `TableLoader`, but the column count must match the generated table.

Example:

```vue
<script setup lang="ts">
import TableLoader from '@/shared/DataStatues/TableLoader.vue'
</script>

<template>
  <TableLoader :cols="4" :rows="10" />
</template>
```

Use it for both initial and loading states:

```vue
<PermissionBuilder :code="fetchPermissions">
  <DataStatus :controller="state">
    <template #success>
      <!-- real table -->
    </template>

    <template #loader>
      <CrudNameTableSkeleton />
    </template>

    <template #initial>
      <CrudNameTableSkeleton />
    </template>

    <template #empty>
      <DataEmpty ... />
    </template>

    <template #failed>
      <DataFailed ... />
    </template>
  </DataStatus>

  <template #notPermitted>
    <DataFailed add-text="Have not Permission" description="" link="" />
  </template>
</PermissionBuilder>
```

The generated index must explicitly handle:

```text
initial
loading
success
data empty
failed
not permitted
```

Do not render an empty table while loading or after failure.

For edit/details screens that fetch data before rendering the form, keep `DataStatus` around the result. Use the project `FormLoader` or create a feature-specific form skeleton only when the layout needs a custom skeleton.

The add screen does not require `DataStatus` when no initial endpoint is fetched, but it must still be protected by its CREATE permission.


## 12.5 `Upload<CrudName>ExcelSheet.vue`

Use the existing Excel import architecture:

- `xlsx`;
- `FileUpload`;
- `ExcelSheetColumnsHandle`;
- first sheet only unless user asks otherwise;
- preview mapped data;
- delete preview row;
- submit with `Add<CrudName>ExcelParams`;
- emit `uploaded` after success.

Generate:

```ts
const SendData = ref<string[]>([
  // exact import field keys
])
```

Generate human-readable `SendDataLabels`.

`dataAsObjects` must map the uploaded/mapped headers to the exact fields required by the Excel params.

The model's `transformData()` must match the Excel column order used by the feature.

The template example/download and export columns must match these same fields.

Never leave old feature labels, sheet names, filenames, or keys from the copied reference.

## 12.6 `<CrudName>ActionsButtons.vue`

Use this small component when the project/reference CRUD includes it.

It normally contains:

- upload completed template;
- download Excel template;
- `ActionsList`;
- hidden file input;
- upload dialog.

All filenames, labels, permissions, and component imports must be changed to the requested CRUD.

Do not leave copied permission names from another feature such as `ROOT_CAUSES_CREATE`.

---

# 13. System Clone Components

Standard CRUDs in this architecture include system-data cloning unless the user explicitly disables it.

## `System<CrudPlural>.vue`

Must:

1. open a PrimeVue `Dialog`;
2. fetch system-only data when opened;
3. call index with:

```ts
new Index<CrudName>Params(
  query,
  pageNumber,
  perPage,
  withPage,
  false,
  true,
)
```

4. maintain `selectedIds`;
5. allow row/checkbox toggling;
6. submit:

```ts
new Add<CrudName>ClonesParams({
  clonesIds: selectedIds.value,
})
```

7. clear selection and close on success.

## `<CrudName>SystemDataHeader.vue`

Use the standard system-data header UI and translations.

All displayed feature text must use the new CRUD name/translation keys.

---

# 14. Views

Always create four lightweight view wrappers:

```text
src/views/Organization/<CrudName>/
├── Add<CrudName>.vue
├── Edit<CrudName>.vue
├── Index<CrudName>.vue
└── <CrudName>ExcelSheet.vue
```

Each file only imports and renders the matching feature component.

Example:

```vue
<script setup lang="ts">
import Add<CrudName> from '@/features/Organization/<CrudName>/Presentation/components/Add<CrudName>.vue'
</script>

<template>
  <Add<CrudName> />
</template>
```

Do not put business logic in view wrappers.

---

# 15. Route File

Create:

```text
src/router/routes/shared/<crud_snake>.ts
```

Use the project's `RouteRecordRaw`.

Standard routes:

```text
<plural-path>
<plural-path>/add
<singular-path>/:id
<singular-path>/upload-excel
```

Example shape:

```ts
import type { RouteRecordRaw } from '@/router/types'

export const <CrudName>Routes: RouteRecordRaw[] = [
  {
    path: '<plural-path>',
    name: '<Crud Display Name>s',
    component: () =>
      import('@/views/Organization/<CrudName>/Index<CrudName>.vue'),
    meta: {
      breadcrumb: '<Crud Display Name>s',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: '<plural-path>/add',
    name: 'Add <Crud Display Name>',
    component: () =>
      import('@/views/Organization/<CrudName>/Add<CrudName>.vue'),
    meta: {
      breadcrumb: 'Add <Crud Display Name>',
      parent: '<Crud Display Name>s',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: '<singular-path>/:id',
    name: 'Edit <Crud Display Name>',
    component: () =>
      import('@/views/Organization/<CrudName>/Edit<CrudName>.vue'),
    meta: {
      breadcrumb: 'Edit <Crud Display Name>',
      parent: '<Crud Display Name>s',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: '<singular-path>/upload-excel',
    name: 'Upload <Crud Display Name>s',
    component: () =>
      import('@/views/Organization/<CrudName>/<CrudName>ExcelSheet.vue'),
    meta: {
      breadcrumb: 'Upload <Crud Display Name>s',
      parent: '<Crud Display Name>s',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
```

### Important

Create the route file, but do not automatically edit:

```text
src/router/routes/shared/index.ts
```

unless the user explicitly asks.

At completion, tell the user the exact two lines they need to add:

```ts
import { <CrudName>Routes } from './<crud_snake>'
```

and:

```ts
...<CrudName>Routes,
```

---

# 16. Translation Keys

Prefer using translation keys instead of hardcoded labels where the reference CRUD does.

Generate consistent keys based on the requested feature, for example:

```text
add_meeting_type
meeting_type_title
enter_meeting_type_title
meeting_type_description
enter_meeting_type_description
import_meeting_types
no_meeting_types
no_meeting_types_description
add_system_meeting_types
select_system_meeting_types
action_feature_meeting_types
```

Do not modify translation JSON/files unless the user asks or the task explicitly includes translation integration.

If translation keys are used but not created, list them in the completion summary.

---

# 17. Excel Rules

Excel support is part of the standard CRUD unless disabled.

All of these must agree with each other:

1. `Add<CrudName>ExcelParams.Data`
2. `<CrudName>Model.transformData()`
3. `Upload<CrudName>ExcelSheet.vue` `SendData`
4. `SendDataLabels`
5. `dataAsObjects`
6. Index export columns
7. Downloaded example/template columns
8. Add controller Excel validation

Example for:

```text
title
description
periodic_type
number_of_days
```

Every one of the eight places above must use those exact fields.

Do not have one part use `periodicType` while another sends `periodic_type` unless a deliberate frontend-to-backend conversion is implemented.

---

# 18. Validation Rules

Validation must exist at the correct layers.

## Params validation

Use `ClassValidation` for field rules that can be represented there.

## Form validation

Use `validateRequiredFields()` for visual/user-facing required-field validation.

## Excel validation

Before sending Excel data:

- require at least one row;
- validate required keys on every row;
- validate enums;
- validate numeric ranges;
- validate conditional fields;
- show `OpenWarningDilaog` with a useful message;
- stop before calling the API if invalid.

Do not silently send invalid rows.

---

# 19. Copy/Clone Safety Rules

When copying an existing CRUD:

1. Replace all old feature names.
2. Replace all old backend keys.
3. Replace all endpoint names.
4. Replace all route paths.
5. Replace all permissions.
6. Replace all Excel filenames.
7. Replace all Excel sheet names.
8. Replace all dialog translation keys.
9. Replace model example data.
10. Replace action feature names.
11. Replace import paths.
12. Replace system clone labels.
13. Replace empty-state text keys.
14. Replace any leftover comments referencing another CRUD.

Before finishing, search the newly generated folders for the source feature name.

For example, if cloning `DrillType` into `MeetingType`, run a search equivalent to:

```bash
grep -Rni "DrillType\|drill_type\|drill-type\|drill types" \
  src/features/Organization/MeetingType \
  src/views/Organization/MeetingType \
  src/router/routes/shared/meeting_type.ts
```

Any unrelated leftover is a generation bug and must be fixed.

Also search for other copied feature names such as `RootCause`, `PPEItem`, etc.

---

# 20. Do Not Over-Refactor

When creating a CRUD:

- do not refactor base architecture;
- do not rename shared components;
- do not change unrelated controller patterns;
- do not convert the project to a different state-management pattern;
- do not replace project dialogs with browser alerts;
- do not introduce a new form library;
- do not move existing shared files;
- do not rewrite working code outside the CRUD unless integration requires it.

The goal is a feature that looks like it was written by the same project/team.

---

# 21. TypeScript / Vue Rules

Generated code must:

- use `<script lang="ts" setup>` for Vue SFCs;
- use project aliases such as `@/`;
- avoid `any` when a clear type already exists, but do not over-engineer new types where the project currently uses `any`;
- use existing controllers/models/params instead of duplicating types;
- preserve singleton controller/repository/service patterns;
- keep import casing compatible with Linux;
- ensure every import path matches the real filename exactly;
- avoid unused imports;
- avoid impossible enum comparisons;
- avoid emitting `null` params into controller calls;
- keep route ids converted with `Number(id)`.

Linux filename casing is important.

---

# 22. Build Verification

In repository-editing mode:

1. Inspect `package.json`.
2. Run the existing relevant command, preferably:
   - `npm run type-check`, or
   - the project's equivalent `vue-tsc` check.
3. Run lint if the project already has a practical lint script.
4. Fix errors introduced by this CRUD.
5. Do not spend time fixing unrelated pre-existing errors unless they block validation; report them separately.

Also verify:

- all generated files exist;
- imports resolve;
- no copied old feature names remain;
- route view paths exist;
- form emits the exact params class expected by add/edit;
- every `TranslationsParams` request preserves the complete `translation.toMap()` object under `translations`;
- no generated Params manually reconstructs `translations.titles` / `translations.descriptions`;
- Excel keys match the backend params;
- API services use the endpoint names supplied by the user.

---

# 23. Default Completion Checklist

A standard CRUD is not complete until these are present:

- [ ] 7 primary Core params files.
- [ ] Additional nested relation ID Params files for every multiple relation field, when required.
- [ ] Enum file(s) when required.
- [ ] 6 API service files.
- [ ] 2 model files.
- [ ] 6 repository files.
- [ ] 6 use-case files.
- [ ] 7 controller files including system index.
- [ ] Add Vue component.
- [ ] Edit Vue component.
- [ ] Shared Form Vue component.
- [ ] Index/table Vue component.
- [ ] API services use canonical `applyService()` and project import paths; no alternate service architecture.
- [ ] Repositories preserve generic typing, typed `serviceInstance`, private constructor, and named-export pattern.
- [ ] UseCases implement `UseCase<..., Params>` and return typed `DataState`.
- [ ] Index controller uses `getData`, `setLoading`, typed `DataState`, `setState`, `handleResponseDialogs`, and returns `state`.
- [ ] Add/Edit/Index components are copied from the reference structure, not redesigned or simplified.
- [ ] Excel upload Vue component.
- [ ] Actions buttons Vue component when reference CRUD uses it.
- [ ] System clone dialog component.
- [ ] System data header component.
- [ ] 4 view wrapper files.
- [ ] 1 shared route file.
- [ ] Correct endpoint references.
- [ ] Endpoint scope (`admin`, `organization`/`org`, or `shared`) is respected.
- [ ] Admin ApiNames getters use `this.prefix`.
- [ ] Organization ApiNames getters use `this.baseUrl + this.organizationPrefix`.
- [ ] Shared ApiNames getters use `this.prefix` and preserve exact user-provided getter identifiers, including snake_case.
- [ ] All required getters exist in `src/base/core/networkStructure/apiNames.ts`.
- [ ] Every API service getter name matches `ApiNames` exactly.
- [ ] Every `ApiNames` getter uses the user-provided backend endpoint path.
- [ ] Correct backend keys.
- [ ] Correct permissions are present in `PermissionsEnum`; missing feature permissions were added.
- [ ] Admin permission handler updated for admin/shared CRUDs.
- [ ] Organization permission handler updated for organization/shared CRUDs.
- [ ] Shared CRUD has both admin and ORG_ permission families.
- [ ] CRUD sidebar item added to the correct sidebar(s); shared CRUD added to both `LockUpsRoutes`.
- [ ] Add/Edit/Delete/Details/Fetch/Excel/Clone actions use their matching permissions.
- [ ] Feature-specific table skeleton component created and used in `DataStatus` loader + initial slots.
- [ ] Index handles success, loader, initial, empty, failed, and not-permitted states.
- [ ] Correct Excel mappings.
- [ ] Correct validation.
- [ ] Every Params class using `TranslationsParams` sends the complete `translation.toMap()` result.
- [ ] No Params class manually reduces translations to only `titles`, `descriptions`, or another subset unless explicitly required by the backend.
- [ ] No old copied CRUD names.
- [ ] Type-check attempted in Codex mode.

---

# 24. Expected User Request Style

The user may simply say:

```text
Make CRUD: MeetingType

Fields:
title translation required
description translation required
periodic_type enum:
DAILY=1
WEEKLY=2
MONTHLY=3
YEARLY=4
DATES=5
number_of_days number, not required for DAILY,
weekly < 7, monthly < 30, yearly < 365

Endpoints:
CreateMeetingType
CloneMeetingTypes
DeleteMeetingType
EditMeetingType
IndexMeetingType
ShowMeetingType
```

That is enough to start if the endpoint constants already exist.

Do not require the user to repeat the architecture in this file.

---

# 25. Final Behavior

Once this file exists in the repository, whenever the user asks for a new CRUD:

1. Read this file first.
2. Inspect `DrillType` or the closest current reference CRUD.
3. Read the user's CRUD name, endpoint scope (`admin`, `organization`/`org`, or `shared`), fields, params keys, endpoints, enum rules, and special requirements.
4. Resolve the ApiNames getter naming/prefix from that scope before generating API services.
5. Build the complete feature.
5. Do not reuse example names.
6. Do not skip layers.
7. Do not invent backend values.
8. For every request using `TranslationsParams`, wrap the complete `this.translation.toMap()` result under `translations`; never manually extract only `titles`, `descriptions`, or other translation subkeys unless explicitly requested.
9. Verify the result.
10. Add/update all required endpoint getters in `src/base/core/networkStructure/apiNames.ts`.
11. Verify every `ApiNames.instance.<Getter>` used by the generated API services exists and points to the user-provided backend endpoint.
12. In Codex mode, write the files into the project.
13. In ChatGPT mode, return the generated CRUD as a ZIP.

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

## 6. Multiple relation IDs must use nested Params objects

A multiple relation must **not** be sent as a flat array of numbers.

This project convention is mandatory for relation/entity IDs.

### Wrong

Do not generate:

```ts
employee_ids: [1, 2, 3]
```

Do not generate:

```ts
organization_ids: [1, 2]
```

Do not generate:

```ts
hierarchy_ids: [4, 5]
```

Do not generate:

```ts
data['employee_ids'] = this.employeeIds
```

### Required backend shape

A collection of relation IDs must be sent as an array of objects.

Example for employees:

```ts
employees: [
  {
    employee_id: 1,
  },
  {
    employee_id: 2,
  },
  {
    employee_id: 3,
  },
]
```

Example for hierarchies:

```ts
hierarchies: [
  {
    hierarchy_id: 4,
  },
  {
    hierarchy_id: 5,
  },
]
```

Example for organizations:

```ts
organizations: [
  {
    organization_id: 1,
  },
  {
    organization_id: 2,
  },
]
```

### Create one dedicated nested Params class

For every multiple relation field, create an additional Params file whose only responsibility is serializing one relation id.

Example:

```ts
import type Params from '@/base/core/params/params'

export default class CreateProjectMeetingHierarchyIdParams implements Params {
  hirarchy_id: number

  constructor(data: { hirarchy_id: number }) {
    this.hirarchy_id = data.hirarchy_id
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['hierarchy_id'] = this.hirarchy_id

    return data
  }
}
```

Keep the user's/project's exact spelling for constructor properties and backend keys. Do not silently rename a backend key.

### Parent Params class

The main endpoint/CRUD Params must store an array of the nested Params class:

```ts
public hierarchies: CreateProjectMeetingHierarchyIdParams[]
```

and serialize it with:

```ts
data['hierarchies'] = this.hierarchies.map((el) => el.toMap())
```

Example constructor:

```ts
constructor(
  public hierarchies: CreateProjectMeetingHierarchyIdParams[],
) {}
```

Example complete mapping concept:

```ts
toMap(): Record<string, unknown> {
  const data: Record<string, unknown> = {}

  data['hierarchies'] = this.hierarchies.map((el) => el.toMap())

  return data
}
```

### Component mapping

Use `UpdatedCustomInputSelect` in multiselect mode for a user-selectable relation list.

The component state contains selected objects, not raw ids:

```ts
const selectedHieararchy = ref<TitleInterface[]>([])
```

When constructing the main Params:

```ts
hierarchies: Array.isArray(selectedHieararchy.value)
  ? selectedHieararchy.value.map(
      (el) =>
        new CreateProjectMeetingHierarchyIdParams({
          hirarchy_id: el.id!,
        }),
    )
  : [],
```

For employees, use the same structure:

```ts
employees: Array.isArray(selectedEmployees.value)
  ? selectedEmployees.value.map(
      (el) =>
        new CreateMeetingEmployeeIdParams({
          employee_id: el.id!,
        }),
    )
  : [],
```

Then the main Params sends:

```ts
data['employees'] = this.employees.map((el) => el.toMap())
```

which produces:

```ts
employees: [
  { employee_id: 1 },
  { employee_id: 2 },
]
```

### Nested Params naming

Create a descriptive nested Params class based on:

```text
<Action><Feature><Relation>IdParams
```

Examples:

```text
CreateProjectMeetingHierarchyIdParams
CreateMeetingEmployeeIdParams
UpdateMeetingEmployeeIdParams
CreateInspectionOrganizationIdParams
```

If the same nested relation Params is safely reusable by create/update in the existing project style, reuse it. Otherwise keep action-specific naming.

### Outer collection key

The outer request key is normally the plural relation name:

```text
employee_id     -> employees
organization_id -> organizations
hierarchy_id    -> hierarchies
equipment_id    -> equipments
```

But the backend contract supplied by the user is always the source of truth.

If the user explicitly gives:

```text
employees
hierarchies
participants
assigned_employees
```

use that exact outer key.

If only a singular relation key is supplied and the correct outer collection key cannot be derived unambiguously, ask for the outer key rather than inventing one.

### Multiselect UI

Use:

```vue
<UpdatedCustomInputSelect
  :model-value="selectedEmployees"
  :controller="indexOrganizatoinEmployeeController"
  :params="indexOrganizatoinEmployeeParams"
  type="multiselect"
  label="employees"
  id="employees"
  :placeholder="$t('Select employees')"
  @update:model-value="setEmployees"
/>
```

The project's component also supports numeric multi-select type values. Prefer the convention used by the nearest existing feature.

Setter example:

```ts
const setEmployees = (value: TitleInterface | TitleInterface[] | null) => {
  selectedEmployees.value = Array.isArray(value) ? value : []
  updateData()
}
```

### Validation

If the relation list is required:

- require at least one selected item;
- show the normal project warning/error;
- do not call the API with an empty array.

If it is optional:

- an empty selection maps to:

```ts
employees: []
```

unless the backend contract requires omitting the key.

### Important scope rule

This nested Params rule applies to **relation/entity ID arrays**.

Examples:

```text
employees
organizations
hierarchies
equipments
projects
locations
teams
users
```

It does **not** apply to upload/image/file data.

Do not wrap these in nested id Params:

```text
images: string[]
attachments: string[]
files: string[]
documents: string[]
photos: string[]
```

Those continue to follow the Base64 upload rules.

It also does not apply to ordinary primitive arrays that are not entity IDs unless the backend explicitly requires object wrapping.

### Critical project rule

```text
single relation:
employee_id: number

multiple relation:
employees: [
  { employee_id: number },
  { employee_id: number },
]
```

Never default to:

```text
employee_ids: number[]
```

for a relation collection in generated code.


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
| multiple employee relation | `UpdatedCustomInputSelect` multiselect -> nested `EmployeeIdParams[]` -> `employees: [{ employee_id }]` |
| multiple hierarchy relation | multiselect -> nested `HierarchyIdParams[]` -> `hierarchies: [{ hierarchy_id }]` |
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


## CRUD-specific application of the global field overrides

For a full CRUD, apply the rules above consistently in all relevant files:

1. `add<CrudName>Params.ts`
2. `edit<CrudName>Params.ts`
3. `<CrudName>Form.vue`
4. `<CrudName>DetailsModel.ts` where existing upload URLs/details are represented
5. `<CrudName>Model.ts` where list values are represented
6. Excel params/import only if the user explicitly says those fields are part of Excel import

The Add and Edit forms must share the same field/component decisions.

Do not use `LangTitleInput` for `title: string` or `description: string`; use normal project text/textarea controls.

Do use the normal translation form architecture only when the field is explicitly declared as translation.

