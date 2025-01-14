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

import com.cinema.projeto.Models.DadosCartao;
import com.cinema.projeto.Repositories.DadosCartaoRepository;
import com.cinema.projeto.service.DadosCartaoService;

@RestController
@RequestMapping("/api/dadosCartao")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class DadosCartaoController {
    
    private final DadosCartaoRepository dsRepository;
    private final DadosCartaoService dadosCartaoService; // Injeção do serviço
    
    public DadosCartaoController(DadosCartaoRepository dsRepository, DadosCartaoService dadosCartaoService) {
        this.dsRepository = dsRepository;
        this.dadosCartaoService = dadosCartaoService; // Inicializando o serviço
    }

    @GetMapping
    public List<DadosCartao> list() {
        return dsRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosCartao> findById(@PathVariable Long id) {
        return dsRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/criarDadosCartao")
    public ResponseEntity<DadosCartao> create(@RequestBody DadosCartao dadosCartao) {
        try {
            // Chamando o serviço para salvar os dados do cartão
            DadosCartao novoCartao = dadosCartaoService.create(dadosCartao);
            return new ResponseEntity<>(novoCartao, HttpStatus.CREATED);
        } catch (Exception e) {
            // Caso ocorra um erro, retorna erro de criação
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}

