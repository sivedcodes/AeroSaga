
package com.aerosaga.aerosaga_backend;

public class DroneTelemetry {

    private String droneId;
    private double latitude;
    private double longitude;
    private double altitude;

    public DroneTelemetry() {
    }

    public DroneTelemetry(
            String droneId,
            double latitude,
            double longitude,
            double altitude) {

        this.droneId = droneId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }

    public String getDroneId() {
        return droneId;
    }

    public void setDroneId(String droneId) {
        this.droneId = droneId;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }
}
