package com.cinema.projeto.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cinema.projeto.Models.Usuario;
import com.cinema.projeto.Repositories.UsuarioRepository;
import com.cinema.projeto.service.UsuarioService;

@Controller
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UsuarioController {
		private final UsuarioRepository userRepository;

		public UsuarioController(UsuarioRepository userRepository) {
			super();
			this.userRepository = userRepository;
		}
		
		@GetMapping
		public @ResponseBody List<Usuario> list(){
				return userRepository.findAll();
			}
		
		
		@GetMapping("/{Id}")
		public ResponseEntity<Usuario> findById(@PathVariable Long Id) {	
			return userRepository.findById(Id).map(record -> ResponseEntity.ok().body(record)).orElse(ResponseEntity.notFound().build());
		}
		
		@PostMapping("/criarusuario")
		public ResponseEntity<Usuario> create(@RequestBody Usuario user){
			
			return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
		}
		
		@PutMapping("/{id}")
		public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario user) {
		    return userRepository.findById(id)
		            .map(record -> {
		                // Atualiza os campos do objeto com os dados do objeto recebido
		                record.setNome(user.getNome());
		                record.setNomeUsuario(user.getNomeUsuario());
		                record.setEmail(user.getEmail());
		                record.setIdade(user.getIdade());
		                record.setSenha(user.getSenha());
		                record.setCPF(user.getCPF());
		                // Salva o objeto atualizado no repositório
		                Usuario updated = userRepository.save(record);
		                return ResponseEntity.ok().body(updated);
		            })
		            .orElse(ResponseEntity.notFound().build());
		}
		@Autowired
	    private UsuarioService usuarioService;

	    // Endpoint para o login
		 @PostMapping("/login")
		    public ResponseEntity<String> login(@RequestBody Usuario usuario) {
		        String email = usuario.getEmail();
		        String senha = usuario.getSenha();

		        // Chama o método de autenticação
		        boolean isAuthenticated = usuarioService.autenticar(email, senha);

		        if (isAuthenticated) {
		            // Retorna apenas uma string simples e um status OK (200)
		            return ResponseEntity.ok("Login realizado com sucesso!");
		        } else {
		            // Retorna uma string simples e um status UNAUTHORIZED (401)
		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		                    .body("Credenciais inválidas!");
		        }
		    }
}
