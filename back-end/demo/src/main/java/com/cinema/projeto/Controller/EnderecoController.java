package com.cinema.projeto.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.projeto.DTO.EnderecoDTO;
import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Endereco;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.CinemaRepository;
import com.cinema.projeto.Repositories.EnderecoRepository;

@RestController
@RequestMapping("/api/endereco")
public class EnderecoController {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    // Rota para listar todos os cinemas com seus respectivos endereços
    @GetMapping("/cinemas")
    public ResponseEntity<List<Cinema>> listarCinemas() {
        try {
            List<Cinema> cinemas = cinemaRepository.findAll();
            if (cinemas.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(cinemas, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public List<Endereco> list() {
        return enderecoRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Endereco> findById(@PathVariable Long id) {
        return enderecoRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/criarEndereco")
    public ResponseEntity<String> criarEndereco(@RequestBody EnderecoDTO enderecoDTO) {
        try {
            // Verifique se o cinema existe
            Cinema cinema = cinemaRepository.findById(enderecoDTO.getIdCienama())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cinema não encontrado"));

            // Criar o endereço e associar ao cinema
            Endereco endereco = new Endereco(
                    null,
                    enderecoDTO.getCep(),
                    enderecoDTO.getLogradouro(),
                    enderecoDTO.getNumero(),
                    enderecoDTO.getComplemento(),
                    enderecoDTO.getBairro(),
                    enderecoDTO.getCidade(),
                    enderecoDTO.getUf(),
                    cinema
            );

            // Salvar o endereço no banco
            enderecoRepository.save(endereco);

            return ResponseEntity.status(HttpStatus.CREATED).body("Endereço criado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao criar endereço: " + e.getMessage());
        }
    }
}
