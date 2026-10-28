package com.aerosaga.aerosaga_backend.service;

import com.aerosaga.aerosaga_backend.model.Mission;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MissionRepository {

    private final Map<String, Mission> missions = new ConcurrentHashMap<>();

    public void save(Mission mission) {
        missions.put(mission.getMissionId(), mission);
    }

    public Mission findById(String missionId) {
        return missions.get(missionId);
    }

    public Collection<Mission> findAll() {
        return missions.values();
    }

    public void delete(String missionId) {
        missions.remove(missionId);
    }
}
