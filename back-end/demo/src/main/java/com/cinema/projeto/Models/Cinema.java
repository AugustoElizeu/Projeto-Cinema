package com.cinema.projeto.Models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="Cinemas")
public class Cinema {
		
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cinemaId;
    private String nomeFantasia;
    private String razaoSocial;
    private String cnpj;
    private String urlCineIcon;
    private String urlCineBanner;
    private Boolean habilitado;
    private Double valorIngresso;
    
    @JsonIgnore
    @OneToMany(mappedBy = "cinemas")
    private List<Horario> horario = new ArrayList<>();
    
    @OneToMany(mappedBy = "cinema") // O mappedBy deve ser "cinema", que é o nome do atributo na classe Endereco
    private List<Endereco> enderecos;

	public Cinema() {
	}
	
	public Cinema(Long cinemaId, String nomeFantasia, String razaoSocial, String cnpj,String urlCineIcon ,String urlCineBanner,Boolean habilitado,Double valorIngresso) {
		super();
		this.cinemaId = cinemaId;
		this.nomeFantasia = nomeFantasia;
		this.razaoSocial = razaoSocial;
		this.cnpj = cnpj;
		this.urlCineIcon = urlCineIcon;
		this.urlCineBanner = urlCineBanner;
		this.habilitado = habilitado;
		this.valorIngresso = valorIngresso;
	}

	public Long getCinemaId() {
		return cinemaId;
	}

	public String getUrlCineIcon() {
		return urlCineIcon;
	}

	public void setUrlCineIcon(String urlCineIcon) {
		this.urlCineIcon = urlCineIcon;
	}

	public String getUrlCineBanner() {
		return urlCineBanner;
	}

	public void setUrlCineBanner(String urlCineBanner) {
		this.urlCineBanner = urlCineBanner;
	}

	public void setCinemaId(Long cinemaId) {
		this.cinemaId = cinemaId;
	}

	public String getNomeFantasia() {
		return nomeFantasia;
	}

	public void setNomeFantasia(String nomeFantasia) {
		this.nomeFantasia = nomeFantasia;
	}

	public String getRazaoSocial() {
		return razaoSocial;
	}

	public void setRazaoSocial(String razaoSocial) {
		this.razaoSocial = razaoSocial;
	}

	public String getCnpj() {
		return cnpj;
	}

	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	public Boolean getHabilitado() {
		return habilitado;
	}

	public void setHabilitado(Boolean habilidado) {
		this.habilitado = habilidado;
	}

	public Double getValorIngresso() {
		return valorIngresso;
	}

	public void setValorIngresso(Double valorIngresso) {
		this.valorIngresso = valorIngresso;
	}
	
    
}
