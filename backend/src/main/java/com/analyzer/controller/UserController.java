package com.analyzer.controller;

import com.analyzer.dto.UserStatsDTO;
import com.analyzer.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search")
    public ResponseEntity<UserStatsDTO> searchUser(@RequestParam String username) {
        return ResponseEntity.ok(userService.getUserStats(username));
    }
}
