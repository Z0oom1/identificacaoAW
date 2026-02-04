// ESTADO GLOBAL DO SISTEMA
let products = [];
let highlights = [];
let selectedProduct = null;
let currentView = 'catalog';
let currentFilter = 'all';

// URL do servidor de persistência (ajustar conforme necessário)
const API_URL = 'http://localhost:3001/data';

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
    await loadData();
    setupEventListeners();
    setupFilters();
    updateStats();
    render();
    
    // Polling para atualização em tempo real (a cada 3 segundos)
    setInterval(loadData, 3000);
    
    showToast("Sistema Wilson ID Pro Inicializado", "success");
}

async function loadData() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            
            // Verifica se houve mudança antes de renderizar novamente
            const newDataStr = JSON.stringify(data);
            const oldDataStr = JSON.stringify({ products, highlights });
            
            if (newDataStr !== oldDataStr) {
                products = data.products.map(p => ({
                    ...p,
                    produto: p.produto.replace(/CAIXA/gi, 'CX')
                }));
                highlights = data.highlights;
                render();
                updateStats();
            }
        }
    } catch (e) {
        console.error("Erro ao carregar dados remotos:", e);
    }
}

async function saveData() {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products, highlights })
        });
        updateStats();
    } catch (e) {
        console.error("Erro ao salvar dados remotos:", e);
        showToast("Erro ao sincronizar dados", "error");
    }
}

function updateStats() {
    document.getElementById('stat-total').textContent = products.length;
    document.getElementById('badge-highlights').textContent = `${highlights.length} itens`;
    document.getElementById('stat-session').textContent = sessionStorage.getItem('print_count') || 0;
}

// FILTROS
function setupFilters() {
    const filters = [
        { id: 'all', label: 'Todos' },
        { id: 'cx', label: 'Caixas', keywords: ['CX'] },
        { id: 'frascos', label: 'Frascos', keywords: ['FRASCO'] },
        { id: 'mp', label: 'Matéria Prima', keywords: ['AROMA', 'CORANTE', 'POLPA', 'AMIDO', 'SAL', 'AÇUCAR', 'VINAGRE'] }
    ];

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
    productsGrid.innerHTML = '';
    highlightsGrid.innerHTML = '';

    const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 0);
    
    let filtered = products.filter(p => {
        // Filtro de busca
        const text = (p.codigo + ' ' + p.produto).toLowerCase();
        const matchesQuery = queryWords.length === 0 || queryWords.every(word => text.includes(word));
        
        if (!matchesQuery) return false;

        // Filtro de categoria
        if (currentFilter === 'all') return true;
        if (currentFilter === 'cx') return p.produto.includes('CX');
        if (currentFilter === 'frascos') return p.produto.includes('FRASCO');
        if (currentFilter === 'mp') {
            const mpKeywords = ['AROMA', 'CORANTE', 'POLPA', 'AMIDO', 'SAL', 'AÇUCAR', 'VINAGRE'];
            return mpKeywords.some(k => p.produto.includes(k));
        }
        return true;
    });

    filtered.sort((a, b) => a.produto.localeCompare(b.produto));

    // Renderiza todos os produtos sem limite
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
    if (highlights.length === 0 || currentView === 'favorites' || query !== '' || currentFilter !== 'all') {
        highlightsSection.classList.add('hidden');
    } else {
        highlightsSection.classList.remove('hidden');
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
            
            // Menu de contexto customizado ou modal de ação
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
    
    // Atualiza o botão de destaque no modal
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
    searchInput.oninput = (e) => render(e.target.value);
    window.onkeydown = (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
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
            if (window.innerWidth <= 768) document.getElementById('app-sidebar').classList.remove('open');
        };
    });

    document.getElementById('mobile-menu-toggle').onclick = () => {
        document.getElementById('app-sidebar').classList.toggle('open');
    };

    document.getElementById('sidebar-add-btn').onclick = () => {
        selectedProduct = null;
        document.getElementById('product-modal-title').textContent = "Novo Material";
        document.getElementById('prod-code').value = "";
        document.getElementById('prod-name').value = "";
        modalProductForm.classList.remove('hidden');
    };

    document.getElementById('sidebar-export-btn').onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({products, highlights}));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "backup_wilson_id.json";
        a.click();
        showToast("Backup exportado");
    };

    document.getElementById('theme-light').onclick = () => {
        document.body.className = 'theme-light';
        document.getElementById('theme-light').classList.add('active');
        document.getElementById('theme-dark').classList.remove('active');
    };
    document.getElementById('theme-dark').onclick = () => {
        document.body.className = 'theme-dark';
        document.getElementById('theme-dark').classList.add('active');
        document.getElementById('theme-light').classList.remove('active');
    };

    document.querySelectorAll('.close-modal, .close-modal-fs').forEach(btn => {
        btn.onclick = closeModal;
    });

    document.getElementById('btn-open-form').onclick = openPrintForm;

    document.getElementById('btn-show-code').onclick = () => {
        closeModal();
        document.getElementById('display-code-fs').textContent = selectedProduct.codigo;
        document.getElementById('display-name-fs').textContent = selectedProduct.produto;
        modalCode.classList.remove('hidden');
    };

    document.getElementById('btn-edit-product-trigger').onclick = () => {
        document.getElementById('product-modal-title').textContent = "Editar Material";
        document.getElementById('prod-code').value = selectedProduct.codigo;
        document.getElementById('prod-name').value = selectedProduct.produto;
        closeModal();
        modalProductForm.classList.remove('hidden');
    };

    // Novo botão de destaque no modal de ação
    const btnHighlight = document.createElement('button');
    btnHighlight.id = 'btn-toggle-highlight';
    btnHighlight.className = 'action-card-v2';
    btnHighlight.onclick = toggleHighlight;
    document.querySelector('.action-grid-v2').appendChild(btnHighlight);

    document.getElementById('btn-delete-product-trigger').onclick = handleDeleteProduct;
    document.getElementById('btn-save-product').onclick = handleSaveProduct;
    document.getElementById('btn-copy-code').onclick = () => {
        navigator.clipboard.writeText(selectedProduct.codigo);
        showToast("Código copiado", "success");
    };

    document.getElementById('btn-generate-print').onclick = generatePrint;
    document.getElementById('close-print').onclick = () => printArea.classList.add('hidden');
}

