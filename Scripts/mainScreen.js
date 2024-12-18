async function carregarFilmesECinemas() {
    // Verifica a página atual
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.endsWith('index.html');
    
    try {
        // Fazendo a requisição para a API de filmes
        const filmesResponse = await fetch('http://localhost:8080/api/filmes');
        
        if (!filmesResponse.ok) {
            throw new Error('Erro ao carregar filmes'); 
        }

        const filmes = await filmesResponse.json();
        const filmesContainer = document.getElementById('filmesContainer');
        filmesContainer.innerHTML = '';  // Limpando o conteúdo anterior

        let filmesCount = 0;
        
        filmes.forEach(filme => {
            // Se estivermos na página principal e já passamos de 8 divs, não cria mais
            if (isIndexPage && filmesCount >= 8) return;

            const filmeCard = document.createElement('div');
            filmeCard.classList.add('FilmeCard');

            const link = document.createElement('a');
            // Variável específica para o ID do filme
            const filmeId = filme.filmesId; // Pegando o ID do filme do banco de dados
            link.href = `http://127.0.0.1:5500/Pages/PáginaExplicativa/PageExplicativa.html?filmeId=${filmeId}`;

            const movieBanner = document.createElement('div');
            movieBanner.classList.add('movieBanner');
            const movieImage = document.createElement('img');
            movieImage.src = filme.urlMoviePicture;
            movieImage.alt = filme.nomeFilme;
            movieBanner.appendChild(movieImage);

            const filmeNome = document.createElement('h3');
            filmeNome.textContent = filme.nomeFilme;

            link.appendChild(movieBanner);
            link.appendChild(filmeNome);
            filmeCard.appendChild(link);
            filmesContainer.appendChild(filmeCard);

            filmesCount++;  // Incrementa o contador de filmes
        });

        // Fazendo a requisição para a API de cinemas
        const cinemasResponse = await fetch('http://localhost:8080/api/cinemas');
        
        if (!cinemasResponse.ok) {
            throw new Error('Erro ao carregar cinemas');
        }

        const cinemas = await cinemasResponse.json();
        const cinemasContainer = document.getElementById('cinemasContainer');
        cinemasContainer.innerHTML = '';  // Limpando o conteúdo anterior

        cinemas.forEach(cinema => {
            const cinemaCard = document.createElement('div');
            cinemaCard.classList.add('CinemaCard');

            const link = document.createElement('a');
            // Variável específica para o ID do cinema
            const cinemaId = cinema.cinemaId; // Pegando o ID do cinema do banco de dados
            link.href = `http://127.0.0.1:5500/Pages/PáginaExplicativa(Cine)/PageExplicativaCine.html?cinemaId=${cinemaId}`;

            const nomeFantasia = document.createElement('h3');
            nomeFantasia.textContent = cinema.nomeFantasia;

            const cnpj = document.createElement('p');
            cnpj.textContent = `CNPJ: ${cinema.cnpj}`;

            link.appendChild(nomeFantasia);
            link.appendChild(cnpj);
            cinemaCard.appendChild(link);
            cinemasContainer.appendChild(cinemaCard);
        });

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Chama a função para carregar filmes e cinemas assim que a página for carregada
window.onload = carregarFilmesECinemas;
