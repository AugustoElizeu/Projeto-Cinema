package com.cinema.projeto.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;

    private String tipoIngresso;
    private Integer qtdIngresso;
    private String emailPedido;
    private Boolean pagamentoConfirm;

    // Relacionamento com as entidades (não é necessário criar manualmente os campos de FK)
    @ManyToOne
    @JoinColumn(name = "Id_Filme", insertable = false, updatable = false) // Relacionamento com Filme
    private Filme filmesPedido;

    @ManyToOne
    @JoinColumn(name = "Id_Cinema", insertable = false, updatable = false) // Relacionamento com Cinema
    private Cinema cinemasPedido;

    @ManyToOne
    @JoinColumn(name = "Id_Horario", insertable = false, updatable = false) // Relacionamento com Horário
    private Horario horariosPedido;

    // Getters e Setters
    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public String getTipoIngresso() {
        return tipoIngresso;
    }

    public void setTipoIngresso(String tipoIngresso) {
        this.tipoIngresso = tipoIngresso;
    }

    public Integer getQtdIngresso() {
        return qtdIngresso;
    }

    public void setQtdIngresso(Integer qtdIngresso) {
        this.qtdIngresso = qtdIngresso;
    }

    public String getEmailPedido() {
        return emailPedido;
    }

    public void setEmailPedido(String emailPedido) {
        this.emailPedido = emailPedido;
    }

    public Boolean getPagamentoConfirm() {
        return pagamentoConfirm;
    }

    public void setPagamentoConfirm(Boolean pagamentoConfirm) {
        this.pagamentoConfirm = pagamentoConfirm;
    }

    // Métodos adicionais para os relacionamentos
    public Filme getFilmesPedido() {
        return filmesPedido;
    }

    public void setFilmesPedido(Filme filmesPedido) {
        this.filmesPedido = filmesPedido;
    }

    public Cinema getCinemasPedido() {
        return cinemasPedido;
    }

    public void setCinemasPedido(Cinema cinemasPedido) {
        this.cinemasPedido = cinemasPedido;
    }

    public Horario getHorariosPedido() {
        return horariosPedido;
    }

    public void setHorariosPedido(Horario horariosPedido) {
        this.horariosPedido = horariosPedido;
    }
}
	

