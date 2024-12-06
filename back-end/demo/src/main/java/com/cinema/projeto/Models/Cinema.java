package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@AllArgsConstructor
@Table(name="Cinemas")
public class Cinema {
		
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Getter@Setter
	private Long cinemaId;
	@Getter@Setter
	private String nomeFantasia;
	@Getter@Setter
	private String razaoSocial;
	@Getter@Setter
	private String cnpj;
	@Getter@Setter
	private Boolean habilidado;
	
	//Lista Filmes
	//Endreço

}
