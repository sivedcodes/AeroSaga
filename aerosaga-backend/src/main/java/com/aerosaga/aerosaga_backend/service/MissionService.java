package com.aerosaga.aerosaga_backend.service;

import com.aerosaga.aerosaga_backend.model.CreateMissionRequest;
import com.aerosaga.aerosaga_backend.model.Mission;
import com.aerosaga.aerosaga_backend.model.MissionStatus;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.UUID;

@Service
public class MissionService {

    private static final String TASK_QUEUE = "drone-mission-queue";

    private final MissionRepository missionRepository;
    private final WorkflowClient workflowClient;

    public MissionService(MissionRepository missionRepository, WorkflowClient workflowClient) {
        this.missionRepository = missionRepository;
        this.workflowClient = workflowClient;
    }

    public Mission createMission(CreateMissionRequest request) {
        String missionId = UUID.randomUUID().toString();
        String droneId = (request.getDroneId() == null || request.getDroneId().isBlank())
                ? "Drone-1"
                : request.getDroneId();

        Mission mission = new Mission(missionId, droneId);
        missionRepository.save(mission);

        DroneMissionWorkflow workflow = workflowClient.newWorkflowStub(
                DroneMissionWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setWorkflowId(missionId)
                        .setTaskQueue(TASK_QUEUE)
                        .build()
        );

        WorkflowClient.start(workflow::execute, missionId, droneId);

        return mission;
    }

    public Mission getMission(String missionId) {
        Mission mission = missionRepository.findById(missionId);
        if (mission == null) {
            throw new IllegalArgumentException("Mission not found: " + missionId);
        }
        return mission;
    }

    public Collection<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    public void cancelMission(String missionId) {
        Mission mission = getMission(missionId);

        if (mission.getStatus() == MissionStatus.COMPLETED
                || mission.getStatus() == MissionStatus.FAILED
                || mission.getStatus() == MissionStatus.CANCELLED) {
            return;
        }

        try {
            workflowClient.newUntypedWorkflowStub(missionId).cancel();
        } catch (Exception ignored) {
            // Workflow may already be finished.
        }

        mission.setStatus(MissionStatus.CANCELLED);
        mission.setCurrentStep("Cancelled");
        missionRepository.save(mission);
    }
}
