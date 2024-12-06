package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto,Long> {

}
