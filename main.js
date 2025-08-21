// main.js (Versão Final com Debugging e Lógica de Nome Reforçada)

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO NOME DE USUÁRIO (MAIS ROBUSTA) ---

    // 1. Tenta pegar o nome do usuário
    let username = localStorage.getItem('username');
    console.log("1. Valor inicial de 'username' no localStorage:", username);

    // 2. Verifica se o username é 'null' (não existe) ou uma string vazia
    if (username === null || username === '') {
        console.log("2. Username não encontrado. Solicitando via prompt...");
        
        try {
            // 3. Pede o nome ao usuário
            let newName = prompt("Por favor, digite seu nome para usar nos comentários:");
            console.log("3. Valor retornado pelo prompt:", newName);

            // 4. Verifica se o usuário clicou em "Cancelar" (retorna null) ou não digitou nada
            if (newName === null || newName.trim() === '') {
                username = 'Usuário Anônimo';
                console.log("4. Usuário cancelou ou não digitou nada. Definindo como 'Usuário Anônimo'.");
            } else {
                username = newName;
                console.log("4. Usuário digitou o nome:", username);
            }
            
            // 5. Salva o nome definido (seja o digitado ou 'Anônimo')
            localStorage.setItem('username', username);
            console.log("5. 'username' salvo no localStorage.");

        } catch (error) {
            // Isso acontece se o prompt for bloqueado por uma extensão
            console.error("ERRO: O prompt foi bloqueado ou falhou.", error);
            username = 'Usuário Anônimo';
            localStorage.setItem('username', username);
        }
    } else {
        console.log("2. Username encontrado:", username);
    }


    // --- LÓGICA DAS ABAS (TABS) ---
    const tabButtons = document.querySelectorAll('.tab-button');
    // ... (o restante do código permanece exatamente o mesmo) ...
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabButtons.length > 0 && tabPanes.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }


    // --- LÓGICA DE COMENTÁRIOS COM LOCALSTORAGE ---
    const comentarioForm = document.querySelector('.comentario-form');

    if (comentarioForm) {
        const comentariosContainer = document.getElementById('comentarios');
        const commentStorageKey = `comments_${window.location.pathname}`;

        const renderComment = (author, text) => {
            const novoComentarioDiv = document.createElement('div');
            novoComentarioDiv.className = 'comentario';

            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = `${author}: `;
            const commentNode = document.createTextNode(text);

            p.appendChild(strong);
            p.appendChild(commentNode);

            const small = document.createElement('small');
            small.textContent = 'Curtir (0) · Responder';

            novoComentarioDiv.appendChild(p);
            novoComentarioDiv.appendChild(small);

            comentariosContainer.insertBefore(novoComentarioDiv, comentarioForm);
        };

        const loadComments = () => {
            const savedComments = localStorage.getItem(commentStorageKey);
            if (savedComments) {
                const comments = JSON.parse(savedComments);
                comments.forEach(comment => {
                    renderComment(comment.author, comment.text);
                });
            }
        };

        loadComments();

        comentarioForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const textarea = comentarioForm.querySelector('textarea');
            const commentText = textarea.value;

            if (commentText.trim() === '') {
                return;
            }

            renderComment(username, commentText);

            const savedComments = localStorage.getItem(commentStorageKey);
            const comments = savedComments ? JSON.parse(savedComments) : [];
            
            comments.push({ author: username, text: commentText });

            localStorage.setItem(commentStorageKey, JSON.stringify(comments));
            
            textarea.value = '';
        });
    }
});