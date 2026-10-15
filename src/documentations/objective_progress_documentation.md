# Objective Progress Documentation

# Step 1 — Fetch Progress Index

`POST - /fetch_objective_progress`

## Params

`IndexObjectiveProgressParams`

## Request

```ts
{
  "objective_id": number
}
```

## Response

```ts
[
  {
    "id": number,
    "objective_id": number,
    "period": string,
    "actual_result": number | null,
    "notes": string | null,
    "attachments": ProgressAttachment[],
    "recorded_by": string | null,
    "recorded_at": string | null,
    "created_at": string | null,
    "updated_at": string | null,
    "corrections": ProgressCorrection[],
    "indicator": number | null
  }
]
```

Alternative accepted data shape:

```ts
{
  "records": ObjectiveProgressModel[]
}
```

---

# Step 2 — Fetch Progress Details

`POST FormData - /fetch_objective_progress_details`

## Params

`ObjectiveProgressDetailsParams`

## Request

```ts
{
  "objective_id": number,
  "objective_progress_id": number
}
```

## Response

```ts
{
  "id": number,
  "objective_id": number,
  "period": string,
  "actual_result": number | null,
  "notes": string | null,
  "attachments": ProgressAttachment[],
  "recorded_by": string | null,
  "recorded_at": string | null,
  "created_at": string | null,
  "updated_at": string | null,
  "corrections": ProgressCorrection[],
  "indicator": number | null
}
```

---

# Step 3 — Create Progress

`POST - /create_objective_progress`

## Request

```ts
{
  "objective_id": number,
  "period": string,
  "actual_result": number,
  "notes"?: string,
  "attachments"?: string[]
}
```
