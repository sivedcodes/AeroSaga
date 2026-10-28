const API_URL = "http://localhost:8080/api/missions";

export async function getMissions() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to load missions");
  }
  return response.json();
}

export async function createMission(droneId) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ droneId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create mission");
  }

  return response.json();
}

export async function cancelMission(missionId) {
  const response = await fetch(`${API_URL}/${missionId}/cancel`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to cancel mission");
  }
}
