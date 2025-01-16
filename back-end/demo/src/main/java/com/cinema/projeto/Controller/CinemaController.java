package com.cinema.projeto.Controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/criarcinema")
    public ResponseEntity<Cinema> criarCinema(
            @RequestParam("nomeFantasia") String nomeFantasia,
            @RequestParam("razaoSocial") String razaoSocial,
            @RequestParam("cnpj") String cnpj,
            @RequestParam("habilidado") Boolean habilidado,
            @RequestParam("urlCineIcon") MultipartFile urlCineIcon,
            @RequestParam("urlCineBanner") MultipartFile urlCineBanner) {

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
            cinema.setHabilidado(habilidado);
            cinema.setUrlCineIcon(urlCompletaIcone);
            cinema.setUrlCineBanner(urlCompletaBanner);

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
}
