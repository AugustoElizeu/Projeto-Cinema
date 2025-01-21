package com.cinema.projeto.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.projeto.DTO.HorarioDTO;
import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.CinemaRepository;
import com.cinema.projeto.Repositories.FilmeRepository;
import com.cinema.projeto.Repositories.HorarioRepository;
import com.cinema.projeto.service.HorarioService;


@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HorarioController {

	@Autowired
    private FilmeRepository filmeRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private HorarioRepository horarioRepository;
    
    @Autowired
    private HorarioService horarioService;

    public HorarioController(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    @GetMapping
    public List<Horario> list() {
        return horarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> findById(@PathVariable Long id) {
        return horarioRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/criar")
    public ResponseEntity<String> criarHorarios(@RequestBody List<HorarioDTO> horariosDTO) {
        try {
            // Iterar sobre os horários enviados no corpo da requisição
            for (HorarioDTO horarioDTO : horariosDTO) {
                // Buscar o filme pelo ID
                Filme filme = filmeRepository.findById(horarioDTO.getIdFilme())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme não encontrado"));

                // Buscar o cinema pelo ID
                Cinema cinema = cinemaRepository.findById(horarioDTO.getIdCinema())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cinema não encontrado"));

                // Criar o objeto Horário
                Horario horario = new Horario(null, horarioDTO.getHorario(), filme, cinema);

                // Salvar o horário no banco de dados
                horarioRepository.save(horario);
            }

            // Retornar uma resposta de sucesso;
            return ResponseEntity.status(HttpStatus.CREATED).body("Horários criados com sucesso!");

        } catch (Exception e) {
            // Se ocorrer algum erro, capturar e retornar uma mensagem de erro
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao criar os horários: " + e.getMessage());
        }
    }
    
    @PostMapping("/filme/{idFilme}/cinema/{idCinema}")
    public ResponseEntity<String> salvarHorarios(@PathVariable Long idFilme, @PathVariable Long idCinema, @RequestBody List<String> horarios) {
        try {
            horarioService.salvarHorarios(idFilme, idCinema, horarios);
            return ResponseEntity.ok("Horários salvos com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao salvar horários.");
        }
    }
    
    @GetMapping("/filme/{idFilme}/cinema/{idCinema}")
    public List<HorarioDTO> buscarHorariosPorFilmeECinema(@PathVariable Long idFilme, @PathVariable Long idCinema) {
        // Recupera o filme e o cinema pelo ID, lançando exceção caso não encontrado
        Filme filme = filmeRepository.findById(idFilme)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        Cinema cinema = cinemaRepository.findById(idCinema)
                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

        // Recupera a lista de horários para o filme e cinema
        List<Horario> horarios = horarioRepository.findByFilmesAndCinemas(filme, cinema);

        // Mapeia os horários para DTO
        List<HorarioDTO> horariosDTO = new ArrayList<>();

        for (Horario horario : horarios) {
            // Converte o horário para DTO
            HorarioDTO dto = new HorarioDTO(
                horario.getId(),                      // ID do horário
                horario.getHorario(),                 // Horário do filme
                horario.getFilmes().getFilmesId(),          // ID do filme associado
                horario.getCinemas().getCinemaId()          // ID do cinema associado
            );
            horariosDTO.add(dto);
        }

        return horariosDTO;  // Retorna a lista de DTOs
    }
    @DeleteMapping("/deletarHorario/filme/{idFilme}/cinema/{idCinema}/horario/{idHorario}")
    public ResponseEntity<String> deletarHorario(@PathVariable Long idFilme, 
                                                  @PathVariable Long idCinema, 
                                                  @PathVariable Long idHorario) {
        // Verifica se o filme existe
        Filme filme = filmeRepository.findById(idFilme)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        // Verifica se o cinema existe
        Cinema cinema = cinemaRepository.findById(idCinema)
                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

        // Verifica se o horário existe e pertence ao filme e cinema especificados
        Horario horario = horarioRepository.findByIdAndFilmesAndCinemas(idHorario, filme, cinema)
                .orElseThrow(() -> new RuntimeException("Horário não encontrado"));

        // Deleta o horário
        horarioRepository.delete(horario);

        return ResponseEntity.ok("Horário deletado com sucesso!");
    }
}
