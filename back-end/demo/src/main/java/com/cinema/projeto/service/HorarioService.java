package com.cinema.projeto.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.projeto.DTO.HorarioDTO;
import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.CinemaRepository;
import com.cinema.projeto.Repositories.FilmeRepository;
import com.cinema.projeto.Repositories.HorarioRepository;

@Service
public class HorarioService {

	  @Autowired
	    private HorarioRepository horarioRepository;

	    @Autowired
	    private FilmeRepository filmeRepository;

	    @Autowired
	    private CinemaRepository cinemaRepository;

	    public List<HorarioDTO> buscarHorariosPorFilmeECinema(Long idFilme, Long idCinema) {
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

	        // Supondo que o HorarioRepository esteja corretamente implementado
	        List<Horario> horarios = horarioRepository.findByFilmesAndCinemas(filme, cinema);

	        // Agora usamos o construtor que você tem (String, Long, Long)
	        return horarios.stream()
	                .map(horario -> new HorarioDTO(
	                    horario.getHorario(),  // Aqui você passa o horário específico
	                    horario.getFilmes().getFilmesId(),  // Passa o ID do Filme
	                    horario.getCinemas().getCinemaId()  // Passa o ID do Cinema
	                ))
	                .collect(Collectors.toList());
	    }
	    
	    public void salvarHorarios(Long idFilme, Long idCinema, List<String> horarios) {
	        // Busca o filme e o cinema pelo ID
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado com id " + idFilme));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado com id " + idCinema));

	        // Cria e salva os novos horários
	        for (String horarioString : horarios) {
	            Horario horario = new Horario();
	            horario.setHorario(horarioString); // Assumindo que "horario" é uma String (hora)
	            horario.setFilmes(filme);
	            horario.setCinemas(cinema);

	            horarioRepository.save(horario);
	        }
	    }
	    
	    public void atualizarHorarios(Long idFilme, Long idCinema, List<String> horarios) {
	        // Busca o filme e o cinema pelo ID
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado com id " + idFilme));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado com id " + idCinema));

	        // Remove os horários existentes para o filme e cinema
	        List<Horario> horariosExistentes = horarioRepository.findByFilmesAndCinemas(filme, cinema);
	        horarioRepository.deleteAll(horariosExistentes);  // Remove todos os horários antigos

	        // Cria e salva os novos horários
	        for (String horarioString : horarios) {
	            Horario horario = new Horario();
	            horario.setHorario(horarioString); // Assumindo que "horario" é uma String (hora)
	            horario.setFilmes(filme);
	            horario.setCinemas(cinema);

	            horarioRepository.save(horario);  // Salva o novo horário
	        }
	    }
	  
}
