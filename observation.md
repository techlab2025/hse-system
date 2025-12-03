# Observation


## Add Observation 

```json
    {
        "title": string,
        "date": "12-10-2025",
        "equipment_id": number,
        "images": base64_encoded_string[],
        "result": ObservationResult,
        "observation_level": ObservationLevel,
                "solve_status": SolveStatus,
        "with_nearmiss":boolean,
        "hazard_type":number,
        
        "with_action": boolean,
        "action_description": string,
        "preventive_description": string,
        "zone_id": number,

    }
```

## Edit Observation 

```json
    {
        "observation_id": number,
        "title": string,
        "date": "12-10-2025",
        "equipment_id": number,
        "images": base64_encoded_string[],
        "result": ObservationResult,
        "observation_level": ObservationLevel,
                "solve_status": SolveStatus,
        "with_nearmiss":boolean,
        "hazard_type":number,
        
        "with_action": boolean,
        "action_description": string,
        "preventive_description": string,
        "zone_id": number,

    }
```

## Delete Observation 

```json
    {
        "observation_id": number,
    }
```

## Show Observation 

```json
    {
        "observation_id": number,
    }
```


