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

// Função para criar múltiplos horários
function criarHorarios(event) {
    event.preventDefault();  // Impede o envio do formulário padrão

    const idFilme = document.getElementById('idFilme').value;
    const idCinema = document.getElementById('idCinema').value;
    const horarios = document.querySelectorAll('input[name="horarios[]"]');

    if (!idFilme || !idCinema || horarios.length === 0) {
        alert('Por favor, selecione um filme, um cinema e adicione pelo menos um horário.');
        return;
    }

    const dadosHorarios = Array.from(horarios).map(horarioInput => ({
        horario: horarioInput.value,
        idFilme: idFilme,
        idCinema: idCinema
    }));

    // Log para verificar os dados que estão sendo enviados
    console.log("Dados enviados para o backend:", dadosHorarios);

    fetch('http://localhost:8080/api/horarios/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosHorarios)
    })
    .then(response => {
        // Log para verificar a resposta do servidor
        console.log("Resposta do servidor:", response);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    })
    .then(data => {
        // Verificando a resposta do servidor
        console.log("Resposta do backend processada:", data);

        if (typeof data === 'string') {
            alert(data);  // Exibe a mensagem simples
        } else if (data.status === 'sucesso') {
            alert('Horários criados com sucesso!');
        } else {
            alert('Erro ao criar os horários.');
        }
    })
    .catch(error => {
        console.error('Erro ao criar os horários:', error);
        alert('Erro ao criar os horários. Verifique o console para mais detalhes.');
    });
}

// Função para adicionar um novo campo de horário e data
function adicionarHorario() {
    const horariosDiv = document.getElementById('horarios');
    const novoHorario = document.createElement('div');
    novoHorario.classList.add('horario-item');
    novoHorario.innerHTML = `
        <label for="horario">Data:</label>
        <input type="date" name="datas[]" required><br><br>

        <label for="horario">Horário:</label>
        <input type="time" name="horarios[]" required><br><br>
    `;
    horariosDiv.appendChild(novoHorario);

    // Habilitar o botão de remover
    document.getElementById('removeHorario').disabled = false;
}

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

// Função para criar múltiplos horários e datas
function criarHorarios(event) {
    event.preventDefault();  // Impede o envio do formulário padrão

    const idFilme = document.getElementById('idFilme').value;
    const idCinema = document.getElementById('idCinema').value;
    const horarios = document.querySelectorAll('input[name="horarios[]"]');
    const datas = document.querySelectorAll('input[name="datas[]"]');  // Captura o campo de datas

    if (!idFilme || !idCinema || horarios.length === 0 || datas.length === 0) {
        alert('Por favor, selecione um filme, um cinema e adicione pelo menos um horário com uma data.');
        return;
    }

    const dadosHorarios = Array.from(horarios).map((horarioInput, index) => ({
        horario: horarioInput.value,
        data: datas[index].value,  // Pega a data correspondente ao horário
        idFilme: idFilme,
        idCinema: idCinema
    }));

    // Log para verificar os dados que estão sendo enviados
    console.log("Dados enviados para o backend:", dadosHorarios);

    fetch('http://localhost:8080/api/horarios/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosHorarios)
    })
    .then(response => {
        // Log para verificar a resposta do servidor
        console.log("Resposta do servidor:", response);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    })
    .then(data => {
        // Verificando a resposta do servidor
        console.log("Resposta do backend processada:", data);

        if (typeof data === 'string') {
            alert(data);  // Exibe a mensagem simples
        } else if (data.status === 'sucesso') {
            alert('Horários criados com sucesso!');
        } else {
            alert('Erro ao criar os horários.');
        }
    })
    .catch(error => {
        console.error('Erro ao criar os horários:', error);
        alert('Erro ao criar os horários. Verifique o console para mais detalhes.');
    });
}

// Função para remover o último campo de horário e data
function removerHorario() {
    const horariosDiv = document.getElementById('horarios');
    const horarios = horariosDiv.querySelectorAll('.horario-item');
    
    if (horarios.length > 0) {
        horariosDiv.removeChild(horarios[horarios.length - 1]);
    }

    // Desabilitar o botão de remover se não houver mais horários
    if (horarios.length <= 1) {
        document.getElementById('removeHorario').disabled = true;
    }
}

// Carregar filmes e cinemas quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
    carregarCinemas();

    // Evento para o botão de adicionar horário
    const addButton = document.getElementById('addHorario');
    addButton.addEventListener('click', function(event) {
        event.preventDefault();  // Impede o comportamento de submit
        adicionarHorario();      // Adiciona um novo campo de horário e data
    });

    // Evento para o botão de remover horário
    const removeButton = document.getElementById('removeHorario');
    removeButton.addEventListener('click', function(event) {
        event.preventDefault();  // Impede o comportamento de submit
        removerHorario();        // Remove o último campo de horário e data
    });

    // Previne o envio do formulário e chama a função de criação dos horários
    const form = document.getElementById('horarioForm');
    form.addEventListener('submit', criarHorarios);  // Chama a função para criar os horários ao enviar o formulário
});
