document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#apagarCinemaForm');
    const nomeCinemaSelect = document.getElementById('nomeFantasia'); // Campo de nome do cinema (select)
    
    let cinemaId = null;  // Variável global para armazenar o ID do cinema selecionado
    let defaultCineIconUrl = null;
    let defaultCineBannerUrl = null;
    
    // Função para carregar todos os cinemas disponíveis
    function carregarCinemas() {
        fetch('http://localhost:8080/api/cinemas', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const select = nomeCinemaSelect;
            select.innerHTML = '<option value="">Selecione um cinema</option>'; // Limpar o select antes de popular
    
            data.forEach(cinema => {
                const option = document.createElement('option');
                option.value = cinema.cinemaId; // A chave correta é 'cinemaId' para o cinema
                option.textContent = cinema.nomeFantasia; // Nome do cinema
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar cinemas:', error);
            alert('Erro ao carregar cinemas. Verifique o console para mais detalhes.');
        });
    }
    
    // Carregar os cinemas assim que a página for carregada
    carregarCinemas();

// Evento de seleção de cinema
nomeCinemaSelect.addEventListener('change', function () {
        cinemaId = nomeCinemaSelect.value;  // Aqui o cinemaId é o valor do <option> selecionado
        console.log("ID selecionado:", cinemaId);

        if (!cinemaId) {
            alert("Por favor, selecione um cinema.");
            return;
        }

        // Buscar os dados do cinema selecionado
        fetch(`http://localhost:8080/api/cinemas/${cinemaId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Dados do cinema:", data);

            if (data) {
                // Preencher os campos com os dados do cinema
                document.getElementById('nomeFantasia1').textContent = `Nome Fantasia: ${data.nomeFantasia}`;
                document.getElementById('razaoSocial').textContent = `Razão Social: ${data.razaoSocial}`;
                document.getElementById('cnpj').textContent = `CNPJ: ${data.cnpj}`;
                document.getElementById('habilidado').textContent = `Habilitado.: ${data.habilidado ? 'Sim' : 'Não'}`;

                // Salvar as URLs das imagens no frontend
                defaultCineIconUrl = data.urlCineIcon;
                defaultCineBannerUrl = data.urlCineBanner;

                // Exibir as imagens no frontend
                document.getElementById("imagemCinema").src = data.urlCineIcon || 'default-icon.png';
                document.getElementById("bannerCinema").src = data.urlCineBanner || 'default-banner.png';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do cinema:', error);
            alert('Erro ao buscar cinema. Verifique o console para mais detalhes.');
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário
    
        if (!cinemaId) {
            alert("Por favor, selecione um cinema.");
            return;
        }
    
        // Confirmar a exclusão do cinema
        if (confirm('Tem certeza que deseja apagar este cinema?')) {
            // Usando a URL correta para deletar
            fetch(`http://localhost:8080/api/cinemas/deletarcinema/${cinemaId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao apagar o cinema: ${response.status}`);
                }
                alert('Cinema apagado com sucesso!');
                // Limpar os dados do cinema na tela após exclusão
                document.getElementById('nomeFantasia1').textContent = 'Nome Fantasia:';
                document.getElementById('razaoSocial').textContent = 'Razão Social:';
                document.getElementById('cnpj').textContent = 'CNPJ:';
                document.getElementById('habilidado').textContent = 'Habilitado:';
                document.getElementById("imagemCinema").src = '';
                document.getElementById("bannerCinema").src = '';
                carregarCinemas();  // Recarregar os cinemas na lista
            })
            .catch(error => {
                console.error('Erro ao apagar cinema:', error);
                alert('Erro ao apagar cinema. Verifique o console para mais detalhes.');
            });
        }
    });
});
