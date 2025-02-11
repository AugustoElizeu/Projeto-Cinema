const params = new URLSearchParams(window.location.search);
const cinemaId = params.get('cinemaId');

let primeiraData = null; // Armazena a primeira data encontrada
let horariosCache = []; // Armazena os horários do back-end

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

        const endereco = document.createElement('p');
        endereco.innerHTML = `Endereço: <span>${cinema.razaoSocial || 'Endereço não disponível'}</span>`;

        const cnpj = document.createElement('p');
        cnpj.innerHTML = `CNPJ: <span>${cinema.cnpj || 'CNPJ não disponível'}</span>`;

        const habilitado = document.createElement('p');
        habilitado.textContent = `Habilitado: ${cinema.habilidado ? 'Sim' : 'Não'}`;

        explainationDiv.appendChild(title);
        explainationDiv.appendChild(endereco);
        explainationDiv.appendChild(cnpj);
        explainationDiv.appendChild(habilitado);

        explainCard.appendChild(fotos);
        explainCard.appendChild(explainationDiv);
        cinemaSection.appendChild(explainCard);

    } catch (error) {
        console.error('Erro ao carregar os detalhes do cinema:', error);
    }
}

async function carregarDatasDisponiveis() {
    try {
        const responseHorarios = await fetch(`http://localhost:8080/api/horarios?cinemaId=${cinemaId}`);
        if (!responseHorarios.ok) throw new Error('Erro ao carregar os horários');

        horariosCache = await responseHorarios.json();
        let datasDisponiveis = [];

        horariosCache.forEach(horario => {
            if (!datasDisponiveis.includes(horario.data)) {
                datasDisponiveis.push(horario.data);
            }
        });

        const daysBarSection = document.getElementById('daysBar');
        daysBarSection.innerHTML = '';

        datasDisponiveis.forEach((data, index) => {
            const radioWrapper = document.createElement('div');
            radioWrapper.classList.add('radio-wrapper');

            const dateButton = document.createElement('button');
            dateButton.classList.add('date-button');
            dateButton.textContent = new Date(data).toLocaleDateString();
            dateButton.setAttribute('data-date', data);

            dateButton.addEventListener('click', () => {
                carregarSessoesPorData(data);
            });

            radioWrapper.appendChild(dateButton);
            daysBarSection.appendChild(radioWrapper);

            if (index === 0) {
                primeiraData = data;
                carregarSessoesPorData(data);
            }
        });

    } catch (error) {
        console.error('Erro ao carregar as datas disponíveis:', error);
    }
}

async function carregarSessoesPorData(dataSelecionada) {
    try {
        limparCinemasEHorarios();

        let sessoesAgrupadas = {};

        horariosCache.forEach(horario => {
            if (horario.data === dataSelecionada) {
                if (!horario.filmes || !horario.filmes.filmesId) {
                    console.warn("FilmeId não encontrado para o horário:", horario);
                    return; // Se o filmeId estiver faltando, pula para o próximo item
                }

                const filmeId = horario.filmes.filmesId;
                const nomeFilme = horario.filmes.nomeFilme;

                if (!sessoesAgrupadas[filmeId]) {
                    sessoesAgrupadas[filmeId] = { nomeFilme, horarios: [] };
                }

                sessoesAgrupadas[filmeId].horarios.push({
                    id: horario.id,
                    horario: horario.horario
                });
            }
        });

        const sessoesContainer = document.getElementById('sessoesContainer') || document.createElement('div');
        sessoesContainer.id = 'sessoesContainer';
        document.body.appendChild(sessoesContainer);
        sessoesContainer.innerHTML = '';

        Object.entries(sessoesAgrupadas).forEach(([filmeId, filme]) => {
            const sessionController = document.createElement('div');
            sessionController.classList.add('SessionController');

            const sessions = document.createElement('div');
            sessions.classList.add('Sessions');

            const sessionCard = document.createElement('div');
            sessionCard.classList.add('SessionCard');

            const filmeName = document.createElement('h1');
            filmeName.textContent = filme.nomeFilme;
            sessionCard.appendChild(filmeName);

            filme.horarios.forEach(h => {
                const link = document.createElement('a');
                link.href = `../compraIngresso/compraIngresso.html?cinemaId=${cinemaId}&filmeId=${filmeId}&horario=${h.horario}&horarioId=${h.id}&data=${dataSelecionada}`;

                const button = document.createElement('button');
                button.classList.add('custom-button');
                button.textContent = h.horario;
                link.appendChild(button);
                sessionCard.appendChild(link);
            });

            sessions.appendChild(sessionCard);
            sessionController.appendChild(sessions);
            sessoesContainer.appendChild(sessionController);
        });

    } catch (error) {
        console.error('Erro ao carregar sessões:', error);
    }
}

function limparCinemasEHorarios() {
    const sessoesContainer = document.getElementById('sessoesContainer');
    if (sessoesContainer) {
        sessoesContainer.innerHTML = '';
    }
}

window.addEventListener('load', async () => {
    await carregarDetalhesCinema();
    await carregarDatasDisponiveis(); 
});
