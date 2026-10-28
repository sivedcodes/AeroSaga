package com.aerosaga.aerosaga_backend.service;

import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.failure.ActivityFailure;
import io.temporal.failure.CanceledFailure;
import io.temporal.workflow.Workflow;

import java.time.Duration;

public class DroneMissionWorkflowImpl implements DroneMissionWorkflow {

    private final DroneMissionActivities activities;

    public DroneMissionWorkflowImpl() {
        RetryOptions retryOptions = RetryOptions.newBuilder()
                .setInitialInterval(Duration.ofSeconds(1))
                .setMaximumInterval(Duration.ofSeconds(5))
                .setBackoffCoefficient(2.0)
                .setMaximumAttempts(3)
                .build();

        ActivityOptions activityOptions = ActivityOptions.newBuilder()
                .setStartToCloseTimeout(Duration.ofSeconds(10))
                .setRetryOptions(retryOptions)
                .build();

        this.activities = Workflow.newActivityStub(DroneMissionActivities.class, activityOptions);
    }

    @Override
    public String execute(String missionId, String droneId) {
        String[] steps = {"Takeoff", "Navigate", "Drop Package", "Return to Base"};

        try {
            for (String step : steps) {
                activities.updateStatus(missionId, "RUNNING", step);
                activities.executeStep(missionId, step, droneId);

                // Long-running mission: durable wait between steps.
                Workflow.sleep(Duration.ofSeconds(5));
            }

            activities.updateStatus(missionId, "COMPLETED", "All steps completed");
            return "COMPLETED";
        } catch (CanceledFailure exception) {
            activities.updateStatus(missionId, "CANCELLED", "Mission cancelled");
            return "CANCELLED";
        } catch (ActivityFailure exception) {
            activities.updateStatus(missionId, "FAILED", exception.getMessage());
            return "FAILED";
        } catch (Exception exception) {
            activities.updateStatus(missionId, "FAILED", exception.getMessage());
            return "FAILED";
        }
    }
}
