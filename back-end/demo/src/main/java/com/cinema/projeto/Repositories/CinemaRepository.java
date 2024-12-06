package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Cinema;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema,Long> {

}
