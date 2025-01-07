package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Horario;

@Repository
public interface HorarioRepository extends JpaRepository<Horario,Long> {
	
}
