{
  "name": "Ballot",
  "type": "object",
  "properties": {
    "vote_id": {
      "type": "string",
      "description": "Reference to Vote"
    },
    "user_email": {
      "type": "string",
      "description": "Voter email"
    },
    "selected_option": {
      "type": "string",
      "description": "Selected vote option"
    },
    "vote_timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "vote_id",
    "user_email",
    "selected_option"
  ]
}
