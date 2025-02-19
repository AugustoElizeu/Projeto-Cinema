document.addEventListener('DOMContentLoaded', function () {
    function carregarCinemas() {
        fetch('http://localhost:8080/api/cinemas/shortcinemas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Falha ao carregar cinemas: ' + response.statusText);
                }
                return response.json();
            })
            .then(cinemas => {
                const selectElement = document.getElementById('nomeFantasia');
                selectElement.innerHTML = '<option value="">Selecione um cinema</option>';

                if (cinemas && cinemas.length > 0) {
                    cinemas.forEach(cinema => {
                        const option = document.createElement('option');
                        option.value = cinema.id; // Usando cinema.id corretamente
                        option.textContent = cinema.nomeFantasia;
                        selectElement.appendChild(option);
                    });
                } else {
                    selectElement.innerHTML = '<option value="">Nenhum cinema encontrado</option>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar cinemas:', error);
                alert("Erro ao carregar cinemas. Verifique o console para mais detalhes.");
            });
    }

    carregarCinemas();

    const enderecoForm = document.getElementById('enderecoForm');
    enderecoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(enderecoForm);
        const enderecoDTO = {};

        formData.forEach((value, key) => {
            enderecoDTO[key] = value;
        });

        const cinemaId = document.getElementById('nomeFantasia').value;

        console.log("Cinema ID selecionado:", cinemaId); // Log para debug

        if (!cinemaId || cinemaId === "") {
            alert("Por favor, selecione um cinema válido.");
            return;
        }

        // O backend espera um campo "idCienama" no DTO
        enderecoDTO.idCienama = Number(cinemaId);

        console.log("Objeto enviado ao backend:", JSON.stringify(enderecoDTO)); // Verificando o JSON enviado

        fetch('http://localhost:8080/api/endereco/criarEndereco', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(enderecoDTO),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar o endereço');
            }
            return response.text();
        })
        .then(message => {
            alert(message); // Exibir a resposta do backend
            enderecoForm.reset();
        })
        .catch(error => {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao cadastrar endereço.');
        });
    });
});
