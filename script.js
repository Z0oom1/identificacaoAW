// ESTADO GLOBAL DO SISTEMA
let products = [];
let highlights = [];
let selectedProduct = null;
let currentView = 'catalog';
let currentFilter = 'all';

// URL do servidor de persistência (Removido para Netlify, usando LocalStorage)
const API_URL = null; 

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
async function init() {
    // 1. Tenta carregar do LocalStorage primeiro (cache rápido)
    const localDb = localStorage.getItem('wilson_db_cache');
    if (localDb) {
        try {
            const data = JSON.parse(localDb);
            products = data.products || [];
            highlights = data.highlights || [];
        } catch (e) {
            console.error("Erro ao ler LocalStorage:", e);
            loadInitial();
        }
    } else {
        loadInitial();
    }

    // Se ainda estiver vazio após tentar carregar inicial, garante que seja um array
    if (!products) products = [];
    if (!highlights) highlights = [];

    // Renderiza o que temos para não deixar a tela vazia
    setupFilters();
    render();
    updateStats();

    // 3. Sincronização removida (Netlify é estático)
    
    setupEventListeners();
    
    showToast("Sistema Wilson ID Pro Inicializado", "success");
}

function loadInitial() {
    if (typeof initialData !== 'undefined') {
        products = initialData.products || [];
        highlights = initialData.highlights || [];
    }
}

async function loadData() {
    // Função mantida para compatibilidade, mas sem fetch remoto
    console.log("Modo offline: Usando dados locais.");
}

async function saveData() {
    // Sempre salva no cache local (LocalStorage)
    localStorage.setItem('wilson_db_cache', JSON.stringify({ products, highlights }));
    updateStats();
    
    // Simula sucesso de salvamento local
    showToast("Dados salvos localmente", "success");
}

function updateStats() {
    const totalEl = document.getElementById('stat-total');
    const highEl = document.getElementById('badge-highlights');
    const sessEl = document.getElementById('stat-session');
    
    if (totalEl) totalEl.textContent = products.length;
    if (highEl) highEl.textContent = `${highlights.length} itens`;
    if (sessEl) sessEl.textContent = sessionStorage.getItem('print_count') || 0;
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
        const code = p.codigo || "";
        const prod = p.produto || "";
        const text = (code + ' ' + prod).toLowerCase();
        const matchesQuery = queryWords.length === 0 || queryWords.every(word => text.includes(word));
        
        if (!matchesQuery) return false;

        if (currentFilter === 'all') return true;
        if (currentFilter === 'cx') return prod.includes('CX');
        if (currentFilter === 'frascos') return prod.includes('FRASCO');
        if (currentFilter === 'mp') {
            const mpKeywords = ['AROMA', 'CORANTE', 'POLPA', 'AMIDO', 'SAL', 'AÇUCAR', 'VINAGRE'];
            return mpKeywords.some(k => prod.includes(k));
        }
        return true;
    });

    filtered.sort((a, b) => (a.produto || "").localeCompare(b.produto || ""));

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
            openActionModal(selectedProduct.codigo);
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

