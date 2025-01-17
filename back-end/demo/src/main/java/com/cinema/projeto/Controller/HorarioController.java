package com.cinema.projeto.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    public ResponseEntity<String> criarHorario(@RequestBody HorarioDTO horarioDTO) {
        // Buscar o filme pelo ID
        Filme filme = filmeRepository.findById(horarioDTO.getIdFilme())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme não encontrado"));

        // Buscar o cinema pelo ID
        Cinema cinema = cinemaRepository.findById(horarioDTO.getIdCinema())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cinema não encontrado"));

        // Criar o objeto Horário
        Horario horario = new Horario(null,horarioDTO.getHorario(), filme, cinema);

        // Salvar o horário no banco de dados
        horarioRepository.save(horario);

        // Retornar uma resposta de sucesso
        return ResponseEntity.status(HttpStatus.CREATED).body("Horário criado com sucesso!");
    }
}
