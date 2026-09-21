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
9. Run the project type-check/lint command that already exists in `package.json`.
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
│   │   └── show<CrudName>Params.ts
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
        └── <CrudName>SystemDataHeader.vue
```

If the reference feature uses a slightly different filename casing, follow the current repository convention consistently.

Do not delete a standard layer merely because it looks repetitive.

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

## 6.7 Excel params

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

6. Use the project's current format:

```ts
return this.prefix + '<backend_endpoint>'
```

unless the user explicitly says the endpoint must use `baseUrl`, `dashboardPrefix`, `organizationPrefix`, or another prefix.

7. Do not derive a backend URL string from the getter name when the user has supplied an explicit path. The user's endpoint path is the source of truth.

8. If the user gives only the backend path but not the getter name, derive the getter name from the operation and feature using the project convention:

```text
create -> Create<CrudName>
index/fetch list -> Index<CrudName>
details/show -> Show<CrudName>
update -> Edit<CrudName>
delete -> Delete<CrudName>
clone -> Clone<CrudPlural>
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

### Permissions

Search `PermissionsEnum` for existing permissions matching the requested feature.

Do not invent permission enum members.

If feature-specific permissions exist, use them in:

- full feature access,
- create actions,
- edit action,
- delete action.

Keep `ADMIN` and/or `ORGANIZATION_EMPLOYEE` according to the reference feature.

If no feature-specific permissions exist, use only existing generic permissions and mention the missing permission integration in the completion summary.

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

- [ ] 7 Core params files.
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
- [ ] Excel upload Vue component.
- [ ] Actions buttons Vue component when reference CRUD uses it.
- [ ] System clone dialog component.
- [ ] System data header component.
- [ ] 4 view wrapper files.
- [ ] 1 shared route file.
- [ ] Correct endpoint references.
- [ ] All required getters exist in `src/base/core/networkStructure/apiNames.ts`.
- [ ] Every API service getter name matches `ApiNames` exactly.
- [ ] Every `ApiNames` getter uses the user-provided backend endpoint path.
- [ ] Correct backend keys.
- [ ] Correct permissions using existing enum members.
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
3. Read the user's CRUD name, fields, params keys, endpoints, enum rules, and special requirements.
4. Build the complete feature.
5. Do not reuse example names.
6. Do not skip layers.
7. Do not invent backend values.
8. For every request using `TranslationsParams`, wrap the complete `this.translation.toMap()` result under `translations`; never manually extract only `titles`, `descriptions`, or other translation subkeys unless explicitly requested.
9. Verify the result.
10. Add/update all required endpoint getters in `src/base/core/networkStructure/apiNames.ts`.
11. Verify every `ApiNames.instance.<Getter>` used by the generated API services exists and points to the user-provided backend endpoint.
12. In Codex mode, write the files into the project.
13. In ChatGPT mode, return the generated CRUD as a ZIP.
