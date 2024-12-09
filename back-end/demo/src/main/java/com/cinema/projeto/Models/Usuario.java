package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Entity
@Table(name="Usuario")
public class Usuario {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Getter@Setter
	private Long id;
	@Getter@Setter
	private String nome;
	@Getter@Setter
	private Integer idade;
	@Getter@Setter
	private String  nomeUsuario;
	@Getter@Setter
	private String email;
	@Getter@Setter
	private String senha;
	@Getter@Setter
	private String CPF;
	@Getter@Setter
	private Boolean admin;
	
	
	
	public Usuario() {
		
	}
	
	public Usuario(Long id, String nome, Integer idade, String nomeUsuario, String email, String senha, String cPF,
			Boolean admin) {
		super();
		this.id = id;
		this.nome = nome;
		this.idade = idade;
		this.nomeUsuario = nomeUsuario;
		this.email = email;
		this.senha = senha;
		CPF = cPF;
		this.admin = admin;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public Integer getIdade() {
		return idade;
	}
	public void setIdade(Integer idade) {
		this.idade = idade;
	}
	public String getNomeUsuario() {
		return nomeUsuario;
	}
	public void setNomeUsuario(String nomeUsuario) {
		this.nomeUsuario = nomeUsuario;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public String getCPF() {
		return CPF;
	}
	public void setCPF(String cPF) {
		CPF = cPF;
	}
	public Boolean getAdmin() {
		return admin;
	}
	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}
	
	
	
}
