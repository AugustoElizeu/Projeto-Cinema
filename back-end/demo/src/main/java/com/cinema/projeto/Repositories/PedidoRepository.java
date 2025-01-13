package com.cinema.projeto.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.projeto.Models.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido,Long> {

}
