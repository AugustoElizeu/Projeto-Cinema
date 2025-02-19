package com.cinema.projeto.Models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

@Entity
@AllArgsConstructor
@Table(name="Endereco")
public class Endereco {
	    
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long enderecoId;
	    private String cep;
	    private String logradouro;
	    private String numero;
	    private String complemento;
	    private String bairro;
	    private String cidade;
	    private String uf;
	 
	    @ManyToOne(cascade = CascadeType.ALL)  // Essa linha irá garantir que o Cinema seja salvo automaticamente
	    @JoinColumn(name = "Id_Cinema")
	    private Cinema cinema;

	public Endereco() {
	}
	
	public Endereco(Long enderecoId, String cep, String logradouro, String numero, String complemento, String bairro,
			String cidade, String uf, Cinema cinema) {
		super();
		this.enderecoId = enderecoId;
		this.cep = cep;
		this.logradouro = logradouro;
		this.numero = numero;
		this.complemento = complemento;
		this.bairro = bairro;
		this.cidade = cidade;
		this.uf = uf;
		this.cinema = cinema;
	}
	
	public Long getEnderecoId() {
		return enderecoId;
	}
	public void setEnderecoId(Long enderecoId) {
		this.enderecoId = enderecoId;
	}
	public String getCep() {
		return cep;
	}
	public void setCep(String cep) {
		this.cep = cep;
	}
	public String getLogradouro() {
		return logradouro;
	}
	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}
	public String getNumero() {
		return numero;
	}
	public void setNumero(String numero) {
		this.numero = numero;
	}
	public String getComplemento() {
		return complemento;
	}
	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}
	public String getBairro() {
		return bairro;
	}
	public void setBairro(String bairro) {
		this.bairro = bairro;
	}
	public String getCidade() {
		return cidade;
	}
	public void setCidade(String cidade) {
		this.cidade = cidade;
	}
	public String getUf() {
		return uf;
	}
	public void setUf(String uf) {
		this.uf = uf;
	}
	public Cinema getCinema() {
		return cinema;
	}

	public void setCinema(Cinema cinema) {
		this.cinema = cinema;
	}
	
}
