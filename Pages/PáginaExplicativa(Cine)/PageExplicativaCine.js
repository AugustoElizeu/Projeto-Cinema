const params = new URLSearchParams(window.location.search);
const cinemaId = params.get('cinemaId');
const filmesId = params.get('filmesId'); // Garantir que temos o filmesId da URL

let filmesExibidos = [];
let primeiraData = null; // Armazena a primeira data encontrada
let horariosCache = []; // Armazena os horários do back-end
let detalheDoCinema = null;

// Função para verificar e alterar o estilo de 'position' se o elemento estiver oculto
function verificarEAlterarEstilo() {
    const sessionControllers = document.querySelectorAll('.SessionController');
    
    sessionControllers.forEach(controller => {
        const estiloAtual = window.getComputedStyle(controller);

        // Se o elemento estiver oculto (display: none ou visibility: hidden)
        if (estiloAtual.display === 'none' || estiloAtual.visibility === 'hidden') {
            controller.style.position = 'absolute';  // Torna o elemento fora do fluxo normal
            controller.style.visibility = 'hidden'; // Torna o elemento invisível
            controller.style.display = 'none';      // Garantir que o display seja 'none', removendo-o do fluxo de layout
        } else {
            controller.style.position = '';        // Retorna à posição normal no fluxo
            controller.style.visibility = '';      // Torna o elemento visível
            controller.style.display = '';         // Retorna ao display original
        }
    });
}

async function carregarDetalhesCinema() {
    try {
        const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
        if (!response.ok) throw new Error('Erro ao carregar o cinema');

        const cinema = await response.json();
        const cinemaSection = document.getElementById('cineSection');

        const explainCard = document.createElement('section');
        explainCard.classList.add('ExplainCard');

        const fotos = document.createElement('picture');
        fotos.classList.add('fotos');

        const bannerCard = document.createElement('div');
        bannerCard.classList.add('bannerCard');
        const bannerImage = document.createElement('img');
        bannerImage.classList.add('banner');
        bannerImage.src = cinema.urlCineBanner || 'https://ingresso-a.akamaihd.net/img/cinema/cover/cover_theater_1599.jpg';
        bannerImage.alt = cinema.nomeFantasia;
        bannerCard.appendChild(bannerImage);

        const profilePicDiv = document.createElement('div');
        const profileImage = document.createElement('img');
        profileImage.classList.add('Pfp');
        profileImage.src = cinema.urlCineIcon || 'https://ingresso-a.akamaihd.net/img/cinema/avatar/avatarcorporation_15.svg';
        profileImage.alt = cinema.nomeFantasia;
        profilePicDiv.appendChild(profileImage);

        fotos.appendChild(bannerCard);
        fotos.appendChild(profilePicDiv);

        const explainationDiv = document.createElement('div');
        explainationDiv.classList.add('Explaination');

        const title = document.createElement('h1');
        title.textContent = cinema.nomeFantasia || 'Nome não disponível';

        const cnpj = document.createElement('p');
        cnpj.innerHTML = `<strong>CNPJ:</strong> ${cinema.cnpj || 'Não disponível'}`;
        
        const habilitado = document.createElement('p');
        habilitado.innerHTML = `<strong>Habilitado:</strong> ${cinema.habilidado ? 'Sim' : 'Não'}`;

        const enderecoDiv = document.createElement('div');
        enderecoDiv.id = 'endereco';

        try {
            const enderecoResponse = await fetch('http://localhost:8080/api/endereco');
            if (!enderecoResponse.ok) throw new Error('Erro ao carregar os endereços');

            const enderecos = await enderecoResponse.json();
            const enderecoCinema = enderecos.find(e => e.cinema && e.cinema.cinemaId == cinemaId);

            if (enderecoCinema) {
                const logradouro = document.createElement('p');
                logradouro.innerHTML = `<strong>Logradouro:</strong> ${enderecoCinema.logradouro || 'Não disponível'}`;
                
                const bairro = document.createElement('p');
                bairro.innerHTML = `<strong>Bairro:</strong> ${enderecoCinema.bairro || 'Não disponível'}`;
                
                const cidade = document.createElement('p');
                cidade.innerHTML = `<strong>Cidade:</strong> ${enderecoCinema.cidade || 'Não disponível'}`;
                
                const uf = document.createElement('p');
                uf.innerHTML = `<strong>UF:</strong> ${enderecoCinema.uf || 'Não disponível'}`;
                
                enderecoDiv.appendChild(logradouro);
                enderecoDiv.appendChild(bairro);
                enderecoDiv.appendChild(cidade);
                enderecoDiv.appendChild(uf);
            } else {
                const enderecoNaoDisponivel = document.createElement('p');
                enderecoNaoDisponivel.textContent = 'Endereço não disponível';
                enderecoDiv.appendChild(enderecoNaoDisponivel);
            }
        } catch (error) {
            console.error('Erro ao carregar os endereços:', error);
        }

        explainationDiv.appendChild(title);
        explainationDiv.appendChild(cnpj);
        explainationDiv.appendChild(habilitado);
        explainationDiv.appendChild(enderecoDiv);

        explainCard.appendChild(fotos);
        explainCard.appendChild(explainationDiv);
        cinemaSection.appendChild(explainCard);

    } catch (error) {
        console.error('Erro ao carregar os detalhes do cinema:', error);
    }
}



