package com.aerosaga.aerosaga_backend.model;

public class CreateMissionRequest {

    private String droneId;

    public CreateMissionRequest() {
    }

    public String getDroneId() {
        return droneId;
    }

    public void setDroneId(String droneId) {
        this.droneId = droneId;
    }
}
