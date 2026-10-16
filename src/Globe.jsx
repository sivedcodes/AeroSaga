import { useEffect, useRef } from "react";
import {
  Viewer,
  Cartesian3,
  Color,
  CallbackProperty,
  JulianDate,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
function Globe() {
  const containerRef = useRef(null);
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

      scene3DOnly: true,
    });

    viewer.scene.morphTo3D(0);

    viewer.scene.globe.show = true;

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(78.4867, 17.385, 2000000),
      duration: 2,
    });

    const startTime = JulianDate.clone(viewer.clock.currentTime);
    for (let i = 0; i < 50; i++) {
      const startLongitude = 75 + (i % 10) * 0.8;
      const startLatitude = 12 + Math.floor(i / 10) * 2;
      const radius = 0.1 + (i % 5) * 0.03;
      const speed = 0.2 + (i % 5) * 0.05;
      const phase = i * 0.5;
      const movingPosition = new CallbackProperty((time) => {
        const seconds = JulianDate.secondsDifference(time, startTime);
        const angle = phase + seconds * speed;
        const longitude = startLongitude + radius * Math.cos(angle);
        const latitude = startLatitude + radius * Math.sin(angle);
        return Cartesian3.fromDegrees(longitude, latitude, 500);
      }, false);
      viewer.entities.add({
        id: `drone-${i + 1}`,
        name: `Drone ${String(i + 1).padStart(2, "0")}`,
        position: movingPosition,
        point: {
          pixelSize: 7,
          color: Color.LIME,
          outlineColor: Color.WHITE,
          outlineWidth: 1,
        },
        label: {
          text: `D${i + 1}`,
          font: "10px sans-serif",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 2,
          pixelOffset: new Cartesian3(0, -12, 0),
          scaleByDistance: undefined,
        },
      });
    }
    return () => {
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
export default Globe;
