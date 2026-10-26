
package com.aerosaga.aerosaga_backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TelemetryController {

    @GetMapping("/api/health")
    public String health() {
        return "AeroSaga backend is running!";
    }
}
