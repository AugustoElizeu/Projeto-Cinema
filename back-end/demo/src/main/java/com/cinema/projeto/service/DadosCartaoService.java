package com.cinema.projeto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.projeto.Models.DadosCartao;
import com.cinema.projeto.Repositories.DadosCartaoRepository;

@Service
public class DadosCartaoService {

    @Autowired
    private DadosCartaoRepository dadosCartaoRepository;

    // Método para criar e salvar os dados do cartão
    public DadosCartao create(DadosCartao dadosCartao) {
        // Aqui você pode adicionar validações ou outras lógicas se necessário
        return dadosCartaoRepository.save(dadosCartao);
    }
}