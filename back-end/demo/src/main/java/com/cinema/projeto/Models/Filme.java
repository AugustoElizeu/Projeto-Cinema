package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;


@Entity
@AllArgsConstructor
@Table(name="Filmes")
public class Filme {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long filmesId;
	private String nomeFilme;
	private String UrlMoviePicture;
	private Integer classificacao;
	private String genero;
	private String lançamento;
	private String saidaCartaz;
	
	public Filme() {
		
	}
	
	public Filme(Long filmesId, String nomeFilme, String urlMoviePicture, Integer classificacao, String genero,
			String lançamento, String saidaCartaz) {
		super();
		this.filmesId = filmesId;
		this.nomeFilme = nomeFilme;
		UrlMoviePicture = urlMoviePicture;
		this.classificacao = classificacao;
		this.genero = genero;
		this.lançamento = lançamento;
		this.saidaCartaz = saidaCartaz;
	}

	public Long getFilmesId() {
		return filmesId;
	}

	public void setFilmesId(Long filmesId) {
		this.filmesId = filmesId;
	}

	public String getNomeFilme() {
		return nomeFilme;
	}

	public void setNomeFilme(String nomeFilme) {
		this.nomeFilme = nomeFilme;
	}

	public String getUrlMoviePicture() {
		return UrlMoviePicture;
	}

	public void setUrlMoviePicture(String urlMoviePicture) {
		UrlMoviePicture = urlMoviePicture;
	}

	public Integer getClassificacao() {
		return classificacao;
	}

	public void setClassificacao(Integer classificacao) {
		this.classificacao = classificacao;
	}

	public String getGenero() {
		return genero;
	}

	public void setGenero(String genero) {
		this.genero = genero;
	}

	public String getLançamento() {
		return lançamento;
	}

	public void setLançamento(String lançamento) {
		this.lançamento = lançamento;
	}

	public String getSaidaCartaz() {
		return saidaCartaz;
	}

	public void setSaidaCartaz(String saidaCartaz) {
		this.saidaCartaz = saidaCartaz;
	}
	
	
	//Cinemas --- 
		
}
