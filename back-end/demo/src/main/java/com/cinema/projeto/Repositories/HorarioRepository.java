package com.cinema.projeto.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Cinema;
import com.cinema.projeto.Models.Filme;
import com.cinema.projeto.Models.Horario;

@Repository
public interface HorarioRepository extends JpaRepository<Horario,Long> {
	 List<Horario> findByFilmesFilmesId(Long filmesId);
	 List<Horario> findByCinemasCinemaId(Long cinemaId);
	 List<Horario> findByFilmesAndCinemas(Filme filme, Cinema cinema);
}
