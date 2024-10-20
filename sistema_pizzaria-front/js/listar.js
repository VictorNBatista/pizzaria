// Função para listar os usuários
async function listarUsuarios() {
    // Obter o token do localStorage
    const token = localStorage.getItem('token');
    const userIdLogado = localStorage.getItem('userId');

    try {
        if (token) {
            // Fazer uma requisição para a API protegida para obter os dados do usuário
            const response = await fetch('http://localhost:8000/api/user/listar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });            
    
            if (response.ok) {
                const usuarios = await response.json();
    
                // Seleciona o corpo da tabela
                const tabelaUsuarios = document.getElementById('tabelaUsuarios');
                tabelaUsuarios.innerHTML = ''; // Limpa a tabela
    
                // Itera sobre os usuários e adiciona cada um à tabela
                usuarios.user.data.forEach((usuario, index) => {
                    
                    const dataCriacao = new Date(usuario.created_at);
                    const dataFormatada = dataCriacao.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false // Formato 24 horas
                    });
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${usuario.name}</td>
                        <td>${usuario.email}</td>
                        <td>${dataFormatada}</td>
                        <td>
                            <button class="btn btn-info btn-sm visualizar-usuario" data-id="${usuario.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-warning btn-sm editar-usuario" data-id="${usuario.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${
                                usuario.id != userIdLogado
                                ? `<button class="btn btn-danger btn-sm excluir-usuario" data-id="${usuario.id}">
                                    <i class="fas fa-trash-alt"></i>
                                    </button>`
                                : ''
                            } <!-- Mostra o botão de excluir apenas se o id for diferente -->
                        </td>
                    `;
                    tabelaUsuarios.appendChild(row);
                    
                });

                // Adiciona o evento de clique para excluir o usuário
                document.querySelectorAll('.excluir-usuario').forEach(button => {
                    button.addEventListener('click', async function() {
                        const userId = this.getAttribute('data-id');
                        const confirmar = confirm('Tem certeza que deseja excluir este usuário?');
                        if (confirmar) {
                            await excluirUsuario(userId);
                        }
                    });
                });

                document.querySelectorAll('.visualizar-usuario').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        visualizarUsuario(userId);
                    });
                });

                document.querySelectorAll('.editar-usuario').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.getAttribute('data-id');
                        abrirModalEditarUsuario(userId);
                    });
                });

                
            } else {
                throw new Error('Erro ao buscar os usuários');
            }
        } else {
            // Redireciona para o login se o token não existir
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        const mensagemErro = document.getElementById('mensagemErro');
        mensagemErro.textContent = 'Erro ao carregar a lista de usuários';
        mensagemErro.classList.remove('d-none');
    }
}

// Função para excluir o usuário
async function excluirUsuario(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8000/api/user/deletar/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Usuário excluído com sucesso!');
            listarUsuarios(); // Recarregar a lista de usuários
        } else {
            throw new Error('Erro ao excluir o usuário');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o usuário.');
    }
}

function visualizarUsuario(userId) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {        
        // Preenche os dados do modal
        document.getElementById('usuarioNome').textContent = data.user.name;
        document.getElementById('usuarioEmail').textContent = data.user.email;

        const dataCriacao = new Date(data.user.created_at);
        document.getElementById('usuarioDataCriacao').textContent = dataCriacao.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        // Abre o modal de visualização
        const visualizarModal = new bootstrap.Modal(document.getElementById('visualizarUsuarioModal'));
        visualizarModal.show();
    })
    .catch(error => {
        console.error('Erro ao visualizar o usuário:', error);
    });
}

function abrirModalEditarUsuario(userId) {
    const token = localStorage.getItem('token');

    // Faz a requisição para buscar os dados do usuário
    fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Preenche os campos do modal com os dados do usuário
        document.getElementById('userIdEdit').value = userId;
        document.getElementById('nameEdit').value = data.user.name;
        document.getElementById('emailEdit').value = data.user.email;

        // Abre o modal de edição
        const editarModal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
        editarModal.show();
    })
    .catch(error => {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao carregar os dados do usuário.');
    });
}

function editarUsuario() {
    const token = localStorage.getItem('token');
    const userId = document.getElementById('userIdEdit').value; // Pega o ID do usuário armazenado

    // Recupera os dados do formulário
    const nome = document.getElementById('nameEdit').value;
    const email = document.getElementById('emailEdit').value;
    const password = document.getElementById('passwordEdit').value;
    const passwordConfirmation = document.getElementById('password_confirmationEdit').value;

    // Cria o payload para a requisição
    const user = {
        name: nome,
        email: email
    };

    // Adiciona a senha ao payload somente se for preenchida
    if (password) {
        user.password = password;
        user.password_confirmation = passwordConfirmation;
    }

    // Envia a requisição de atualização
    fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            // Se a resposta não for bem-sucedida, lança um erro para o bloco catch
            throw new Error('Erro ao atualizar o usuário.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Usuário atualizado com sucesso!');

            // Fecha o modal de edição
            const editarModal = bootstrap.Modal.getInstance(document.getElementById('editarUsuarioModal'));
            editarModal.hide();

            // Aqui você pode adicionar lógica para atualizar a interface, como atualizar a tabela de usuários.
        } else {
            alert('Erro ao atualizar o usuário: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao editar o usuário:', error);
        alert('Ocorreu um erro ao tentar atualizar o usuário.');
    });
}


// Chama a função para listar os usuários assim que a página for carregada
document.addEventListener('DOMContentLoaded', listarUsuarios);
