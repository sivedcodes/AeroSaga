package com.aerosaga.aerosaga_backend.config;

import com.aerosaga.aerosaga_backend.service.MissionRepository;
import com.aerosaga.aerosaga_backend.service.DroneMissionWorkflowImpl;
import com.aerosaga.aerosaga_backend.service.DroneMissionWorkflow;
import com.aerosaga.aerosaga_backend.service.DroneMissionActivitiesImpl;
import com.aerosaga.aerosaga_backend.service.DroneMissionActivities;
import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.serviceclient.WorkflowServiceStubsOptions;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TemporalConfig {

    private static final String TASK_QUEUE = "drone-mission-queue";

    private final MissionRepository missionRepository;

    public TemporalConfig(MissionRepository missionRepository) {
        this.missionRepository = missionRepository;
    }

    @Bean
    public WorkflowServiceStubs workflowServiceStubs() {
        WorkflowServiceStubsOptions options = WorkflowServiceStubsOptions.newBuilder()
                .setTarget("localhost:7233")
                .build();

        return WorkflowServiceStubs.newInstance(options);
    }

    @Bean
    public WorkflowClient workflowClient(WorkflowServiceStubs serviceStubs) {
        return WorkflowClient.newInstance(serviceStubs);
    }

    @Bean
    public WorkerFactory workerFactory(WorkflowClient workflowClient) {
        WorkerFactory factory = WorkerFactory.newInstance(workflowClient);
        Worker worker = factory.newWorker(TASK_QUEUE);
        worker.registerWorkflowImplementationTypes(DroneMissionWorkflowImpl.class);
        worker.registerActivitiesImplementations(new DroneMissionActivitiesImpl(missionRepository));
        return factory;
    }

    @Bean
    public ApplicationRunner temporalWorkerRunner(WorkerFactory workerFactory) {
        return args -> workerFactory.start();
    }
}
