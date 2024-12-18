package com.cinema.projeto.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Repositories.CinemaRepository;


@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CinemaController {

    private final CinemaRepository cineRepository;

    public CinemaController(CinemaRepository cineRepository) {
        this.cineRepository = cineRepository;
    }

    @GetMapping
    public List<Cinema> list() {
        return cineRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cinema> findById(@PathVariable Long id) {
        return cineRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/criarfilme")
    public ResponseEntity<Cinema> create(@RequestBody Cinema cinema) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cineRepository.save(cinema));
    }
}
