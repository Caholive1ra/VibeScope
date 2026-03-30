package com.vibescope.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas
                .allowedOrigins("*") // Permite requisições de qualquer frontend (ex: Vercel)
                .allowedMethods("*") // Permite todos os métodos HTTP
                .allowedHeaders("*");
    }
}