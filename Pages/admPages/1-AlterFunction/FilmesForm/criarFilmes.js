document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    // Defina o tamanho máximo de arquivo permitido (em bytes)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB

    // Evento de envio do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        // Coletando os dados do formulário
        const nomeFilme = document.getElementById('nomeFilme').value;
        const urlMoviePicture = document.getElementById('urlMoviePicture').files[0];  // Arquivo, não URL
        const urlBannerPicture = document.getElementById('urlBannerPicture').files[0];  // Arquivo, não URL
        const descricao = document.getElementById('descricao').value;
        const classificacao = document.getElementById('classificacao').value;
        const genero = document.getElementById('genero').value;
        const lancamento = document.getElementById('lancamento').value;
        const saidaCartaz = document.getElementById('saidaCartaz').value;

        // Verificar se os arquivos são maiores que o tamanho máximo permitido
        if (urlMoviePicture && urlMoviePicture.size > MAX_FILE_SIZE) {
            alert('O tamanho da imagem do filme excede o limite de 10MB.');
            return;
        }

        if (urlBannerPicture && urlBannerPicture.size > MAX_FILE_SIZE) {
            alert('O tamanho da imagem do banner excede o limite de 10MB.');
            return;
        }

        // Criando um objeto FormData para enviar os dados incluindo os arquivos
        const formData = new FormData();
        formData.append('nomeFilme', nomeFilme);
        formData.append('urlMoviePicture', urlMoviePicture);
        formData.append('urlBannerPicture', urlBannerPicture);
        formData.append('descricao', descricao);
        formData.append('classificacao', classificacao);
        formData.append('genero', genero);
        formData.append('lancamento', lancamento);
        formData.append('saidaCartaz', saidaCartaz);

        // Enviando os dados para a API utilizando fetch
        fetch('http://localhost:8080/api/filmes/criarfilme', {
            method: 'POST',
            body: formData  // Usando FormData, não é necessário definir Content-Type
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Filme criado com sucesso!');

            // Exibir as imagens no frontend com o caminho do backend
            document.getElementById("imagemFilme").src = `http://localhost:8080/imagens/filmes/${data.urlMoviePicture}`;
            document.getElementById("bannerFilme").src = `http://localhost:8080/imagens/filmes/${data.urlBannerPicture}`;
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao criar filme. Verifique o console para mais detalhes.');
        });
    });
});
