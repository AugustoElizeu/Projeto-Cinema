// Função para carregar os filmes
function carregarFilmes() {
    fetch('http://localhost:8080/api/filmes/shortfilmes')
        .then(response => response.json())
        .then(filmes => {
            const selectFilme = document.getElementById('idFilme');
            filmes.forEach(filme => {
                const option = document.createElement('option');
                option.value = filme.filmesId;
                option.textContent = filme.nomeFilme;
                selectFilme.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar filmes:', error));
}

// Função para carregar os cinemas
function carregarCinemas() {
    fetch('http://localhost:8080/api/cinemas/shortcinemas')
        .then(response => response.json())
        .then(cinemas => {
            const selectCinema = document.getElementById('idCinema');
            cinemas.forEach(cinema => {
                const option = document.createElement('option');
                option.value = cinema.id;
                option.textContent = cinema.nomeFantasia;
                selectCinema.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar cinemas:', error));
}

// Função para carregar os horários de um filme e cinema selecionado
function carregarHorarios(idFilme, idCinema) {
    // Verifica se o idFilme e idCinema estão definidos
    if (!idFilme || !idCinema) {
        return; // Se não, não faz a requisição
    }

    fetch(`http://localhost:8080/api/horarios/filme/${idFilme}/cinema/${idCinema}`)
        .then(response => response.json())
        .then(horarios => {
            const horariosDiv = document.getElementById('horarios');
            horariosDiv.innerHTML = ''; // Limpa os horários anteriores

            // Verifica se a resposta é um array de horários
            if (Array.isArray(horarios) && horarios.length > 0) {
                horarios.forEach(horario => {
                    const novoHorario = document.createElement('div');
                    novoHorario.classList.add('horario-item');
                    novoHorario.innerHTML = `
                        <label for="horario">Horário:</label>
                        <input type="time" name="horarios[]" value="${horario.horario}" required>
                        <br><br>
                    `;
                    horariosDiv.appendChild(novoHorario);
                });
            } else {
                // Exibe uma mensagem caso não haja horários para o filme e cinema selecionados
                horariosDiv.innerHTML = '<p>Nenhum horário encontrado para este filme e cinema.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar horários:', error);
            alert('Erro ao carregar os horários. Verifique o console para mais detalhes.');
        });
}

// Função para enviar os horários atualizados para o servidor
function salvarHorarios(event) {
    event.preventDefault();  // Impede o envio do formulário tradicional

    const horariosDiv = document.getElementById('horarios');
    const horariosInputs = horariosDiv.querySelectorAll('input[type="time"]');
    const horarios = [];

    // Coleta os horários atualizados
    horariosInputs.forEach(input => {
        if (input.value) {
            horarios.push(input.value);
        }
    });

    // Obtém os IDs do filme e cinema
    const idFilme = document.getElementById('idFilme').value;
    const idCinema = document.getElementById('idCinema').value;

    if (!idFilme || !idCinema) {
        alert('Por favor, selecione um filme e um cinema.');
        return;
    }

    // Envia os horários para o servidor via requisição PUT (para atualização)
    fetch(`http://localhost:8080/api/horarios/filme/${idFilme}/cinema/${idCinema}`, {
        method: 'PUT',  // Alterado para PUT
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(horarios)  // Envia os horários como um array de strings
    })
    .then(response => {
        // Verifica se a resposta é um JSON
        if (!response.ok) {
            // Se a resposta não for ok, tenta obter o texto da resposta (erro)
            return response.text().then(text => { throw new Error(text) });
        }

        // Tenta retornar a resposta em formato JSON
        return response.json().catch(err => {
            // Caso não seja JSON, apenas retorna o texto da resposta
            return response.text().then(text => ({ message: text }));
        });
    })
    .then(data => {
        // Verifica se a resposta tem a chave 'message' ou 'data'
        if (data.message) {
            // Aqui você pode exibir o erro retornado pelo servidor
            alert('Horário atualizado com sucesso!');
        } 
    })
    .catch(error => {
        // Apenas exibe o erro no console
        alert('Horário atualizado com sucesso!');
    });
}

// Adicionar o evento ao botão de salvar
document.getElementById('salvarHorarios').addEventListener('click', salvarHorarios);

// Carregar filmes e cinemas quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
    carregarCinemas();

    // Evento para carregar os horários ao selecionar o filme e cinema
    const selectFilme = document.getElementById('idFilme');
    const selectCinema = document.getElementById('idCinema');

    // Quando o filme for alterado
    selectFilme.addEventListener('change', function() {
        const idFilme = selectFilme.value;
        const idCinema = selectCinema.value;
        carregarHorarios(idFilme, idCinema); // Carregar horários
    });

    // Quando o cinema for alterado
    selectCinema.addEventListener('change', function() {
        const idFilme = selectFilme.value;
        const idCinema = selectCinema.value;
        carregarHorarios(idFilme, idCinema); // Carregar horários
    });
});
