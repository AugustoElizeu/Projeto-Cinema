async function carregarFilmes() {
    // Verifica se estamos na página "index.html"
    const currentPage = window.location.pathname;
    const isIndexPage = currentPage.endsWith('index.html');

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

        let count = 0;  // Variável para contar as divs criadas

        // Iterando sobre os filmes e criando as divs dinamicamente
        filmes.forEach(filme => {
            // Se estivermos na página "index.html" e já tiver criado 8 divs, não cria mais
            if (isIndexPage && count >= 8) {
                return;
            }

            // Criando o card do filme
            const filmeCard = document.createElement('div');
            filmeCard.classList.add('FilmeCard');  // Adicionando a classe

            // Criando um link para a página explicativa, passando o ID do filme
            const link = document.createElement('a');
            const filmeId = filme.filmesId || filme.id; // Obtendo o ID do filme da resposta da API
            link.href = `http://127.0.0.1:5500/Pages/PáginaExplicativa/PageExplicativa.html?filmeId=${filmeId}`;  // Incluindo o ID do filme na URL

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

            // Incrementando o contador de divs criadas
            count++;
        });

    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

// Chama a função para carregar os filmes assim que a página for carregada
window.onload = carregarFilmes;
