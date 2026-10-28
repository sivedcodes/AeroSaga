import { useEffect, useState } from "react";
import { getMissions, createMission, cancelMission } from "../api/missions";
import "./WorkflowPanel.css";

const steps = ["Takeoff", "Navigate", "Drop Package", "Return to Base"];

function getStepState(step, mission) {
  if (!mission) {
    return "pending";
  }

  if (mission.status === "COMPLETED") {
    return "completed";
  }

  if (mission.status === "FAILED" || mission.status === "CANCELLED") {
    if (step === mission.currentStep) {
      return "active";
    }
    return "pending";
  }

  const currentIndex = steps.indexOf(mission.currentStep);

  if (currentIndex === -1) {
    return "pending";
  }

  const stepIndex = steps.indexOf(step);

  if (stepIndex < currentIndex) {
    return "completed";
  }

  if (stepIndex === currentIndex) {
    return "active";
  }

  return "pending";
}

function getProgress(mission) {
  if (!mission) {
    return 0;
  }

  if (mission.status === "COMPLETED") {
    return 100;
  }

  const currentIndex = steps.indexOf(mission.currentStep);

  if (currentIndex < 0) {
    return 0;
  }

  return Math.round(((currentIndex + 1) / steps.length) * 100);
}

function WorkflowPanel() {
  const [missions, setMissions] = useState([]);
  const [droneId, setDroneId] = useState("Drone-1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMissions = async () => {
    try {
      const data = await getMissions();
      setMissions(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getMissions();
        if (active) {
          setMissions(data);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      }
    };

    load();
    const timer = setInterval(load, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const latestMission = [...missions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )[0];

  const handleCreate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createMission(droneId);
      await loadMissions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!latestMission || latestMission.status !== "RUNNING") {
      return;
    }

    try {
      await cancelMission(latestMission.missionId);
      await loadMissions();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="workflow-panel">
      <h2>Mission Workflow</h2>
      <p className="workflow-subtitle">
        {latestMission
          ? `${latestMission.droneId} · ${latestMission.status}`
          : "No mission selected"}
      </p>

      <div className="workflow-actions">
        <input
          value={droneId}
          onChange={(event) => setDroneId(event.target.value)}
          placeholder="Drone ID"
        />
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
        {latestMission?.status === "RUNNING" && (
          <button onClick={handleCancel}>Cancel</button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {steps.map((step) => {
        const stepState = getStepState(step, latestMission);

        return (
          <div key={step} className={`workflow-step ${stepState}`}>
            <div className="step-number">
              {stepState === "completed" ? "✓" : steps.indexOf(step) + 1}
            </div>
            <div className="step-name">{step}</div>
            <div className="step-status">{stepState.toUpperCase()}</div>
          </div>
        );
      })}

      <div className="workflow-progress">
        Mission progress {getProgress(latestMission)}%
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${getProgress(latestMission)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default WorkflowPanel;
