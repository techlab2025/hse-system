# Organization Documents

## Models

```ts
interface OrganizationDocumentFields {
  document_title: string
  document_ref: string
  document_version: string
  issue_date: string // YYYY-MM-DD
  nex_review_date: string // YYYY-MM-DD; keep this exact API key
  document_file: string // Base64 data URL when uploading
  notes: string // May be an empty string
  document_category_id: number
}

interface OrganizationDocument extends OrganizationDocumentFields {
  id: number
  document_category?: {
    id: number
    title?: string
    name?: string
  }
  created_at?: string
}
```


# Step 1 — List Documents

`POST - /fetch_organization_documents`

## Request

```ts
{
  word?: string,
  paginate: number, // 1 enables pagination; 0 disables it
  page: number, // Default: 1
  limit: number, // Default: 10
  date?: string,
  parent_id?: number, // Supported by params; not sent by the current list page
}
```

## Response


```ts
{
  status: boolean,
  message: string,
  data: {
    data: OrganizationDocument[],
    meta: {
      from: number | null,
      to: number | null,
      per_page: number,
      current_page: number,
      last_page: number,
      total: number,
    },
  },
}
```

# Step 2 — Create Document

`POST - /create_organization_document`

## Request

```ts
OrganizationDocumentFields
```

Example:

```json
{
  "document_title": "Safety Policy",
  "document_ref": "DOC-001",
  "document_version": "1.0",
  "issue_date": "2026-10-06",
  "nex_review_date": "2027-10-06",
  "document_file": "data:application/pdf;base64,SGVsbG8=",
  "notes": "Review annually",
  "document_category_id": 1
}
```

## Response

```ts
{
  status: boolean,
  message: string,
}
```

# Step 3 — Document Details

`POST FormData - /fetch_organization_document_details`

## Request

```ts
{
  document_id: number,
}
```

## Response

```ts
{
  status: boolean,
  message: string,
  data: OrganizationDocument,
}
```

# Step 4 — Update Document

`POST - /update_organization_document`

## Request

```ts
{
  document_id: number,
  document_title: string,
  document_ref: string,
  document_version: string,
  issue_date: string,
  nex_review_date: string,
  document_file?: string, // Replacement file as a base64 data URL
  notes: string,
  document_category_id: number,
}
```

## Response

```ts
{
  status: boolean,
  message: string,
}
```


# Step 5 — Delete Document

`POST FormData - /delete_organization_document`

## Request

```ts
{
  document_id: number,
}
```

## Response

```ts
{
  status: boolean,
  message: string,
}
```

The list reloads after a successful deletion.

---

# Step 6 — Import Documents from Excel

`POST - /create_organization_document`

## Request

```ts
{
  data: OrganizationDocumentFields[],
}
```

## Response

```ts
{
  status: boolean,
  message: string,
}
```

Download the template from the document list and use these column names:

```ts
;[
  'document_title',
  'document_ref',
  'document_version',
  'issue_date',
  'nex_review_date',
  'document_category_id',
  'document_file',
  'notes',
]
```

# Step 7 — Document Category Select

`POST - /fetch_document_categories`

## Request

The documents form uses `IndexDocumentCategoryController` and `IndexDocumentCategoryParams` with:

```ts
{
  paginate: 0,
  page: 1,
  limit: 100,
}
```

## Response

```ts
{
  status: boolean,
  message: string,
  data: {
    id: number,
    title: string,
  }[],
}
```


```ts
;[
  '/:role/document-categories',
  '/:role/document-category/add',
  '/:role/document-category/:id',
  '/:role/document-category/upload-excel',
]
// role: admin | organization
```

---

## Permissions

| Permission                       | Code    |
| -------------------------------- | ------- |
| `ORGANIZATION_DOCUMENTS_ALL`     | `ODO00` |
| `ORGANIZATION_DOCUMENTS_FETCH`   | `ODO01` |
| `ORGANIZATION_DOCUMENTS_DETAILS` | `ODO02` |
| `ORGANIZATION_DOCUMENTS_CREATE`  | `ODO03` |
| `ORGANIZATION_DOCUMENTS_UPDATE`  | `ODO04` |
| `ORGANIZATION_DOCUMENTS_DELETE`  | `ODO05` |

