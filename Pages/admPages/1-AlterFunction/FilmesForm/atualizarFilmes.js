document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#atualizarFilmeForm');
    const nomeFilmeSelect = document.getElementById('nomeFilme'); // Campo de nome do filme (select)
    
    let filmeId = null;  // Variável global para armazenar o ID do filme selecionado
    let defaultMoviePictureUrl = null;
    let defaultBannerPictureUrl = null;

    // Função para carregar todos os filmes disponíveis
    function carregarFilmes() {
        fetch('http://localhost:8080/api/filmes', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const select = nomeFilmeSelect;
            select.innerHTML = '<option value="">Selecione um filme</option>';

            data.forEach(filme => {
                const option = document.createElement('option');
                option.value = filme.filmesId; // A chave é 'filmesId', não 'nomeFilme'
                option.textContent = filme.nomeFilme;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar filmes:', error);
            alert('Erro ao carregar filmes. Verifique o console para mais detalhes.');
        });
    }

    // Carrega os filmes assim que a página for carregada
    carregarFilmes();

    // Evento de seleção de filme
    nomeFilmeSelect.addEventListener('change', function () {
        filmeId = nomeFilmeSelect.value;  // Aqui o filmeId é o valor do <option> selecionado
        console.log("ID selecionado:", filmeId);

        if (!filmeId) {
            alert("Por favor, selecione um filme.");
            return;
        }

        // Buscar os dados do filme selecionado
        fetch(`http://localhost:8080/api/filmes/${filmeId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Dados do filme:", data);

            if (data) {
                document.getElementById('nomeFilme1').value = data.nomeFilme;
                document.getElementById('descricao').value = data.descricao;
                document.getElementById('classificacao').value = data.classificacao;
                document.getElementById('genero').value = data.genero;
                document.getElementById('lancamento').value = data.lancamento;
                document.getElementById('saidaCartaz').value = data.saidaCartaz;

                // Salvar as URLs das imagens no frontend
                defaultMoviePictureUrl = data.urlMoviePicture;
                defaultBannerPictureUrl = data.urlBannerPicture;

                // Exibir as imagens no frontend
                document.getElementById("imagemFilme").src = data.urlMoviePicture;
                document.getElementById("bannerFilme").src = data.urlBannerPicture;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error);
            alert('Erro ao buscar filme. Verifique o console para mais detalhes.');
        });
    });

    // Evento de envio do formulário para atualizar o filme
    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        if (!filmeId) {
            alert("Por favor, selecione um filme.");
            return;
        }

        // Coletando os dados do formulário
        const nomeFilme = document.getElementById('nomeFilme1').value;

        // Pegando os arquivos das imagens do input[type="file"]
        const moviePictureInput = document.getElementById('urlMoviePicture'); // Input do filme
        const bannerPictureInput = document.getElementById('urlBannerPicture');  // Input do banner

        // Inicializando as variáveis para os arquivos
        let moviePictureFile = moviePictureInput.files[0]; // Arquivo do filme (se selecionado)
        let bannerPictureFile = bannerPictureInput.files[0]; // Arquivo do banner (se selecionado)

        // Coletando os outros dados
        const descricao = document.getElementById('descricao').value;
        const classificacao = document.getElementById('classificacao').value;
        const genero = document.getElementById('genero').value;
        const lancamento = document.getElementById('lancamento').value;
        const saidaCartaz = document.getElementById('saidaCartaz').value;

        // Criando o FormData
        const formData = new FormData();
        formData.append('nomeFilme', nomeFilme);
        formData.append('descricao', descricao);
        formData.append('classificacao', classificacao);
        formData.append('genero', genero);
        formData.append('lancamento', lancamento);
        formData.append('saidaCartaz', saidaCartaz);

        // Se o usuário selecionou uma imagem, anexa ao FormData
        if (moviePictureFile) {
            formData.append('urlMoviePicture', moviePictureFile);  // Enviar arquivo de imagem do filme
        } else {
            // Se não houver nova imagem, envia nada para o campo urlMoviePicture (não adiciona no FormData)
            // O backend deve lidar com a ausência dessa parte corretamente (ou usar a URL padrão)
        }

        if (bannerPictureFile) {
            formData.append('urlBannerPicture', bannerPictureFile);  // Enviar arquivo de imagem do banner
        } else {
            // Se não houver novo banner, envia nada para o campo urlBannerPicture (não adiciona no FormData)
        }

        // Enviar os dados para a API
        fetch(`http://localhost:8080/api/filmes/atualizarfilme/${filmeId}`, {
            method: 'PUT',  // Usar PUT para atualizar
            body: formData  // Usando FormData, não é necessário definir Content-Type
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Filme atualizado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
            alert('Erro ao atualizar filme. Verifique o console para mais detalhes.');
        });
    });

});
