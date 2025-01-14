package com.cinema.projeto.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;

    @Column(nullable = false)
    private String tipoIngresso;

    @Column(nullable = false)
    private Integer qtdIngresso;

    @Column(nullable = false)
    private String emailPedido;

    @Column(nullable = false)
    private Boolean pagamentoConfirm;

    private Long idFilme; // ID do Filme
    private Long idCinema; // ID do Cinema
    private Long idHorario; // ID do Horário
    
    // Construtor padrão (sem parâmetros)
    public Pedido() {
    }

    // Construtor com parâmetros
    public Pedido(Long idPedido, String tipoIngresso, Integer qtdIngresso, String emailPedido, Boolean pagamentoConfirm,
                  Long idFilme, Long idCinema, Long idHorario) {
        this.idPedido = idPedido;
        this.tipoIngresso = tipoIngresso;
        this.qtdIngresso = qtdIngresso;
        this.emailPedido = emailPedido;
        this.pagamentoConfirm = pagamentoConfirm;
        this.idFilme = idFilme;
        this.idCinema = idCinema;
        this.idHorario = idHorario;
    }

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

    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }
}

