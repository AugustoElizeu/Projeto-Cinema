package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.DadosCartao;

@Repository
public interface DadosCartaoRepository extends JpaRepository<DadosCartao,Long>{

}
