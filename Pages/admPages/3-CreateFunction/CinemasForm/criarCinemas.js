document.addEventListener('DOMContentLoaded', function () {

    // Selecionando o formulário
    const form = document.querySelector('#cinemaForm');

    // Evento de envio do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        // Coletando os dados do formulário
        const nomeFantasia = document.getElementById('nomeFantasia').value;
        const razaoSocial = document.getElementById('razaoSocial').value;
        const cnpj = document.getElementById('cnpj').value;
        const urlCineIcon = document.getElementById('urlCineIcon').files[0];  // Arquivo, não URL
        const urlCineBanner = document.getElementById('urlCineBanner').files[0];  // Arquivo, não URL
        const habilidado = document.getElementById('habilidado').value === 'true';  // Converte para booleano
        const valorIngresso = document.getElementById('totalAmt').value; // Ajuste do ID para garantir compatibilidade

        // Criando um objeto FormData para enviar dados binários e texto
        const formData = new FormData();
        formData.append('nomeFantasia', nomeFantasia);
        formData.append('razaoSocial', razaoSocial);
        formData.append('cnpj', cnpj);
        formData.append('urlCineIcon', urlCineIcon);
        formData.append('urlCineBanner', urlCineBanner);
        formData.append('habilidado', habilidado);
        formData.append('valorIngresso', valorIngresso);

        // Enviando os dados para a API utilizando fetch
        fetch('http://localhost:8080/api/cinemas/criarcinema', {
            method: 'POST',
            body: formData, // O FormData será enviado como o corpo da requisição
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Cinema criado com sucesso!');

            // Exibir as imagens no frontend com o caminho do backend
            if (data.urlCineIcon) {
                document.getElementById("imagemCinema").src = `http://localhost:8080/imagens/cinemas/${data.urlCineIcon}`;
            }

            if (data.urlCineBanner) {
                document.getElementById("bannerCinema").src = `http://localhost:8080/imagens/cinemas/${data.urlCineBanner}`;
            }
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao criar cinema. Verifique o console para mais detalhes.');
        });
    });

});