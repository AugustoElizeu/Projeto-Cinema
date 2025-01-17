package com.cinema.projeto.Controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

import com.cinema.projeto.DTO.FilmesNameDTO;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Repositories.FilmeRepository;

@RestController
@RequestMapping("/api/filmes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class FilmeController {

    private final FilmeRepository filmeRepository;

    public FilmeController(FilmeRepository filmeRepository) {
        this.filmeRepository = filmeRepository;
    }

    @GetMapping
    public List<Filme> list() {
        return filmeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> findById(@PathVariable Long id) {
        return filmeRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/shortfilmes")
    public List<FilmesNameDTO> listarFilmes() {
        List<Filme> filmes = filmeRepository.findAll();
        return filmes.stream()
                     .map(f -> new FilmesNameDTO(
                            f.getFilmesId(), 
                            f.getNomeFilme(), 
                            f.getUrlMoviePicture(), 
                            f.getUrlBannerPicture(),
                            f.getDescricao(),
                            f.getClassificacao(),
                            f.getGenero(),
                            f.getLançamento(),
                            f.getSaidaCartaz()))  // Converte Filme para FilmesDTO
                     .collect(Collectors.toList());
    }

    @PostMapping("/criarfilme")
    public ResponseEntity<Filme> criarFilme(
            @RequestParam("nomeFilme") String nomeFilme,
            @RequestParam("urlMoviePicture") MultipartFile urlMoviePicture,
            @RequestParam("urlBannerPicture") MultipartFile urlBannerPicture,
            @RequestParam("descricao") String descricao,
            @RequestParam("classificacao") Integer classificacao,
            @RequestParam("genero") String genero,
            @RequestParam("lancamento") String lancamento,
            @RequestParam("saidaCartaz") String saidaCartaz) {

        try {
            // Verifica se os arquivos foram enviados
            if (urlMoviePicture.isEmpty() || urlBannerPicture.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            // Salvar os arquivos e obter os nomes dos arquivos
            String nomeImagemFilme = salvarArquivo(urlMoviePicture);
            String nomeBannerFilme = salvarArquivo(urlBannerPicture);

            // Criar a URL completa para salvar no banco de dados
            String urlCompletaFilme = "http://localhost:8080/imagens/filmes/" + nomeImagemFilme;
            String urlCompletaBanner = "http://localhost:8080/imagens/filmes/" + nomeBannerFilme;

            // Criar o objeto Filme e salvar no banco de dados
            Filme filme = new Filme();
            filme.setNomeFilme(nomeFilme);
            filme.setDescricao(descricao);
            filme.setClassificacao(classificacao);
            filme.setGenero(genero);
            filme.setLançamento(lancamento);
            filme.setSaidaCartaz(saidaCartaz);
            filme.setUrlMoviePicture(urlCompletaFilme);
            filme.setUrlBannerPicture(urlCompletaBanner);

            // Salvar no banco de dados
            filmeRepository.save(filme);

            return ResponseEntity.status(HttpStatus.CREATED).body(filme);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    public String salvarArquivo(MultipartFile arquivo) throws IOException {
        // Caminho para o diretório onde você quer salvar as imagens
        Path diretorioDestino = Paths.get("C:/imagens/filmes");

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
