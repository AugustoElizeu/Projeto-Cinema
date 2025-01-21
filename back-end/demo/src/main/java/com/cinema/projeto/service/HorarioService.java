package com.cinema.projeto.service;

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

	    /**
	     * Buscar horários com base no ID do filme e do cinema.
	     * 
	     * @param idFilme ID do filme.
	     * @param idCinema ID do cinema.
	     * @return Lista de horários associados ao filme e cinema.
	     */
	    public List<HorarioDTO> buscarHorariosPorFilmeECinema(Long idFilme, Long idCinema) {
	        // Recupera o Filme e Cinema do banco de dados
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

	        // Recupera a lista de horários para o filme e cinema
	        List<Horario> horarios = horarioRepository.findByFilmesAndCinemas(filme, cinema);

	        // Mapeia os horários para um DTO (Data Transfer Object) com os detalhes necessários, incluindo o ID do horário
	        return horarios.stream()
	                .map(horario -> new HorarioDTO(
	                        horario.getId(),  // ID do horário
	                        horario.getHorario(),  // Horário
	                        horario.getFilmes().getFilmesId(),  // ID do Filme
	                        horario.getCinemas().getCinemaId()  // ID do Cinema
	                ))
	                .collect(Collectors.toList());
	    }

	    /**
	     * Salvar novos horários para um filme e cinema.
	     * 
	     * @param idFilme ID do filme.
	     * @param idCinema ID do cinema.
	     * @param horarios Lista de horários (Strings) a serem salvos.
	     */
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

	    /**
	     * Atualizar os horários para um filme e cinema.
	     * Este método apaga os horários antigos e salva os novos.
	     * 
	     * @param idFilme ID do filme.
	     * @param idCinema ID do cinema.
	     * @param horarios Lista de horários (Strings) a serem salvos.
	     */
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

	    /**
	     * Deletar um horário específico pelo seu ID.
	     * 
	     * @param idHorario ID do horário a ser deletado.
	     */
	    public void deletarHorario(Long idHorario) {
	        Optional<Horario> horarioOptional = horarioRepository.findById(idHorario);  // Agora buscamos pelo id do horário

	        if (horarioOptional.isPresent()) {
	            horarioRepository.delete(horarioOptional.get());  // Deleta o horário encontrado
	        } else {
	            // Lógica caso o horário não seja encontrado (por exemplo, lançar uma exceção ou apenas retornar)
	            throw new RuntimeException("Horário não encontrado para o ID: " + idHorario);
	        }
	    }
}
