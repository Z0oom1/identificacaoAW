// ESTADO GLOBAL DO SISTEMA
let products = [];
let highlights = [];
let selectedProduct = null;
let currentView = 'catalog';
let currentFilter = 'all';

// ELEMENTOS DOM
const productsGrid = document.getElementById('productsGrid');
const highlightsGrid = document.getElementById('highlightsGrid');
const searchInput = document.getElementById('searchInput');
const modalAction = document.getElementById('modal-action');
const modalForm = document.getElementById('modal-form');
const modalCode = document.getElementById('modal-code');
const modalProductForm = document.getElementById('modal-product-form');
const printArea = document.getElementById('print-area');
const filterContainer = document.getElementById('filterContainer');

// INICIALIZAÇÃO
function init() {
    // 1. Tenta carregar do LocalStorage
    const localDb = localStorage.getItem('wilson_db_cache');
    if (localDb) {
        try {
            const data = JSON.parse(localDb);
            products = data.products || [];
            highlights = data.highlights || [];
        } catch (e) {
            console.error("Erro ao ler cache local:", e);
            loadInitialData();
        }
    } else {
        loadInitialData();
    }

    // 2. Garante que os nomes sigam o padrão solicitado (CAIXA -> CX)
    products = products.map(p => ({
        ...p,
        produto: (p.produto || '').replace(/CAIXA/gi, 'CX')
    }));

    setupFilters();
    render();
    updateStats();
    setupEventListeners();
    
    showToast("Sistema Wilson ID Pro Ativo (Modo Local)", "success");
}

function loadInitialData() {
    if (typeof initialData !== 'undefined') {
        products = initialData.products || [];
        highlights = initialData.highlights || [];
    }
}

function saveData() {
    // Salva no LocalStorage (Netlify não tem servidor/banco)
    localStorage.setItem('wilson_db_cache', JSON.stringify({ products, highlights }));
    updateStats();
}

function updateStats() {
    if (document.getElementById('stat-total')) {
        document.getElementById('stat-total').textContent = products.length;
    }
    if (document.getElementById('badge-highlights')) {
        document.getElementById('badge-highlights').textContent = `${highlights.length} itens`;
    }
    if (document.getElementById('stat-session')) {
        document.getElementById('stat-session').textContent = sessionStorage.getItem('print_count') || 0;
    }
}

