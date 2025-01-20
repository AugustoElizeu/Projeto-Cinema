package com.cinema.projeto.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

            // Retornar uma resposta de sucesso
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
    public List<HorarioDTO> getHorariosPorFilmeECinema(@PathVariable Long idFilme, @PathVariable Long idCinema) {
        // Chama o serviço para buscar os horários com os IDs fornecidos
        List<HorarioDTO> horarios = horarioService.buscarHorariosPorFilmeECinema(idFilme, idCinema);
        return horarios;
    }
    
    @PutMapping("/filme/{idFilme}/cinema/{idCinema}")
    public ResponseEntity<?> atualizarHorarios(@PathVariable Long idFilme, 
                                               @PathVariable Long idCinema, 
                                               @RequestBody List<String> horarios) {
        try {
            // Chama o serviço para atualizar os horários
            horarioService.atualizarHorarios(idFilme, idCinema, horarios);  // Chama o método atualizado
            
            // Retorna uma resposta de sucesso
            return ResponseEntity.ok("Horários atualizados com sucesso!");
        } catch (RuntimeException e) {
            // Caso ocorra algum erro (como não encontrar filme ou cinema)
            return ResponseEntity.status(400).body("Falha ao atualizar os horários: " + e.getMessage());
        } catch (Exception e) {
            // Caso ocorra um erro inesperado no servidor
            return ResponseEntity.status(500).body("Erro interno do servidor: " + e.getMessage());
        }
    }
    
}
