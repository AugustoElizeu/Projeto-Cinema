package com.cinema.projeto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Repositories.FilmeRepository;

@SpringBootApplication
public class CinemaApplication implements CommandLineRunner {
	
	@Autowired
	private FilmeRepository filmeRepository;
	
	public static void main(String[] args) {
		SpringApplication.run(CinemaApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
	    // Criando um novo usuário
	    Filme novoFilme = new Filme(null, "Batman", "https://i0.wp.com/cloud.estacaonerd.com/wp-content/uploads/2022/01/24181944/Batman-682x1024.jpg?resize=682%2C1024&ssl=1","https://pbs.twimg.com/media/FBwJWeQXIAItfyH.jpg:large","Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the scale of the perpetrator's plans become clear, he must bring justice to the abuse of power and corruption that plagues the metropolis.", 18, "Ação", "31/12/2024", "Not defined");

	    // Salvando o usuário no banco de dados
	    filmeRepository.save(novoFilme);
	    
	}
}
