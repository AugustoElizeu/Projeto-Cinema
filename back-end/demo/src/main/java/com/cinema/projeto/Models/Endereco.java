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
@Table(name="Endereco")
public class Endereco {
	//NOT USED
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Getter@Setter
	private Long enderecoId;
	@Getter@Setter
	private String cep;
	@Getter@Setter
	private String logradouro;
	@Getter@Setter
	private String numero;
	@Getter@Setter
	private String complemento;
	@Getter@Setter
	private String bairro;
	@Getter@Setter
	private String cidade;
	@Getter@Setter
	private String uf;
}
