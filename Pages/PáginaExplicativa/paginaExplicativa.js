const params = new URLSearchParams(window.location.search);
const filmeId = params.get('filmeId'); // Pega o ID do filme da URL

// Variável para armazenar os cinemas já exibidos
let cinemasExibidos = [];

// Função para carregar os dados do filme a partir do ID
async function carregarDetalhesFilme() {
    try {
        // Faz a requisição para buscar os dados do filme no servidor
        const response = await fetch(`http://localhost:8080/api/filmes/${filmeId}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o filme');
        }
        
        const filme = await response.json(); // Supondo que o servidor retorne um JSON com os dados do filme
        
        // Seleciona a seção onde os dados serão inseridos
        const movieSection = document.getElementById('movieSection');
        
        // Cria a estrutura HTML da seção explicativa
        const explainCard = document.createElement('section');
        explainCard.classList.add('ExplainCard');

        const fotos = document.createElement('picture');
        fotos.classList.add('fotos');

        const bannerCard = document.createElement('div');
        bannerCard.classList.add('bannerCard');
        const bannerImage = document.createElement('img');
        bannerImage.classList.add('banner');
        bannerImage.src = filme.urlBannerPicture || 'default-banner.jpg'; // Coloca a URL do banner ou uma imagem padrão
        bannerImage.alt = filme.nomeFilme;
        bannerCard.appendChild(bannerImage);

        const profilePicDiv = document.createElement('div');
        const profileImage = document.createElement('img');
        profileImage.classList.add('Pfp');
        profileImage.src = filme.urlMoviePicture || 'default-profile.jpg'; // Coloca a URL da imagem do filme ou uma imagem padrão
        profileImage.alt = filme.nomeFilme;
        profilePicDiv.appendChild(profileImage);

        fotos.appendChild(bannerCard);
        fotos.appendChild(profilePicDiv);

        const explainationDiv = document.createElement('div');
        explainationDiv.classList.add('Explaination');
        const title = document.createElement('h1');
        title.textContent = filme.nomeFilme;
        
        const classificacao = document.createElement('p');
        classificacao.textContent = `Classificação: ${filme.classificacao} estrelas`;
        
        const genero = document.createElement('p');
        genero.textContent = `Gênero: ${filme.genero}`;

        const lancamento = document.createElement('p');
        lancamento.textContent = `Lançamento: ${filme.lancamento}`;
        
        const descricao = document.createElement('p');
        descricao.textContent = `Descrição: ${filme.descricao || "Descrição não disponível."}`;

        explainationDiv.appendChild(title);
        explainationDiv.appendChild(classificacao);
        explainationDiv.appendChild(genero);
        explainationDiv.appendChild(lancamento);
        explainationDiv.appendChild(descricao); // Adiciona a descrição

        // Adiciona os elementos criados à seção
        explainCard.appendChild(fotos);
        explainCard.appendChild(explainationDiv);
        movieSection.appendChild(explainCard);

        // Carregar os horários do cinema
        await carregarHorarios();

    } catch (error) {
        console.error('Erro ao carregar os detalhes do filme:', error);
    }
}

// Função para carregar os horários e comparar o filmeId
async function carregarHorarios() {
    try {
        // Faz a requisição para buscar os dados de horários no servidor
        const responseHorarios = await fetch('http://localhost:8080/api/horarios');
        if (!responseHorarios.ok) {
            throw new Error('Erro ao carregar os horários');
        }
        
        const horarios = await responseHorarios.json(); // Supondo que o servidor retorne um JSON com os dados de horários

        // Pega o filmeId da URL
        const params = new URLSearchParams(window.location.search);
        const filmeId = params.get('filmeId'); // Pega o ID do filme da URL

        // Lista para armazenar cinemas já exibidos
        let cinemasExibidos = [];

        // Agora, vamos verificar se o filmeId da URL é igual ao filmeId de cada item de horário
        horarios.forEach(horario => {
            const filmeIdNoHorario = horario.filmes.filmesId; // Pega o filmesId do horário atual
            const cinemaId = horario.cinemas.cinemaId
            const isFilmeIdIgual = filmeId == filmeIdNoHorario; // Compara o filmeId da URL com o filmeId do JSON

            // Se for verdadeiro e o nome do cinema ainda não foi exibido
            if (isFilmeIdIgual) {
                const nomeCinema = horario.cinemas.nomeFantasia; // Pega o nome do cinema

                console.log(`Filme encontrado! Nome do Cinema: ${nomeCinema}`);

                // Verifica se o nome do cinema já foi exibido
                if (!cinemasExibidos.includes(nomeCinema)) {
                    // Filtra os horários para esse cinema
                    const horariosDisponiveis = horarios.filter(h => h.cinemas.nomeFantasia === nomeCinema && h.filmes.filmesId == filmeId)
                                                        .map(h => h.horario);
                    
                    const idHorariosDisponiveis = horarios.filter(h => h.cinemas.nomeFantasia === nomeCinema && h.filmes.filmesId == filmeId)
                                                        .map(h => h.id);

                    // Criando a div para o cinema
                    const sessionController = document.createElement('div');
                    sessionController.classList.add('SessionController');
                    
                    const sessions = document.createElement('div');
                    sessions.classList.add('Sessions');
                    
                    const sessionCard = document.createElement('div');
                    sessionCard.classList.add('SessionCard');
                    
                    const cinemaName = document.createElement('h1');
                    cinemaName.textContent = nomeCinema; // Nome do cinema

                    sessionCard.appendChild(cinemaName);

                    function divHorario(horario, haga) {
                        const horarioId = haga;  // 'haga' será o ID do horário correspondente
                    
                        // Criando o link
                        const link = document.createElement('a');
                        link.href = `../compraIngresso/compraIngresso.html?cinemaId=${cinemaId}&filmeId=${filmeId}&horario=${horario}&horarioId=${horarioId}`;
                    
                        // Criação de um botão <button> com o horário
                        const button = document.createElement('button');
                        button.classList.add('custom-button');
                        button.setAttribute('data-value', horario); // Usando o horário do JSON
                        button.textContent = horario; // Exibe o horário no botão
                        link.appendChild(button); // Adiciona o botão ao link
                    
                        // Adiciona o link com o botão ao card da sessão
                        sessionCard.appendChild(link);
                    }
                    
                    // Adicionando os horários como links
                    horariosDisponiveis.forEach((horario, index) => {
                        divHorario(horario, idHorariosDisponiveis[index]); // Passa o horário e o ID correspondente
                    });

                    sessions.appendChild(sessionCard);
                    sessionController.appendChild(sessions);

                    // Adiciona a div criada na página
                    document.body.appendChild(sessionController);

                    // Adiciona o nome do cinema à lista para evitar repetição
                    cinemasExibidos.push(nomeCinema);
                } else {
                    console.log(`Cinema '${nomeCinema}' já exibido.`);
                }
            }
        });

    } catch (error) {
        console.error('Erro ao carregar os horários:', error);
    }
}


// Chama a função para carregar os horários assim que a página carregar
window.onload = carregarHorarios;


// Chama a função para carregar os detalhes do filme assim que a página carregar
window.onload = carregarDetalhesFilme;
