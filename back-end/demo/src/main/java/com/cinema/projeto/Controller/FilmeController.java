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

import com.cinema.projeto.DTO.FilmesNameDTO;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Models.Horario;
import com.cinema.projeto.Repositories.FilmeRepository;
import com.cinema.projeto.Repositories.HorarioRepository;

@RestController
@RequestMapping("/api/filmes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class FilmeController {

    private final FilmeRepository filmeRepository;
    private final HorarioRepository horarioRepository;

    

    public FilmeController(FilmeRepository filmeRepository, HorarioRepository horarioRepository) {
		super();
		this.filmeRepository = filmeRepository;
		this.horarioRepository = horarioRepository;
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
    //Criar Dados
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
    
    //Atualizar Dados
    
    @PutMapping("/atualizarfilme/{id}")
    public ResponseEntity<Filme> atualizarFilme(
            @PathVariable("id") Long id,
            @RequestParam("nomeFilme") String nomeFilme,
            @RequestParam(value = "urlMoviePicture", required =  false) MultipartFile urlMoviePicture,
            @RequestParam(value = "urlBannerPicture", required = false) MultipartFile urlBannerPicture,
            @RequestParam("descricao") String descricao,
            @RequestParam("classificacao") Integer classificacao,
            @RequestParam("genero") String genero,
            @RequestParam("lancamento") String lancamento,
            @RequestParam("saidaCartaz") String saidaCartaz) {

        try {
            // Tente buscar o filme pelo ID
            Optional<Filme> optionalFilme = filmeRepository.findById(id);

            if (!optionalFilme.isPresent()) {
                // Se o filme não for encontrado, retorne um erro 404
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Filme encontrado
            Filme filme = optionalFilme.get();

            // Atualizar os campos do filme com os dados recebidos
            filme.setNomeFilme(nomeFilme);
            filme.setDescricao(descricao);
            filme.setClassificacao(classificacao);
            filme.setGenero(genero);
            filme.setLançamento(lancamento);
            filme.setSaidaCartaz(saidaCartaz);

            // Se a URL da imagem do filme foi fornecida (caso o usuário tenha enviado uma nova), atualizar a URL
            if (urlMoviePicture != null && !urlMoviePicture.isEmpty()) {
                String nomeImagemFilme = salvarArquivo(urlMoviePicture); // Salva a imagem
                String urlCompletaFilme = "http://localhost:8080/imagens/filmes/" + nomeImagemFilme;
                filme.setUrlMoviePicture(urlCompletaFilme); // Atualiza com a URL da imagem
            }

            // Se a URL da imagem do banner foi fornecida (caso o usuário tenha enviado uma nova), atualizar a URL
            if (urlBannerPicture != null && !urlBannerPicture.isEmpty()) {
                String nomeBannerFilme = salvarArquivo(urlBannerPicture); // Salva a imagem
                String urlCompletaBanner = "http://localhost:8080/imagens/filmes/" + nomeBannerFilme;
                filme.setUrlBannerPicture(urlCompletaBanner); // Atualiza com a URL do banner
            }

            // Salvar o filme atualizado no banco de dados
            filmeRepository.save(filme);

            // Retornar a resposta com o filme atualizado
            return ResponseEntity.status(HttpStatus.OK).body(filme);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/deletarfilme/{id}")
    public ResponseEntity<String> deleteFilme(@PathVariable("id") Long id) {
        try {
            // Buscar os horários que referenciam o filme
            List<Horario> horarios = horarioRepository.findByFilmesFilmesId(id); // Usando 'filmesFilmesId' no repositório

            // Se houver horários associados ao filme, exclua-os
            if (!horarios.isEmpty()) {
                horarioRepository.deleteAll(horarios);
            }

            // Agora excluir o filme
            Filme filme = filmeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filme não encontrado"));
            filmeRepository.delete(filme);

            return ResponseEntity.ok("Filme e dependências deletadas com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao deletar o filme: " + e.getMessage());
        }
    }

}
