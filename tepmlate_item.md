# Template Item

## Add Template Item

```json
    {
      "template_id": number,
        "title": string,
        "type": TemplateItemType,
        "items": [
          {
            "title": string,
            "is_danger": boolean
          }
        ],
        "required_image": boolean,
        "required_type": RequiredType,
        
        
    }
```

## Edit Template Item

```json
    {
        "template_item_id": number,
        "template_id": number,
        "title": string,
        "type": TemplateItemType,
        "items": [
          {
            "title": string,
            "is_danger": boolean
          }
        ],
        "required_image": boolean,
        "required_type": RequiredType,
        
    }
```

## Delete Template Item

```json
    {
        "template_item_id": number,
    }
```

## Show Template Item

```json
    {
        "template_item_id": number,
    }
```

