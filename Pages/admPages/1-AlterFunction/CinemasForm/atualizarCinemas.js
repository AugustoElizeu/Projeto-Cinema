document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#cinemaForm');  // Garantir que está pegando o form correto
    const nomeCinemaSelect = document.getElementById('nomeFantasia'); // Select para escolher o cinema
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
            select.innerHTML = '<option value="">Selecione um cinema</option>';

            data.forEach(cinema => {
                const option = document.createElement('option');
                option.value = cinema.cinemaId;
                option.textContent = cinema.nomeFantasia;
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
        cinemaId = nomeCinemaSelect.value;
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
            if (data) {
                document.getElementById('nomeFantasia1').value = data.nomeFantasia;
                document.getElementById('razaoSocial').value = data.razaoSocial;
                document.getElementById('cnpj').value = data.cnpj;
                document.getElementById('habilitado').value = data.habilitado ? 'true' : 'false'; // Mantenha habilidado aqui
                document.getElementById("valorIngresso").value = data.valorIngresso;

                // Salvar as URLs das imagens no frontend
                defaultCineIconUrl = data.urlCineIcon;
                defaultCineBannerUrl = data.urlCineBanner;

                // Exibir as imagens no frontend
                document.getElementById("imagemCinema").src = data.urlCineIcon;
                document.getElementById("bannerCinema").src = data.urlCineBanner;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do cinema:', error);
            alert('Erro ao buscar cinema. Verifique o console para mais detalhes.');
        });
    });

    // Evento de envio do formulário para atualizar o cinema
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!cinemaId) {
            alert("Por favor, selecione um cinema.");
            return;
        }

        // Coletando os dados do formulário
        const nomeFantasia = document.getElementById('nomeFantasia1').value;
        const razaoSocial = document.getElementById('razaoSocial').value;
        const cnpj = document.getElementById('cnpj').value;
        const habilitado = document.getElementById('habilitado').value === 'true'; // Manter habilidado aqui

        const cineIconInput = document.getElementById('urlCineIcon');
        const cineBannerInput = document.getElementById('urlCineBanner');

        // Coletando o valor de 'valorIngresso' e convertendo para número
        const valorIngresso = parseFloat(document.getElementById('valorIngresso').value);

        // Verificar se o valor de ingresso é válido
        if (isNaN(valorIngresso)) {
            alert('Por favor, insira um valor válido para o ingresso.');
            return;
        }

        // Inicializando as variáveis para as imagens
        let cineIconFile = cineIconInput.files.length > 0 ? cineIconInput.files[0] : null;
        let cineBannerFile = cineBannerInput.files.length > 0 ? cineBannerInput.files[0] : null;

        // URLs das imagens que serão enviadas
        let urlCineIcon = defaultCineIconUrl;
        let urlCineBanner = defaultCineBannerUrl;

        // Se o usuário enviou novos arquivos, usamos as novas URLs
        if (cineIconFile) {
            urlCineIcon = cineIconFile;
        }
        if (cineBannerFile) {
            urlCineBanner = cineBannerFile;
        }

        // Criando um objeto FormData para enviar os dados
        const formData = new FormData();
        formData.append('nomeFantasia', nomeFantasia);
        formData.append('razaoSocial', razaoSocial);
        formData.append('cnpj', cnpj);
        formData.append('habilitado', habilitado); // Manter habilidado aqui
        formData.append('valorIngresso', valorIngresso); // Enviar como número (Double)

        // Adicionando as imagens ao FormData, se houverem
        if (cineIconFile) {
            formData.append('urlCineIcon', cineIconFile);
        } else {
            formData.append('urlCineIcon', urlCineIcon);  // Enviar URL se não houver novo arquivo
        }

        if (cineBannerFile) {
            formData.append('urlCineBanner', cineBannerFile);
        } else {
            formData.append('urlCineBanner', urlCineBanner);  // Enviar URL se não houver novo arquivo
        }

        // Enviar o formData para o backend
        fetch(`http://localhost:8080/api/cinemas/atualizarcinema/${cinemaId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar cinema');
            }
            return response.json();
        })
        .then(data => {
            alert('Cinema atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao atualizar cinema. Verifique o console para mais detalhes.');
        });
    });
});
