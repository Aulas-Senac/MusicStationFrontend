document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FILTER BAR INTERACTIONS ---
    const filterTags = document.querySelectorAll('.filter-tag');
    
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Remove active class from all
                filterTags.forEach(t => t.classList.remove('active'));
                // Add active class to clicked
                tag.classList.add('active');
                
                const filterValue = tag.textContent.trim().toLowerCase();
                filterCards(filterValue, document.querySelector('.search-input input')?.value || '');
            });
        });
    }
    
    // --- 2. SEARCH INTERACTIONS ---
    const searchInputs = document.querySelectorAll('.search-input input');
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const activeFilter = document.querySelector('.filter-tag.active')?.textContent.trim().toLowerCase() || 'todos';
                filterCards(activeFilter, searchTerm);
            });
            
            // Prevent form submit
            const form = input.closest('form');
            if (form) {
                form.addEventListener('submit', e => e.preventDefault());
            }
        });
    }
    
    function normalizeText(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }
    
    function filterCards(category, searchTerm) {
        // Find the grid container (could be instruments, pros, or services)
        const grid = document.querySelector('.instrument-grid, .pros-grid, .category-grid');
        if (!grid) return;
        
        const cards = grid.querySelectorAll('.instrument-card, .pro-card, .category-card');
        let visibleCount = 0;
        
        const normCat = normalizeText(category);
        const normSearch = normalizeText(searchTerm);
        
        cards.forEach(card => {
            let show = true;
            const normText = normalizeText(card.textContent);
            
            // Filter by category
            if (normCat !== 'todos') {
                const categoryWords = normCat.split(' ');
                // If any category word is not found in the text, hide it. 
                // This handles plurals like "técnicos" matching "técnico".
                if (!categoryWords.every(word => normText.includes(word))) {
                    show = false;
                }
            }
            
            // Filter by search term
            if (normSearch !== '' && !normText.includes(normSearch)) {
                show = false;
            }
            
            if (show) {
                card.style.display = 'flex'; // Reset display
                // For a nice effect
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                card.style.animation = null; 
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update results header if exists
        const resultsHeader = document.querySelector('.results-header strong');
        if (resultsHeader) {
            resultsHeader.textContent = visibleCount;
        }
    }
    
    // --- 3. SCROLL ANIMATIONS ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add slide-up class to all cards automatically
    const allCards = document.querySelectorAll('.instrument-card, .pro-card, .category-card');
    allCards.forEach((card, index) => {
        card.classList.add('slide-up');
        // Add a slight delay based on index for a cascade effect
        card.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(card);
    });
    
    // --- 4. MENU ACTIVE STATE (ANCHOR LINKS) ---
    const menuLinks = document.querySelectorAll('.menu-principal a');
    
    function updateMenuState() {
        const hash = window.location.hash;
        if (hash) {
            const targetLink = Array.from(menuLinks).find(l => {
                const h = l.getAttribute('href');
                return h && h.endsWith(hash);
            });
            if (targetLink) {
                menuLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
            }
        } else {
            // Restore active state based on current page URL if hash is removed
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const targetLink = Array.from(menuLinks).find(l => {
                const h = l.getAttribute('href');
                return h && h.endsWith(currentPage) && !h.includes('#');
            });
            if (targetLink) {
                menuLinks.forEach(l => l.classList.remove('active'));
                targetLink.classList.add('active');
            }
        }
    }

    // Atualiza ao carregar a página (caso venha de outra página direto para a âncora)
    updateMenuState();
    window.addEventListener('hashchange', updateMenuState);

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Se for um link de âncora interno na MESMA página
            if (href && (href.startsWith('#') || (href.includes(window.location.pathname.split('/').pop()) && href.includes('#')))) {
                menuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Fecha o menu lateral no celular ao clicar
                const navBar = document.querySelector('.nav-bar');
                if (navBar && navBar.classList.contains('menu-open')) {
                    navBar.classList.remove('menu-open');
                    document.body.style.overflow = '';
                }
            }
        });
    });
});