function openActionModal(id) {
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
async function handleSaveProduct() {
    const code = document.getElementById('prod-code').value.trim();
    const name = document.getElementById('prod-name').value.trim().toUpperCase().replace(/CAIXA/gi, 'CX');

    if (!code || !name) {
        showToast("Preencha todos os campos", "error");
        return;
    }

    if (selectedProduct) {
        const idx = products.findIndex(p => p.codigo === selectedProduct.codigo);
        products[idx] = { codigo: code, produto: name };
        showToast("Produto atualizado", "success");
    } else {
        products.push({ codigo: code, produto: name });
        showToast("Produto cadastrado", "success");
    }

    await saveData();
    render();
    closeModal();
}

async function handleDeleteProduct() {
    if (!selectedProduct) return;
    if (confirm(`Excluir permanentemente: ${selectedProduct.produto}?`)) {
        products = products.filter(p => p.codigo !== selectedProduct.codigo);
        highlights = highlights.filter(h => h !== selectedProduct.codigo);
        await saveData();
        render();
        closeModal();
        showToast("Produto removido");
    }
}

async function toggleHighlight() {
    if (!selectedProduct) return;
    const id = selectedProduct.codigo;
    if (highlights.includes(id)) {
        highlights = highlights.filter(h => h !== id);
        showToast("Removido dos destaques");
    } else {
        highlights.push(id);
        showToast("Adicionado aos destaques", "success");
    }
    await saveData();
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
        const actionGrid = document.querySelector('.action-grid-v2');
        if (actionGrid) actionGrid.appendChild(btnHighlight);
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

// quantas palavras ficam junto do código
const prefixCount = 2;

    const prefixo = palavras.slice(0, prefixCount).join(' ');
    const resto = palavras.slice(prefixCount).join(' ');
    const opTypeInput = document.querySelector('input[name="op-type"]:checked');
    const opType = opTypeInput ? opTypeInput.value : "recebimento";
    const nf = document.getElementById('input-nf').value || "---";
    const qty = document.getElementById('input-qty').value || "---";
    const lote = document.getElementById('input-lote').value || "---";
    const validadeRaw = document.getElementById('input-validade').value;
    
    let valFormatted = "00/00/0000";
    if(validadeRaw) { 
        const p = validadeRaw.split('-'); 
        valFormatted = `${p[2]}/${p[1]}/${p[0]}`; 
    }

    const printDate = document.getElementById('print-date');
    const printCode = document.getElementById('print-code');
    const printPrefix = document.getElementById('print-product-prefix');
    const printRest = document.getElementById('print-product-rest');
    const printProd = document.getElementById('print-product');
    const printQty = document.getElementById('print-qty');
    const printLote = document.getElementById('print-lote');
    const printVal = document.getElementById('print-validade');
    const printNf = document.getElementById('print-nf');
    const printDayLot = document.getElementById('print-day-lot');

    if (printDate) printDate.textContent = new Date().toLocaleDateString('pt-BR');
    if (printCode) printCode.textContent = selectedProduct.codigo;
    if (printPrefix) printPrefix.textContent = prefixo;
    if (printRest) printRest.textContent = resto;
    if (printProd) printProd.textContent = selectedProduct.produto;
    if (printQty) printQty.textContent = qty;
    if (printLote) printLote.textContent = lote;
    if (printVal) printVal.textContent = valFormatted;
    if (printNf) printNf.textContent = nf;
    if (printDayLot) printDayLot.textContent = String(getDayOfYear()).padStart(3, '0');

    const boxRec = document.getElementById('box-rec');
    const boxDev = document.getElementById('box-dev');
    if (boxRec) boxRec.classList.toggle('checked', opType === 'recebimento');
    if (boxDev) boxDev.classList.toggle('checked', opType === 'devolucao');

    closeModal();
    if (printArea) printArea.classList.remove('hidden');
    
    let count = parseInt(sessionStorage.getItem('print_count') || 0) + 1;
    sessionStorage.setItem('print_count', count);
    updateStats();

    setTimeout(adjustProductFontSize, 10);
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function adjustProductFontSize() {
    const container = document.querySelector('.big-content-row');
    const wrapper = document.querySelector('.container-produto-ajustavel');
    const productEl = document.getElementById('print-product');
    if (!productEl || !wrapper || !container) return;

    let size = 48;
    productEl.style.fontSize = size + "pt";
    const maxWidth = container.clientWidth - 40; 
    while (wrapper.scrollWidth > maxWidth && size > 16) {
        size -= 1;
        productEl.style.fontSize = size + "pt";
    }
}

// TOAST
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'ri-checkbox-circle-fill' : (type === 'error' ? 'ri-error-warning-fill' : 'ri-information-fill');
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// LÓGICA 3D
const sheet = document.querySelector('.sheet-viewport');
const overlay = document.querySelector('.print-overlay');
let isDragging = false;
let startX, startY;
let currentRotX = 0, currentRotY = 0;
let velX = 0, velY = 0;
let currentZoom = 0.6;
let resetTimer;

function applyTransform() {
    if (sheet) sheet.style.transform = `scale(${currentZoom}) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
}

function physicsLoop() {
    if (!isDragging) {
        velX *= 0.95; velY *= 0.95;
        currentRotY += velX; currentRotX += velY;
        applyTransform();
    }
    requestAnimationFrame(physicsLoop);
}
physicsLoop();

if (overlay) {
    overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay || e.target === sheet) {
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            if (sheet) sheet.style.transition = "none";
            clearTimeout(resetTimer);
        }
    });
}

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
            if (sheet) {
                sheet.style.transition = "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
                currentRotX = 0; currentRotY = 0;
                applyTransform();
            }
        }, 2500);
    }
});

if (overlay) {
    overlay.addEventListener('wheel', (e) => {
        e.preventDefault();
        currentZoom += e.deltaY * -0.0008;
        currentZoom = Math.max(0.3, Math.min(1.8, currentZoom));
        applyTransform();
    }, { passive: false });
}

// Inicializar
init();