// IMPRESSÃO
function generatePrint() {
    const opType = document.querySelector('input[name="op-type"]:checked').value;
    const nf = document.getElementById('input-nf').value || "---";
    const qty = document.getElementById('input-qty').value || "---";
    const lote = document.getElementById('input-lote').value || "---";
    const validadeRaw = document.getElementById('input-validade').value;
    
    let valFormatted = "00/00/0000";
    if(validadeRaw) { 
        const p = validadeRaw.split('-'); 
        valFormatted = `${p[2]}/${p[1]}/${p[0]}`; 
    }

    document.getElementById('print-date').textContent = new Date().toLocaleDateString('pt-BR');
    document.getElementById('print-code').textContent = selectedProduct.codigo;
    document.getElementById('print-product').textContent = selectedProduct.produto;
    document.getElementById('print-qty').textContent = qty;
    document.getElementById('print-lote').textContent = lote;
    document.getElementById('print-validade').textContent = valFormatted;
    document.getElementById('print-nf').textContent = nf;
    document.getElementById('print-day-lot').textContent = String(getDayOfYear()).padStart(3, '0');

    document.getElementById('box-rec').classList.toggle('checked', opType === 'recebimento');
    document.getElementById('box-dev').classList.toggle('checked', opType === 'devolucao');

    closeModal();
    printArea.classList.remove('hidden');
    
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

overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay || e.target === sheet) {
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
            if (sheet) {
                sheet.style.transition = "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
                currentRotX = 0; currentRotY = 0;
                applyTransform();
            }
        }, 2500);
    }
});

overlay.addEventListener('wheel', (e) => {
    e.preventDefault();
    currentZoom += e.deltaY * -0.0008;
    currentZoom = Math.max(0.3, Math.min(1.8, currentZoom));
    applyTransform();
}, { passive: false });

init();
