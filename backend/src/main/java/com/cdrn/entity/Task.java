package com.cdrn.entity;

import jakarta.persistence.*;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String status; // PENDING, IN_PROGRESS, COMPLETED

    @ManyToOne
    private User assignedVolunteer;

    @ManyToOne
    private IncidentReport relatedIncident;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public User getAssignedVolunteer() { return assignedVolunteer; }
    public void setAssignedVolunteer(User assignedVolunteer) { this.assignedVolunteer = assignedVolunteer; }
    
    public IncidentReport getRelatedIncident() { return relatedIncident; }
    public void setRelatedIncident(IncidentReport relatedIncident) { this.relatedIncident = relatedIncident; }
}
