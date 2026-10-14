import Globe from "./Globe";

function App() {
  return (
    <div>
      <h1
        style={{
          position: "absolute",
          zIndex: 1,
          color: "white",
          background: "#172033",
          padding: "12px 20px",
          margin: 0,
        }}
      >
        AeroSaga - Drone Mission Control
      </h1>

      <Globe />
    </div>
  );
}

export default App;
