package com.cinema.projeto.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.HorarioRepository;


@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HorarioController {

    private final HorarioRepository horarioRepository;

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
}
