import Globe from "./Globe";
import "./App.css";
import WorkflowPanel from "./WorkflowPanel";

function App() {
  return (
    <div className="app">
      <h1 className="heading">AeroSaga - Drone Mission Control</h1>

      <Globe />
      <WorkflowPanel />
    </div>
  );
}

export default App;
