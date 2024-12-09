document.getElementById('usuarioForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Previne o envio normal do formulário

    // Coletar os dados do formulário
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Adicionar a propriedade 'admin' com valor false
    formObject.admin = false;

    // Enviar os dados como JSON
    fetch('http://localhost:8080/api/usuario/criarusuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Usuário criado:', data);

        // Mostrar o popup quando a requisição for bem-sucedida
        document.getElementById('popup').style.display = 'flex';
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

// Fechar o popup quando o botão "X" for clicado
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});

// Fechar o popup clicando fora da caixa de conteúdo
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('popup')) {
        document.getElementById('popup').style.display = 'none';
    }
});
