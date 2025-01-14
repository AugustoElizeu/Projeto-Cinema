// Função para pegar o parâmetro da URL (idPedido)
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const idPedido = params.get('idPedido'); // Pega o ID do Pedido
    return { idPedido }; // Retorna o idPedido
}

// Função para carregar as informações do pedido, filme, cinema e horário
async function carregarDetalhes() {
    const { idPedido } = getURLParams(); // Pega o idPedido da URL

    try {
        // Requisição para pegar os detalhes do pedido
        const responsePedido = await fetch(`http://localhost:8080/api/pedidos/${idPedido}`);
        if (!responsePedido.ok) {
            throw new Error('Erro ao carregar os detalhes do pedido');
        }
        const pedido = await responsePedido.json();

        // Verificação do tipo de ingresso e atribuição do valor
        let valorIngresso = 0;
        if (pedido.tipoIngresso === 'Inteira') {
            valorIngresso = 30.00; // 30 reais para ingresso inteiro
        } else if (pedido.tipoIngresso === 'Meia-entrada') {
            valorIngresso = 15.00; // 15 reais para ingresso meia
        } else {
            throw new Error('Tipo de ingresso inválido');
        }

        // Requisição para pegar os detalhes do filme, cinema e horário com base nos IDs
        const [responseFilme, responseCinema, responseHorario] = await Promise.all([
            fetch(`http://localhost:8080/api/filmes/${pedido.idFilme}`),
            fetch(`http://localhost:8080/api/cinemas/${pedido.idCinema}`),
            fetch(`http://localhost:8080/api/horarios/${pedido.idHorario}`)
        ]);

        if (!responseFilme.ok || !responseCinema.ok || !responseHorario.ok) {
            throw new Error('Erro ao carregar os detalhes do filme, cinema ou horário');
        }

        const filme = await responseFilme.json();
        const cinema = await responseCinema.json();
        const horario = await responseHorario.json();

        // Atualizando a interface HTML com as informações
        const infoBuySection = document.querySelector('.infoBuy');

        // Criação da estrutura HTML para o filme, cinema e horário
        const h4Filme = document.createElement('h4');
        h4Filme.textContent = `Filme: ${filme.nomeFilme}`;

        const h4Cinema = document.createElement('h4');
        h4Cinema.textContent = `Cinema: ${cinema.nomeFantasia}`;

        const h4Horario = document.createElement('h4');
        h4Horario.textContent = `Horário: ${horario.horario}`;

        // Adicionando as informações à seção
        infoBuySection.appendChild(h4Filme);
        infoBuySection.appendChild(h4Cinema);
        infoBuySection.appendChild(h4Horario);

        // Criar a tag <img> dinamicamente
        const imgCartao = document.createElement('img');
        imgCartao.classList.add('cartao');
        imgCartao.src = 'https://cdn-icons-png.flaticon.com/512/2695/2695969.png';
        imgCartao.alt = 'Cartão de crédito';

        infoBuySection.appendChild(imgCartao);

        // **Aqui é o cálculo do valor total**
        const totalValue = valorIngresso * pedido.qtdIngresso; // Multiplicação do valor do ingresso pela quantidade de ingressos
        infoBuySection.querySelector('h3 span').textContent = totalValue.toFixed(2); // Atualiza o total com duas casas decimais

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        alert("Erro ao carregar as informações do pedido");
    }
}

// Função para processar o pagamento e confirmar o pagamento no pedido
async function processarPagamento(event) {
    event.preventDefault();  // Previne o comportamento padrão do formulário

    const { idPedido } = getURLParams(); // Pega o idPedido da URL

    // Pega os valores do formulário
    const nomeTitular = document.getElementById('card-name').value;
    const numCard = document.getElementById('card-number').value;
    const dataExpiracao = document.getElementById('expiration-date').value;
    const cvv = document.getElementById('cvv').value;
    const cartaoTipo = document.getElementById('card-type').value;

    // Cálculo do valor total (isso deve ser feito na hora do pagamento)
    const valorIngresso = (document.querySelector('h3 span') || {}).textContent || 0;
    const totalValue = parseFloat(valorIngresso);

    // Criando o objeto de dados do cartão com o valor total
    const dadosCartao = {
        nomeTitular: nomeTitular,
        numCard: numCard,
        dataExpiracao: dataExpiracao,
        cvv: parseInt(cvv),
        cartaoTipo: cartaoTipo,
        pedidoId: idPedido, // Assumindo que o idPedido está sendo passado corretamente
        valor: totalValue // Incluindo o valor total do pagamento
    };

    try {
        // Envia a requisição POST para salvar os dados do cartão e o valor do pagamento
        const response = await fetch("http://localhost:8080/api/dadosCartao/criarDadosCartao", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCartao)
        });

        // Verificar a resposta do pagamento
        if (response.ok) {
            // Se o pagamento for bem-sucedido, exibe o alert
            alert("Pagamento realizado com sucesso!");

            // Agora, atualiza o status de pagamento do pedido
            await confirmarPagamento(idPedido);

            // Redireciona para a página inicial
            window.location.href = "http://127.0.0.1:5500/index.html"; // Redireciona para a página inicial
        } else {
            throw new Error('Erro ao processar pagamento');
        }
    } catch (error) {
        // Se ocorrer algum erro, exibe a mensagem de erro
        alert(`Erro: ${error.message}`);
    }
}

// Função para confirmar o pagamento no backend
async function confirmarPagamento(idPedido) {
    try {
        const response = await fetch(`http://localhost:8080/api/pedidos/${idPedido}/confirmarPagamento`, {
            method: 'PUT'
        });

        if (!response.ok) {
            throw new Error('Erro ao confirmar o pagamento');
        }

        console.log('Pagamento confirmado no sistema');
    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error);
    }
}

// Adiciona o evento de envio do formulário para chamar a função de pagamento
document.getElementById('payment-form').addEventListener('submit', processarPagamento);

// Chama a função quando a página carregar
window.onload = carregarDetalhes;
