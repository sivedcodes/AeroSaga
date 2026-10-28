package com.aerosaga.aerosaga_backend.service;

import com.aerosaga.aerosaga_backend.model.Mission;
import com.aerosaga.aerosaga_backend.model.MissionStatus;

public class DroneMissionActivitiesImpl implements DroneMissionActivities {

    private final MissionRepository missionRepository;

    public DroneMissionActivitiesImpl(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    @Override
    public void updateStatus(String missionId, String status, String currentStep) {
        Mission mission = missionRepository.findById(missionId);
        if (mission == null) {
            return;
        }

        mission.setStatus(MissionStatus.valueOf(status));
        mission.setCurrentStep(currentStep);
        missionRepository.save(mission);
    }

    @Override
    public void executeStep(String missionId, String step, String droneId) {
        try {
            // Simulate work for each mission step.
            Thread.sleep(1000);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Mission step interrupted: " + step, exception);
        }
    }
}
