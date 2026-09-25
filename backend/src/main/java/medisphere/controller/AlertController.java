package medisphere.controller;

import medisphere.dto.AlertValidationSuite;
import medisphere.model.Alert;
import medisphere.model.WearableDevice;
import medisphere.service.AlertEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertEngineService alertEngineService;

    public AlertController(AlertEngineService alertEngineService) {
        this.alertEngineService = alertEngineService;
    }

    @GetMapping
    public List<Alert> getAlerts(@RequestParam(required = false) String patientId) {
        if (patientId != null && !patientId.isBlank() && !"ALL".equalsIgnoreCase(patientId)) {
            return alertEngineService.getAlertsForPatient(patientId);
        }
        return alertEngineService.getAllAlerts();
    }

    @PostMapping("/simulate-sarah")
    public Alert triggerSarahMAlert() {
        return alertEngineService.triggerSarahMAlert();
    }

    @PostMapping("/simulate-john")
    public Alert triggerJohnDoeAlert() {
        return alertEngineService.triggerJohnDoeAlert();
    }

    @PostMapping("/simulate-robert")
    public Alert triggerRobertSmithAlert() {
        return alertEngineService.triggerRobertSmithAlert();
    }

    @PostMapping("/simulate")
    public Alert triggerPatientAlert(@RequestParam(defaultValue = "patient-002") String patientId) {
        return alertEngineService.triggerPatientAlert(patientId);
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<Alert> acknowledgeAlert(@PathVariable String id,
                                                  @RequestBody(required = false) Map<String, String> body) {
        String doctor = (body != null && body.containsKey("doctorName"))
                ? body.get("doctorName")
                : "Dr. Marcus Vance (Cardiology)";
        return alertEngineService.acknowledgeAlert(id, doctor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable String id,
                                              @RequestBody(required = false) Map<String, String> body) {
        String doctor = (body != null && body.containsKey("doctorName"))
                ? body.get("doctorName")
                : "Dr. Marcus Vance";
        return alertEngineService.resolveAlert(id, doctor)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/validations")
    public AlertValidationSuite getValidationSuite() {
        return alertEngineService.getValidationSuite();
    }

    @GetMapping("/wearables")
    public List<WearableDevice> getWearableDevices() {
        return alertEngineService.getWearableDevices();
    }

    @PostMapping("/stream-packet")
    public ResponseEntity<Alert> ingestStreamPacket(@RequestBody Map<String, Object> payload) {
        String patientId = (String) payload.getOrDefault("patientId", "patient-002");
        String patientName = (String) payload.getOrDefault("patientName", "Sarah M.");
        double hr = payload.containsKey("heartRate") ? Double.parseDouble(payload.get("heartRate").toString()) : 145.0;
        double sbp = payload.containsKey("systolicBP") ? Double.parseDouble(payload.get("systolicBP").toString()) : 124.0;
        double dbp = payload.containsKey("diastolicBP") ? Double.parseDouble(payload.get("diastolicBP").toString()) : 82.0;
        double temp = payload.containsKey("temperature") ? Double.parseDouble(payload.get("temperature").toString()) : 36.8;
        double spo2 = payload.containsKey("oxygenSaturation") ? Double.parseDouble(payload.get("oxygenSaturation").toString()) : 98.0;
        String dev = (String) payload.getOrDefault("deviceModel", "Apple Watch Ultra 2");

        return alertEngineService.processVitalsPacket(patientId, patientName, hr, sbp, dbp, temp, spo2, dev)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
