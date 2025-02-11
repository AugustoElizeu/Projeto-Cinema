document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o envio do formulário padrão (recarga da página)

    // Captura os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    // Envia os dados para o backend (API)
    fetch('http://localhost:8080/api/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, senha: senha })  // Dados enviados no corpo da requisição
    })
    .then(response => response.text())  // Espera uma resposta como texto simples
    .then(data => {
        // Se o login for bem-sucedido
        if (data === "Login realizado com sucesso!") {
            alert('Login bem-sucedido!');
            // Redireciona para outra página após login bem-sucedido
            window.location.href = "../../../Pages/admPages/mainScreen.html";  // Redirecionamento para a página inicial, por exemplo
        } else {
            alert('Erro de login: ' + data);  // Exibe mensagem de erro se as credenciais forem inválidas
        }
    })
    .catch(error => {
        console.error('Erro de comunicação com o servidor:', error);
        alert('Erro de comunicação com o servidor.');
    });
});
