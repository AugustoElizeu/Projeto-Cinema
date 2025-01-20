// Função para carregar os filmes
function carregarFilmes() {
    fetch('http://localhost:8080/api/filmes/shortfilmes')
        .then(response => response.json())
        .then(filmes => {
            const selectFilme = document.getElementById('idFilme');
            filmes.forEach(filme => {
                const option = document.createElement('option');
                option.value = filme.filmesId;  // A chave do ID do filme pode variar dependendo da resposta da API
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
                option.value = cinema.id;  // O ID do cinema
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
                        <button type="button" class="btn btn-danger" onclick="removerHorario(this, ${horario.id}, ${idFilme}, ${idCinema})">Apagar</button>
                        <br><br>
                    `;
                    console.log(horario); // Adicionando um log para verificar se o ID está vindo corretamente
                    horariosDiv.appendChild(novoHorario);
                });
            } else {
                horariosDiv.innerHTML = '<p>Nenhum horário encontrado para este filme e cinema.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao carregar horários:', error);
            alert('Erro ao carregar os horários. Verifique o console para mais detalhes.');
        });
}

// Função para remover um horário
function removerHorario(button, idHorario, idFilme, idCinema) {
    // Verifica se o id do horário é válido
    if (!idHorario) {
        console.error('ID do horário não encontrado');
        return;
    }

    // Faz a requisição DELETE para o backend, passando o idHorario na URL
    fetch(`http://localhost:8080/api/horarios/filme/${idFilme}/cinema/${idCinema}/horario/${idHorario}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Remove o item do DOM após a resposta bem-sucedida
            const horarioItem = button.closest('.horario-item');
            horarioItem.remove();
            alert('Horário apagado com sucesso!');
        } else {
            alert('Erro ao apagar o horário.');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir horário:', error);
        alert('Erro ao excluir o horário. Verifique o console para mais detalhes.');
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
