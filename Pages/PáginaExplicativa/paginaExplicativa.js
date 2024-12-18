const params = new URLSearchParams(window.location.search);
const filmeId = params.get('filmeId'); // Pega o ID do filme da URL

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

    } catch (error) {
        console.error('Erro ao carregar os detalhes do filme:', error);
    }
}

// Chama a função para carregar os detalhes do filme assim que a página carregar
window.onload = carregarDetalhesFilme;
