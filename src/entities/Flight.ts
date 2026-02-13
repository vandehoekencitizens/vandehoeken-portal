{
  "name": "Flight",
  "type": "object",
  "properties": {
    "flight_number": {
      "type": "string",
      "description": "Flight number"
    },
    "departure_city": {
      "type": "string",
      "description": "Departure city"
    },
    "arrival_city": {
      "type": "string",
      "description": "Arrival city"
    },
    "departure_time": {
      "type": "string",
      "format": "date-time",
      "description": "Departure date and time"
    },
    "arrival_time": {
      "type": "string",
      "format": "date-time",
      "description": "Arrival date and time"
    },
    "aircraft_model": {
      "type": "string",
      "description": "Aircraft model"
    },
    "price": {
      "type": "number",
      "description": "Ticket price in VHS"
    },
    "available_seats": {
      "type": "number",
      "description": "Available seats"
    },
    "status": {
      "type": "string",
      "enum": [
        "scheduled",
        "boarding",
        "departed",
        "arrived",
        "cancelled"
      ],
      "default": "scheduled"
    }
  },
  "required": [
    "flight_number",
    "departure_city",
    "arrival_city",
    "departure_time",
    "price"
  ]
}
