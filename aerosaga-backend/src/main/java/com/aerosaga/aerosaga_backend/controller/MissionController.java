package com.aerosaga.aerosaga_backend.controller;

import com.aerosaga.aerosaga_backend.model.CreateMissionRequest;
import com.aerosaga.aerosaga_backend.model.Mission;
import com.aerosaga.aerosaga_backend.service.MissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collection;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequestMapping("/api/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping
    public ResponseEntity<Mission> createMission(@RequestBody(required = false) CreateMissionRequest request) {
        if (request == null) {
            request = new CreateMissionRequest();
        }

        Mission mission = missionService.createMission(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mission);
    }

    @GetMapping
    public Collection<Mission> getAllMissions() {
        return missionService.getAllMissions();
    }

    @GetMapping("/{missionId}")
    public Mission getMission(@PathVariable String missionId) {
        return missionService.getMission(missionId);
    }

    @PostMapping("/{missionId}/cancel")
    public ResponseEntity<Void> cancelMission(@PathVariable String missionId) {
        missionService.cancelMission(missionId);
        return ResponseEntity.noContent().build();
    }

}
