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
    if (!idFilme || !idCinema) {
        return;
    }

    fetch(`http://localhost:8080/api/horarios/filme/${idFilme}/cinema/${idCinema}`)
        .then(response => response.json())
        .then(horarios => {
            const horariosDiv = document.getElementById('horarios');
            horariosDiv.innerHTML = ''; // Limpa os horários anteriores

            if (Array.isArray(horarios) && horarios.length > 0) {
                horarios.forEach(horario => {
                    const novoHorario = document.createElement('div');
                    novoHorario.classList.add('horario-item');
                    novoHorario.innerHTML = `
                        <label for="horario">Horário:</label>
                        <input type="time" name="horarios[]" value="${horario.horario}" required>
                        <button type="button" class="btn btn-danger" data-id="${horario.id}" data-filme="${idFilme}" data-cinema="${idCinema}" data-horario="${horario.horario}">Apagar</button>
                        <br><br>
                    `;
                    horariosDiv.appendChild(novoHorario);

                    // Associando o evento de clique ao botão "Apagar"
                    const btnApagar = novoHorario.querySelector('.btn.btn-danger');
                    btnApagar.addEventListener('click', function() {
                        removerHorario(this);
                    });
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
function removerHorario(button) {
    const idHorario = button.getAttribute('data-id');  // Agora estamos pegando o id do horário
    const idFilme = button.getAttribute('data-filme');
    const idCinema = button.getAttribute('data-cinema');

    if (!idHorario) {
        console.error('ID do horário não encontrado');
        return;
    }

    // Debug: Verificando os parâmetros
    console.log(`Remover horário: ID do horário = ${idHorario}, Filme ID = ${idFilme}, Cinema ID = ${idCinema}`);

    // Realiza a requisição DELETE para o endpoint atualizado
    fetch(`http://localhost:8080/api/horarios/deletarHorario/filme/${idFilme}/cinema/${idCinema}/horario/${idHorario}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            // Remove o item do DOM após a resposta bem-sucedida
            button.closest('.horario-item').remove();
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
