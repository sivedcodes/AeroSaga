import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { Viewer, Cartesian2, Cartesian3, Color } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function Globe() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const clientRef = useRef(null);

  const [count] = useState(50);
  const [showLabels, setShowLabels] = useState(true);
  const [status, setStatus] = useState("Connecting...");
  const [lastGPS, setLastGPS] = useState("Waiting for GPS data");
  const [receivedCount, setReceivedCount] = useState(0);

  const drones = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      longitude: 75 + (i % 10) * 0.8,
      latitude: 12 + Math.floor(i / 10) * 2,
      altitude: 500,
    }));
  }, [count]);

  const handleTelemetry = useCallback(
    (message) => {
      try {
        const data = JSON.parse(message.body);

        console.log("GPS update:", data);

        const viewer = viewerRef.current;

        if (!viewer || viewer.isDestroyed()) {
          return;
        }

        const rawId = String(data.droneId ?? data.id ?? "").trim();
        const match = rawId.match(/^(?:Drone-?)?0*(\d+)$/i);

        if (!match) {
          console.warn("Invalid drone ID:", rawId);
          return;
        }

        const droneNumber = Number(match[1]);

        if (droneNumber < 1 || droneNumber > count) {
          console.warn("Drone ID out of range:", rawId);
          return;
        }

        const entityId = `Drone-${droneNumber}`;
        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);
        const altitude = Number(data.altitude ?? 500);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          !Number.isFinite(altitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          console.warn("Invalid GPS data:", data);
          return;
        }

        const marker = viewer.entities.getById(entityId);

        if (!marker) {
          console.warn("Drone marker not found:", entityId);
          return;
        }

        marker.position = Cartesian3.fromDegrees(longitude, latitude, altitude);

        setLastGPS(
          `${entityId}: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        );

        setReceivedCount((previous) => previous + 1);
      } catch (error) {
        console.error("Telemetry error:", error);
      }
    },
    [count],
  );

  useEffect(() => {
    const viewer = new Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      selectionIndicator: false,
    });

    viewerRef.current = viewer;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(78.4867, 17.385, 2000000),
      duration: 2,
    });

    drones.forEach((drone) => {
      viewer.entities.add({
        id: `Drone-${drone.id}`,
        name: `Drone ${drone.id}`,

        position: Cartesian3.fromDegrees(
          drone.longitude,
          drone.latitude,
          drone.altitude,
        ),

        point: {
          pixelSize: 9,
          color: Color.LIME,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
        },

        label: {
          text: `D${drone.id}`,
          show: showLabels,
          font: "12px sans-serif",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 2,
          showBackground: true,
          backgroundColor: Color.BLACK,
          pixelOffset: new Cartesian2(0, -18),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    });

    return () => {
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }

      viewerRef.current = null;
    };
  }, [drones]);

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer || viewer.isDestroyed()) {
      return;
    }

    for (let i = 1; i <= count; i++) {
      const drone = viewer.entities.getById(`Drone-${i}`);

      if (drone?.label) {
        drone.label.show = showLabels;
      }
    }
  }, [showLabels, count]);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-telemetry",
      reconnectDelay: 5000,

      onConnect: () => {
        setStatus("Connected");

        client.subscribe("/topic/telemetry", handleTelemetry);

        console.log("Subscribed to /topic/telemetry");
      },

      onWebSocketClose: () => {
        setStatus("Disconnected - reconnecting...");
      },

      onWebSocketError: (error) => {
        setStatus("WebSocket error");
        console.error("WebSocket error:", error);
      },

      onStompError: (frame) => {
        setStatus("Connection error");
        console.error("STOMP error:", frame.headers.message);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      client.deactivate();
    };
  }, [handleTelemetry]);

  const toggleLabels = () => {
    setShowLabels((previous) => !previous);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Cesium 3D Earth */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Drone mission dashboard */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 10,
          padding: 15,
          background: "rgba(0, 0, 0, 0.85)",
          color: "white",
          borderRadius: 8,
          minWidth: 250,
        }}
      >
        <p>WebSocket: {status}</p>
        <p>Last GPS: {lastGPS}</p>
        <p>Total Drones: {count}</p>
        <p>GPS Messages Received: {receivedCount}</p>

        <button
          onClick={toggleLabels}
          style={{
            padding: "8px 12px",
            marginTop: 8,
            cursor: "pointer",
          }}
        >
          {showLabels ? "Hide Labels" : "Show Labels"}
        </button>
      </div>
    </div>
  );
}

export default Globe;
