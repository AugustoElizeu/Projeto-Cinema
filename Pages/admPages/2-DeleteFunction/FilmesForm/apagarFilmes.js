document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#apagarFilmeForm');
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
                document.getElementById('nomeFilme1').textContent = `Nome do Filme: ${data.nomeFilme}`;
                // Tornar a descrição em negrito
                document.getElementById('descricao').innerHTML = `<strong>Descrição do Filme:</strong> ${data.descricao}`;
                document.getElementById('classificacao').textContent = `Classificação Indicativa: ${data.classificacao}`;
                document.getElementById('genero').textContent = `Gênero do Filme: ${data.genero}`;
                document.getElementById('lancamento').textContent = `Lançamento do Filme: ${data.lançamento}`;
                document.getElementById('saidaCartaz').textContent = `Sai de Cartaz: ${data.saidaCartaz}`;

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

    // Evento de envio do formulário para apagar o filme
    form.addEventListener('submit', function (event) {
        event.preventDefault();  // Previne o comportamento padrão de envio do formulário

        if (!filmeId) {
            alert("Por favor, selecione um filme.");
            return;
        }

        // Confirmar a exclusão do filme
        if (confirm('Tem certeza que deseja apagar este filme?')) {
            // Usando a URL correta para deletar
            fetch(`http://localhost:8080/api/filmes/deletarfilme/${filmeId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao apagar o filme: ${response.status}`);
                }
                alert('Filme apagado com sucesso!');
                // Limpar os dados do filme na tela após exclusão
                document.getElementById('nomeFilme1').textContent = 'Nome do Filme:';
                document.getElementById('descricao').textContent = 'Descrição do Filme:';
                document.getElementById('classificacao').textContent = 'Classificação Indicativa:';
                document.getElementById('genero').textContent = 'Gênero do Filme:';
                document.getElementById('lancamento').textContent = 'Lançamento do Filme:';
                document.getElementById('saidaCartaz').textContent = 'Sai de Cartaz:';
                document.getElementById("imagemFilme").src = '';
                document.getElementById("bannerFilme").src = '';
                carregarFilmes();  // Recarregar os filmes na lista
            })
            .catch(error => {
                console.error('Erro ao apagar filme:', error);
                alert('Erro ao apagar filme. Verifique o console para mais detalhes.');
            });
        }
    });
});
