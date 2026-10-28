package com.aerosaga.aerosaga_backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Mission {

    private String missionId;
    private String droneId;
    private MissionStatus status;
    private String currentStep;
    private String failureReason;
    private Instant createdAt;
    private Instant updatedAt;
    private List<String> steps = new ArrayList<>();

    public Mission() {
    }

    public Mission(String missionId, String droneId) {
        this.missionId = missionId;
        this.droneId = droneId;
        this.status = MissionStatus.CREATED;
        this.currentStep = "Not started";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.steps.add("Takeoff");
        this.steps.add("Navigate");
        this.steps.add("Drop Package");
        this.steps.add("Return to Base");
    }

    public String getMissionId() {
        return missionId;
    }

    public void setMissionId(String missionId) {
        this.missionId = missionId;
    }

    public String getDroneId() {
        return droneId;
    }

    public void setDroneId(String droneId) {
        this.droneId = droneId;
    }

    public MissionStatus getStatus() {
        return status;
    }

    public void setStatus(MissionStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public String getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(String currentStep) {
        this.currentStep = currentStep;
        this.updatedAt = Instant.now();
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
        this.updatedAt = Instant.now();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }
}
