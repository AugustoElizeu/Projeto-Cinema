acao1 = document.getElementById("filmes");
acao2 = document.getElementById("cinemas");

document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar conteúdo de arquivos HTML para os respectivos elementos
    function loadContent(url, elementId) {
        try {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar o arquivo: ${url}`);
                    }
                    return response.text();
                })
                .then(data => {
                    const contentDiv = document.getElementById(elementId);
                    if (contentDiv) {
                        contentDiv.innerHTML = data;  // Substitui o conteúdo da página pelo conteúdo carregado
                    } else {
                        console.error(`Elemento com id "${elementId}" não encontrado.`);
                    }
                })
                .catch(error => {
                    console.error(error.message);  // Logar qualquer erro que ocorra no processo
                });
        } catch (error) {
            console.error(`Erro inesperado ao tentar carregar ${url}: ${error.message}`);
        }
    }
    loadContent('/Pages/NavBar/navBar.html', 'content');

   try {
    // Verifica a condição
    if (acao1.id === "filmes" && acao2.id === "cinemas") {
        // Tenta carregar o conteúdo, caso a condição seja verdadeira
        loadContent('../Pages/FilmesSection/filmes.html', 'filmes');
        loadContent('/Pages/CinemaSection/cinema.html', 'cinemas');
    }
    } catch (error) {
        // Se ocorrer algum erro, o bloco catch será executado
        console.error('Algo diferente da página principal:', error);
    }
    loadContent('/Pages/Footer/footer.html', 'footer');
});