package com.cinema.projeto;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.CinemaRepository;
import com.cinema.projeto.Repositories.FilmeRepository;
import com.cinema.projeto.Repositories.HorarioRepository;

@SpringBootApplication
public class CinemaApplication implements CommandLineRunner {
	
	@Autowired
	private FilmeRepository filmeRepository;
	
	@Autowired
	private HorarioRepository horarioRepository;
	
	@Autowired
	private CinemaRepository cinemaRepository;
	
	
	public static void main(String[] args) {
		SpringApplication.run(CinemaApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
	    // Criando um novo usuário
	   Filme novoFilme = new Filme(null, "Batman", "https://i0.wp.com/cloud.estacaonerd.com/wp-content/uploads/2022/01/24181944/Batman-682x1024.jpg?resize=682%2C1024&ssl=1","https://pbs.twimg.com/media/FBwJWeQXIAItfyH.jpg:large","Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues. As the scale of the perpetrator's plans become clear, he must bring justice to the abuse of power and corruption that plagues the metropolis.", 18, "Ação", "31/12/2024", "Not defined");
	    Filme novoFilme2 = new Filme(null, "Blueman", "https://thehiddensouth.com/cdn/shop/files/Resize_20240923_153417_7594.jpg?v=1727261093","https://www.blueman.com/-/media/bmg/images/casting/video-thumbnail/video_thumbnail_blueman.jpg?db=web&h=407&vs=2&w=720&hash=2EF0CC0A9984AE918326D6557634E6C2","É um filme de comédia", 18, "Ação", "31/12/2024", "Not defined");
	    Cinema novoCinema = new Cinema(null, "Cineplex cinema", "Cineplex Cinemas Ltda", "12.345.678/0001-99", "https://play-lh.googleusercontent.com/4-TQTNX802eClPmKSyUZEWFF7OOfmWlOVjwCdCqInp1NxNjpR5VT2mYmF128I3vxs3Q=w240-h480-rw",  "https://www.bpmcdn.com/f/files/shared/feeds/gps/2023/10/web1_230728-lat-ke-cineplexcheapmovies-_1.jpg", true,30.0);
	    Cinema novoCinema2 = new Cinema(null, "Kinoplex cinema", "Cineplex Cinemas Ltda", "12.345.678/0001-99", "https://play-lh.googleusercontent.com/4-TQTNX802eClPmKSyUZEWFF7OOfmWlOVjwCdCqInp1NxNjpR5VT2mYmF128I3vxs3Q=w240-h480-rw",  "https://www.bpmcdn.com/f/files/shared/feeds/gps/2023/10/web1_230728-lat-ke-cineplexcheapmovies-_1.jpg", true,30.0);
	    Horario novoHorario = new Horario(null,"15:00",LocalDate.of(2025, 2, 9),novoFilme, novoCinema);
	    Horario novoHorario3 = new Horario(null,"17:00",LocalDate.of(2025, 2, 9),novoFilme, novoCinema);
	    Horario novoHorario1 = new Horario(null,"18:30",LocalDate.of(2025, 2, 9),novoFilme, novoCinema2);
	    Horario novoHorario2 = new Horario(null,"21:00",LocalDate.of(2025, 2, 9),novoFilme2, novoCinema);
	    Horario novoHorario4 = new Horario(null,"17:00",LocalDate.of(2025, 2, 9),novoFilme2, novoCinema);
	    // Salvando o usuário no banco de dados
	    filmeRepository.save(novoFilme);
	    filmeRepository.save(novoFilme2);
	    cinemaRepository.save(novoCinema);
	    cinemaRepository.save(novoCinema2);
	    horarioRepository.save(novoHorario);
	    horarioRepository.save(novoHorario1);
	    horarioRepository.save(novoHorario4);
	    horarioRepository.save(novoHorario2);
	    horarioRepository.save(novoHorario3);
	}
}