// Função para carregar os horários e armazenar em cache
async function carregarHorarios() {
    try {
        const responseHorarios = await fetch('http://localhost:8080/api/horarios');
        if (!responseHorarios.ok) {
            throw new Error('Erro ao carregar os horários');
        }
        
        horariosCache = await responseHorarios.json(); // Armazena os horários no cache

        let datasEncontradas = [];

        // Filtra e encontra as datas únicas
        horariosCache.forEach(horario => {
            const cinemaIdNoHorario = horario.cinemas.cinemaId;
            const isCinemaIdIgual = cinemaId == cinemaIdNoHorario;

            if (isCinemaIdIgual) {
                // Armazenar a primeira data encontrada
                if (!primeiraData) {
                    primeiraData = horario.data; 
                }

                // Adiciona a data na lista de datas encontradas
                if (!datasEncontradas.includes(horario.data)) {
                    datasEncontradas.push(horario.data);
                }
            }
        });

        // Exibe os botões de data
        const daysBarSection = document.querySelector('.daysBar');
        datasEncontradas.forEach(data => {
            // Criar um contêiner para o botão
            const radioWrapper = document.createElement('div');
            radioWrapper.classList.add('radio-wrapper');
        
            // Criar botões para cada data
            const dateButton = document.createElement('button');
            dateButton.classList.add('date-button');  // Adiciona a classe para os botões
            dateButton.textContent = new Date(data).toLocaleDateString(); // Formatar data para exibição
        
            // Adicionar evento de clique para carregar os horários quando a data for clicada
            dateButton.addEventListener('click', () => {
                carregarHorariosPorData(data);  // Recarrega os horários baseados na data clicada
            });
        
            // Adiciona o botão à "daysBar"
            radioWrapper.appendChild(dateButton);
            daysBarSection.appendChild(radioWrapper);
        });

        // Exibe os cinemas da primeira data
        carregarHorariosPorData(primeiraData);
        
    } catch (error) {
        console.error('Erro ao carregar os horários:', error);
    }
}

async function carregarHorariosPorData(dataSelecionada) {
    try {
        limparFilmesEHorarios(); // Remove os cinemas e horários anteriores corretamente

        let filmesAgrupados = {};
        // Filtra apenas os horários do filme específico e da data selecionada
        horariosCache.forEach(horario => {
            if (horario.data === dataSelecionada && horario.cinemas.cinemaId == cinemaId) { 
                const filmesId = horario.filmes.filmesId;
                const nomeFilme = horario.filmes.nomeFilme;

                if (!filmesAgrupados[filmesId]) {
                    filmesAgrupados[filmesId] = { nomeFilme, horarios: [] };
                    console.log(filmesAgrupados);
                }

                filmesAgrupados[filmesId].horarios.push({
                    id: horario.id,
                    horario: horario.horario
                });
            }
        });

        const sessoesContainer = document.getElementById('sessoesContainer') || document.createElement('div');
        sessoesContainer.id = 'sessoesContainer';
        document.body.appendChild(sessoesContainer);
        sessoesContainer.innerHTML = ''; // Limpa os horários anteriores corretamente

        // **Se não houver cinemas disponíveis, não criar div vazia**
        if (Object.keys(filmesAgrupados).length === 0) {
            const noSessionsMessage = document.createElement('p');
            noSessionsMessage.textContent = 'Não há sessões disponíveis para esta data.';
            sessoesContainer.appendChild(noSessionsMessage);
            console.log(filmesAgrupados);
            return;
        }

        Object.entries(filmesAgrupados).forEach(([filmesId, filme]) => {
            // **Verifica se o cinema tem horários antes de criar o SessionController**
            if (filme.horarios.length > 0) {
                const sessionController = document.createElement('div');
                sessionController.classList.add('SessionController');

                const sessions = document.createElement('div');
                sessions.classList.add('Sessions');

                const sessionCard = document.createElement('div');
                sessionCard.classList.add('SessionCard');

                const nomeFilme = document.createElement('h2');
                nomeFilme.textContent = filme.nomeFilme;
                sessionCard.appendChild(nomeFilme);

                filme.horarios.forEach(h => {
                    const link = document.createElement('a');
                    link.href = `../compraIngresso/compraIngresso.html?cinemaId=${cinemaId}&filmeId=${filmesId}&horario=${h.horario}&horarioId=${h.id}&data=${dataSelecionada}`;

                    const button = document.createElement('button');
                    button.classList.add('custom-button');
                    button.textContent = h.horario;
                    link.appendChild(button);
                    sessionCard.appendChild(link);
                });

                sessions.appendChild(sessionCard);
                sessionController.appendChild(sessions);
                sessoesContainer.appendChild(sessionController);
            }
        });
        
        // **Remove qualquer div vazia que tenha sido gerada**
        removerDivsVazias();

    } catch (error) {
        console.error('Erro ao carregar horários por data:', error);
    }
    
}

// **Função para limpar espaços invisíveis no DOM**
function removerDivsVazias() {
    document.querySelectorAll('.SessionController').forEach(div => {
        if (!div.innerHTML.trim()) {
            div.remove();
        }
    });
}

// **Correção para remover os espaços vazios corretamente**
function limparFilmesEHorarios() {
    const sessoesContainer = document.getElementById('sessoesContainer');
    if (sessoesContainer) {
        sessoesContainer.innerHTML = ''; // Remove todos os elementos corretamente
    }
}


// Chama a função para carregar os detalhes do filme assim que a página carregar
window.onload = async () => {
    await carregarDetalhesCinema();
    await carregarHorarios(); // Carregar horários depois que o filme for carregado
    verificarEAlterarEstilo(); // Verifica e altera o estilo dos 'SessionController' após o carregamento
};

