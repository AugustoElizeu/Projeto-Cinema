package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class DadosCartao {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idDadosCartao;
	private String nomeTitular;
	private String numCard;
	private String dataExpiracao;
	private Integer cvv;
	private String cartaoTipo;
	private Double valor;
	private Integer pedidoId;
	public DadosCartao(Long idDadosCartao, String nomeTitular, String numCard, String dataExpiracao, Integer cvv,Double valor,
			String cartaoTipo, Integer pedidoId) {
		super();
		this.idDadosCartao = idDadosCartao;
		this.nomeTitular = nomeTitular;
		this.numCard = numCard;
		this.dataExpiracao = dataExpiracao;
		this.cvv = cvv;
		this.valor = valor;
		this.cartaoTipo = cartaoTipo;
		this.pedidoId = pedidoId;
	}
	public Long getIdDadosCartao() {
		return idDadosCartao;
	}
	public void setIdDadosCartão(Long idDadosCartao) {
		this.idDadosCartao = idDadosCartao;
	}
	public String getNomeTitular() {
		return nomeTitular;
	}
	public void setNomeTitular(String nomeTitular) {
		this.nomeTitular = nomeTitular;
	}
	public String getNumCard() {
		return numCard;
	}
	public void setNumCard(String numCard) {
		this.numCard = numCard;
	}
	public String getDataExpiracao() {
		return dataExpiracao;
	}
	public void setDataExpiracao(String dataExpiracao) {
		this.dataExpiracao = dataExpiracao;
	}
	public Integer getCvv() {
		return cvv;
	}
	public void setCvv(Integer cvv) {
		this.cvv = cvv;
	}
	public String getCartaoTipo() {
		return cartaoTipo;
	}
	public void setCartaoTipo(String cartaoTipo) {
		this.cartaoTipo = cartaoTipo;
	}
	public Integer getPedidoId() {
		return pedidoId;
	}
	public void setPedidoId(Integer pedidoId) {
		this.pedidoId = pedidoId;
	}
	public Double getValor() {
		return valor;
	}
	public void setValor(Double valor) {
		this.valor = valor;
	}
	
	

}
