import { useEffect, useRef } from "react";
import { Viewer, Cartesian3, Color } from "cesium";
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
      infoBox: true,
      selectionIndicator: true,
    });

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(78.4867, 17.385, 12000000),
      duration: 2,
    });

    const drones = [
      {
        name: "Drone 01 - Hyderabad",
        longitude: 78.4867,
        latitude: 17.385,
      },
      {
        name: "Drone 02 - Bangalore",
        longitude: 77.5946,
        latitude: 12.9716,
      },
      {
        name: "Drone 03 - Chennai",
        longitude: 80.2707,
        latitude: 13.0827,
      },
      {
        name: "Drone 08 - Kochi",
        longitude: 76.2673,
        latitude: 9.9312,
      },
      {
        name: "Drone 09 - Ahmedabad",
        longitude: 72.5714,
        latitude: 23.0225,
      },
      {
        name: "Drone 10 - Jaipur",
        longitude: 75.7873,
        latitude: 26.9124,
      },
      {
        name: "Drone 11 - Visakhapatnam",
        longitude: 83.2185,
        latitude: 17.6868,
      },
      {
        name: "Drone 12 - Lucknow",
        longitude: 80.9462,
        latitude: 26.8467,
      },
    ];

    drones.forEach((drone) => {
      viewer.entities.add({
        name: drone.name,

        position: Cartesian3.fromDegrees(drone.longitude, drone.latitude, 500),

        point: {
          pixelSize: 13,
          color: Color.LIME,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },

        label: {
          text: drone.name,
          font: "14px sans-serif",
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 3,
          style: 2,
          pixelOffset: new Cartesian3(0, -22, 0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    });

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
        margin: 0,
        padding: 0,
      }}
    />
  );
}

export default Globe;
