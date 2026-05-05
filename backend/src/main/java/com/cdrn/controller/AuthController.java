package com.cdrn.controller;

import com.cdrn.entity.User;
import com.cdrn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String role = payload.get("role");
        String name = payload.get("name");

        Optional<User> existingUser = userRepository.findByPhone(phone);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        User newUser = new User();
        newUser.setPhone(phone);
        newUser.setRole(role != null ? role : "CITIZEN");
        newUser.setName(name != null ? name : "Unknown");
        return userRepository.save(newUser);
    }
}
