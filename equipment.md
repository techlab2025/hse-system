# Equipment

## Add Equipment

```json
    {
        "title": "string",
        "type": "EquipmentType",
        "equipment_type": 0,
        "image": "base64_encoded_string",
        "certification": "base64_encoded_string",
        "license_number": "string",
        "license_plate_number": "string",
        "date_of_decommissioning": "2025-11-16",
        "status": EquipmentStatus,
        "inspection_type": [
          {
            "type": EquipmentInspectionType,
            "duration": number,
          },
        ],
        "inspection_template": number[],
    }
```

## Edit Equipment


```json
     {
        "equipment_id": id,
        "title": "string",
        "type": "EquipmentType",
        "equipment_type": 0,
        "image": "base64_encoded_string",
        "certification": "base64_encoded_string",
        "license_number": "string",
        "license_plate_number": "string",
        "date_of_decommissioning": "2025-11-16",
        "status": EquipmentStatus,
        "inspection_type": [
          {
            "type": EquipmentInspectionType,
            "duration": number,
          },
        ],
        "inspection_template": number[],
    }
```

## Delete Equipment

```
    {
        "equipemnt_id": number,
    }
```
## Show Equipment

```
    {
        "equipemnt_id": number,
    }
```
