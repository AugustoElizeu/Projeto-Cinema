const params = new URLSearchParams(window.location.search);
const cinemaId = params.get('cinemaId'); // Pega o ID do cinema da URL

// Variável para armazenar os cinemas já exibidos
let filmesExibidos = [];

// Função para carregar os dados do cinema a partir do ID
async function carregarDetalhesCinema() {
    try {
        // Faz a requisição para buscar os dados do cinema no servidor
        const response = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o cinema');
        }
        
        const cinema = await response.json(); // Supondo que o servidor retorne um JSON com os dados do cinema
        
        // Seleciona a seção onde os dados serão inseridos (usando o id 'cineSection')
        const cinemaSection = document.getElementById('cineSection');
        
        // Cria a estrutura HTML da seção explicativa
        const explainCard = document.createElement('section');
        explainCard.classList.add('ExplainCard');

        const fotos = document.createElement('picture');
        fotos.classList.add('fotos');

        const bannerCard = document.createElement('div');
        bannerCard.classList.add('bannerCard');
        const bannerImage = document.createElement('img');
        bannerImage.classList.add('banner');
        
        // Usa a URL de banner fornecida pelo servidor
        bannerImage.src = cinema.urlCineBanner || 'https://ingresso-a.akamaihd.net/img/cinema/cover/cover_theater_1599.jpg'; 
        bannerImage.alt = cinema.nomeFantasia;
        bannerCard.appendChild(bannerImage);

        const profilePicDiv = document.createElement('div');
        const profileImage = document.createElement('img');
        profileImage.classList.add('Pfp');
        
        // Usa a URL de ícone fornecida pelo servidor
        profileImage.src = cinema.urlCineIcon || 'https://ingresso-a.akamaihd.net/img/cinema/avatar/avatarcorporation_15.svg'; 
        profileImage.alt = cinema.nomeFantasia;
        profilePicDiv.appendChild(profileImage);

        fotos.appendChild(bannerCard);
        fotos.appendChild(profilePicDiv);

        const explainationDiv = document.createElement('div');
        explainationDiv.classList.add('Explaination');
        
        // Usando as variáveis fornecidas para preencher as informações do cinema
        const title = document.createElement('h1');
        title.textContent = cinema.nomeFantasia || 'Nome não disponível'; // Nome do cinema
        
        const endereco = document.createElement('p');
        endereco.innerHTML = `Endereço: <span>${cinema.razaoSocial || 'Endereço não disponível'}</span>`; // Endereço do cinema

        const cnpj = document.createElement('p');
        cnpj.innerHTML = `CNPJ: <span>${cinema.cnpj || 'CNPJ não disponível'}</span>`; // CNPJ do cinema

        const habilitado = document.createElement('p');
        habilitado.textContent = `Habilitado: ${cinema.habilidado ? 'Sim' : 'Não'}`; // Habilitação do cinema
        
        // Adiciona os elementos criados ao container de explicação
        explainationDiv.appendChild(title);
        explainationDiv.appendChild(endereco);
        explainationDiv.appendChild(cnpj);
        explainationDiv.appendChild(habilitado);

        // Adiciona os elementos criados à seção
        explainCard.appendChild(fotos);
        explainCard.appendChild(explainationDiv);
        cinemaSection.appendChild(explainCard);

    } catch (error) {
        console.error('Erro ao carregar os detalhes do cinema:', error);
    }
}


async function carregarHorarios() {
    try {
        // Faz a requisição para buscar os dados de horários no servidor
        const responseHorarios = await fetch('http://localhost:8080/api/horarios');
        if (!responseHorarios.ok) {
            throw new Error('Erro ao carregar os horários');
        }
        
        const horarios = await responseHorarios.json(); // Supondo que o servidor retorne um JSON com os dados de horários

        // Pega o cinemaId da URL
        const params = new URLSearchParams(window.location.search);
        const cinemaId = params.get('cinemaId'); // Pega o ID do cinema da URL

        // Lista para armazenar combinações de cinemas e filmes já exibidos
        let cinemasExibidos = [];

        // Agora, vamos verificar se o cinemaId da URL é igual ao cinemaId de cada item de horário
        horarios.forEach(horario => {
            const cinemaIdNoHorario = horario.cinemas.cinemaId; // Pega o cinemaId do horário atual
            const isCinemaIdIgual = cinemaId == cinemaIdNoHorario; // Compara o cinemaId da URL com o cinemaId do JSON

            // Se for verdadeiro e o cinema já foi exibido com o filme
            if (isCinemaIdIgual) {
                const nomeFilme = horario.filmes.nomeFilme; // Pega o nome do filme
                const filmeId = horario.filmes.filmesId; // Pega o filmeId

                console.log(`Filme encontrado! Nome do Filme: ${nomeFilme}`);

                // Verifica se o filme já foi exibido no cinema específico
                if (!cinemasExibidos.some(item => item.cinemaId === cinemaId && item.filmeId === filmeId)) {
                    // Filtra os horários para esse cinema e filme
                    const horariosDisponiveis = horarios.filter(h => h.filmes.filmesId === filmeId && h.cinemas.cinemaId == cinemaId)
                                                        .map(h => h.horario);

                    // Criando a div para o cinema
                    const sessionController = document.createElement('div');
                    sessionController.classList.add('SessionController');
                    
                    const sessions = document.createElement('div');
                    sessions.classList.add('Sessions');
                    
                    const sessionCard = document.createElement('div');
                    sessionCard.classList.add('SessionCard');
                    
                    const filmeName = document.createElement('h1');
                    filmeName.textContent = nomeFilme; // Nome do filme

                    sessionCard.appendChild(filmeName);

                    // Adicionando os horários como links (sem o <form>)
                    horariosDisponiveis.forEach(horario => {
                        // Criação de um link <a> com o href para a página de compra de ingressos
                        const link = document.createElement('a');
                        link.href = `../compraIngresso/compraIngresso.html?cinemaId=${cinemaId}&horario=${horario}`;

                        const button = document.createElement('button');
                        button.classList.add('custom-button');
                        button.setAttribute('data-value', horario); // Usando o horário do JSON
                        button.textContent = horario; // Exibe o horário no botão
                        link.appendChild(button); // Adiciona o botão ao link

                        sessionCard.appendChild(link); // Adiciona o link com o botão ao card da sessão
                    });

                    sessions.appendChild(sessionCard);
                    sessionController.appendChild(sessions);

                    // Adiciona a div criada na página
                    document.body.appendChild(sessionController);

                    // Adiciona a combinação cinemaId e filmeId à lista para evitar repetição
                    cinemasExibidos.push({ cinemaId, filmeId });
                } else {
                    console.log(`Filme '${nomeFilme}' já exibido nesse cinema.`);
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar os horários:', error);
    }
}

window.addEventListener('load', () => {
    carregarHorarios();
    carregarDetalhesCinema();
});