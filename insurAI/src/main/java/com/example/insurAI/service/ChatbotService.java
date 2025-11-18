package com.example.insurAI.service;

import com.example.insurAI.entity.*;
import com.example.insurAI.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private PolicyApplicationRepository applicationRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${openai.api.key:demo-key}")
    private String openaiApiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    
    public Map<String, Object> processUserMessage(String message, Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userRepository.findById(userId).orElse(null);
            String aiResponse = generateAIResponse(message.toLowerCase(), user);
            
            response.put("message", aiResponse);
            response.put("timestamp", LocalDateTime.now());
            response.put("success", true);
            
        } catch (Exception e) {
            response.put("message", "I'm sorry, I'm having trouble processing your request right now. Please try again.");
            response.put("success", false);
        }
        
        return response;
    }
    
    private String generateAIResponse(String message, User user) {
        try {
            String context = buildUserContext(user);
            return callOpenAI(message, context);
        } catch (Exception e) {
            return getFallbackResponse(message, user);
        }
    }
    
    private String buildUserContext(User user) {
        StringBuilder context = new StringBuilder("You are InsurAI, a helpful insurance assistant. ");
        
        if (user != null) {
            List<Policy> allPolicies = policyRepository.findByStatus(PolicyStatus.ACTIVE);
            List<PolicyApplication> userApplications = applicationRepository.findByUserId(user.getId());
            List<Appointment> userAppointments = appointmentRepository.findByCustomerId(user.getId());
            
            context.append(String.format("User: %s (%s). ", user.getFullName(), user.getRole()));
            context.append(String.format("Available policies: %d. ", allPolicies.size()));
            context.append(String.format("User applications: %d. ", userApplications.size()));
            context.append(String.format("User appointments: %d. ", userAppointments.size()));
        }
        
        context.append("Help with insurance policies, claims, appointments, and applications.");
        return context.toString();
    }
    
    private String callOpenAI(String message, String context) {
        if ("demo-key".equals(openaiApiKey) || "your-openai-api-key-here".equals(openaiApiKey)) {
            return "AI service not configured. Using demo mode.";
        }
        
        if (openaiApiKey == null || !openaiApiKey.startsWith("sk-")) {
            System.err.println("Invalid OpenAI API key format: " + (openaiApiKey != null ? openaiApiKey.substring(0, Math.min(10, openaiApiKey.length())) + "..." : "null"));
            return getFallbackResponse(message, null);
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
            Map.of("role", "system", "content", context),
            Map.of("role", "user", "content", message)
        ));
        requestBody.put("max_tokens", 150);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(OPENAI_URL, entity, 
                (Class<Map<String, Object>>) (Class<?>) Map.class);
            Map<String, Object> responseBody = response.getBody();
            
            if (responseBody != null && responseBody.containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    @SuppressWarnings("unchecked")
                    Map<String, Object> messageObj = (Map<String, Object>) firstChoice.get("message");
                    return (String) messageObj.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("OpenAI API Error: " + e.getMessage());
            return getFallbackResponse(message, null);
        }
        
        return "I'm having trouble connecting to AI services. Please try again.";
    }
    
    private String getFallbackResponse(String message, User user) {
        List<Policy> allPolicies = policyRepository.findByStatus(PolicyStatus.ACTIVE);
        return generateIntelligentResponse(message.toLowerCase(), allPolicies, user);
    }
    
    private String generateIntelligentResponse(String message, List<Policy> policies, User user) {
        String msg = message.toLowerCase();
        
        // Agents Information - Check first
        if (msg.contains("agent") || msg.contains("available") || msg.contains("portal")) {
            return generateAgentInformation();
        }
        
        // Detect intent from any natural language question
        if (message.matches(".*(compare|comparison|difference|vs|versus|better|which.*better|can you compare).*") ||
            (message.contains("health") && message.contains("vehicle")) ||
            (message.contains("health") && message.contains("life")) ||
            (message.contains("vehicle") && message.contains("life"))) {
            return generatePolicyComparison(policies, message);
        }
        
        // Greetings
        if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey")) {
            return String.format("Hello! I'm your InsurAI assistant. We have %d active policies available. How can I help you today?", policies.size());
        }
        
        // Policies and Insurance
        if (msg.contains("policies") || msg.contains("insurance") || msg.contains("available") || msg.contains("types") || msg.contains("plans")) {
            return String.format("We offer %d insurance policies including Health, Vehicle, and Life insurance. You can browse policies, apply for coverage, or schedule appointments with our agents. What interests you?", policies.size());
        }
        
        // Health Insurance
        if (msg.contains("health") || msg.contains("medical") || msg.contains("hospital")) {
            return "Our health insurance policies cover medical expenses, hospitalization, surgeries, and preventive care. Coverage ranges from ₹5,00,000 to ₹25,00,000. Would you like to see available health plans?";
        }
        
        // Vehicle Insurance
        if (msg.contains("vehicle") || msg.contains("car") || msg.contains("bike") || msg.contains("auto")) {
            return "Our vehicle insurance covers cars, bikes, and commercial vehicles. We offer comprehensive coverage including third-party liability, own damage, and theft protection. Interested in getting a quote?";
        }
        
        // Life Insurance
        if (msg.contains("life") || msg.contains("term")) {
            return "Our life insurance policies provide financial security for your family. We offer term life, whole life, and endowment plans with coverage up to ₹1 crore. Would you like to know more about our life insurance options?";
        }
        
        // Appointments
        if (msg.contains("appointment") || msg.contains("schedule") || msg.contains("meeting") || msg.contains("book")) {
            return "I can help you schedule an appointment with one of our insurance agents. You can book appointments for policy consultations, claim processing, or general inquiries. Would you like to see available time slots?";
        }
        
        // Claims
        if (msg.contains("claim") || msg.contains("file") || msg.contains("submit")) {
            return "To file an insurance claim, you'll need your policy number and relevant documents. The process typically takes 7-14 days. I can guide you through the claims process. Do you have an active policy you'd like to file a claim for?";
        }
        
        // Premium and Pricing
        if (msg.contains("premium") || msg.contains("price") || msg.contains("cost") || msg.contains("how much")) {
            return "Insurance premiums vary based on coverage type, age, and risk factors. Health insurance starts from ₹5,000/year, Vehicle from ₹3,000/year, and Life insurance from ₹8,000/year. Would you like a personalized quote?";
        }
        
        // Applications
        if (msg.contains("apply") || msg.contains("application") || msg.contains("how to")) {
            return "To apply for insurance, you can browse our policies, select one that suits your needs, and fill out the application form. You'll need identity proof, address proof, and relevant documents. Shall I guide you through the application process?";
        }
        
        // Documents
        if (msg.contains("document") || msg.contains("papers") || msg.contains("required")) {
            return "Required documents typically include: ID proof (Aadhaar/PAN), address proof, income proof, medical reports (for health insurance), and vehicle registration (for auto insurance). What type of policy are you interested in?";
        }
        
        // Benefits
        if (msg.contains("benefit") || msg.contains("coverage") || msg.contains("what does")) {
            return "Our insurance policies offer comprehensive benefits including cashless treatment, 24/7 claim support, nationwide network, tax benefits under Section 80C/80D, and quick claim settlement. Which policy benefits interest you most?";
        }
        

        
        // Contact and Support
        if (msg.contains("contact") || msg.contains("phone") || msg.contains("email") || msg.contains("support")) {
            return "You can reach our support team 24/7. I'm here to assist you with: 📋 Browsing policies, 📝 Filing applications, 📅 Scheduling appointments, 💬 Answering questions, and 📞 Connecting you with agents. What would you like to do?";
        }
        
        // Age and Eligibility
        if (msg.contains("age") || msg.contains("eligible") || msg.contains("qualify")) {
            return "Eligibility varies by policy type. Health insurance: 18-65 years, Vehicle insurance: Valid license holders, Life insurance: 18-60 years. Pre-existing conditions and other factors may apply. Would you like to check eligibility for a specific policy?";
        }
        
        // Renewal
        if (msg.contains("renew") || msg.contains("renewal") || msg.contains("expire")) {
            return "Policy renewal is easy! You can renew online or through our agents. We send renewal reminders 30 days before expiry. Continuous coverage ensures no waiting periods. Need help with renewal?";
        }
        
        // Policy Comparison
        if (msg.contains("compare") || msg.contains("difference") || msg.contains("vs") || msg.contains("better") || 
            (msg.contains("can you") && (msg.contains("health") || msg.contains("vehicle") || msg.contains("life"))) ||
            (msg.contains("which") && msg.contains("policy"))) {
            return generatePolicyComparison(policies, msg);
        }
        
        // General questions
        if (msg.contains("what") || msg.contains("how") || msg.contains("why") || msg.contains("when") || msg.contains("?")) {
            return "I'm here to help with all your insurance questions! I can assist with policy information, applications, claims, appointments, and general insurance guidance. Could you be more specific about what you'd like to know?";
        }
        
        // Smart default response - analyze the question
        return generateSmartResponse(message, policies);
    }
    
    private String generateSmartResponse(String message, List<Policy> policies) {
        // Extract key topics from the question
        StringBuilder response = new StringBuilder();
        
        if (message.contains("?")) {
            response.append("Great question! ");
        }
        
        response.append("I'm your InsurAI assistant with access to ").append(policies.size()).append(" insurance policies. ");
        
        // Suggest relevant topics based on the question
        if (message.matches(".*(what|how|when|where|why|can|should|will).*")) {
            response.append("\n\nI can help you with:\n");
            response.append("• 📋 Policy information and comparisons\n");
            response.append("• 💰 Premium costs and quotes\n");
            response.append("• 📅 Agent appointments and scheduling\n");
            response.append("• 📝 Claims filing and processing\n");
            response.append("• 📄 Application requirements and steps\n");
            response.append("• 👥 Available agents and contact info\n\n");
            response.append("Could you be more specific about what you'd like to know?");
        } else {
            response.append("Feel free to ask me anything about insurance! I'm here to help 24/7.");
        }
        
        return response.toString();
    }
    
    private String generatePolicyComparison(List<Policy> policies, String message) {
        if (policies.isEmpty()) {
            return "No policies available for comparison at the moment. Please check back later.";
        }
        
        StringBuilder comparison = new StringBuilder("📊 **Policy Comparison Overview:**\n\n");
        
        // Group policies by type
        Map<String, List<Policy>> policyGroups = policies.stream()
            .collect(java.util.stream.Collectors.groupingBy(Policy::getPolicyType));
        
        for (Map.Entry<String, List<Policy>> entry : policyGroups.entrySet()) {
            String type = entry.getKey();
            List<Policy> typePolicies = entry.getValue();
            
            comparison.append(String.format("**%s Insurance (%d policies):**\n", type, typePolicies.size()));
            
            for (Policy policy : typePolicies.subList(0, Math.min(3, typePolicies.size()))) {
                comparison.append(String.format(
                    "• %s - Premium: ₹%,.0f, Coverage: %s\n",
                    policy.getPolicyName(),
                    policy.getPremium().doubleValue(),
                    policy.getCoverage() != null ? policy.getCoverage() : "Standard Coverage"
                ));
            }
            comparison.append("\n");
        }
        
        comparison.append("💡 **Key Differences:**\n");
        comparison.append("• Premium amounts vary based on coverage and risk\n");
        comparison.append("• Coverage limits differ by policy type\n");
        comparison.append("• Benefits and exclusions vary\n");
        comparison.append("• Claim settlement processes may differ\n\n");
        
        comparison.append("Would you like detailed comparison of specific policies? Ask me about 'health vs life insurance' or 'compare vehicle policies'!");
        
        return comparison.toString();
    }
    
    private String generateAgentInformation() {
        try {
            List<User> agents = userRepository.findByRole(Role.AGENT);
            
            if (agents.isEmpty()) {
                return "Currently, no agents are available in our system. Please check back later or contact our support team.";
            }
            
            StringBuilder agentInfo = new StringBuilder();
            agentInfo.append("👥 Available Insurance Agents\n");
            agentInfo.append("=".repeat(35)).append("\n\n");
            
            for (int i = 0; i < Math.min(agents.size(), 5); i++) {
                User agent = agents.get(i);
                agentInfo.append(String.format(
                    "👨‍💼 Agent %d: %s\n" +
                    "   📧 Email: %s\n" +
                    "   🔄 Status: %s\n" +
                    "   💼 Specialization: Insurance Consultant\n\n",
                    i + 1,
                    agent.getFullName(),
                    agent.getEmail(),
                    agent.isActive() ? "✅ Active & Available" : "❌ Currently Inactive"
                ));
            }
            
            if (agents.size() > 5) {
                agentInfo.append(String.format("📈 Total: %d agents available (%d more not shown)\n\n", 
                    agents.size(), agents.size() - 5));
            } else {
                agentInfo.append(String.format("📈 Total: %d agent%s available\n\n", 
                    agents.size(), agents.size() == 1 ? "" : "s"));
            }
            
            agentInfo.append("📅 How to Book an Appointment:\n");
            agentInfo.append("-".repeat(30)).append("\n");
            agentInfo.append("1️⃣ Go to Appointment Scheduling\n");
            agentInfo.append("2️⃣ Choose your preferred date & time\n");
            agentInfo.append("3️⃣ Select an available agent\n");
            agentInfo.append("4️⃣ Confirm your booking\n\n");
            
            agentInfo.append("💬 Need help? Ask me: 'schedule appointment' or 'book meeting'\n");
            agentInfo.append("🕰️ Available 24/7 for your insurance needs!");
            
            return agentInfo.toString();
            
        } catch (Exception e) {
            return "⚠️ Sorry, I'm having trouble retrieving agent information right now.\n\nPlease try again in a moment or contact our support team for immediate assistance.";
        }
    }
}