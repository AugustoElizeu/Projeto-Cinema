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

    // Carregar diferentes conteúdos de HTML
    loadContent('/Pages/NavBar/navBar.html', 'content');
    loadContent('/Pages/FilmesSection/filmes.html', 'filmes');
    loadContent('/Pages/CinemaSection/cinema.html', 'cinemas');
    loadContent('/Pages/Footer/footer.html', 'footer');
    loadContent('/Pages/LoginAndSignUp/LoginForm/Login.html', 'login');
});