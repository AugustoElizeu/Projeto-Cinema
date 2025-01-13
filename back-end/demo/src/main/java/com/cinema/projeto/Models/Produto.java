package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="Produto")
public class Produto {
	//NOT USED
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Getter@Setter
	private Long produtoId;
	@Getter@Setter
	private String nomeProduto;
	@Getter@Setter
	private Double preco;
	@Getter@Setter
	private String estoque;
	@Getter@Setter
	private String tipo;
	
	//Ingresso
}
