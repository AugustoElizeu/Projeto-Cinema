package com.cinema.projeto.DTO;

public class HorarioDTO {

	private Long id;
    private String horario;
    private Long idFilme;
    private Long idCinema;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	// Construtores, getters e setters
    public HorarioDTO() {}

    

    public HorarioDTO(Long id, String horario, Long idFilme, Long idCinema) {
		super();
		this.id = id;
		this.horario = horario;
		this.idFilme = idFilme;
		this.idCinema = idCinema;
	}
    
    public HorarioDTO(String horario, Long idFilme, Long idCinema) {
		super();
		this.horario = horario;
		this.idFilme = idFilme;
		this.idCinema = idCinema;
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
