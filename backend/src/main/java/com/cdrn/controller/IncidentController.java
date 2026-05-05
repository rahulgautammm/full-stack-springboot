package com.cdrn.controller;

import com.cdrn.entity.IncidentReport;
import com.cdrn.entity.User;
import com.cdrn.repository.IncidentRepository;
import com.cdrn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<IncidentReport> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @PostMapping
    public IncidentReport createIncident(@RequestBody IncidentReport report) {
        if (report.getReporter() != null && report.getReporter().getId() != null) {
            User reporter = userRepository.findById(report.getReporter().getId()).orElse(null);
            report.setReporter(reporter);
        }
        report.setReportedAt(LocalDateTime.now());
        if (report.getStatus() == null) {
            report.setStatus("REPORTED");
        }
        IncidentReport savedReport = incidentRepository.save(report);
        
        // Push to WebSocket
        messagingTemplate.convertAndSend("/topic/incidents", savedReport);
        
        return savedReport;
    }
}
