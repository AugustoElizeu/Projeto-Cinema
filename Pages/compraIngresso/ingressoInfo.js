// Função para pegar os parâmetros da URL
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const cinemaId = params.get('cinemaId'); // Pega o ID do cinema
    const filmeId = params.get('filmeId'); // Pega o ID do filme
    const horarioId = params.get('horarioId'); // Pega o ID do horário
    const horarioValor = params.get('horario'); // Pega o horário formatado
    const dataSessao = params.get('data'); // Pega a data da sessão
    console.log('cinemaId:', cinemaId, 'filmeId:', filmeId, 'horarioId:', horarioId, 'data:', dataSessao); 
    return { cinemaId, filmeId, horarioId, horarioValor, dataSessao }; // Retorna todos os parâmetros necessários
}

// Função para formatar a data para o padrão DD/MM/YYYY
function formatarData(data) {
    if (!data) return "Data não disponível"; // Caso a data não exista
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return "Data inválida"; // Caso a data seja inválida

    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

// Função para carregar as informações do filme e do cinema
async function carregarDetalhes() {
    const { cinemaId, filmeId, horarioValor, dataSessao } = getURLParams(); 

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

        // Formata a data no padrão DD/MM/YYYY
        const dataFormatada = formatarData(dataSessao);

        // Atualizando as informações no HTML
        document.getElementById('nomeFilme').textContent = filme.nomeFilme || 'Nome do Filme não disponível';
        document.getElementById('nomeCinema').textContent = cinema.nomeFantasia || 'Nome do Cinema não disponível';
        document.getElementById('horarioSessao').textContent = horarioValor || 'Horário não disponível';
        document.getElementById('dataSessao').textContent = dataFormatada; // **Agora exibe a data corretamente no formato DD/MM/YYYY**

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Chama a função quando a página carregar
window.onload = carregarDetalhes;

// Função chamada ao submeter o formulário de compra
document.getElementById('form-compra').addEventListener('submit', function(event) {
    event.preventDefault();  

    // Coleta os dados do formulário
    const tipoIngresso = document.getElementById('tipoIngresso').value;
    const quantidade = document.getElementById('quantidade').value;
    const email = document.getElementById('email').value;

    // Coleta os parâmetros da URL
    const { cinemaId, filmeId, horarioId, dataSessao } = getURLParams(); 
    console.log(cinemaId, filmeId, horarioId, dataSessao); 

    // Coleta a forma de pagamento (cartão de crédito ou débito)
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked');
    if (!formaPagamento) {
        alert("Selecione a forma de pagamento!");
        return;
    }
    const tipoDeCartao = formaPagamento.value === 'credito' ? "Cartão de Crédito" : "Cartão de Débito";

    // Cria o objeto de dados a ser enviado
    const pedidoData = {
        tipoIngresso: tipoIngresso,
        qtdIngresso: quantidade,
        emailPedido: email,
        cartãoPG: tipoDeCartao,
        idCinema: cinemaId, 
        idFilme: filmeId, 
        idHorario: horarioId, 
        dataSessao: formatarData(dataSessao), // **Garante que a data seja enviada no formato DD/MM/YYYY**
        pagamentoConfirm: false,
    };

    console.log('Dados do pedido:', pedidoData);

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
            // Captura o ID do pedido
            const idPedido = data.idPedido;

            // Cria a URL para a página de pagamento
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
