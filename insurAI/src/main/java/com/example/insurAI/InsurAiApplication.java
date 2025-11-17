package com.example.insurAI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class InsurAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(InsurAiApplication.class, args);
	}

}
