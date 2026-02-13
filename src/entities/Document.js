export default {
  "name": "Document",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Document owner email"
    },
    "document_name": {
      "type": "string",
      "description": "Document name"
    },
    "document_type": {
      "type": "string",
      "enum": [
        "passport",
        "id_card",
        "certificate",
        "permit",
        "other"
      ],
      "description": "Type of document"
    },
    "file_url": {
      "type": "string",
      "description": "Document file URL"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes"
    }
  },
  "required": [
    "user_email",
    "document_name",
    "document_type",
    "file_url"
  ]
}
