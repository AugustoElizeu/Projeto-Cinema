package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Filme;

@Repository
public interface FilmeRepository extends JpaRepository<Filme,Long> {

}
