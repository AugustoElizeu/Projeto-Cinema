package com.cinema.projeto.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.projeto.Models.Usuario;
import com.cinema.projeto.Repositories.UsuarioRepository;

@Service
public class UsuarioService {
	 @Autowired
	    private UsuarioRepository usuarioRepository;

	    // Método que autentica o usuário
	 public boolean autenticar(String email, String password) {
		    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
		    
		    if (usuarioOpt.isEmpty()) {
		        return false;  // Usuário não encontrado
		    }

		    Usuario usuario = usuarioOpt.get();

		    // Comparando diretamente a senha (em texto simples)
		    if (!usuario.getSenha().equals(password)) {
		        return false;  // Senha incorreta
		    }

		    return true;  // Login bem-sucedido
		}
	    
	    
}
