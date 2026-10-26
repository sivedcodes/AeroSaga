import "./WorkflowPanel.css";
const steps = [
  { id: 1, name: "Takeoff", status: "COMPLETED" },
  { id: 2, name: "Navigate", status: "ACTIVE" },
  { id: 3, name: "Drop Package", status: "PENDING" },
  { id: 4, name: "Return to Base", status: "PENDING" },
];
function WorkflowPanel() {
  return (
    <div className="workflow-panel">
      <h2>Mission Workflow</h2>
      <p className="mission-id">DRONE-01 · Mission steps</p>
      {steps.map((step, index) => (
        <div key={step.id} className="step">
          <div
            className={`step-icon ${step.status === "COMPLETED" ? "completed" : step.status === "ACTIVE" ? "active" : "pending"}`}
          >
            {step.status === "COMPLETED" ? "✓" : step.id}
          </div>
          <div className="step-name">{step.name}</div>
          <div className="step-status">{step.status}</div>
        </div>
      ))}
      <p>
        Mission progress{" "}
        {Math.round(
          (steps.filter((s) => s.status === "COMPLETED").length /
            steps.length) *
            100,
        )}
        %
      </p>
    </div>
  );
}
export default WorkflowPanel;
