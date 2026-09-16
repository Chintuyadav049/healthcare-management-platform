package medisphere.controller;

import medisphere.dto.RiskPredictionResult;
import medisphere.dto.ShapFeatureValue;
import medisphere.dto.ValidationSuiteData;
import medisphere.model.ModelVersion;
import medisphere.repository.ModelVersionRepository;
import medisphere.service.RiskPredictionService;
import medisphere.service.ShapExplanationService;
import medisphere.service.ValidationSuiteService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final RiskPredictionService riskPredictionService;
    private final ShapExplanationService shapExplanationService;
    private final ValidationSuiteService validationSuiteService;
    private final ModelVersionRepository modelVersionRepository;

    public AIController(RiskPredictionService riskPredictionService,
                        ShapExplanationService shapExplanationService,
                        ValidationSuiteService validationSuiteService,
                        ModelVersionRepository modelVersionRepository) {
        this.riskPredictionService = riskPredictionService;
        this.shapExplanationService = shapExplanationService;
        this.validationSuiteService = validationSuiteService;
        this.modelVersionRepository = modelVersionRepository;
    }

    @GetMapping("/predict/cvd/{patientId}")
    public RiskPredictionResult getCvdRisk(@PathVariable String patientId) {
        return riskPredictionService.predictRisk(patientId);
    }

    @GetMapping("/predict/cvd")
    public RiskPredictionResult getDefaultCvdRisk() {
        return riskPredictionService.predictRisk("patient-001");
    }

    @PostMapping("/predict/new-patient")
    public RiskPredictionResult assessNewPatient(@RequestBody medisphere.dto.NewPatientAssessmentRequest request) {
        return riskPredictionService.assessNewPatient(request);
    }

    @GetMapping("/predict/diabetes/{patientId}")
    public Map<String, Double> getDiabetesComplications(@PathVariable String patientId) {
        return riskPredictionService.predictRisk(patientId).getDiabetesComplications();
    }

    @GetMapping("/explain/shap/{patientId}")
    public List<ShapFeatureValue> getShapExplanation(@PathVariable String patientId) {
        return riskPredictionService.predictRisk(patientId).getShapAttributions();
    }

    @GetMapping("/models")
    public List<ModelVersion> getAllModels() {
        List<ModelVersion> models = modelVersionRepository.findAll();
        if (models.isEmpty()) {
            models = getFallbackModelVersions();
        }
        return models;
    }

    @PostMapping("/models/{versionId}/activate")
    public ModelVersion activateModel(@PathVariable String versionId) {
        List<ModelVersion> models = modelVersionRepository.findAll();
        ModelVersion activated = null;
        for (ModelVersion mv : models) {
            if (mv.getVersionId().equalsIgnoreCase(versionId)) {
                mv.setStatus("ACTIVE");
                activated = mv;
            } else if ("ACTIVE".equalsIgnoreCase(mv.getStatus())) {
                mv.setStatus("CANDIDATE");
            }
            modelVersionRepository.save(mv);
        }
        if (activated == null) {
            activated = new ModelVersion(
                    versionId, "Cardiovascular Risk Neural Network", "Dense-Residual-FedAvg",
                    47, 91.4, 0.942, 0.908, 48500, "ACTIVE",
                    "sha256:7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9", LocalDateTime.now()
            );
        }
        return activated;
    }

    @GetMapping("/validation/all")
    public ValidationSuiteData getValidationSuite() {
        return validationSuiteService.getValidationSuite();
    }

    private List<ModelVersion> getFallbackModelVersions() {
        List<ModelVersion> list = new ArrayList<>();
        list.add(new ModelVersion(
                "v2.4.0-fed-cvd",
                "TensorFlow Federated CVD Neural Network",
                "Dense Residual MLP (FedAvg + DP-SGD)",
                47, 91.4, 0.942, 0.908, 48500, "ACTIVE",
                "sha256:7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
                LocalDateTime.now().minusHours(4)
        ));
        list.add(new ModelVersion(
                "v2.3.1-fed-cvd",
                "Federated ASCVD Risk Estimator",
                "Wide & Deep Neural Network",
                35, 88.7, 0.918, 0.881, 36000, "CANDIDATE",
                "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                LocalDateTime.now().minusDays(5)
        ));
        list.add(new ModelVersion(
                "v1.2.0-fed-diabetes",
                "Multi-Organ Diabetes Complications Net",
                "Multi-Task Deep Learning",
                42, 89.8, 0.925, 0.892, 42000, "ACTIVE",
                "sha256:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
                LocalDateTime.now().minusDays(2)
        ));
        list.add(new ModelVersion(
                "v1.0.0-baseline",
                "Framingham Baseline Risk Model",
                "Logistic Regression Classifier",
                0, 78.2, 0.812, 0.774, 12000, "ARCHIVED",
                "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
                LocalDateTime.now().minusDays(20)
        ));
        return list;
    }
}