// FILTROS
function setupFilters() {
    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'cx', label: 'Caixas', keywords: ['CX'] },
        { id: 'frascos', label: 'Frascos', keywords: ['FRASCO'] },
        { id: 'mp', label: 'Matéria Prima', keywords: ['AROMA', 'CORANTE', 'POLPA', 'AMIDO', 'SAL', 'AÇUCAR', 'VINAGRE'] }
    ];

    if (!filterContainer) return;
    
    filterContainer.innerHTML = '';
    filters.forEach(f => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${currentFilter === f.id ? 'active' : ''}`;
        btn.textContent = f.label;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = f.id;
            render();
        };
        filterContainer.appendChild(btn);
    });
}

// RENDERIZAÇÃO
function render(query = '') {
    if (!productsGrid || !highlightsGrid) return;
    
    productsGrid.innerHTML = '';
    highlightsGrid.innerHTML = '';

    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
    
    let filtered = products.filter(p => {
        const text = ((p.codigo || '') + ' ' + (p.produto || '')).toLowerCase();
        const matchesQuery = queryWords.length === 0 || queryWords.every(word => text.includes(word));
        
        if (!matchesQuery) return false;

        if (currentFilter === 'all') return true;
        if (currentFilter === 'cx') return (p.produto || '').includes('CX');
        if (currentFilter === 'frascos') return (p.produto || '').includes('FRASCO');
        if (currentFilter === 'mp') {
            const mpKeywords = ['AROMA', 'CORANTE', 'POLPA', 'AMIDO', 'SAL', 'AÇUCAR', 'VINAGRE'];
            return mpKeywords.some(k => (p.produto || '').includes(k));
        }
        return true;
    });

    filtered.sort((a, b) => (a.produto || '').localeCompare(b.produto || ''));

    filtered.forEach(p => {
        const card = createCard(p);
        if (highlights.includes(p.codigo)) {
            highlightsGrid.appendChild(card.cloneNode(true));
        }
        if (currentView === 'catalog' || (currentView === 'favorites' && highlights.includes(p.codigo))) {
            productsGrid.appendChild(card);
        }
    });

    const highlightsSection = document.getElementById('section-highlights');
    if (highlightsSection) {
        if (highlights.length === 0 || currentView === 'favorites' || query !== '' || currentFilter !== 'all') {
            highlightsSection.classList.add('hidden');
        } else {
            highlightsSection.classList.remove('hidden');
        }
    }

    rebindCardEvents();
}

function createCard(p) {
    const div = document.createElement('div');
    div.className = 'product-card zoom-anim';
    if (highlights.includes(p.codigo)) div.classList.add('is-highlight');
    div.dataset.id = p.codigo;
    div.innerHTML = `
        <span class="card-code">${p.codigo}</span>
        <h3 class="card-name">${p.produto}</h3>
        ${highlights.includes(p.codigo) ? '<i class="ri-star-fill card-star"></i>' : ''}
    `;
    return div;
}

function rebindCardEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.onclick = (e) => {
            selectedProduct = products.find(p => p.codigo === card.dataset.id);
            if (!selectedProduct) return;
            openPrintForm();
        };

        card.oncontextmenu = (e) => {
            e.preventDefault();
            selectedProduct = products.find(p => p.codigo === card.dataset.id);
            if (!selectedProduct) return;
            openActionModal();
        };
    });
}

// MODAIS
function openPrintForm() {
    closeModal();
    document.getElementById('preview-code').textContent = selectedProduct.codigo;
    document.getElementById('preview-name').textContent = selectedProduct.produto;
    modalForm.classList.remove('hidden');
}

function openActionModal() {
    closeModal();
    document.getElementById('preview-code').textContent = selectedProduct.codigo;
    document.getElementById('preview-name').textContent = selectedProduct.produto;
    
    const isHigh = highlights.includes(selectedProduct.codigo);
    const btnHighlight = document.getElementById('btn-toggle-highlight');
    if (btnHighlight) {
        btnHighlight.innerHTML = `
            <div class="card-icon"><i class="ri-star-${isHigh ? 'fill' : 'line'}"></i></div>
            <div class="card-info">
                <strong>${isHigh ? 'Remover Destaque' : 'Adicionar Destaque'}</strong>
                <span>${isHigh ? 'Tirar da lista rápida' : 'Fixar no topo'}</span>
            </div>
        `;
    }
    
    modalAction.classList.remove('hidden');
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
}

// CRUD
function handleSaveProduct() {
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim().toUpperCase().replace(/CAIXA/gi, 'CX');

    if (!code || !name) {
        showToast("Preencha todos os campos", "error");
        return;
    }

    if (selectedProduct) {
        const idx = products.findIndex(p => p.codigo === selectedProduct.codigo);
        if (idx !== -1) {
            products[idx] = { codigo: code, produto: name };
            showToast("Produto atualizado", "success");
        }
    } else {
        products.push({ codigo: code, produto: name });
        showToast("Produto cadastrado", "success");
    }

    saveData();
    render();
    closeModal();
}

function handleDeleteProduct() {
    if (!selectedProduct) return;
    if (confirm(`Excluir permanentemente: ${selectedProduct.produto}?`)) {
        products = products.filter(p => p.codigo !== selectedProduct.codigo);
        highlights = highlights.filter(h => h !== selectedProduct.codigo);
        saveData();
        render();
        closeModal();
        showToast("Produto removido");
    }
}

function toggleHighlight() {
    if (!selectedProduct) return;
    const id = selectedProduct.codigo;
    if (highlights.includes(id)) {
        highlights = highlights.filter(h => h !== id);
        showToast("Removido dos destaques");
    } else {
        highlights.push(id);
        showToast("Adicionado aos destaques", "success");
    }
    saveData();
    render();
    closeModal();
}

// EVENT LISTENERS
function setupEventListeners() {
    if (searchInput) {
        searchInput.oninput = (e) => render(e.target.value);
    }
    
    window.onkeydown = (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
        if (e.key === 'Escape') closeModal();
    };

    document.querySelectorAll('.nav-item[data-view]').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentView = item.dataset.view;
            render();
            const sidebar = document.getElementById('app-sidebar');
            if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('open');
        };
    });

    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.onclick = () => {
            const sidebar = document.getElementById('app-sidebar');
            if (sidebar) sidebar.classList.toggle('open');
        };
    }

    const sidebarAddBtn = document.getElementById('sidebar-add-btn');
    if (sidebarAddBtn) {
        sidebarAddBtn.onclick = () => {
            selectedProduct = null;
            document.getElementById('product-modal-title').textContent = "Novo Material";
            document.getElementById('prod-code').value = "";
            document.getElementById('prod-name').value = "";
            modalProductForm.classList.remove('hidden');
        };
    }

    const sidebarExportBtn = document.getElementById('sidebar-export-btn');
    if (sidebarExportBtn) {
        sidebarExportBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({products, highlights}));
            const a = document.createElement('a');
            a.href = dataStr;
            a.download = "backup_wilson_id.json";
            a.click();
            showToast("Backup exportado");
        };
    }

    const themeLight = document.getElementById('theme-light');
    if (themeLight) {
        themeLight.onclick = () => {
            document.body.className = 'theme-light';
            themeLight.classList.add('active');
            const themeDark = document.getElementById('theme-dark');
            if (themeDark) themeDark.classList.remove('active');
        };
    }
    
    const themeDark = document.getElementById('theme-dark');
    if (themeDark) {
        themeDark.onclick = () => {
            document.body.className = 'theme-dark';
            themeDark.classList.add('active');
            const themeLight = document.getElementById('theme-light');
            if (themeLight) themeLight.classList.remove('active');
        };
    }

    document.querySelectorAll('.close-modal, .close-modal-fs').forEach(btn => {
        btn.onclick = closeModal;
    });

    const btnOpenForm = document.getElementById('btn-open-form');
    if (btnOpenForm) btnOpenForm.onclick = openPrintForm;

    const btnShowCode = document.getElementById('btn-show-code');
    if (btnShowCode) {
        btnShowCode.onclick = () => {
            closeModal();
            document.getElementById('display-code-fs').textContent = selectedProduct.codigo;
            document.getElementById('display-name-fs').textContent = selectedProduct.produto;
            modalCode.classList.remove('hidden');
        };
    }

    const btnEditProductTrigger = document.getElementById('btn-edit-product-trigger');
    if (btnEditProductTrigger) {
        btnEditProductTrigger.onclick = () => {
            document.getElementById('product-modal-title').textContent = "Editar Material";
            document.getElementById('prod-code').value = selectedProduct.codigo;
            document.getElementById('prod-name').value = selectedProduct.produto;
            closeModal();
            modalProductForm.classList.remove('hidden');
        };
    }

    // Botão de destaque no modal de ação
    if (!document.getElementById('btn-toggle-highlight')) {
        const btnHighlight = document.createElement('button');
        btnHighlight.id = 'btn-toggle-highlight';
        btnHighlight.className = 'action-card-v2';
        btnHighlight.onclick = toggleHighlight;
        const grid = document.querySelector('.action-grid-v2');
        if (grid) grid.appendChild(btnHighlight);
    }

    const btnDeleteProductTrigger = document.getElementById('btn-delete-product-trigger');
    if (btnDeleteProductTrigger) btnDeleteProductTrigger.onclick = handleDeleteProduct;
    
    const btnSaveProduct = document.getElementById('btn-save-product');
    if (btnSaveProduct) btnSaveProduct.onclick = handleSaveProduct;
    
    const btnCopyCode = document.getElementById('btn-copy-code');
    if (btnCopyCode) {
        btnCopyCode.onclick = () => {
            navigator.clipboard.writeText(selectedProduct.codigo);
            showToast("Código copiado", "success");
        };
    }

    const btnGeneratePrint = document.getElementById('btn-generate-print');
    if (btnGeneratePrint) btnGeneratePrint.onclick = generatePrint;
    
    const closePrint = document.getElementById('close-print');
    if (closePrint) closePrint.onclick = () => printArea.classList.add('hidden');
}

// IMPRESSÃO
function generatePrint() {
    const palavras = selectedProduct.produto.split(' ');
    const prefixCount = 2;
    const prefixo = palavras.slice(0, prefixCount).join(' ');
    const resto = palavras.slice(prefixCount).join(' ');
    
    const opTypeInput = document.querySelector('input[name="op-type"]:checked');
    const opType = opTypeInput ? opTypeInput.value : 'recebimento';
    
    const nf = document.getElementById('input-nf').value || "---";
    const qty = document.getElementById('input-qty').value || "---";
    const lote = document.getElementById('input-lote').value || "---";
    const validadeRaw = document.getElementById('input-validade').value;
    
    let valFormatted = "00/00/0000";
    if(validadeRaw) { 
        const p = validadeRaw.split('-'); 
        valFormatted = `${p[2]}/${p[1]}/${p[0]}`;
    }

    const printContent = `
        <div class="print-item">
            <div class="print-header">
                <img src="logo.png" alt="Wilson Logo">
                <div class="print-title">IDENTIFICAÇÃO DE MATERIAL</div>
            </div>
            <div class="print-body">
                <div class="info-row">
                    <div class="info-label">CÓDIGO:</div>
                    <div class="info-value large">${selectedProduct.codigo}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">DESCRIÇÃO:</div>
                    <div class="info-value">${prefixo} <strong>${resto}</strong></div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">OPERAÇÃO:</div>
                        <div class="info-value uppercase">${opType}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">NF:</div>
                        <div class="info-value">${nf}</div>
                    </div>
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">QUANTIDADE:</div>
                        <div class="info-value">${qty}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">LOTE/FAB:</div>
                        <div class="info-value">${lote}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-label">VALIDADE:</div>
                    <div class="info-value highlight">${valFormatted}</div>
                </div>
            </div>
            <div class="print-footer">
                <span>Impresso em: ${new Date().toLocaleString('pt-BR')}</span>
                <span>Sistema Wilson ID Pro</span>
            </div>
        </div>
    `;

    const sheetContainer = document.querySelector('.official-sheet');
    if (sheetContainer) {
        sheetContainer.innerHTML = printContent;
    }
    
    if (printArea) printArea.classList.remove('hidden');
    
    // Incrementar contador de sessão
    const count = parseInt(sessionStorage.getItem('print_count') || 0) + 1;
    sessionStorage.setItem('print_count', count);
    updateStats();
}

// TOAST NOTIFICATIONS
function showToast(msg, type = "info") {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="ri-${type === 'success' ? 'checkbox-circle' : type === 'error' ? 'error-warning' : 'information'}-line"></i>
        <span>${msg}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// EFEITOS 3D E INTERAÇÕES
let isDragging = false;
let startX, startY;
let currentRotX = 0;
let currentRotY = 0;
let currentZoom = 1;
let velX = 0;
let velY = 0;
let resetTimer;

function applyTransform() {
    const sheet = document.querySelector('.official-sheet');
    if (sheet) {
        sheet.style.transform = `scale(${currentZoom}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    }
}

window.addEventListener('mousedown', (e) => {
    if (printArea && !printArea.classList.contains('hidden')) {
        const sheet = document.querySelector('.official-sheet');
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        if (sheet) sheet.style.transition = "none";
        clearTimeout(resetTimer);
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    velX = dx * 0.15; velY = -dy * 0.15;
    currentRotY += velX; currentRotX += velY;
    startX = e.clientX; startY = e.clientY;
    applyTransform();
});

window.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            const sheet = document.querySelector('.official-sheet');
            if (sheet) {
                sheet.style.transition = "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
                currentRotX = 0; currentRotY = 0;
                applyTransform();
            }
        }, 2500);
    }
});

// Inicializar ao carregar
window.onload = init;
