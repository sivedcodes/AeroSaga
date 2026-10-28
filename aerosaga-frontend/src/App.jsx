import "./App.css";
import Globe from "./components/Globe";
import WorkflowPanel from "./components/WorkflowPanel";

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
