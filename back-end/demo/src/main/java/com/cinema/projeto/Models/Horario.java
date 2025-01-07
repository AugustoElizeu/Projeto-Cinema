package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity	
public class Horario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String horario;
	
	@ManyToOne
	@JoinColumn(name = "Id_Filme")
	private Filme filmes;
	
	@ManyToOne
	@JoinColumn(name = "Id_Cinemas")
	private Cinema cinemas;
	
	public Horario() {
		super();
	}


	public Horario(Long id, String horario, Filme filmes,Cinema cinemas) {
		super();
		this.id = id;
		this.horario = horario;
		this.filmes = filmes;
		this.cinemas = cinemas;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getHorario() {
		return horario;
	}


	public void setHorario(String horario) {
		this.horario = horario;
	}


	public Filme getFilmes() {
		return filmes;
	}


	public void setFilmes(Filme filmes) {
		this.filmes = filmes;
	}


	public Cinema getCinemas() {
		return cinemas;
	}


	public void setCinemas(Cinema cinemas) {
		this.cinemas = cinemas;
	}
	
	
	
	
	
	
	
}
