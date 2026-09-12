package medisphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "fhir_resources")
public class FHIRResource {

    @Id
    private String id;

    private String resourceType;

    private String resourceId;

    private Map<String, Object> resourceData;

    public FHIRResource() {
    }

    public FHIRResource(String resourceType, String resourceId,
                        Map<String, Object> resourceData) {
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.resourceData = resourceData;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public Map<String, Object> getResourceData() {
        return resourceData;
    }

    public void setResourceData(Map<String, Object> resourceData) {
        this.resourceData = resourceData;
    }
}