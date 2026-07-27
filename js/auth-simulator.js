/**
 * Auth Flow
 * Controla o estado de login e o cabeçalho superior (Header Dropdown)
 */

document.addEventListener("DOMContentLoaded", () => {
    applyCurrentState();
    setupMobileMenu();
});

// Setup Mobile Menu
function setupMobileMenu() {
    if (window.location.pathname.includes('checkout.html')) return;
    const navBar = document.querySelector('.nav-bar');
    if (navBar && !document.querySelector('.mobile-menu-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<i class="ph ph-list"></i>';
        toggle.onclick = () => {
            navBar.classList.toggle('menu-open');
            document.body.style.overflow = navBar.classList.contains('menu-open') ? 'hidden' : '';
        };
        navBar.appendChild(toggle);
    }
}

// Realizar Login (Chamado pelos formulários)
window.doLogin = function(profile) {
    localStorage.setItem('ms_mock_profile', profile);
    // Mostrar notificação toast opcional aqui ou apenas ir pra página
}

// Fazer Logout (Chamado pelo Dropdown)
window.doLogout = function() {
    localStorage.removeItem('ms_mock_profile');
    
    // Toast notification
    showToast("Você saiu com sucesso.");
    
    setTimeout(() => {
        window.location.href = window.location.pathname.includes('pages/') ? '../index.html' : 'index.html';
    }, 1000);
}

// Auth Guard (Proteção de Rotas)
window.requireAuth = function(roleRequired) {
    const profile = localStorage.getItem('ms_mock_profile');
    const basePath = window.location.pathname.includes('pages/') ? '' : 'pages/';
    
    if (!profile) {
        alert('Acesso negado: Você precisa estar logado para realizar esta ação.');
        window.location.href = basePath + 'login.html';
        return false;
    }
    if (roleRequired && profile !== roleRequired) {
        alert('Acesso restrito: Apenas o perfil ' + roleRequired.toUpperCase() + ' pode realizar esta ação. Entre com a conta correta.');
        window.location.href = basePath + 'painel.html';
        return false;
    }
    return true;
}

// Toast System
window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    const icon = type === 'success' ? '<i class="ph-fill ph-check-circle" style="color: #22c55e; font-size: 1.5rem;"></i>' : '<i class="ph-fill ph-warning-circle" style="color: #eab308; font-size: 1.5rem;"></i>';
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            ${icon}
            <span>${message}</span>
        </div>
        <div class="toast-progress" style="position: absolute; bottom: 0; left: 0; height: 3px; background: ${type === 'success' ? '#22c55e' : '#eab308'}; width: 100%; animation: toastProgress 3s linear forwards;"></div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--surface-color, #150f1f);
        color: var(--text-main, #fff);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-color, rgba(255,255,255,0.1));
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 9999;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 500;
        overflow: hidden;
        animation: toastIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }
        @keyframes toastProgress { from { width: 100%; } to { width: 0%; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function applyCurrentState() {
    const profile = localStorage.getItem('ms_mock_profile');
    
    // Lógica 1: Alterar o Cabeçalho Global (Nav bar)
    const botoesAuth = document.querySelector('.botoes-auth');
    if (botoesAuth) {
        if (!profile) {
            // Deslogado
            if(!botoesAuth.classList.contains('auth-logged-in')) {
                const basePath = window.location.pathname.includes('pages/') ? '' : 'pages/';
                botoesAuth.innerHTML = `
                    <div class="desktop-auth-links" style="display: flex; gap: 1.5rem; align-items: center;">
                        <a href="${basePath}login.html" class="btn-link">Entrar</a>
                        <a href="${basePath}cadastro.html" class="btn-primary">Criar Conta</a>
                    </div>
                    <div class="mobile-auth-link" style="display: none;">
                        <a href="${basePath}login.html" aria-label="Entrar" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: var(--surface-light); color: var(--text-main); border: 1px solid var(--border-color);">
                            <i class="ph ph-user" style="font-size: 1.2rem;"></i>
                        </a>
                    </div>
                `;
            }
        } else {
            // Logado: Avatar com Dropdown
            const avatarLetter = profile === 'cliente' ? 'C' : (profile === 'profissional' ? 'P' : 'E');
            const basePath = window.location.pathname.includes('pages/') ? '' : 'pages/';
            
            botoesAuth.innerHTML = `
                <div class="user-menu-group" style="display: flex; align-items: center; gap: 1.5rem; flex-direction: row;">
                <!-- Sino de Notificações -->
                <div style="position: relative;">
                    <a href="#" id="notif-trigger" style="color: var(--text-main); text-decoration: none; position: relative; " aria-label="Notificações">
                        <i class="ph ph-bell" style="font-size: 1.5rem;"></i>
                    </a>
                    <!-- Dropdown Notificações -->
                    <div id="notif-menu" style="display: none; position: absolute; top: 120%; right: 10px; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 8px; width: 250px; padding: 1.5rem; text-align: center; box-shadow: var(--shadow-lg); z-index: 100;">
                        <i class="ph-fill ph-bell-ringing" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">Nenhuma notificação nova no momento.</p>
                    </div>
                </div>

                <!-- Chat -->
                <a href="${basePath}mensagens.html" style="color: var(--text-main); text-decoration: none; position: relative; " aria-label="Mensagens">
                    <i class="ph ph-chat-circle" style="font-size: 1.5rem;"></i>
                    <span class="chat-dot" style="position: absolute; top: -2px; right: -4px; background: #ef4444; width: 8px; height: 8px; border-radius: 50%;"></span>
                </a>

                <!-- Avatar Dropdown -->
                <div class="profile-dropdown-container" style="position: relative; cursor: pointer;">
                    <div id="profile-trigger" style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem;">${avatarLetter}</div>
                        <i class="ph-bold ph-caret-down" style="color: var(--text-muted); font-size: 0.8rem;"></i>
                    </div>
                    
                    <!-- Dropdown Menu -->
                    <div id="profile-dropdown-menu" style="display: none; position: absolute; top: 120%; right: 0; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 8px; width: 200px; padding: 0.5rem 0; box-shadow: var(--shadow-lg); z-index: 100;">
                        <a href="${basePath}painel.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1rem; color: var(--text-main); text-decoration: none; transition: background 0.2s;"><i class="ph ph-squares-four"></i> Meu Painel</a>
                        <a href="${basePath}configuracoes.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1rem; color: var(--text-main); text-decoration: none; transition: background 0.2s;"><i class="ph ph-gear"></i> Configurações</a>
                        <a href="${basePath}contato.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1rem; color: var(--text-main); text-decoration: none; transition: background 0.2s;"><i class="ph ph-question"></i> Ajuda e Suporte</a>
                        <div style="height: 1px; background: var(--border-color); margin: 0.5rem 0;"></div>
                        <a href="#" onclick="doLogout()" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1rem; color: #ef4444; text-decoration: none; transition: background 0.2s;"><i class="ph ph-sign-out"></i> Sair</a>
                    </div>
                </div>
                </div>
            `;

            // Lógica de Toggle do Dropdown (Notificações)
            const notifTrigger = document.getElementById('notif-trigger');
            const notifMenu = document.getElementById('notif-menu');
            
            if (notifTrigger) {
                notifTrigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    notifMenu.style.display = notifMenu.style.display === 'none' ? 'block' : 'none';
                    if (menu) menu.style.display = 'none';
                });
            }

            // Lógica de Toggle do Dropdown (Perfil)
            const trigger = document.getElementById('profile-trigger');
            const menu = document.getElementById('profile-dropdown-menu');
            
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                    if (notifMenu) notifMenu.style.display = 'none';
                });
            }
            
            // Hover states pros links do dropdown
            if (menu) {
                menu.querySelectorAll('a').forEach(a => {
                    a.addEventListener('mouseover', () => a.style.background = 'rgba(255,255,255,0.05)');
                    a.addEventListener('mouseout', () => a.style.background = 'transparent');
                });
            }

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if(menu && !menu.contains(e.target) && !trigger.contains(e.target)) menu.style.display = 'none';
                if(notifMenu && !notifMenu.contains(e.target) && !notifTrigger.contains(e.target)) notifMenu.style.display = 'none';
            });
        }
    }

    // Lógica 2: Alterar o Conteúdo do Painel (painel.html)
    // O painel atualizado lerá ms_mock_profile para preencher os dados corretamente.
    // Isso foi migrado para dentro do próprio script no novo painel.
}
