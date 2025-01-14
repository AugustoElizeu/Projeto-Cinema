// Função para pegar os parâmetros da URL
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cinemaId = params.get('cinemaId'); // Pega o ID do cinema
    const filmeId = params.get('filmeId'); // Pega o ID do filme
    const horarioId = params.get('horarioId'); // Pega o ID do horário
    const horarioValor = params.get('horario'); // Pega o ID do horário
    console.log('cinemaId:', cinemaId, 'filmeId:', filmeId, 'horarioId:', horarioId); // Verifique se os valores estão sendo recuperados corretamente
    return { cinemaId, filmeId, horarioId, horarioValor }; // Retorna todos os parâmetros necessários
}

// Função para carregar as informações do filme e do cinema
async function carregarDetalhes() {
    const { cinemaId, filmeId, horarioId, horarioValor } = getURLParams(); // Agora pegamos os três parâmetros

    try {
        // Requisição para pegar os detalhes do filme
        const responseFilme = await fetch(`http://localhost:8080/api/filmes/${filmeId}`);
        if (!responseFilme.ok) {
            throw new Error('Erro ao carregar os detalhes do filme');
        }
        const filme = await responseFilme.json();

        // Requisição para pegar os detalhes do cinema
        const responseCinema = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
        if (!responseCinema.ok) {
            throw new Error('Erro ao carregar os detalhes do cinema');
        }
        const cinema = await responseCinema.json();

        // Atualizando as informações no HTML
        document.getElementById('nomeFilme').textContent = filme.nomeFilme || 'Nome do Filme não disponível';
        document.getElementById('nomeCinema').textContent = cinema.nomeFantasia || 'Nome do Cinema não disponível';
        document.getElementById('horarioSessao').textContent = horarioValor || 'Horário não disponível'; // Agora exibe o valor do parâmetro "horario"

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Chama a função quando a página carregar
window.onload = carregarDetalhes;

// Função chamada ao submeter o formulário de compra
document.getElementById('form-compra').addEventListener('submit', function(event) {
    event.preventDefault();  // Previne o envio tradicional do formulário

    // Coleta os dados do formulário
    const tipoIngresso = document.getElementById('tipoIngresso').value;
    const quantidade = document.getElementById('quantidade').value;
    const email = document.getElementById('email').value;

    // Coleta os parâmetros da URL
    const { cinemaId, filmeId, horarioId } = getURLParams(); // Agora pegamos os três parâmetros
    console.log(cinemaId, filmeId, horarioId); // Verifique se os parâmetros estão sendo passados corretamente

    // Coleta a forma de pagamento (cartão de crédito ou débito)
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked');
    if (!formaPagamento) {
        alert("Selecione a forma de pagamento!");
        return;
    }
    // Verifica qual tipo de cartão foi selecionado e atribui o nome correto
    const tipoDeCartao = formaPagamento.value === 'credito' ? "Cartão de Crédito" : "Cartão de Débito";

    // Cria o objeto de dados a ser enviado
    const pedidoData = {
        tipoIngresso: tipoIngresso,
        qtdIngresso: quantidade,
        emailPedido: email,
        cartãoPG: tipoDeCartao, // Agora envia o valor "Cartão de Crédito" ou "Cartão de Débito"
        idCinema: cinemaId, // Associe o cinemaId da URL
        idFilme: filmeId, // Associe o filmeId da URL
        idHorario: horarioId, // Agora envia o valor do horarioId
        pagamentoConfirm: false, // Assume que o pagamento não foi confirmado inicialmente
    };

    console.log('Dados do pedido:', pedidoData); // Verifique se os dados estão sendo passados corretamente

    // Envia o pedido para o backend
    fetch('http://localhost:8080/api/pedidos/criarPedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.idPedido) {
            // Quando a resposta for recebida com sucesso, captura o ID do pedido
            const idPedido = data.idPedido;

            // Cria a URL para a próxima página de pagamento com o ID do pedido
            const pagamentoUrl = `../pagamento/pagamento.html?idPedido=${idPedido}`;

            // Redireciona o usuário para a página de pagamento
            window.location.href = pagamentoUrl;
        } else {
            alert("Erro ao processar o pedido.");
        }
    })
    .catch(error => {
        alert("Erro na comunicação com o servidor.");
        console.error('Erro:', error);
    });
});
