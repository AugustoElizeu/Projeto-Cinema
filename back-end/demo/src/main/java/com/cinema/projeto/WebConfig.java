package com.cinema.projeto;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Caminho para suas APIs
                .allowedOrigins("http://127.0.0.1:5500") // URL do frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos permitidos
                .allowedHeaders("*"); // Cabeçalhos permitidos
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Para arquivos em /imagens/filmes/*
        registry.addResourceHandler("/imagens/filmes/**")
                .addResourceLocations("file:///C:/imagens/filmes/");

        // Para arquivos em /imagens/cinemas/*
        registry.addResourceHandler("/imagens/cinemas/**")
                .addResourceLocations("file:///C:/imagens/cinemas/");
    }
}