import { useState, useEffect, useMemo, useRef } from "react";
import { Viewer, Cartesian3, Color } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
function Globe() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [count] = useState(50);
  const [showLabels] = useState(true);
  const drones = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      longitude: 75 + (i % 10) * 0.8,
      latitude: 12 + Math.floor(i / 10) * 2,
    }));
  }, [count]);
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
    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.entities.removeAll();
    drones.forEach((drone) => {
      viewer.entities.add({
        name: `Drone ${drone.id}`,
        position: Cartesian3.fromDegrees(drone.longitude, drone.latitude, 500),
        point: {
          pixelSize: 8,
          color: Color.LIME,
          outlineColor: Color.WHITE,
          outlineWidth: 1,
        },
        label: showLabels
          ? {
              text: `D${drone.id}`,
              font: "10px sans-serif",
              fillColor: Color.WHITE,
              outlineColor: Color.BLACK,
              outlineWidth: 2,
              style: 2,
            }
          : undefined,
      });
    });
  }, [drones, showLabels]);
  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
}
export default Globe;
