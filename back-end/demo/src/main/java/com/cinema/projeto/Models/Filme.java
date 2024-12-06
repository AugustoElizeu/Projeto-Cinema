package com.cinema.projeto.Models;

import java.util.Date;

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
@Table(name="Filmes")
public class Filme {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Getter@Setter
	private Long filmesId;
	@Getter@Setter
	private String nomeFilme;
	@Getter@Setter
	private Integer classificacao;
	@Getter@Setter
	private String genero;
	@Getter@Setter
	private Date lançamento;
	@Getter@Setter
	private Date saidaCartaz;

	//Cinemas --- 
		
}
