const params = new URLSearchParams(window.location.search);
const cinemaId = params.get('cinemaId'); // Pega o ID do cinema da URL

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

// Chama a função para carregar os detalhes do cinema assim que a página carregar
window.onload = carregarDetalhesCinema;
