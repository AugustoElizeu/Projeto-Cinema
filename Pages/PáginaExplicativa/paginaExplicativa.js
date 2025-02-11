const params = new URLSearchParams(window.location.search);
const filmeId = params.get('filmeId'); // Pega o ID do filme da URL

let cinemasExibidos = [];
let primeiraData = null; // Variável para armazenar a primeira data encontrada
let horariosCache = []; // Armazena os horários
let detalhesDoFilme = null; // Variável para armazenar os detalhes do filme carregados

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

// Função para carregar os dados do filme a partir do ID
async function carregarDetalhesFilme() {
    if (!detalhesDoFilme) { // Se não tiver os dados do filme, carrega do banco de dados
        try {
            const response = await fetch(`http://localhost:8080/api/filmes/${filmeId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar o filme');
            }

            detalhesDoFilme = await response.json(); // Armazena os detalhes do filme na variável

            const movieSection = document.getElementById('movieSection');
            
            const explainCard = document.createElement('section');
            explainCard.classList.add('ExplainCard');
            
            const fotos = document.createElement('picture');
            fotos.classList.add('fotos');
            
            const bannerCard = document.createElement('div');
            bannerCard.classList.add('bannerCard');
            const bannerImage = document.createElement('img');
            bannerImage.classList.add('banner');
            bannerImage.src = detalhesDoFilme.urlBannerPicture || 'default-banner.jpg';
            bannerImage.alt = detalhesDoFilme.nomeFilme;
            bannerCard.appendChild(bannerImage);

            const profilePicDiv = document.createElement('div');
            const profileImage = document.createElement('img');
            profileImage.classList.add('Pfp');
            profileImage.src = detalhesDoFilme.urlMoviePicture || 'default-profile.jpg';
            profileImage.alt = detalhesDoFilme.nomeFilme;
            profilePicDiv.appendChild(profileImage);

            fotos.appendChild(bannerCard);
            fotos.appendChild(profilePicDiv);

            const explainationDiv = document.createElement('div');
            explainationDiv.classList.add('Explaination');
            const title = document.createElement('h1');
            title.textContent = detalhesDoFilme.nomeFilme;
            
            const classificacao = document.createElement('p');
            classificacao.textContent = `Classificação: ${detalhesDoFilme.classificacao} anos`;
            
            const genero = document.createElement('p');
            genero.textContent = `Gênero: ${detalhesDoFilme.genero}`;

            const lancamento = document.createElement('p');
            lancamento.textContent = `Lançamento: ${detalhesDoFilme.lancamento}`;
            
            const descricao = document.createElement('p');
            descricao.textContent = `Descrição: ${detalhesDoFilme.descricao || "Descrição não disponível."}`;

            explainationDiv.appendChild(title);
            explainationDiv.appendChild(classificacao);
            explainationDiv.appendChild(genero);
            explainationDiv.appendChild(lancamento);
            explainationDiv.appendChild(descricao); 

            explainCard.appendChild(fotos);
            explainCard.appendChild(explainationDiv);
            movieSection.appendChild(explainCard);

        } catch (error) {
            console.error('Erro ao carregar os detalhes do filme:', error);
        }
    } else {
        // Se já tiver os detalhes do filme, renderize diretamente sem fazer a requisição
        const movieSection = document.getElementById('movieSection');
        
        const explainCard = document.createElement('section');
        explainCard.classList.add('ExplainCard');
        
        const fotos = document.createElement('picture');
        fotos.classList.add('fotos');
        
        const bannerCard = document.createElement('div');
        bannerCard.classList.add('bannerCard');
        const bannerImage = document.createElement('img');
        bannerImage.classList.add('banner');
        bannerImage.src = detalhesDoFilme.urlBannerPicture || 'default-banner.jpg';
        bannerImage.alt = detalhesDoFilme.nomeFilme;
        bannerCard.appendChild(bannerImage);

        const profilePicDiv = document.createElement('div');
        const profileImage = document.createElement('img');
        profileImage.classList.add('Pfp');
        profileImage.src = detalhesDoFilme.urlMoviePicture || 'default-profile.jpg';
        profileImage.alt = detalhesDoFilme.nomeFilme;
        profilePicDiv.appendChild(profileImage);

        fotos.appendChild(bannerCard);
        fotos.appendChild(profilePicDiv);

        const explainationDiv = document.createElement('div');
        explainationDiv.classList.add('Explaination');
        const title = document.createElement('h1');
        title.textContent = detalhesDoFilme.nomeFilme;
        
        const classificacao = document.createElement('p');
        classificacao.textContent = `Classificação: ${detalhesDoFilme.classificacao} anos`;
        
        const genero = document.createElement('p');
        genero.textContent = `Gênero: ${detalhesDoFilme.genero}`;

        const lancamento = document.createElement('p');
        lancamento.textContent = `Lançamento: ${detalhesDoFilme.lancamento}`;
        
        const descricao = document.createElement('p');
        descricao.textContent = `Descrição: ${detalhesDoFilme.descricao || "Descrição não disponível."}`;

        explainationDiv.appendChild(title);
        explainationDiv.appendChild(classificacao);
        explainationDiv.appendChild(genero);
        explainationDiv.appendChild(lancamento);
        explainationDiv.appendChild(descricao); 

        explainCard.appendChild(fotos);
        explainCard.appendChild(explainationDiv);
        movieSection.appendChild(explainCard);
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
            const filmeIdNoHorario = horario.filmes.filmesId;
            const isFilmeIdIgual = filmeId == filmeIdNoHorario;

            if (isFilmeIdIgual) {
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
        limparCinemasEHorarios(); // Remove os cinemas e horários anteriores corretamente

        let cinemasAgrupados = {};

        // Filtra apenas os horários do filme específico e da data selecionada
        horariosCache.forEach(horario => {
            if (horario.data === dataSelecionada && horario.filmes.filmesId == filmeId) { 
                const cinemaId = horario.cinemas.cinemaId;
                const nomeCinema = horario.cinemas.nomeFantasia;

                if (!cinemasAgrupados[cinemaId]) {
                    cinemasAgrupados[cinemaId] = { nomeCinema, horarios: [] };
                }

                cinemasAgrupados[cinemaId].horarios.push({
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
        if (Object.keys(cinemasAgrupados).length === 0) {
            const noSessionsMessage = document.createElement('p');
            noSessionsMessage.textContent = 'Não há sessões disponíveis para esta data.';
            sessoesContainer.appendChild(noSessionsMessage);
            return;
        }

        Object.entries(cinemasAgrupados).forEach(([cinemaId, cinema]) => {
            // **Verifica se o cinema tem horários antes de criar o SessionController**
            if (cinema.horarios.length > 0) {
                const sessionController = document.createElement('div');
                sessionController.classList.add('SessionController');

                const sessions = document.createElement('div');
                sessions.classList.add('Sessions');

                const sessionCard = document.createElement('div');
                sessionCard.classList.add('SessionCard');

                const cinemaName = document.createElement('h2');
                cinemaName.textContent = cinema.nomeCinema;
                sessionCard.appendChild(cinemaName);

                cinema.horarios.forEach(h => {
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
function limparCinemasEHorarios() {
    const sessoesContainer = document.getElementById('sessoesContainer');
    if (sessoesContainer) {
        sessoesContainer.innerHTML = ''; // Remove todos os elementos corretamente
    }
}




// Chama a função para carregar os detalhes do filme assim que a página carregar
window.onload = async () => {
    await carregarDetalhesFilme();
    await carregarHorarios(); // Carregar horários depois que o filme for carregado
    verificarEAlterarEstilo(); // Verifica e altera o estilo dos 'SessionController' após o carregamento
};
