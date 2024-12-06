package com.cinema.projeto.Models;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

public class Ingresso {
	
	@Getter@Setter
	private String assento;
	@Getter@Setter
	private String sala;
	@Getter@Setter
	private Date dataIngresso;
}
