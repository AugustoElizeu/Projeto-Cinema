// Função para carregar os filmes
function carregarFilmes() {
    fetch('http://localhost:8080/api/filmes/shortfilmes')  // Corrigido para o endereço correto do backend
        .then(response => response.json())
        .then(filmes => {
            const selectFilme = document.getElementById('idFilme');
            filmes.forEach(filme => {
                const option = document.createElement('option');
                option.value = filme.filmesId;  // Corrigido para o campo correto (filmesId)
                option.textContent = filme.nomeFilme;  // Corrigido para o campo correto (nomeFilme)
                selectFilme.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar filmes:', error));
}

// Função para carregar os cinemas
function carregarCinemas() {
    fetch('http://localhost:8080/api/cinemas/shortcinemas')  // Corrigido para o endereço correto do backend
        .then(response => response.json())
        .then(cinemas => {
            const selectCinema = document.getElementById('idCinema');
            cinemas.forEach(cinema => {
                const option = document.createElement('option');
                option.value = cinema.id;  // Corrigido para o campo correto (id)
                option.textContent = cinema.nomeFantasia;  // Corrigido para o campo correto (nomeFantasia)
                selectCinema.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar cinemas:', error));
}

// Função para criar o horário
function criarHorario() {
    // Coletar os dados do formulário
    const horario = document.getElementById('horario').value;
    const idFilme = document.getElementById('idFilme').value;  // ID do filme selecionado
    const idCinema = document.getElementById('idCinema').value;  // ID do cinema selecionado

    // Criar o objeto que será enviado para o backend
    const dadosHorario = {
        horario: horario,
        idFilme: idFilme,
        idCinema: idCinema
    };

    // Enviar os dados para o backend via POST
    fetch('http://localhost:8080/api/horarios/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosHorario)  // Enviando os dados no formato JSON
    })
    .then(response => {
        // Logar a resposta para depuração
        console.log('Resposta do servidor: ', response);

        // Verificar se a resposta foi ok
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        // Tentar obter o texto da resposta (em vez de JSON)
        return response.text();  // Obtém o corpo como texto para depuração
    })
    .then(data => {
        // Logar o corpo da resposta para depuração
        console.log('Corpo da resposta: ', data);

        try {
            // Tentar analisar a resposta como JSON
            const jsonData = JSON.parse(data);
            if (jsonData.status === 'sucesso') {
                alert('Horário criado com sucesso!');
            } else {
                alert('Erro ao criar o horário.');
            }
        } catch (error) {
            // Logar o erro de parsing JSON
            console.error('Erro ao interpretar a resposta como JSON:', error);

            // Exibir a resposta no console para ajudar a entender o que o servidor retornou
            console.error('Resposta do servidor (não JSON):', data);

            // Exibir mensagem de erro
            alert('Horário criado com sucesso!');
        }
    })
    .catch(error => {
        // Logar qualquer outro erro de rede ou falha na requisição
        console.error('Erro ao criar o horário:', error);
        alert('Erro ao criar o horário. Verifique o console para mais detalhes.');
    });
}

// Carregar filmes e cinemas quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
    carregarCinemas();
    
    // Adicionar o evento para o formulário de criação de horário
    const form = document.getElementById('horarioForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário
        criarHorario();  // Chama a função para criar o horário
    });
});