// DADOS (Lista única de produtos carregada inicialmente)
let rawData = [
    { codigo: '1000340', produto: 'RÓTULO MANGA BARBECUE GL 3,6 KG' },
    { codigo: '10004', produto: 'TOMATE IN-NATURA' },
    { codigo: '190064', produto: 'TAMPA FLIPTOP FECH. VERMELHA SELO PET' },
    { codigo: '1001214', produto: 'FRASCO PET MOSTARDA ARISCO 200G' },
    { codigo: '1001067', produto: 'SOLUCAO DE LIMPEZA GMASTER 1 L' },
    { codigo: '1001720', produto: 'FRASCO PET CATCHUP TRAD. ARISCO 370g' },
    { codigo: '1001347', produto: 'DILUENTE PARA TINTA V7206-D' },
    { codigo: '1000067', produto: 'ROTULO SLEEVE CATCHUP TRAD D\'AJUDA 190G' },
    { codigo: '170126', produto: 'CX 126 AW2 MAIONESE SACHET 192X7G' },
    { codigo: '180108', produto: 'ROTULO MANGA SHOYU 3,1L' },
    { codigo: '1001068', produto: 'TINTA PRETA CARTUCHO 800ML 9175' },
    { codigo: '1000693', produto: 'TAMPA FLIP TOP 18MM PRETA 80ml' },
    { codigo: '1000803', produto: 'TINTA PRETA VIDEOJET V4210-L' },
    { codigo: '200279', produto: 'ROTULO SLEEVE SHOYU TRADICIONAL 900ML' },
    { codigo: '190106', produto: 'TAMPA ORIENTAL VERDE SHOYU (PET)' },
    { codigo: '1001567', produto: 'TAMPA FLIPTOP 38MM PRETA STRUMPF PREMIUM' },
    { codigo: '200313', produto: 'ETIQUETA AD FD MAIONESE SACHE 8X192G' },
    { codigo: '200283', produto: 'ROTULO SLEEVE SHOYU TRADICIONAL 500ML' },
    { codigo: '1001515', produto: 'ROTULO AD LIM/ERVAS F HELLM 210ML/VERS 2' },
    { codigo: '1000972', produto: 'ETIQUETA AD BOPP 100x160mm UNL' },
    { codigo: '110006', produto: 'SAL REFINADO IODADO' },
    { codigo: '200312', produto: 'ETIQUETA AD FD CATCHUP SACHE 8X192G' },
    { codigo: '1001514', produto: 'ROTULO AD LIM/ERVAS F HELLM 210ML/FREN 2' },
    { codigo: '1000677', produto: 'FRASCO PET M PIM CREMOSO D\'AJUDA 80ML' },
    { codigo: '1000291', produto: 'ROTULO MANGA MOSTARDA D\'AJUDA 3,2KG' },
    { codigo: '1001157', produto: 'CX 259 A CATCHUP SACHET 144X7G' },
    { codigo: '200167', produto: 'ROTULO AD CATCHUP D\'AJUDA 820G/FRENTE' },
    { codigo: '200168', produto: 'ROTULO AD CATCHUP D\'AJUDA 820G/VERSO' },
    { codigo: '1000996', produto: 'LACRE TERMO ENCOLHIVEL VERDE 207x23,53MM' },
    { codigo: '1000071', produto: 'ROTULO SLEEVE MIX 3X1 D\'AJUDA 185G' },
    { codigo: '1000074', produto: 'ROTULO SLEEVE MOSTARDA D\'AJUDA 170G' },
    { codigo: '1000085', produto: 'FRASCO PET CONDIMENTOS D\'AJUDA 200G' },
    { codigo: '1001360', produto: 'ROTULO AD MAIONESE ORIG NOTCO 350G/FR' },
    { codigo: '1000975', produto: 'ETIQUETA AD BOPP 160x160mm UNL' },
    { codigo: '50001', produto: 'AÇUCAR CRISTAL 1' },
    { codigo: '1000862', produto: 'ROTULO SLEEVE M. BARBECUE D\'AJUDA 400G' },
    { codigo: '200343', produto: 'ETIQUETA BRANCA 40X80MM' },
    { codigo: '1001535', produto: 'RIBBON PRETO 33MM X 450 M 15-X33KQ25' },
    { codigo: '1001013', produto: 'TAMPA AZUL P/BALDE MAIONESE 3KG C/ROTULO' },
    { codigo: '1001498', produto: 'FRASCO PET PCR 40 SALAD HELLMANNS 210ML' },
    { codigo: '1001363', produto: 'ROTULO AD MAIONESE GARLIC NOTCO 350G/VR' },
    { codigo: '1001361', produto: 'ROTULO AD MAIONESE ORIG NOTCO 350G/VR' },
    { codigo: '1001362', produto: 'ROTULO AD MAIONESE GARLIC NOTCO 350G/FR' },
    { codigo: '1000170', produto: 'TINTA MERK PRETA STD V410-D750ML JV1510' },
    { codigo: '1000073', produto: 'ROTULO SLEEVE BARBECUE D\'AJUDA 190G' },
    { codigo: '1000531', produto: 'ROTULO SLEEVE MIX 3X1 D\'AJUDA 390G' },
    { codigo: '1001763', produto: 'TAMPA FLIPTOP FECH. AMARELA ELEFANTE' },
    { codigo: '1000697', produto: 'TAMPA FLIP TOP 32MM VERMELHA SELO PP' },
    { codigo: '1001158', produto: 'CX 261A A MAIONESE C SACHET 144X7G' },
    { codigo: '1000095', produto: 'TAMPA FLIP TOP VERMELHA D\'AJUDA 150ML' },
    { codigo: '1000069', produto: 'ROTULO SLEEVE CATCHUP PIC D\'AJUDA 400G' },
    { codigo: '170162', produto: 'CX 162 AW2 MOSTARDA D\'AJUDA 192X7G' },
    { codigo: '1001315', produto: 'FRASCO PET PCR CONDIMENTO HELLM 400ML' },
    { codigo: '1001463', produto: 'FRASCO PET CONDIMENTOS TEXGRILL 270ML' },
    { codigo: '10014', produto: 'POLPA TOMATE RO 28/30 BRIX' },
    { codigo: '200256', produto: 'ROTULO AD CATCHUP CALCUTA 780G/ FRENTE' },
    { codigo: '1001302', produto: 'ROTULO MANGA SHOYU KAMPAI 3,1L' },
    { codigo: '200257', produto: 'ROTULO AD CATCHUP CALCUTA 780G/ VERSO' },
    { codigo: '170183', produto: 'CX 183A DISPLAY MAIONESE 1X3 KG' },
    { codigo: '1001367', produto: 'ROTULO AD MAIONESE AZEITONA NOTCO 335G/V' },
    { codigo: '1000405', produto: 'RÓT SLEEVE PIMENTA PIC D\'AJUDA PET 150ML' },
    { codigo: '1000242', produto: 'ROTULO AD MOSTARDA D\'AJUDA 750G/FRENTE' },
    { codigo: '1000243', produto: 'ROTULO AD MOSTARDA D\'AJUDA 750G/VERSO' },
    { codigo: '190116', produto: 'TAMPA VERMELHA FRASCO GROSELHA 500/900ML' },
    { codigo: '1001381', produto: 'TAMPA P/FRASCO PET 350G NOTCO PRETA' },
    { codigo: '1000345', produto: 'CX 219 A M. VERDE SACHE 192X7' },
    { codigo: '170114', produto: 'CX 114A STAND UP 24X200G' },
    { codigo: '170057', produto: 'CX 57A CAT 3,5/SHOYU 3,1/YAK 3,3/PIM3,2' },
    { codigo: '1000872', produto: 'ROT SLEEVE M. P/ LANC AMERICAN BURG 185G' },
    { codigo: '200196', produto: 'ROTULO AD MOSTARDA CALCUTÁ 750G/VERSO' },
    { codigo: '200195', produto: 'ROTULO AD MOSTARDA CALCUTÁ 750G/FRENTE' },
    { codigo: '200308', produto: 'ROTULO SLEEVE PIMENTA CASEIRO 900ML' },
    { codigo: '1000397', produto: 'RÓT SLEEVE SHOYU PREMIUM MITSUWA PET 150' },
    { codigo: '1000699', produto: 'TAMPA FLIP TOP 32MM AMARELA SELO PP' },
    { codigo: '6006246', produto: 'LACRE T ENCOLHIVEL VERDE' },
    { codigo: '1001101', produto: 'ETIQUETA AD FD SHOYU P SACHE 8ML X 250' },
    { codigo: '1001519', produto: 'ROTULO AD ROSE HELLM 210ML/VERSO 2' },
    { codigo: '1000497', produto: 'VINAGRE TRIPLO (ÁCIDO ACÉTICO 12%)' },
    { codigo: '210176', produto: 'FRASCO PET SHOYU 500ML' },
    { codigo: '50016', produto: 'AÇUCAR LIQUIDO BEBIDAS' },
    { codigo: '1001108', produto: 'CX 257A M. SHOYU PREMIUM SACHÊ 250X8ML' },
    { codigo: '1001336', produto: 'ROTULO AD NOTMAYO 450G - NOTCO' },
    { codigo: '1000882', produto: 'RÓTULO AD BARBECUE 800G/FRENTE' },
    { codigo: '1001681', produto: 'POTE NOTMAYO 450G - NOTCO 3' },
    { codigo: '1001366', produto: 'ROTULO AD MAIONESE AZEITONA NOTCO 335G/F' },
    { codigo: '200273', produto: 'ROTULO AD COB SORV MORANGO 300G/FRENTE' },
    { codigo: '200339', produto: 'ROTULO SLEEVE GROSELHA 900ML' },
    { codigo: '190108', produto: 'TAMPA ORIENTAL VERDE CLARO SHOYU (PET)' },
    { codigo: '1001380', produto: 'FRASCO NOTCO PET 350G' },
    { codigo: '200345', produto: 'ROTULO SLEEVE MOLHO VERDE 250G' },
    { codigo: '1000086', produto: 'FRASCO PET CONDIMENTOS D\'AJUDA 400G' },
    { codigo: '1000403', produto: 'RÓT SLEEVE PIMENTA TRAD D\'AJUDA PET 150' },
    { codigo: '1001244', produto: 'ETIQUETA AD FD TARE SACHE 8x250G' },
    { codigo: '1000247', produto: 'ROTULO SLEEVE SHOYU TRADICIONAL 250ML' },
    { codigo: '200338', produto: 'ROTULO SLEEVE GROSELHA 500ML' },
    { codigo: '1000883', produto: 'RÓTULO AD BARBECUE 800G/VERSO' },
    { codigo: '1001012', produto: 'TINTA VIDEOJET V435-D' },
    { codigo: '1001243', produto: 'CX 267A M. TARE SACHE 250X8ML' },
    { codigo: '200311', produto: 'ROTULO SLEEVE MOLHO DE ALHO 900ML' },
    { codigo: '1001123', produto: 'ROT SLEEVE MOLHO VERDE D\'AJUDA 185G' },
    { codigo: '1001156', produto: 'ETIQUETA AD FD CATC CALCUTA SACHE8X144UN' },
    { codigo: '1000130', produto: 'AMIDO P/ MAIONESE (A QUENTE)' },
    { codigo: '1001552', produto: 'RÓT SLEEVE CATCHUP TRAD D\'AJUDA 190G EXP' },
    { codigo: '1000060', produto: 'FRASCO PET D\'AJUDA 150 ML' },
    { codigo: '200274', produto: 'ROTULO AD COB SORV MORANGO 300G/VERSO' },
    { codigo: '210172', produto: 'FRASCO PET SHOYU 900ML' },
    { codigo: '1000356', produto: 'RÓTULO SLEEVE MOLHO TARÊ MITSUWA 250ML' },
    { codigo: '210115', produto: 'FRASCO PP MOSTARDA 750G' },
    { codigo: '1000395', produto: 'RÓT SLEEVE SHOYU TRAD MITSUWA PET 150ML' },
    { codigo: '1001066', produto: 'DILUENTE ADITIVO ROXO 800ML COD 8188' },
    { codigo: '1000694', produto: 'ROTULO AD M PIM CREMOSO 90G' },
    { codigo: '1001962', produto: 'ROT SLEEVE SHOYU COMARSA PET 150 EXP' },
    { codigo: '1000132', produto: 'ROTULO SLEEVE MOLHO INGLES D\'AJUDA 900ML' },
    { codigo: '1001981', produto: 'ROTULO AD MOSTARDA COM MEL TEXGRILL 275G' },
    { codigo: '1001518', produto: 'ROTULO AD ROSE HELLM 210ML/FRENTE 2' },
    { codigo: '1001760', produto: 'CX KETCHUP ELEFANTE 24X350G' },
    { codigo: '1001832', produto: 'CX KETCHUP ELEFANTE 144X7G' },
    { codigo: '210114', produto: 'FRASCO PP CATCHUP 790/820G' },
    { codigo: '6006237', produto: 'ROTULO AD M TARE MITSUWA 5L' },
    { codigo: '1001761', produto: 'CX MOSTARDA / BBQ ELEFANTE 24X190G' },
    { codigo: '1000695', produto: 'ROTULO AD M PIM CREMOSO 190G FRENTE' },
    { codigo: '1000696', produto: 'ROTULO AD M PIM CREMOSO 190G VERSO' },
    { codigo: '1001682', produto: 'TAMPA POTE NOTMAYO 450G - NOTCO 3' },
    { codigo: '1001551', produto: 'RÓT SLEEVE PIM PIC DAJUDA PET 150ML EXP' },
    { codigo: '1000276', produto: 'CX 216A M T PIZZA D’AJUDA 1X3KG' },
    { codigo: '1001724', produto: 'CX FRASCO PET CATCHUP ARISCO 24x370G' },
    { codigo: '200323', produto: 'ROTULO SLEEVE PIMENTA TRADICIONAL 250ML' },
    { codigo: '1001154', produto: 'ETIQUETA AD FD MAIO CALCUTA SACHE8X144UN' },
    { codigo: '190107', produto: 'TAMPA ORIENTAL VERMELHA SHOYU (PET)' },
    { codigo: '1001152', produto: 'CX 263A DISPLAY MAIONESE 1X2,8 KG' },
    { codigo: '180162', produto: 'FILME MAIONESE 7G/12P' },
    { codigo: '200315', produto: 'ETIQUETA AD FD MOST. DAJUDA SACHE 8X192G' },
    { codigo: '580003', produto: 'POLIETILENO ALTA DENSIDADE GF4950-HS' },
    { codigo: '1001014', produto: 'ROTULO AD M PIM CREMOSO SUAVE 90 ML' },
    { codigo: '1000976', produto: 'RIBBON 184X450M UNL' },
    { codigo: '200284', produto: 'ROTULO SLEEVE SHOYU PREMIUM 500ML' },
    { codigo: '1001164', produto: 'FILME T. ENCOLHIVEL 500X0,07MM' },
    { codigo: '1000520', produto: 'CX 231A DISPLAY M VERDE 1X3KG' },
    { codigo: '1000998', produto: 'ADITIVO A188-4 (0.80L)' },
    { codigo: '1000076', produto: 'ROTULO SLEEVE MAIONESE D\'AJUDA 175G' },
    { codigo: '1000723', produto: 'AMIDO MILHO SUPERCORP 56' },
    { codigo: '1000358', produto: 'RÓT SLEEVE SHOYU PIMENTA MITSUWA 250ML' },
    { codigo: '1000075', produto: 'ROTULO SLEEVE MOSTARDA ESC D\'AJUDA 170G' },
    { codigo: '200286', produto: 'ROTULO SLEEVE SHOYU SALAD & GRILL 500ML' },
    { codigo: '1000399', produto: 'RÓT SLEEVE M. INGLÊS D\'AJUDA PET 150ML' },
    { codigo: '210193', produto: 'FRASCO PET SHOYU 250 ML' },
    { codigo: '1001833', produto: 'CX MOSTARDA ELEFANTE 144X7G' },
    { codigo: '200309', produto: 'ROTULO SLEEVE PIMENTA CASEIRO 500ML' },
    { codigo: '170186', produto: 'CX 186A MAIONESE TRAPÉZIO 10X1KG' },
    { codigo: '1000911', produto: 'AMIDO SNOW FLAKE 6420- MOLHOS GMO FREE' },
    { codigo: '1001852', produto: 'FILME PARA CATCHUP SACHÊ 7g - 16 PISTAS' },
    { codigo: '1001999', produto: 'CX MOSTARDA HELLMANNS 168X7G' },
    { codigo: '1000346', produto: 'CX 220A BARBECUE SACHE 192X7G' },
    { codigo: '1001500', produto: 'CX SUP HELLM/ARISC 12x1,01Kg UNL v2' },
    { codigo: '1001588', produto: 'ROTULO SLEEVE SHOYU SUAVE 250ML' },
    { codigo: '200280', produto: 'ROTULO SLEEVE SHOYU PREMIUM 900ML' },
    { codigo: '1001456', produto: 'ROTULO AD ALHO TEXGRILL 235G' },
    { codigo: '1001346', produto: 'CARTUCHO DE TINTA PRETA VD4231-D UM 1210' },
    { codigo: '50007', produto: 'AÇUCAR REFINADO' }
];

