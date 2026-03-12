package com.taskmanagement.auth.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.taskmanagement.auth.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtFilter;
	private final AuthenticationProvider authenticationProvider;


	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) {
		http
		.csrf(AbstractHttpConfigurer::disable)
		
		.cors(cors -> {})
		
		.sessionManagement(session -> 
		session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		)
		
		.authorizeHttpRequests(request -> request
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/api/tasks/**").hasRole("USER")
				.anyRequest()
				.authenticated()
				)
		
		.authenticationProvider(authenticationProvider)
		
		.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
}
