
package com.aerosaga.aerosaga_backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TelemetryService {

    private final SimpMessagingTemplate messagingTemplate;

    
    private final Map<Integer, Double> latitudes = new HashMap<>();
    private final Map<Integer, Double> longitudes = new HashMap<>();

    private int step = 0;

    public TelemetryService(
            SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;

        
        for (int i = 1; i <= 50; i++) {
            latitudes.put(
                i,
                12.0 + ((i - 1) / 10) * 2.0
            );

            longitudes.put(
                i,
                75.0 + ((i - 1) % 10) * 0.8
            );
        }
    }

    @Scheduled(fixedRate = 1000)
    public void sendTelemetry() {

        step++;

        for (int i = 1; i <= 50; i++) {

           
            double latitude = latitudes.get(i);
            double longitude = longitudes.get(i);

            
            latitude += 0.03;
            longitude += 0.04;

          
            if (latitude > 27.0) {
                latitude = 12.0;
            }

            if (longitude > 88.0) {
                longitude = 75.0;
            }

            
            latitudes.put(i, latitude);
            longitudes.put(i, longitude);

            
            DroneTelemetry telemetry = new DroneTelemetry(
                "Drone-" + i,
                latitude,
                longitude,
                500
            );

            
            messagingTemplate.convertAndSend(
                "/topic/telemetry",
                telemetry
            );
        }

        System.out.println(
            "GPS updates sent: 50 drones, step = " + step
        );
    }
}

