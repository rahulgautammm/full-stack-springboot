package com.cdrn.controller;

import com.cdrn.entity.User;
import com.cdrn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/volunteers")
    public List<User> getVolunteers() {
        return userRepository.findAll().stream()
                .filter(u -> "VOLUNTEER".equals(u.getRole()))
                .collect(Collectors.toList());
    }
}
