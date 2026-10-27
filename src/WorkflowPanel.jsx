import "./WorkflowPanel.css";

const steps = [
  { id: 1, name: "Takeoff", status: "COMPLETED" },
  { id: 2, name: "Navigate", status: "ACTIVE" },
  { id: 3, name: "Drop Package", status: "PENDING" },
  { id: 4, name: "Return to Base", status: "PENDING" },
];

function WorkflowPanel() {
  const completedSteps = steps.filter(
    (step) => step.status === "COMPLETED",
  ).length;

  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="workflow-panel">
      <h2>Mission Workflow</h2>

      <p className="workflow-subtitle">DRONE-01 · Mission steps</p>

      {steps.map((step) => (
        <div
          key={step.id}
          className={`workflow-step ${
            step.status === "COMPLETED"
              ? "completed"
              : step.status === "ACTIVE"
                ? "active"
                : "pending"
          }`}
        >
          <div className="step-number">
            {step.status === "COMPLETED" ? "✓" : step.id}
          </div>

          <div className="step-name">{step.name}</div>

          <div className="step-status">{step.status}</div>
        </div>
      ))}

      <div className="workflow-progress">
        Mission progress {progress}%
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default WorkflowPanel;
