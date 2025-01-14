package com.cinema.projeto.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.projeto.Models.Pedido;
import com.cinema.projeto.Repositories.PedidoRepository;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PedidoController {
	
	@Autowired
    private PedidoRepository pedidoRepository;	

	public PedidoController(PedidoRepository pedidoRepository) {
		super();
		this.pedidoRepository = pedidoRepository;
	}
	@GetMapping
	public @ResponseBody List<Pedido> list(){
			return pedidoRepository.findAll();
	}
	 @GetMapping("/{id}")
	    public ResponseEntity<Pedido> findById(@PathVariable Long id) {
	        return pedidoRepository.findById(id)
	                .map(record -> ResponseEntity.ok().body(record))
	                .orElseGet(() -> ResponseEntity.notFound().build());
	 }
	 @PostMapping("/criarPedido")
	    public ResponseEntity<Pedido> create(@RequestBody Pedido pedido) {
	        // Verifica se os dados obrigatórios estão presentes
	        if (pedido.getTipoIngresso() == null || pedido.getQtdIngresso() == null) {
	            return ResponseEntity.badRequest().build(); // Dados obrigatórios faltando
	        }

	        // Agora salva o pedido com o campo 'tipoDeCartão' também
	        Pedido pedidoSalvo = pedidoRepository.save(pedido);

	        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoSalvo);
	    }
	 @PutMapping("/{idPedido}/confirmarPagamento")
	    public ResponseEntity<Pedido> confirmarPagamento(@PathVariable Long idPedido) {
	        Optional<Pedido> pedidoOptional = pedidoRepository.findById(idPedido);
	        
	        if (pedidoOptional.isPresent()) {
	            Pedido pedido = pedidoOptional.get();
	            pedido.setPagamentoConfirm(true); // Atualiza o status do pagamento
	            pedidoRepository.save(pedido); // Salva a alteração no banco de dados
	            
	            return ResponseEntity.ok(pedido); // Retorna o pedido atualizado
	        } else {
	            return ResponseEntity.notFound().build(); // Se o pedido não for encontrado
	        }
	    }

}