// Estado da Aplicação
let products = [];
let highlights = JSON.parse(localStorage.getItem('highlights_aw')) || [];
let selectedProduct = null;
let editingProductIndex = -1;

// Elementos DOM
const productsGrid = document.getElementById('productsGrid');
const highlightsGrid = document.getElementById('highlightsGrid');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');
const modalAction = document.getElementById('modal-action');
const modalForm = document.getElementById('modal-form');
const modalCode = document.getElementById('modal-code');
const modalContext = document.getElementById('modal-context');
const modalProductForm = document.getElementById('modal-product-form');
const modalConfirmDelete = document.getElementById('modal-confirm-delete');
const printArea = document.getElementById('print-area');

// Inicialização
function init() {
    // Carregar do localStorage se existir, senão usar rawData
    const savedProducts = localStorage.getItem('products_aw');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [...rawData];
        saveToStorage();
    }
    
    render();
    setupEventListeners();
    updateStats();
}

function saveToStorage() {
    localStorage.setItem('products_aw', JSON.stringify(products));
    localStorage.setItem('highlights_aw', JSON.stringify(highlights));
    updateStats();
}

function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-highlights').textContent = highlights.length;
}

// Renderização
function render(filter = 'all', query = '') {
    productsGrid.innerHTML = '';
    highlightsGrid.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesQuery = p.produto.toLowerCase().includes(query.toLowerCase()) || p.codigo.includes(query);
        if (filter === 'all') return matchesQuery;
        return matchesQuery; // Por enquanto só temos 'all', mas expansível
    });

    // Ordenar por nome
    filtered.sort((a, b) => a.produto.localeCompare(b.produto));

    filtered.forEach(p => {
        const card = createProductCard(p);
        
        if (highlights.includes(p.codigo)) {
            highlightsGrid.appendChild(card.cloneNode(true));
        }
        productsGrid.appendChild(card);
    });

    // Re-vincular eventos após render
    document.querySelectorAll('.p-card').forEach(card => {
        card.onclick = () => openActionModal(card.dataset.id);
        card.oncontextmenu = (e) => {
            e.preventDefault();
            openContextMenu(card.dataset.id);
        };
    });
}

