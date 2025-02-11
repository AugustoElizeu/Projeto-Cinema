package com.cinema.projeto.service;

import java.time.LocalDate;
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
	    public List<HorarioDTO> buscarHorariosPorFilmeECinema(Long idFilme, Long idCinema, LocalDate data) {
	        // Recupera o Filme e Cinema do banco de dados
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

	        // Recupera a lista de horários para o filme, cinema e data
	        List<Horario> horarios = horarioRepository.findByFilmesAndCinemasAndData(filme, cinema, data);

	        // Mapeia os horários para um DTO (Data Transfer Object), incluindo o ID do horário, horário, id do filme, id do cinema e data
	        return horarios.stream()
	                .map(horario -> new HorarioDTO(
	                        horario.getId(),  // ID do horário
	                        horario.getHorario(),  // Horário
	                        horario.getData(),  // Data do horário (LocalDate)
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
	    public void atualizarHorarios(Long idFilme, Long idCinema, List<Long> idHorarios, List<String> horarios, LocalDate data) {
	        // Busca o filme e o cinema pelo ID
	        Filme filme = filmeRepository.findById(idFilme)
	                .orElseThrow(() -> new RuntimeException("Filme não encontrado com id " + idFilme));

	        Cinema cinema = cinemaRepository.findById(idCinema)
	                .orElseThrow(() -> new RuntimeException("Cinema não encontrado com id " + idCinema));

	        // Verifica se o número de ids de horários e horários são compatíveis
	        if (idHorarios.size() != horarios.size()) {
	            throw new RuntimeException("O número de idHorarios e horários não coincide.");
	        }

	        // Para cada horário enviado, tenta atualizar ou criar um novo horário
	        for (int i = 0; i < idHorarios.size(); i++) {
	            Long idHorario = idHorarios.get(i);
	            String horarioString = horarios.get(i);

	            // Busca o horário existente
	            Optional<Horario> horarioExistenteOpt = horarioRepository.findById(idHorario);
	            
	            // Se o horário existe, atualiza ele
	            if (horarioExistenteOpt.isPresent()) {
	                Horario horarioExistente = horarioExistenteOpt.get();
	                horarioExistente.setHorario(horarioString); // Atualiza o horário
	                horarioExistente.setData(data); // Atualiza a data
	                horarioRepository.save(horarioExistente);  // Salva a atualização
	            } else {
	                // Caso o horário não exista, cria um novo horário
	                Horario novoHorario = new Horario();
	                novoHorario.setHorario(horarioString);  // Define o novo horário
	                novoHorario.setFilmes(filme);  // Associa o filme
	                novoHorario.setCinemas(cinema);  // Associa o cinema
	                novoHorario.setData(data);  // Define a data
	                horarioRepository.save(novoHorario);  // Salva o novo horário
	            }
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
