package com.cinema.projeto.Controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cinema.projeto.DTO.CinemasNameDTO;
import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.CinemaRepository;
import com.cinema.projeto.Repositories.HorarioRepository;


@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CinemaController {

    private final CinemaRepository cineRepository;
    private final HorarioRepository horarioRepository;


    public CinemaController(CinemaRepository cineRepository, HorarioRepository horarioRepository) {
        this.cineRepository = cineRepository;
        this.horarioRepository = horarioRepository;
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
    
    @GetMapping("/shortcinemas")
    public List<CinemasNameDTO> listarCinemas() {
        List<Cinema> cinemas = cineRepository.findAll();
        return cinemas.stream()
                      .map(c -> new CinemasNameDTO(c.getCinemaId(), c.getNomeFantasia()))  // Converte Cinema para DTO
                      .collect(Collectors.toList());
    }

    @PostMapping("/criarcinema")
    public ResponseEntity<Cinema> criarCinema(
            @RequestParam("nomeFantasia") String nomeFantasia,
            @RequestParam("razaoSocial") String razaoSocial,
            @RequestParam("cnpj") String cnpj,
            @RequestParam("habilidado") Boolean habilitado,
            @RequestParam("urlCineIcon") MultipartFile urlCineIcon,
            @RequestParam("urlCineBanner") MultipartFile urlCineBanner,
            @RequestParam("valorIngresso") Double valorIngresso) {

        try {
            // Verifica se os arquivos foram enviados
            if (urlCineIcon.isEmpty() || urlCineBanner.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Salvar os arquivos e obter os nomes dos arquivos
            String nomeIconeCinema = salvarArquivo(urlCineIcon);
            String nomeBannerCinema = salvarArquivo(urlCineBanner);

            // Criar a URL completa para salvar no banco de dados
            String urlCompletaIcone = "http://localhost:8080/imagens/cinemas/" + nomeIconeCinema;
            String urlCompletaBanner = "http://localhost:8080/imagens/cinemas/" + nomeBannerCinema;

            // Criar o objeto Cinema e salvar no banco de dados
            Cinema cinema = new Cinema();
            cinema.setNomeFantasia(nomeFantasia);
            cinema.setRazaoSocial(razaoSocial);
            cinema.setCnpj(cnpj);
            cinema.setHabilitado(habilitado);
            cinema.setUrlCineIcon(urlCompletaIcone);
            cinema.setUrlCineBanner(urlCompletaBanner);
            cinema.setValorIngresso(valorIngresso);

            // Salvar no banco de dados
            cineRepository.save(cinema);

            return ResponseEntity.status(HttpStatus.CREATED).body(cinema);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public String salvarArquivo(MultipartFile arquivo) throws IOException {
        // Caminho para o diretório onde você quer salvar as imagens (C:/imagens/cinemas)
        Path diretorioDestino = Paths.get("C:/imagens/cinemas");

        // Criação do diretório se ele não existir
        if (!Files.exists(diretorioDestino)) {
            Files.createDirectories(diretorioDestino);
        }

        // Gerando um nome único para o arquivo
        String nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();

        // Caminho completo do arquivo de destino
        Path caminhoDestino = diretorioDestino.resolve(nomeArquivo);

        // Verifica se o arquivo já existe
        if (Files.exists(caminhoDestino)) {
            // Se o arquivo já existe, cria um novo nome
            nomeArquivo = UUID.randomUUID().toString() + "_" + arquivo.getOriginalFilename();
            caminhoDestino = diretorioDestino.resolve(nomeArquivo);
        }

        // Salva o arquivo no diretório de destino
        try (InputStream inputStream = arquivo.getInputStream()) {
            Files.copy(inputStream, caminhoDestino, StandardCopyOption.REPLACE_EXISTING);
        }

        // Retorna o nome do arquivo salvo para ser salvo no banco de dados
        return nomeArquivo;
    }
    
    @PutMapping("/atualizarcinema/{id}")
    public ResponseEntity<Cinema> atualizarCinema(
    		 @PathVariable("id") Long id,
    	        @RequestParam("nomeFantasia") String nomeFantasia,
    	        @RequestParam("razaoSocial") String razaoSocial,
    	        @RequestParam("cnpj") String cnpj,
    	        @RequestParam(value = "urlCineIcon", required = false) MultipartFile urlCineIcon,
    	        @RequestParam(value = "urlCineBanner", required = false) MultipartFile urlCineBanner,
    	        @RequestParam("habilitado") Boolean habilitado,  // Nome correto
    	        @RequestParam("valorIngresso") Double valorIngresso) {

        try {
            // Tente buscar o cinema pelo ID
            Optional<Cinema> optionalCinema = cineRepository.findById(id);

            if (!optionalCinema.isPresent()) {
                // Se o cinema não for encontrado, retorne um erro 404
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Cinema encontrado
            Cinema cinema = optionalCinema.get();

            // Atualizar os campos do cinema com os dados recebidos
            cinema.setNomeFantasia(nomeFantasia);
            cinema.setRazaoSocial(razaoSocial);
            cinema.setCnpj(cnpj);
            cinema.setHabilitado(habilitado);
            
            // Se a URL do ícone do cinema foi fornecida (caso o usuário tenha enviado uma nova), atualizar a URL
            if (urlCineIcon != null && !urlCineIcon.isEmpty()) {
                String nomeIconeCinema = salvarArquivo(urlCineIcon); // Salva o ícone
                String urlCompletaIcone = "http://localhost:8080/imagens/cinemas/" + nomeIconeCinema;
                cinema.setUrlCineIcon(urlCompletaIcone); // Atualiza com a URL do ícone
            }

            // Se a URL do banner do cinema foi fornecida (caso o usuário tenha enviado uma nova), atualizar a URL
            if (urlCineBanner != null && !urlCineBanner.isEmpty()) {
                String nomeBannerCinema = salvarArquivo(urlCineBanner); // Salva o banner
                String urlCompletaBanner = "http://localhost:8080/imagens/cinemas/" + nomeBannerCinema;
                cinema.setUrlCineBanner(urlCompletaBanner); // Atualiza com a URL do banner
            }
            cinema.setValorIngresso(valorIngresso);
            // Salvar o cinema atualizado no banco de dados
            cineRepository.save(cinema);

            // Retornar a resposta com o cinema atualizado
            return ResponseEntity.status(HttpStatus.OK).body(cinema);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/deletarcinema/{id}")
    public ResponseEntity<String> deleteCinema(@PathVariable("id") Long id) {
        try {
            // Buscar os horários que referenciam o cinema
            List<Horario> horarios = horarioRepository.findByCinemasCinemaId(id); // Aqui buscamos por cinemaId no repositório

            // Se houver horários associados ao cinema, exclua-os
            if (!horarios.isEmpty()) {
                horarioRepository.deleteAll(horarios);
            }

            // Agora excluir o cinema
            Cinema cinema = cineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema não encontrado"));
            cineRepository.delete(cinema);

            return ResponseEntity.ok("Cinema e dependências deletadas com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao deletar o cinema: " + e.getMessage());
        }
    }
}