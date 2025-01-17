package com.cinema.projeto.DTO;

public class HorarioDTO {

    private String horario;
    private Long idFilme;  // Para associar o Filme ao Horário
    private Long idCinema; // Para associar o Cinema ao Horário

    // Construtores, getters e setters
    public HorarioDTO() {}

    public HorarioDTO(String horario, Long idFilme, Long idCinema) {
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
