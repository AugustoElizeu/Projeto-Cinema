async function carregarCinemas() {
    try {
        // Fazendo a requisição para a API de cinemas
        const response = await fetch('http://localhost:8080/api/cinemas');  // URL do backend para cinemas

        // Verificar se a resposta da API foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar cinemas');
        }

        // Converte a resposta da API em formato JSON
        const cinemas = await response.json();

        // Pegando o container onde os cinemas serão inseridos
        const cinemasContainer = document.getElementById('cinemasContainer');
        
        // Limpando qualquer conteúdo antigo
        cinemasContainer.innerHTML = '';

        // Iterando sobre os cinemas e criando as divs dinamicamente
        cinemas.forEach(cinema => {
            // Criando o card do cinema
            const cinemaCard = document.createElement('div');
            cinemaCard.classList.add('CinemaCard');  // Adicionando a classe

            // Criando o link com o ID do cinema
            const link = document.createElement('a');
            const cinemaId = cinema.cinemaId || cinema.id; // Ajuste para garantir que o campo correto seja usado
            link.href = `http://127.0.0.1:5500/Pages/PáginaExplicativa(Cine)/PageExplicativaCine.html?cinemaId=${cinemaId}`;  // Link com o ID do cinema

            // Criando o nome do cinema
            const nomeFantasia = document.createElement('h3');
            nomeFantasia.textContent = cinema.nomeFantasia;

            // Criando o endereço do cinema
            const cnpj = document.createElement('p');
            cnpj.textContent = `Endereço: ${cinema.cnpj}`;

            // Adicionando o nome e o endereço no link
            link.appendChild(nomeFantasia);
            link.appendChild(cnpj);

            // Adicionando o card do cinema ao container
            cinemaCard.appendChild(link);
            cinemasContainer.appendChild(cinemaCard);
        });

    } catch (error) {
        console.error('Erro ao carregar cinemas:', error);
    }
}

// Chama a função para carregar os cinemas assim que a página for carregada
window.onload = carregarCinemas;