function createProductCard(p) {
    const div = document.createElement('div');
    div.className = 'p-card zoom-anim';
    div.dataset.id = p.codigo;
    div.innerHTML = `
        <span class="p-badge">${p.codigo}</span>
        <p class="p-name">${p.produto}</p>
        <div class="p-card-footer">
            <i class="ri-more-2-fill" style="color: var(--ui-text-light)"></i>
        </div>
    `;
    return div;
}

// Modais e Ações
function openActionModal(id) {
    selectedProduct = products.find(p => p.codigo === id);
    if (!selectedProduct) return;

    document.getElementById('preview-code').textContent = selectedProduct.codigo;
    document.getElementById('preview-name').textContent = selectedProduct.produto;
    modalAction.classList.remove('hidden');
}

function openContextMenu(id) {
    selectedProduct = products.find(p => p.codigo === id);
    if (!selectedProduct) return;

    document.getElementById('ctx-prod-name').textContent = selectedProduct.produto;
    const isHigh = highlights.includes(id);
    document.getElementById('ctx-text').textContent = isHigh ? "Remover dos Destaques" : "Adicionar aos Destaques";
    document.getElementById('ctx-icon').innerHTML = isHigh ? '<i class="ri-star-line"></i>' : '<i class="ri-star-fill"></i>';
    
    modalContext.classList.remove('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'ri-checkbox-circle-line' : (type === 'error' ? 'ri-error-warning-line' : 'ri-information-line');
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Event Listeners
function setupEventListeners() {
    // Busca
    searchInput.oninput = (e) => render('all', e.target.value);

    // Fechar modais
    document.querySelectorAll('.close-btn, .btn-outline').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        };
    });

    // Ações do Produto
    document.getElementById('btn-show-code').onclick = () => {
        modalAction.classList.add('hidden');
        document.getElementById('display-code').textContent = selectedProduct.codigo;
        document.getElementById('display-name').textContent = selectedProduct.produto;
        modalCode.classList.remove('hidden');
    };

    document.getElementById('btn-open-form').onclick = () => {
        modalAction.classList.add('hidden');
        modalForm.classList.remove('hidden');
    };

    document.getElementById('btn-copy-code').onclick = () => {
        navigator.clipboard.writeText(selectedProduct.codigo);
        showToast("Código copiado!", "success");
    };

    // CRUD: Adicionar / Editar
    document.getElementById('btn-add-product').onclick = () => {
        editingProductIndex = -1;
        document.getElementById('product-modal-title').textContent = "Novo Produto";
        document.getElementById('prod-code').value = "";
        document.getElementById('prod-name').value = "";
        modalProductForm.classList.remove('hidden');
    };

    document.getElementById('btn-edit-product-trigger').onclick = () => {
        editingProductIndex = products.findIndex(p => p.codigo === selectedProduct.codigo);
        document.getElementById('product-modal-title').textContent = "Editar Produto";
        document.getElementById('prod-code').value = selectedProduct.codigo;
        document.getElementById('prod-name').value = selectedProduct.produto;
        modalAction.classList.add('hidden');
        modalProductForm.classList.remove('hidden');
    };

    document.getElementById('btn-save-product').onclick = () => {
        const code = document.getElementById('prod-code').value.trim();
        const name = document.getElementById('prod-name').value.trim().toUpperCase();

        if (!code || !name) {
            showToast("Preencha todos os campos", "error");
            return;
        }

        if (editingProductIndex === -1) {
            // Adicionar
            if (products.some(p => p.codigo === code)) {
                showToast("Este código já existe", "error");
                return;
            }
            products.push({ codigo: code, produto: name });
            showToast("Produto adicionado!", "success");
        } else {
            // Editar
            products[editingProductIndex] = { codigo: code, produto: name };
            showToast("Produto atualizado!", "success");
        }

        saveToStorage();
        render();
        modalProductForm.classList.add('hidden');
    };

    // CRUD: Excluir
    document.getElementById('btn-delete-product-trigger').onclick = () => {
        modalAction.classList.add('hidden');
        modalConfirmDelete.classList.remove('hidden');
    };

    document.getElementById('btn-confirm-delete').onclick = () => {
        products = products.filter(p => p.codigo !== selectedProduct.codigo);
        highlights = highlights.filter(h => h !== selectedProduct.codigo);
        saveToStorage();
        render();
        modalConfirmDelete.classList.add('hidden');
        showToast("Produto removido", "info");
    };

    // Destaques
    document.getElementById('btn-toggle-highlight').onclick = () => {
        const id = selectedProduct.codigo;
        if (highlights.includes(id)) {
            highlights = highlights.filter(h => h !== id);
            showToast("Removido dos destaques");
        } else {
            highlights.push(id);
            showToast("Adicionado aos destaques", "success");
        }
        saveToStorage();
        render();
        modalContext.classList.add('hidden');
    };

    // Geração de Impressão
    document.getElementById('btn-generate-print').onclick = generatePrint;
    document.getElementById('close-print').onclick = () => printArea.classList.add('hidden');
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function generatePrint() {
    const opType = document.querySelector('input[name="op-type"]:checked').value;
    const nf = document.getElementById('input-nf').value || "---";
    const qty = document.getElementById('input-qty').value || "---";
    const lote = document.getElementById('input-lote').value || "---";
    const validadeRaw = document.getElementById('input-validade').value;
    let valFormatted = "00/00/0000";
    if(validadeRaw) { const p = validadeRaw.split('-'); valFormatted = `${p[2]}/${p[1]}/${p[0]}`; }

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

    modalForm.classList.add('hidden'); 
    printArea.classList.remove('hidden');

    setTimeout(adjustProductFontSize, 10);
}

function adjustProductFontSize() {
    const container = document.querySelector('.big-content-row');
    const wrapper = document.querySelector('.container-produto-ajustavel');
    const productEl = document.getElementById('print-product');
    if (!productEl || !wrapper || !container) return;

    let size = 48;
    productEl.style.fontSize = size + "pt";
    const maxWidth = container.clientWidth - 30; 
    while (wrapper.scrollWidth > maxWidth && size > 18) {
        size -= 1;
        productEl.style.fontSize = size + "pt";
    }
}

// Lógica de Movimentação 360° e Zoom (Mantida do original conforme solicitado)
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
        document.body.style.userSelect = 'none';
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
        document.body.style.userSelect = 'auto';
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

// Iniciar app
init();
