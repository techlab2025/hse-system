# Mangement Of Change

## Enums

```ts
export enum changeType {
  temp=1,
  permenent=2
}

export enum changeApproval {
  approve=1,
  reject=2
}
```

---

# Step 1

`POST - /create_mangement_change`

## Request

```ts

```

## Response

```ts
{
  "risk_assisment_file":string,
  "image"?: string,
  "changer_request_id": number,
  "facilty":string,
  "area":string,
  "date":string,
  "change_type" :changeType,
  "management_change_topic_type_id":number,
  "status":changeApproval,
  "approval_by":number,
  "management_change_topic_employee_id"?:number,
  "management_change_topic_equipment_id"?:number,
  "management_change_topic_text"?:string,
}
```

---

# Step 2

