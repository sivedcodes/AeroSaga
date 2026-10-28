# AeroSaga

Autonomous Drone Mission Control using React, CesiumJS, Java Spring Boot, and Temporal.io.

## Run

```bash
./run.sh
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Temporal UI: http://localhost:8233

## Backend APIs

- `POST /api/missions` - create a drone mission
- `GET /api/missions` - list missions
- `GET /api/missions/{id}` - mission status
- `POST /api/missions/{id}/cancel` - cancel a mission
