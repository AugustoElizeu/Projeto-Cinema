package com.cinema.projeto.Controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
            for (HorarioDTO horarioDTO : horariosDTO) {
                Filme filme = filmeRepository.findById(horarioDTO.getIdFilme())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme não encontrado"));

                Cinema cinema = cinemaRepository.findById(horarioDTO.getIdCinema())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cinema não encontrado"));

                Horario horario = new Horario(null, horarioDTO.getHorario(), horarioDTO.getData(), filme, cinema);

                horarioRepository.save(horario);
            }
            return ResponseEntity.status(HttpStatus.CREATED).body("Horários criados com sucesso!");
        } catch (Exception e) {
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

    @GetMapping("/filme/{idFilme}/cinema/{idCinema}/data/{data}")
    public List<HorarioDTO> buscarHorariosPorFilmeECinema(@PathVariable Long idFilme, 
                                                           @PathVariable Long idCinema,
                                                           @PathVariable LocalDate data) {
        Filme filme = filmeRepository.findById(idFilme)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        Cinema cinema = cinemaRepository.findById(idCinema)
                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

        List<Horario> horarios = horarioRepository.findByFilmesAndCinemasAndData(filme, cinema, data);

        List<HorarioDTO> horariosDTO = new ArrayList<>();
        for (Horario horario : horarios) {
            HorarioDTO dto = new HorarioDTO(
                horario.getId(),
                horario.getHorario(),
                horario.getData(),
                horario.getFilmes().getFilmesId(),
                horario.getCinemas().getCinemaId()
            );
            horariosDTO.add(dto);
        }
        return horariosDTO;
    }

    @DeleteMapping("/deletarHorario/filme/{idFilme}/cinema/{idCinema}/horario/{idHorario}/data/{data}")
    public ResponseEntity<String> deletarHorario(@PathVariable Long idFilme, 
                                                  @PathVariable Long idCinema, 
                                                  @PathVariable Long idHorario,
                                                  @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        Filme filme = filmeRepository.findById(idFilme)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

        Cinema cinema = cinemaRepository.findById(idCinema)
                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

        Horario horario = horarioRepository.findByIdAndFilmesAndCinemasAndData(idHorario, filme, cinema, data)
                .orElseThrow(() -> new RuntimeException("Horário não encontrado"));

        horarioRepository.delete(horario);

        return ResponseEntity.ok("Horário deletado com sucesso!");
    }

    @PutMapping("/atualizar/filme/{idFilme}/cinema/{idCinema}/horario/{idHorario}/data/{data}")
    public ResponseEntity<String> atualizarHorario(@PathVariable Long idFilme, 
            @PathVariable Long idCinema, 
            @PathVariable Long idHorario,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestBody HorarioDTO horarioDTO) {
        try {
            // Verifica se o filme existe
            Filme filme = filmeRepository.findById(idFilme)
                    .orElseThrow(() -> new RuntimeException("Filme não encontrado"));

            // Verifica se o cinema existe
            Cinema cinema = cinemaRepository.findById(idCinema)
                    .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));

            // Verifica se o horário existe e pertence ao filme, cinema e data especificados
            Horario horario = horarioRepository.findByIdAndFilmesAndCinemasAndData(idHorario, filme, cinema, data)
                    .orElseThrow(() -> new RuntimeException("Horário não encontrado"));

            // Atualiza o horário e a data com as novas informações do DTO
            horario.setHorario(horarioDTO.getHorario());  // Atualiza o horário
            horario.setData(data);  // Atualiza a data com a data vinda do PathVariable

            // Salva o horário atualizado no banco de dados
            horarioRepository.save(horario);

            return ResponseEntity.ok("Horário atualizado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar o horário: " + e.getMessage());
        }
    }
}
