package com.cinema.projeto.DTO;

import java.time.LocalDate;

public class HorarioDTO {

	 private Long id;       // Adiciona o id do horário
	    private String horario;
	    private LocalDate data;
	    public LocalDate getData() {
			return data;
		}

		public void setData(LocalDate data) {
			this.data = data;
		}

		private Long idFilme;  // Para associar o Filme ao Horário
	    private Long idCinema; // Para associar o Cinema ao Horário

	    // Construtores, getters e setters
	    public HorarioDTO() {}

	    public HorarioDTO(Long id, String horario,LocalDate data, Long idFilme, Long idCinema) {
	        this.id = id;
	        this.horario = horario;
	        this.data = data;
	        this.idFilme = idFilme;
	        this.idCinema = idCinema;
	    }

	    // Getters e Setters
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

    public Long getIdFilme() {
        return idFilme;
    }

    public void setIdFilme(Long idFilme) {
        this.idFilme = idFilme;
    }

    public Long getIdCinema() {
        return idCinema;
    }

    public void setIdCinema(Long idCinema) {
        this.idCinema = idCinema;
    }
}
