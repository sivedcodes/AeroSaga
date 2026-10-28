package com.aerosaga.aerosaga_backend.service;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface DroneMissionActivities {

    @ActivityMethod
    void updateStatus(String missionId, String status, String currentStep);

    @ActivityMethod
    void executeStep(String missionId, String step, String droneId);
}
