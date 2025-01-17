document.addEventListener('DOMContentLoaded', function() {
    // Função para carregar conteúdo de arquivos HTML para os respectivos elementos
    function loadContent(url, elementId) {
        try {
            console.log(`Tentando carregar o conteúdo de: ${url}`); // Log para depuração
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar o arquivo: ${url} - Status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    const contentDiv = document.getElementById(elementId);
                    if (contentDiv) {
                        contentDiv.innerHTML = data;  // Substitui o conteúdo da página pelo conteúdo carregado
                        console.log("Conteúdo carregado com sucesso"); // Log para confirmar que o conteúdo foi carregado
                    } else {
                        console.error(`Elemento com id "${elementId}" não encontrado.`);
                    }
                })
                .catch(error => {
                    console.error(`Erro ao carregar o conteúdo: ${error.message}`);  // Log de erro
                });
        } catch (error) {
            console.error(`Erro inesperado ao tentar carregar ${url}: ${error.message}`);
        }
    }

    // Carregar conteúdo no elemento com id="nav"
    loadContent('/Pages/admPages/1-AlterFunction/admNav.html', 'navA');
});