package com.cinema.projeto.Models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
	private String urlMoviePicture;
	private String urlBannerPicture;
	private String descricao;
	private Integer classificacao;
	private String genero;
	private String lançamento;
	private String saidaCartaz;
	
	@JsonIgnore
	@OneToMany(mappedBy = "filmes")
	private List<Horario> horario = new ArrayList<>();
	
	public Filme() {
		
	}
	
	public Filme(Long filmesId, String nomeFilme, String urlMoviePicture,String urlBannerPicture,String descricao, Integer classificacao, String genero,
			String lançamento, String saidaCartaz) {
		super();
		this.filmesId = filmesId;
		this.nomeFilme = nomeFilme;
		this.urlMoviePicture = urlMoviePicture;
		this.urlBannerPicture = urlBannerPicture;
		this.descricao = descricao;
		this.classificacao = classificacao;
		this.genero = genero;
		this.lançamento = lançamento;
		this.saidaCartaz = saidaCartaz;
	}

	public String getUrlBannerPicture() {
		return urlBannerPicture;
	}

	public void setUrlBannerPicture(String urlBannerPicture) {
		this.urlBannerPicture = urlBannerPicture;
	}

	public Long getFilmesId() {
		return filmesId;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
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
		return urlMoviePicture;
	}

	public void setUrlMoviePicture(String urlMoviePicture) {
		this.urlMoviePicture = urlMoviePicture;
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
