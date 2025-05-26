package com.fitness.ai_service.service;

import ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.ai_service.model.Activity;
import com.fitness.ai_service.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public Recommendation generateRecommendations(Activity activity){
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("Response form AI: {}", aiResponse);
        return processAIResponse(activity, aiResponse);
    }

    private Recommendation processAIResponse(Activity activity, String aiResponse){
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

//            log.info("PARSED RESPONSE FORM AI {}", jsonContent);
            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");
            StringBuilder fulLAnalysis = new StringBuilder();
            addAnalysisSection(fulLAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fulLAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fulLAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fulLAnalysis, analysisNode, "caloriesBurnt", "Calories Burnt:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafety(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fulLAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        }catch (Exception e){
            e.printStackTrace();
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .createdAt(LocalDateTime.now())
                .build();

    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safeties = new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(
                    safety -> {
                        safeties.add(safety.asText());
                    }
            );
        }
        return safeties.isEmpty()?
                Collections.singletonList("Follow general safety guidlines") :
                safeties;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(
                    suggestion -> {
                        String workout = suggestion.path("workout").asText();
                        String description = suggestion.path("description").asText();
                        suggestions.add(String.format("%s: %s", workout, description));
                    }
            );
        }
        return suggestions.isEmpty()?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(
                    improvement -> {
                        String area = improvement.path("area").asText();
                        String detail = improvement.path("recommendation").asText();
                        improvements.add(String.format("%s: %s", area, detail));
                    }
            );
        }
        return improvements.isEmpty()?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fulLAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()) {
            fulLAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }


    private String createPromptForActivity(Activity activity){
        return String.format("""
                Analyse this fitness activity and provide detailed recommendations in the following EXACT JSON format
                {
                    "analysis" : {
                        "overall" : "Overall analysis here",
                        "pace" : "Pace analysis here",
                        "heartRate" : "Heart rate analysis here",
                        "caloriesBurned" : "Calories analysis here"
                    },
                    improvements : [
                        {
                            "area" : "Area name",
                            "recommendation" : "Detailed recommendation"
                        }
                    ],
                    "suggestions" : [
                        {
                            "workout" : "Workout name",
                            "description" : "Detailed workout description"
                        }
                    ],
                    "safety" : [
                        "Safety point 1",
                        "Safety point 2"
                    ]
                }
                
                Analyse this activity:
                Activity type: %s
                Duration: %d
                Calories Burnt: %d
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements, next
                Ensure the response follows the EXACT JSON format shown above.
                """,

                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurnt(),
                activity.getAdditionalMetrics()

                );
    }
}
