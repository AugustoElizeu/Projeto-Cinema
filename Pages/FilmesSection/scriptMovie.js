async function carregarFilmes() {
    try {
        // Fazendo a requisição para a API
        const response = await fetch('http://localhost:8080/api/filmes');  // URL do backend

        // Verificar se a resposta da API foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar filmes');
        }

        // Converte a resposta da API em formato JSON
        const filmes = await response.json();

        // Pegando o container onde os filmes serão inseridos
        const filmesContainer = document.getElementById('filmesContainer');
        
        // Limpando qualquer conteúdo antigo
        filmesContainer.innerHTML = '';

        // Iterando sobre os filmes e criando as divs dinamicamente
        filmes.forEach(filme => {
            // Criando o card do filme
            const filmeCard = document.createElement('div');
            filmeCard.classList.add('FilmeCard');  // Adicionando a classe

            // Criando um link com o ID do filme
            const link = document.createElement('a');
            link.href = `http://localhost:8080/api/filmes/${filme.filmesId}`;  // Usando o ID do filme para chamar a rota

            // Adicionando conteúdo do filme (imagem e nome)
            const movieBanner = document.createElement('div');
            movieBanner.classList.add('movieBanner');
            const movieImage = document.createElement('img');
            movieImage.src = filme.urlMoviePicture;
            movieImage.alt = filme.nomeFilme;
            movieBanner.appendChild(movieImage);

            const filmeNome = document.createElement('h3');
            filmeNome.textContent = filme.nomeFilme;

            // Adicionando todos os elementos no link
            link.appendChild(movieBanner);
            link.appendChild(filmeNome);

            // Adicionando o card do filme ao container
            filmeCard.appendChild(link);
            filmesContainer.appendChild(filmeCard);
        });

    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

// Chama a função para carregar os filmes assim que a página for carregada
window.onload = carregarFilmes;
