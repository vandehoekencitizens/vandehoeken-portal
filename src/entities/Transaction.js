export default {
  "name": "Transaction",
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "purchase",
        "transfer_sent",
        "transfer_received",
        "admin_adjustment"
      ],
      "description": "Type of transaction"
    },
    "amount": {
      "type": "number",
      "description": "Transaction amount in VHS"
    },
    "from_vnt_id": {
      "type": "string",
      "description": "Sender VNT ID"
    },
    "to_vnt_id": {
      "type": "string",
      "description": "Receiver VNT ID"
    },
    "from_email": {
      "type": "string",
      "description": "Sender email"
    },
    "to_email": {
      "type": "string",
      "description": "Receiver email"
    },
    "description": {
      "type": "string",
      "description": "Transaction description"
    },
    "item_name": {
      "type": "string",
      "description": "For purchases: item name"
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "pending",
        "failed"
      ],
      "default": "completed"
    }
  },
  "required": [
    "type",
    "amount",
    "from_email"
  ]
}
