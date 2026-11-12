// Endereço da sua API
const API_URL = 'http://localhost:3000/api';

// Elementos do DOM
const formulario = document.getElementById('meuFormulario');
const nomeInput = document.getElementById('nomeInput');
const listaDados = document.getElementById('listaDados');

// Função para buscar e exibir os dados salvos no banco
async function carregarDados() {
    try {
        const resposta = await fetch(API_URL);
        const resultado = await resposta.json();

        listaDados.innerHTML = '';

        if (resultado.dados && resultado.dados.length > 0) {
            resultado.dados.forEach(item => {
                const li = document.createElement('li');
                
                const dataFormatada = new Date(item.criadoEm).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                li.innerHTML = `
                    <div class="item-info">
                        <span>${item.nome}</span>
                        <small style="color: #7f8c8d; font-size: 0.8rem; display: block;">${dataFormatada}</small>
                    </div>
                    <div class="acoes">
                        <button class="btn-editar" onclick="editarItem('${item._id}', '${item.nome}')">Editar</button>
                        <button class="btn-excluir" onclick="deletarItem('${item._id}')">Excluir</button>
                    </div>
                `;
                listaDados.appendChild(li);
            });
        } else {
            listaDados.innerHTML = '<li style="border-left-color: #bdc3c7; color: #7f8c8d; justify-content: center;">Nenhum dado cadastrado ainda.</li>';
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        listaDados.innerHTML = '<li style="border-left-color: #e74c3c; color: #e74c3c; justify-content: center;">Erro ao conectar com o servidor.</li>';
    }
}

// Função para editar um item
async function editarItem(id, nomeAntigo) {
    const novoNome = prompt('Edite o valor:', nomeAntigo);
    
    // Se o usuário cancelar ou deixar vazio, não faz nada
    if (novoNome === null || novoNome.trim() === '') return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: novoNome.trim() })
        });

        if (resposta.ok) {
            carregarDados(); // Atualiza a lista
        } else {
            alert('Erro ao atualizar o item.');
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Não foi possível conectar ao servidor para atualizar.');
    }
}

// Função para excluir um item
async function deletarItem(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (resposta.ok) {
            carregarDados();
        } else {
            alert('Erro ao excluir o item.');
        }
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Não foi possível conectar ao servidor para excluir.');
    }
}

// Evento de envio do formulário (Criar)
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    if (!nome) return;

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome })
        });

        if (resposta.ok) {
            nomeInput.value = '';
            carregarDados();
        } else {
            alert('Erro ao salvar os dados.');
        }
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});

carregarDados();