package com.cinema.projeto.Controller;

import com.cinema.projeto.Models.Endereco;
import com.cinema.projeto.Repositories.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/endereco")
public class EnderecoController {

    @Autowired
    private EnderecoRepository enderecoRepository;

    // Rota para criar um novo endereço com o nome específico "criarEndereco"
    @PostMapping("/criarEndereco")
    public ResponseEntity<Endereco> criarEndereco(@RequestBody Endereco endereco) {
        try {
            Endereco novoEndereco = enderecoRepository.save(endereco);
            return new ResponseEntity<>(novoEndereco, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Rota para buscar um endereço por ID
    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarEnderecoPorId(@PathVariable("id") Long id) {
        Endereco endereco = enderecoRepository.findById(id).orElse(null);
        if (endereco != null) {
            return new ResponseEntity<>(endereco, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
