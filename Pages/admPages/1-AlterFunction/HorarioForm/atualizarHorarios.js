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

// Função para carregar os horários de um filme e cinema selecionado, com data
function carregarHorarios(idFilme, idCinema, data) {
    // Verifica se o idFilme e idCinema estão definidos
    if (!idFilme || !idCinema) {
        return; // Se não, não faz a requisição
    }

    // Verifica se a data foi selecionada
    const dataSelecionada = data || document.getElementById('data').value;

    // Caso a data não tenha sido informada
    if (!dataSelecionada) {
        alert('Por favor, selecione uma data.');
        return;
    }

    // Faz a requisição incluindo o filtro de data
    fetch(`http://localhost:8080/api/horarios/filme/${idFilme}/cinema/${idCinema}/data/${dataSelecionada}`)
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
                        <label for="data-${horario.id}">Data:</label>
                        <input type="date" name="data[]" id="data-${horario.id}" value="${horario.data}" required>
                        <br>
                        <label for="horario-${horario.id}">Horário:</label>
                        <input type="time" name="horarios[]" id="horario-${horario.id}" value="${horario.horario}" required data-id="${horario.id}">
                        <br><br>
                    `;
                    horariosDiv.appendChild(novoHorario);
                });
            } else {
                // Exibe uma mensagem caso não haja horários para o filme, cinema e data selecionados
                horariosDiv.innerHTML = '<p>Nenhum horário encontrado para este filme, cinema e data.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar horários:', error);
            alert('Erro ao carregar os horários. Verifique o console para mais detalhes.');
        });
}

// Função para salvar ou atualizar os horários no banco
function salvarHorarios(event) {
    event.preventDefault();  // Impede o envio do formulário tradicional

    const horariosDiv = document.getElementById('horarios');
    const horariosInputs = horariosDiv.querySelectorAll('.horario-item'); // Agora pegamos os itens de horário
    const horarios = [];

    // Coleta os horários e as datas atualizados
    horariosInputs.forEach(item => {
        const horario = item.querySelector('input[type="time"]').value;
        const data = item.querySelector('input[type="date"]').value;
        const idHorario = item.querySelector('input[type="time"]').dataset.id; // ID do horário

        // Se ambos os campos (horário e data) estiverem preenchidos, adiciona no array
        if (horario && data && idHorario) {
            horarios.push({ horario, data, idHorario });
        }
    });

    // Coleta os IDs do filme, cinema e a data
    const idFilme = document.getElementById('idFilme').value;
    const idCinema = document.getElementById('idCinema').value;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!idFilme || !idCinema || horarios.length === 0) {
        alert('Por favor, preencha todos os campos (filme, cinema, horários e datas).');
        return;
    }

    // Envia os horários e datas para o servidor via requisição PUT para salvar os horários
    horarios.forEach(horario => {
        fetch(`http://localhost:8080/api/horarios/atualizar/filme/${idFilme}/cinema/${idCinema}/horario/${horario.idHorario}/data/${horario.data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ horario: horario.horario })  // Envia o novo horário
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            alert('Horários atualizados com sucesso!');
        })
        .catch(error => {
            alert('Erro ao atualizar horários!');
            console.error('Erro ao atualizar horários:', error);
        });
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
        const dataSelecionada = document.getElementById('data').value;  // Pega a data selecionada
        carregarHorarios(idFilme, idCinema, dataSelecionada); // Carregar horários com data
    });

    // Quando o cinema for alterado
    selectCinema.addEventListener('change', function() {
        const idFilme = selectFilme.value;
        const idCinema = selectCinema.value;
        const dataSelecionada = document.getElementById('data').value;  // Pega a data selecionada
        carregarHorarios(idFilme, idCinema, dataSelecionada); // Carregar horários com data
    });

    // Evento para carregar horários quando a data for alterada
    document.getElementById('data').addEventListener('change', function () {
        const idFilme = document.getElementById('idFilme').value;
        const idCinema = document.getElementById('idCinema').value;
        const dataSelecionada = document.getElementById('data').value;

        carregarHorarios(idFilme, idCinema, dataSelecionada);  // Carregar os horários com a data
    });
});

