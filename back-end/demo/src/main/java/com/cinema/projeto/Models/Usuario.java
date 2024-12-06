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
	
	
	
}
