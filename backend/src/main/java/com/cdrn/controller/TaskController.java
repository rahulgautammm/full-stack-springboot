package com.cdrn.controller;

import com.cdrn.entity.IncidentReport;
import com.cdrn.entity.Task;
import com.cdrn.entity.User;
import com.cdrn.repository.IncidentRepository;
import com.cdrn.repository.TaskRepository;
import com.cdrn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/volunteer/{volunteerId}")
    public List<Task> getTasksForVolunteer(@PathVariable Long volunteerId) {
        User volunteer = new User();
        volunteer.setId(volunteerId);
        return taskRepository.findByAssignedVolunteer(volunteer);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getAssignedVolunteer() != null && task.getAssignedVolunteer().getId() != null) {
            User volunteer = userRepository.findById(task.getAssignedVolunteer().getId())
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
            task.setAssignedVolunteer(volunteer);
        }
        if (task.getRelatedIncident() != null && task.getRelatedIncident().getId() != null) {
            IncidentReport incident = incidentRepository.findById(task.getRelatedIncident().getId()).orElse(null);
            task.setRelatedIncident(incident);
        }
        if (task.getStatus() == null) {
            task.setStatus("PENDING");
        }
        Task savedTask = taskRepository.save(task);
        
        // Push to WebSocket
        messagingTemplate.convertAndSend("/topic/tasks", savedTask);
        
        return savedTask;
    }

    @PutMapping("/{taskId}/status")
    public Task updateTaskStatus(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(taskDetails.getStatus());
        Task updatedTask = taskRepository.save(task);
        
        messagingTemplate.convertAndSend("/topic/tasks", updatedTask);
        return updatedTask;
    }
}
