package com.example.insurAI.controller;

import com.example.insurAI.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {
    
    @Autowired
    private ChatbotService chatbotService;
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> processMessage(
            @RequestBody Map<String, String> request,
            @RequestParam Long userId) {
        
        String userMessage = request.get("message");
        Map<String, Object> response = chatbotService.processUserMessage(userMessage, userId);
        
        return ResponseEntity.ok(response);
    }
}