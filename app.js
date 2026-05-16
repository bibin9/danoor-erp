// ==================== DANOOR LLC - Document Clearing ERP (Firebase Edition) ====================
// Data is stored in Firebase Firestore and synced in real-time

// ---- Save guard: prevents duplicate submissions on double-click ----
let _saving = false;
function _beginSave() { if (_saving) return false; _saving = true; return true; }
function _endSave()   { _saving = false; }

const DEFAULT_VAT_RATE = 0.05;
function getVatRate(selectId) {
    const el = document.getElementById(selectId);
    return el ? parseFloat(el.value) || 0 : DEFAULT_VAT_RATE;
}

// Default Chart of Accounts
const DEFAULT_COA = [
    { code: '1000', name: 'Cash & Bank', type: 'Asset', balance: 0 },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
    { code: '1200', name: 'Inventory', type: 'Asset', balance: 0 },
    { code: '1300', name: 'Prepaid Expenses', type: 'Asset', balance: 0 },
    { code: '1400', name: 'Government Fee Advances', type: 'Asset', balance: 0 },
    { code: '1500', name: 'Fixed Assets', type: 'Asset', balance: 0 },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 0 },
    { code: '2100', name: 'VAT Payable', type: 'Liability', balance: 0 },
    { code: '2200', name: 'VAT Receivable', type: 'Asset', balance: 0 },
    { code: '2300', name: 'Accrued Expenses', type: 'Liability', balance: 0 },
    { code: '2400', name: 'End of Service Benefits', type: 'Liability', balance: 0 },
    { code: '2500', name: 'Customer Deposits', type: 'Liability', balance: 0 },
    { code: '3000', name: "Owner's Equity / Capital", type: 'Equity', balance: 0 },
    { code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 0 },
    { code: '4000', name: 'Service Revenue', type: 'Revenue', balance: 0 },
    { code: '4100', name: 'Typing & Documentation Revenue', type: 'Revenue', balance: 0 },
    { code: '4200', name: 'Government Fee Recovery', type: 'Revenue', balance: 0 },
    { code: '5000', name: 'Government Fees Paid', type: 'Expense', balance: 0 },
    { code: '5050', name: 'Typing Centre Charges', type: 'Expense', balance: 0 },
    { code: '5060', name: 'Amer / Tas-heel Fees', type: 'Expense', balance: 0 },
    { code: '5100', name: 'Salaries & Wages', type: 'Expense', balance: 0 },
    { code: '5200', name: 'Rent Expense', type: 'Expense', balance: 0 },
    { code: '5300', name: 'Utilities', type: 'Expense', balance: 0 },
    { code: '5400', name: 'Marketing & Advertising', type: 'Expense', balance: 0 },
    { code: '5500', name: 'Office Supplies', type: 'Expense', balance: 0 },
    { code: '5600', name: 'Transport & Fuel', type: 'Expense', balance: 0 },
    { code: '5700', name: 'Professional Fees', type: 'Expense', balance: 0 },
    { code: '5800', name: 'Insurance', type: 'Expense', balance: 0 },
    { code: '5900', name: 'Depreciation', type: 'Expense', balance: 0 },
    { code: '5950', name: 'Maintenance', type: 'Expense', balance: 0 },
    { code: '5999', name: 'Miscellaneous Expense', type: 'Expense', balance: 0 },
];

const DEFAULT_SERVICES = [
    { id: 's1', code: 'VISA-NEW', name: 'Employment Visa - New', category: 'Visa Services', desc: 'New employment visa application processing', govtFee: 300, serviceFee: 200 },
    { id: 's2', code: 'VISA-REN', name: 'Employment Visa - Renewal', category: 'Visa Services', desc: 'Employment visa renewal processing', govtFee: 300, serviceFee: 150 },
    { id: 's3', code: 'VISA-CAN', name: 'Visa Cancellation', category: 'Visa Services', desc: 'Visa cancellation processing', govtFee: 100, serviceFee: 150 },
    { id: 's4', code: 'VISA-MSN', name: 'Mission Visa', category: 'Visa Services', desc: 'Mission/visit visa processing', govtFee: 200, serviceFee: 150 },
    { id: 's5', code: 'EID-NEW', name: 'Emirates ID - New', category: 'Emirates ID', desc: 'New Emirates ID application', govtFee: 370, serviceFee: 100 },
    { id: 's6', code: 'EID-REN', name: 'Emirates ID - Renewal', category: 'Emirates ID', desc: 'Emirates ID renewal', govtFee: 370, serviceFee: 100 },
    { id: 's7', code: 'MED-FIT', name: 'Medical Fitness Test', category: 'Medical & Insurance', desc: 'Medical fitness test arrangement', govtFee: 320, serviceFee: 100 },
    { id: 's8', code: 'LAB-NEW', name: 'Labour Card - New', category: 'Labour & Immigration', desc: 'New labour card / work permit', govtFee: 300, serviceFee: 200 },
    { id: 's9', code: 'LAB-REN', name: 'Labour Card - Renewal', category: 'Labour & Immigration', desc: 'Labour card renewal', govtFee: 300, serviceFee: 150 },
    { id: 's10', code: 'TL-NEW', name: 'Trade License - New', category: 'Trade License', desc: 'New trade license application (DED)', govtFee: 3000, serviceFee: 1500 },
    { id: 's11', code: 'TL-REN', name: 'Trade License - Renewal', category: 'Trade License', desc: 'Trade license renewal', govtFee: 1500, serviceFee: 500 },
    { id: 's12', code: 'PRO-GEN', name: 'General PRO Service', category: 'PRO Services', desc: 'General government liaison & document processing', govtFee: 0, serviceFee: 300 },
    { id: 's13', code: 'ATT-DOC', name: 'Document Attestation', category: 'Attestation', desc: 'Document attestation from relevant authority', govtFee: 150, serviceFee: 200 },
    { id: 's14', code: 'TYP-GEN', name: 'General Typing', category: 'Typing Services', desc: 'General typing and form filling', govtFee: 0, serviceFee: 50 },
    { id: 's15', code: 'COMP-FRM', name: 'Company Formation', category: 'Company Formation', desc: 'Full company formation / setup assistance', govtFee: 5000, serviceFee: 3000 },
    { id: 's16', code: 'STA-CHG', name: 'Status Change (Inside)', category: 'Visa Services', desc: 'Visa status change inside country', govtFee: 570, serviceFee: 250 },
    { id: 's17', code: 'INS-MED', name: 'Health Insurance Arrangement', category: 'Medical & Insurance', desc: 'DHA/HAAD compliant health insurance arrangement', govtFee: 0, serviceFee: 150 },
    { id: 's18', code: 'EST-CARD', name: 'Establishment Card - New/Renew', category: 'Labour & Immigration', desc: 'Establishment card new or renewal', govtFee: 2000, serviceFee: 300 },
];

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();

    const now = new Date();
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-AE', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });

    const today = now.toISOString().split('T')[0];
    ['invDate', 'jeDate', 'expDate', 'quoteDate', 'poDate', 'cmDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = today;
    });
    const due = new Date(now); due.setDate(due.getDate() + 30);
    if (document.getElementById('invDueDate')) document.getElementById('invDueDate').value = due.toISOString().split('T')[0];
    const valid = new Date(now); valid.setDate(valid.getDate() + 15);
    if (document.getElementById('quoteValidUntil')) document.getElementById('quoteValidUntil').value = valid.toISOString().split('T')[0];
    const delivery = new Date(now); delivery.setDate(delivery.getDate() + 7);
    if (document.getElementById('poDeliveryDate')) document.getElementById('poDeliveryDate').value = delivery.toISOString().split('T')[0];
});

// ==================== NAVIGATION ====================
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('page-' + page).classList.add('active');
            document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;
            document.getElementById('sidebar').classList.remove('mobile-open');
            if (page === 'dashboard') updateDashboard();
            if (page === 'accounting') renderPnL();
            if (page === 'reports') renderAllReports();
            if (page === 'loans') renderLoans();
        });
    });
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });
    document.getElementById('mobileToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('mobile-open');
    });
}

function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabBar => {
        tabBar.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                tabBar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const parent = tabBar.parentElement;
                parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                parent.querySelector('#tab-' + tabId).classList.add('active');
            });
        });
    });
}

// ==================== MODAL MANAGEMENT ====================
function openModal(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'invoiceModal') { populateCustomerDropdown('invCustomer'); populateQuoteDropdown(); }
    if (id === 'quotationModal') { populateCustomerDropdown('quoteCustomer'); populateServicePicker(); }
    if (id === 'purchaseModal') populateSupplierDropdown('poSupplier');
    if (id === 'journalModal') populateAccountDropdowns();
    if (id === 'expenseModal') populateSupplierDropdown('expSupplier');
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ==================== SETTINGS ====================
function loadSettingsUI() {
    const s = appData.settings || {};
    document.getElementById('companyNameDisplay').textContent = s.companyName || 'Danoor Services';
    document.getElementById('trnDisplay').textContent = s.trn || '100000000000000';
    const fields = {
        settCompanyName: 'companyName', settTRN: 'trn', settBusinessType: 'businessType',
        settLicense: 'license', settAddress: 'address', settPhone: 'phone', settEmail: 'email',
        settFYStart: 'fyStart', settLicenseExpiry: 'licenseExpiry', settImmigrationExpiry: 'immigrationExpiry',
        settEstabExpiry: 'estabExpiry', settLeaseExpiry: 'leaseExpiry',
        settIBAN: 'iban', settAccountTitle: 'accountTitle',
        settSWIFT: 'swift', settWebsite: 'website',
        settQuotePrefix: 'quotePrefix', settQuoteNext: 'quoteNext',
        settInvPrefix: 'invPrefix', settInvNext: 'invNext', settPOPrefix: 'poPrefix', settPONext: 'poNext'
    };
    Object.entries(fields).forEach(([elId, key]) => {
        const el = document.getElementById(elId);
        if (el && s[key] !== undefined) el.value = s[key];
    });
}
// Alias for firebase-config.js callback
function loadSettings() { loadSettingsUI(); }

function saveSettings() {
    if (!_beginSave()) return;
    const s = {
        companyName: document.getElementById('settCompanyName').value,
        businessType: document.getElementById('settBusinessType').value,
        trn: document.getElementById('settTRN').value,
        license: document.getElementById('settLicense').value,
        address: document.getElementById('settAddress').value,
        phone: document.getElementById('settPhone').value,
        email: document.getElementById('settEmail').value,
        fyStart: document.getElementById('settFYStart').value,
        licenseExpiry: document.getElementById('settLicenseExpiry').value || '',
        immigrationExpiry: document.getElementById('settImmigrationExpiry').value || '',
        estabExpiry: document.getElementById('settEstabExpiry').value || '',
        leaseExpiry: document.getElementById('settLeaseExpiry').value || '',
        iban: document.getElementById('settIBAN').value,
        accountTitle: document.getElementById('settAccountTitle').value,
        swift: document.getElementById('settSWIFT').value,
        website: document.getElementById('settWebsite').value,
        quotePrefix: document.getElementById('settQuotePrefix').value,
        quoteNext: parseInt(document.getElementById('settQuoteNext').value) || 1001,
        invPrefix: document.getElementById('settInvPrefix').value,
        invNext: parseInt(document.getElementById('settInvNext').value) || 1001,
        poPrefix: document.getElementById('settPOPrefix').value,
        poNext: parseInt(document.getElementById('settPONext').value) || 1001
    };
    saveSettingsToFirestore(s).then(() => { _endSave(); showToast('Settings saved!'); }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

// ==================== CONTACTS ====================
function saveContact() {
    if (!_beginSave()) return;
    const editId = document.getElementById('ctEditId').value;
    const contact = {
        name: document.getElementById('ctName').value.trim(),
        type: document.getElementById('ctType').value,
        trn: document.getElementById('ctTrn').value.trim(),
        email: document.getElementById('ctEmail').value.trim(),
        phone: document.getElementById('ctPhone').value.trim(),
        city: document.getElementById('ctCity').value,
        address: document.getElementById('ctAddress').value.trim(),
        licenseExpiry: document.getElementById('ctLicenseExpiry').value || '',
        visaExpiry: document.getElementById('ctVisaExpiry').value || '',
        immigrationExpiry: document.getElementById('ctImmigrationExpiry').value || '',
        estabExpiry: document.getElementById('ctEstabExpiry').value || '',
        balance: 0
    };
    if (!contact.name) { _endSave(); return showToast('Please enter a contact name', 'error'); }

    const promise = editId ? fsUpdate('contacts', editId, contact) : fsAdd('contacts', contact);
    promise.then(() => {
        _endSave();
        closeModal('contactModal');
        resetContactForm();
        showToast('Contact saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetContactForm() {
    clearForm(['ctName','ctTrn','ctEmail','ctPhone','ctAddress','ctEditId','ctLicenseExpiry','ctVisaExpiry','ctImmigrationExpiry','ctEstabExpiry']);
    document.getElementById('ctType').value = 'Customer';
    document.getElementById('ctCity').value = 'Dubai';
    document.getElementById('contactModalTitle').textContent = 'New Contact';
}

function editContact(id) {
    const c = appData.contacts.find(x => x.id === id);
    if (!c) return;
    document.getElementById('ctEditId').value = c.id;
    document.getElementById('ctName').value = c.name;
    document.getElementById('ctType').value = c.type;
    document.getElementById('ctTrn').value = c.trn || '';
    document.getElementById('ctEmail').value = c.email || '';
    document.getElementById('ctPhone').value = c.phone || '';
    document.getElementById('ctCity').value = c.city || 'Dubai';
    document.getElementById('ctAddress').value = c.address || '';
    document.getElementById('ctLicenseExpiry').value = c.licenseExpiry || '';
    document.getElementById('ctVisaExpiry').value = c.visaExpiry || '';
    document.getElementById('ctImmigrationExpiry').value = c.immigrationExpiry || '';
    document.getElementById('ctEstabExpiry').value = c.estabExpiry || '';
    document.getElementById('contactModalTitle').textContent = 'Edit Contact';
    openModal('contactModal');
}

function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    fsDelete('contacts', id).then(() => showToast('Contact deleted'));
}

function renderContacts() {
    const contacts = appData.contacts || [];
    const search = (document.getElementById('contactSearch')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('contactTypeFilter')?.value || '';
    const sortVal = document.getElementById('contactSort')?.value || 'name-asc';
    let filtered = contacts.filter(c => {
        return (!search || c.name.toLowerCase().includes(search) || (c.email || '').toLowerCase().includes(search))
            && (!typeFilter || c.type === typeFilter);
    });
    filtered = sortList(filtered, sortVal);
    const tbody = document.getElementById('contactsTableBody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No contacts found</td></tr>'; renderPagination('contacts', 0, 0, 'renderContacts'); return; }
    const pg = paginate(filtered, 'contacts');
    tbody.innerHTML = pg.items.map(c => `<tr>
        <td><strong>${esc(c.name)}</strong></td>
        <td><span class="status-badge status-${c.type}">${c.type}</span></td>
        <td>${esc(c.phone || '-')}</td><td>${esc(c.city || '-')}</td>
        <td>${formatExpiryBadge(c.licenseExpiry)}</td>
        <td>${formatExpiryBadge(c.visaExpiry)}</td>
        <td style="white-space:nowrap;">
            <button class="btn-icon" onclick="editContact('${c.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteContact('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('contacts', pg.totalPages, pg.total, 'renderContacts');
}

function populateCustomerDropdown(selectId) {
    const contacts = (appData.contacts || []).filter(c => c.type === 'Customer' || c.type === 'Both');
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">Select Customer</option>' + contacts.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    sel.value = cur;
}

function populateSupplierDropdown(selectId) {
    const contacts = (appData.contacts || []).filter(c => c.type === 'Supplier' || c.type === 'Both');
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">Select Supplier (optional)</option>' + contacts.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    sel.value = cur;
}

// ==================== SERVICE CATALOGUE ====================
function saveService() {
    if (!_beginSave()) return;
    const editId = document.getElementById('svcEditId').value;
    const svc = {
        code: document.getElementById('svcCode').value.trim(),
        name: document.getElementById('svcName').value.trim(),
        category: document.getElementById('svcCategory').value,
        desc: document.getElementById('svcDesc').value.trim(),
        govtFee: parseFloat(document.getElementById('svcGovtFee').value) || 0,
        serviceFee: parseFloat(document.getElementById('svcServiceFee').value) || 0,
    };
    if (!svc.name) { _endSave(); return showToast('Please enter a service name', 'error'); }

    const promise = editId ? fsUpdate('services', editId, svc) : fsAdd('services', svc);
    promise.then(() => {
        _endSave();
        closeModal('serviceModal');
        clearForm(['svcCode','svcName','svcDesc','svcEditId']);
        document.getElementById('svcGovtFee').value = 0;
        document.getElementById('svcServiceFee').value = 0;
        showToast('Service saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetServiceForm() {
    clearForm(['svcCode','svcName','svcDesc','svcEditId']);
    document.getElementById('svcCategory').value = 'Visa Services';
    document.getElementById('svcGovtFee').value = 0;
    document.getElementById('svcServiceFee').value = 0;
    document.getElementById('serviceModalTitle').textContent = 'New Service';
}

function editService(id) {
    const svc = appData.services.find(s => s.id === id);
    if (!svc) return;
    document.getElementById('svcEditId').value = svc.id;
    document.getElementById('svcCode').value = svc.code;
    document.getElementById('svcName').value = svc.name;
    document.getElementById('svcCategory').value = svc.category;
    document.getElementById('svcDesc').value = svc.desc || '';
    document.getElementById('svcGovtFee').value = svc.govtFee;
    document.getElementById('svcServiceFee').value = svc.serviceFee;
    document.getElementById('serviceModalTitle').textContent = 'Edit Service';
    openModal('serviceModal');
}

function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    fsDelete('services', id).then(() => showToast('Service deleted'));
}

function renderServices() {
    let services = [...(appData.services || [])];
    const sortVal = document.getElementById('serviceSort')?.value || 'code-asc';
    services = sortList(services, sortVal);
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;
    if (!services.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No services defined yet</td></tr>'; renderPagination('services', 0, 0, 'renderServices'); return; }
    const pg = paginate(services, 'services');
    tbody.innerHTML = pg.items.map(s => `<tr>
        <td><strong>${esc(s.code)}</strong></td><td>${esc(s.name)}</td>
        <td><span class="status-badge">${esc(s.category)}</span></td>
        <td>${esc(s.desc || '-')}</td>
        <td>${fmt(s.govtFee)}</td><td>${fmt(s.serviceFee)}</td>
        <td><strong>${fmt((s.govtFee||0) + (s.serviceFee||0))}</strong></td>
        <td>
            <button class="btn-icon" onclick="editService('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteService('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('services', pg.totalPages, pg.total, 'renderServices');
}

// ==================== ITEM MASTER ====================
function saveItemMaster() {
    if (!_beginSave()) return;
    const editId = document.getElementById('imEditId').value;
    const item = {
        code: document.getElementById('imCode').value.trim(),
        name: document.getElementById('imName').value.trim(),
        category: document.getElementById('imCategory').value,
        serviceType: document.getElementById('imServiceType').value,
        desc: document.getElementById('imDesc').value.trim(),
        defaultPrice: parseFloat(document.getElementById('imPrice').value) || 0,
    };
    if (!item.name) { _endSave(); return showToast('Please enter an item name', 'error'); }
    const promise = editId ? fsUpdate('itemMaster', editId, item) : fsAdd('itemMaster', item);
    promise.then(() => {
        _endSave();
        closeModal('itemMasterModal');
        resetItemMasterForm();
        showToast('Item saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetItemMasterForm() {
    clearForm(['imCode','imName','imDesc','imEditId']);
    document.getElementById('imCategory').value = 'Visa Services';
    document.getElementById('imServiceType').value = '';
    document.getElementById('imPrice').value = 0;
    document.getElementById('itemMasterModalTitle').textContent = 'Add Item';
}

function editItemMaster(id) {
    const item = (appData.itemMaster || []).find(x => x.id === id);
    if (!item) return;
    document.getElementById('imEditId').value = item.id;
    document.getElementById('imCode').value = item.code || '';
    document.getElementById('imName').value = item.name;
    document.getElementById('imCategory').value = item.category || 'Visa Services';
    document.getElementById('imServiceType').value = item.serviceType || '';
    document.getElementById('imDesc').value = item.desc || '';
    document.getElementById('imPrice').value = item.defaultPrice || 0;
    document.getElementById('itemMasterModalTitle').textContent = 'Edit Item';
    openModal('itemMasterModal');
}

function deleteItemMaster(id) {
    if (!confirm('Delete this item?')) return;
    fsDelete('itemMaster', id).then(() => showToast('Item deleted'));
}

function renderItemMaster() {
    let items = [...(appData.itemMaster || [])];
    const search = (document.getElementById('itemMasterSearch')?.value || '').toLowerCase();
    const sortVal = document.getElementById('itemMasterSort')?.value || 'name-asc';
    if (search) items = items.filter(i => (i.name||'').toLowerCase().includes(search) || (i.code||'').toLowerCase().includes(search) || (i.category||'').toLowerCase().includes(search) || (i.desc||'').toLowerCase().includes(search));
    items = sortList(items, sortVal);
    const tbody = document.getElementById('itemMasterTableBody');
    if (!tbody) return;
    if (!items.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No items defined yet</td></tr>'; renderPagination('itemMaster', 0, 0, 'renderItemMaster'); return; }
    const pg = paginate(items, 'itemMaster');
    tbody.innerHTML = pg.items.map(i => `<tr>
        <td><strong>${esc(i.code || '-')}</strong></td>
        <td>${esc(i.name)}</td>
        <td><span class="status-badge">${esc(i.category || '-')}</span></td>
        <td>${esc(i.desc || '-')}</td>
        <td><strong>${fmt(i.defaultPrice || 0)}</strong></td>
        <td style="white-space:nowrap;">
            <button class="btn-icon" onclick="editItemMaster('${i.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteItemMaster('${i.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('itemMaster', pg.totalPages, pg.total, 'renderItemMaster');
}

// Build Item Master dropdown options for invoice lines
function getItemMasterOptions() {
    const items = appData.itemMaster || [];
    let opts = '<option value="">-- Custom / Ad-hoc --</option>';
    const categories = [...new Set(items.map(i => i.category).filter(Boolean))].sort();
    categories.forEach(cat => {
        opts += `<optgroup label="${esc(cat)}">`;
        items.filter(i => i.category === cat).forEach(i => {
            opts += `<option value="${i.id}" data-price="${i.defaultPrice||0}" data-desc="${esc(i.desc || i.name)}">${esc(i.code ? i.code + ' - ' : '')}${esc(i.name)}</option>`;
        });
        opts += '</optgroup>';
    });
    // Items without category
    const uncategorized = items.filter(i => !i.category);
    if (uncategorized.length) {
        uncategorized.forEach(i => {
            opts += `<option value="${i.id}" data-price="${i.defaultPrice||0}" data-desc="${esc(i.desc || i.name)}">${esc(i.code ? i.code + ' - ' : '')}${esc(i.name)}</option>`;
        });
    }
    return opts;
}

function getInvLineRowHtml(desc, qty, price) {
    desc = desc || '';
    qty = qty || 1;
    price = price || 0;
    return `<td style="min-width:250px;">
            <select class="input inv-item-select" onchange="onInvItemSelect(this)" style="margin-bottom:4px;font-size:0.8rem;">
                ${getItemMasterOptions()}
            </select>
            <input type="text" class="input inv-desc" placeholder="Item description (ad-hoc or auto-filled)" value="${esc(desc)}">
        </td>
        <td><input type="number" class="input inv-qty" value="${qty}" min="1" oninput="calcInvoiceTotal()"></td>
        <td><input type="number" class="input inv-price" value="${price}" step="0.01" oninput="calcInvoiceTotal()"></td>
        <td class="inv-line-total">${(qty * price).toFixed(2)}</td>
        <td><button class="btn-icon" onclick="removeInvLine(this)"><i class="fas fa-trash"></i></button></td>`;
}

function onInvItemSelect(sel) {
    const row = sel.closest('tr');
    const opt = sel.options[sel.selectedIndex];
    if (sel.value) {
        // Selected an Item Master item
        const desc = opt.getAttribute('data-desc') || opt.textContent;
        const price = parseFloat(opt.getAttribute('data-price')) || 0;
        row.querySelector('.inv-desc').value = desc;
        row.querySelector('.inv-price').value = price;
        calcInvoiceTotal();
    }
    // If "Custom", leave desc and price as-is for user to type
}

// ==================== QUOTATIONS ====================
function populateServicePicker() {
    const services = appData.services || [];
    const sel = document.getElementById('quoteServicePicker');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Pick from catalogue --</option>' +
        services.map(s => `<option value="${s.id}">${esc(s.code)} - ${esc(s.name)} (Govt: ${s.govtFee} + Svc: ${s.serviceFee})</option>`).join('');
}

function addServiceToQuote() {
    const sel = document.getElementById('quoteServicePicker');
    const svcId = sel.value;
    if (!svcId) return;
    const svc = appData.services.find(s => s.id === svcId);
    if (!svc) return;
    const tbody = document.getElementById('quoteLineItemsBody');
    const row = document.createElement('tr');
    row.innerHTML = `<td><input type="text" class="input qt-desc" value="${esc(svc.name)} - ${esc(svc.desc || '')}"></td>
        <td><input type="number" class="input qt-govt" value="${svc.govtFee}" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-svc" value="${svc.serviceFee}" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-qty" value="1" min="1" oninput="calcQuoteTotal()"></td>
        <td class="qt-line-total">${((svc.govtFee||0) + (svc.serviceFee||0)).toFixed(2)}</td>
        <td><button class="btn-icon" onclick="removeQuoteLine(this)"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(row);
    sel.value = '';
    calcQuoteTotal();
}

function addQuoteLine() {
    const tbody = document.getElementById('quoteLineItemsBody');
    const row = document.createElement('tr');
    row.innerHTML = `<td><input type="text" class="input qt-desc" placeholder="Service description"></td>
        <td><input type="number" class="input qt-govt" value="0" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-svc" value="0" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-qty" value="1" min="1" oninput="calcQuoteTotal()"></td>
        <td class="qt-line-total">0.00</td>
        <td><button class="btn-icon" onclick="removeQuoteLine(this)"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(row);
}

function removeQuoteLine(btn) {
    const tbody = document.getElementById('quoteLineItemsBody');
    if (tbody.children.length > 1) { btn.closest('tr').remove(); calcQuoteTotal(); }
}

function calcQuoteTotal() {
    let subtotal = 0;
    document.querySelectorAll('#quoteLineItemsBody tr').forEach(row => {
        const govt = parseFloat(row.querySelector('.qt-govt').value) || 0;
        const svc = parseFloat(row.querySelector('.qt-svc').value) || 0;
        const qty = parseFloat(row.querySelector('.qt-qty').value) || 0;
        const lineTotal = (govt + svc) * qty;
        row.querySelector('.qt-line-total').textContent = lineTotal.toFixed(2);
        subtotal += lineTotal;
    });
    const vatRate = getVatRate('quoteVatRate');
    const vat = subtotal * vatRate;
    document.getElementById('quoteSubtotal').textContent = 'AED ' + subtotal.toFixed(2);
    document.getElementById('quoteVat').textContent = 'AED ' + vat.toFixed(2);
    document.getElementById('quoteTotal').textContent = 'AED ' + (subtotal + vat).toFixed(2);
    return { subtotal, vat, vatRate, total: subtotal + vat };
}

function saveQuotation() {
    if (!_beginSave()) return;
    const editId = document.getElementById('quoteEditId').value;
    const customerId = document.getElementById('quoteCustomer').value;
    const customer = appData.contacts.find(c => c.id === customerId);
    const s = appData.settings;

    const lines = [];
    document.querySelectorAll('#quoteLineItemsBody tr').forEach(row => {
        const desc = row.querySelector('.qt-desc').value.trim();
        const govt = parseFloat(row.querySelector('.qt-govt').value) || 0;
        const svc = parseFloat(row.querySelector('.qt-svc').value) || 0;
        const qty = parseFloat(row.querySelector('.qt-qty').value) || 0;
        if (desc && qty > 0) lines.push({ desc, govt, svc, qty, total: (govt + svc) * qty });
    });
    if (!lines.length) { _endSave(); return showToast('Add at least one line item', 'error'); }

    const totals = calcQuoteTotal();
    const quote = {
        number: editId ? (appData.quotations.find(q => q.id === editId) || {}).number : (s.quotePrefix || 'QT-') + (s.quoteNext || 1001),
        date: document.getElementById('quoteDate').value,
        validUntil: document.getElementById('quoteValidUntil').value,
        customerId, customerName: customer ? customer.name : 'Walk-in Customer',
        subject: document.getElementById('quoteSubject').value.trim(),
        status: document.getElementById('quoteStatus').value,
        lines, subtotal: totals.subtotal, vat: totals.vat, vatRate: totals.vatRate, total: totals.total,
        terms: document.getElementById('quoteTerms').value.trim()
    };

    let promise;
    if (editId) {
        promise = fsUpdate('quotations', editId, quote);
    } else {
        promise = fsAdd('quotations', quote).then(() => incrementCounter('quoteNext'));
    }
    promise.then(() => {
        _endSave();
        closeModal('quotationModal');
        resetQuoteForm();
        showToast('Quotation saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetQuoteForm() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const validStr = new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0];
    document.getElementById('quoteEditId').value = '';
    document.getElementById('quoteCustomer').value = '';
    document.getElementById('quoteSubject').value = '';
    document.getElementById('quoteStatus').value = 'Draft';
    document.getElementById('quoteDate').value = todayStr;
    document.getElementById('quoteValidUntil').value = validStr;
    if (document.getElementById('quoteVatRate')) document.getElementById('quoteVatRate').value = '0';
    if (document.getElementById('quoteTerms')) document.getElementById('quoteTerms').value = '';
    if (document.getElementById('quoteNumber')) {
        const s = appData.settings || {};
        document.getElementById('quoteNumber').value = (s.quotePrefix || 'QT-') + (s.quoteNext || 1001);
    }
    document.getElementById('quotationModalTitle').textContent = 'New Quotation';
    document.getElementById('quoteLineItemsBody').innerHTML = `<tr>
        <td><input type="text" class="input qt-desc" placeholder="Service description"></td>
        <td><input type="number" class="input qt-govt" value="0" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-svc" value="0" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-qty" value="1" min="1" oninput="calcQuoteTotal()"></td>
        <td class="qt-line-total">0.00</td>
        <td><button class="btn-icon" onclick="removeQuoteLine(this)"><i class="fas fa-trash"></i></button></td></tr>`;
    calcQuoteTotal();
}

function editQuotation(id) {
    const q = appData.quotations.find(x => x.id === id);
    if (!q) return;
    document.getElementById('quoteEditId').value = q.id;
    document.getElementById('quoteDate').value = q.date;
    document.getElementById('quoteValidUntil').value = q.validUntil;
    document.getElementById('quoteSubject').value = q.subject || '';
    document.getElementById('quoteStatus').value = q.status;
    document.getElementById('quoteTerms').value = q.terms || '';
    document.getElementById('quotationModalTitle').textContent = 'Edit Quotation ' + q.number;
    document.getElementById('quoteLineItemsBody').innerHTML = q.lines.map(l => `<tr>
        <td><input type="text" class="input qt-desc" value="${esc(l.desc)}"></td>
        <td><input type="number" class="input qt-govt" value="${l.govt}" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-svc" value="${l.svc}" step="0.01" oninput="calcQuoteTotal()"></td>
        <td><input type="number" class="input qt-qty" value="${l.qty}" min="1" oninput="calcQuoteTotal()"></td>
        <td class="qt-line-total">${l.total.toFixed(2)}</td>
        <td><button class="btn-icon" onclick="removeQuoteLine(this)"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    openModal('quotationModal');
    setTimeout(() => {
        document.getElementById('quoteCustomer').value = q.customerId || '';
        if (q.vatRate !== undefined) document.getElementById('quoteVatRate').value = q.vatRate;
        calcQuoteTotal();
    }, 100);
}

function deleteQuotation(id) {
    if (!confirm('Delete this quotation?')) return;
    fsDelete('quotations', id).then(() => showToast('Quotation deleted'));
}

function convertQuoteToInvoice(id) {
    const q = appData.quotations.find(x => x.id === id);
    if (!q) return;
    if (!confirm('Convert ' + q.number + ' to an Invoice?')) return;
    const s = appData.settings;
    const now = new Date();
    const due = new Date(now); due.setDate(due.getDate() + 30);
    const invoice = {
        number: (s.invPrefix || 'INV-') + (s.invNext || 1001),
        date: now.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
        customerId: q.customerId, customerName: q.customerName,
        title: q.subject || '',
        status: 'Draft',
        lines: q.lines.map(l => ({ desc: l.desc, qty: l.qty, price: (l.govt||0) + (l.svc||0), total: l.total })),
        subtotal: q.subtotal, vat: q.vat, vatRate: q.vatRate !== undefined ? q.vatRate : DEFAULT_VAT_RATE, total: q.total,
        notes: 'Converted from ' + q.number, linkedQuote: q.id
    };
    fsAdd('invoices', invoice)
        .then(() => incrementCounter('invNext'))
        .then(() => fsUpdate('quotations', id, { status: 'Invoiced' }))
        .then(() => showToast('Invoice ' + invoice.number + ' created!'))
        .catch(e => showToast('Error: ' + e.message, 'error'));
}

function previewQuotation(id) {
    const q = appData.quotations.find(x => x.id === id);
    if (!q) return;
    document.getElementById('printModalTitle').textContent = 'Quotation Preview';
    document.getElementById('printPreviewContent').innerHTML = buildDocPreview({
        type: 'QUOTATION', doc: q, settings: appData.settings,
        extraMeta: `<div>Valid Until: ${q.validUntil}</div>${q.subject ? '<div>Re: ' + esc(q.subject) + '</div>' : ''}`,
        showGovtSvc: true,
        footer: q.terms ? '<strong>Terms & Conditions:</strong><br><pre style="white-space:pre-wrap;font-size:0.8rem;font-family:inherit;">' + esc(q.terms) + '</pre>' : ''
    });
    openModal('printModal');
}

function renderQuotations() {
    const quotations = appData.quotations || [];
    const search = (document.getElementById('quoteSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('quoteStatusFilter')?.value || '';
    const sortVal = document.getElementById('quoteSort')?.value || 'date-desc';
    let filtered = quotations.filter(q => {
        return (!search || (q.number||'').toLowerCase().includes(search) || (q.customerName||'').toLowerCase().includes(search))
            && (!statusFilter || q.status === statusFilter);
    });
    filtered = filterByDateInputs(filtered, 'date', 'quoteFromDate', 'quoteToDate');
    filtered = sortList(filtered, sortVal);
    const tbody = document.getElementById('quotationsTableBody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No quotations found</td></tr>'; renderPagination('quotations', 0, 0, 'renderQuotations'); return; }
    const pg = paginate(filtered, 'quotations');
    tbody.innerHTML = pg.items.map(q => `<tr>
        <td><strong>${esc(q.number)}</strong></td>
        <td>${q.date||''}</td><td>${q.validUntil||''}</td>
        <td>${esc(q.customerName)}</td>
        <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(q.subject || (q.lines && q.lines[0]?.desc) || '-')}</td>
        <td>${fmt(q.subtotal)}</td><td>${fmt(q.vat)}</td>
        <td><strong>${fmt(q.total)}</strong></td>
        <td><span class="status-badge status-${q.status}">${q.status}</span></td>
        <td style="white-space:nowrap;">
            <button class="btn-icon" onclick="previewQuotation('${q.id}')" title="Preview"><i class="fas fa-eye"></i></button>
            <button class="btn-icon" onclick="editQuotation('${q.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            ${q.status !== 'Invoiced' ? `<button class="btn-icon" onclick="convertQuoteToInvoice('${q.id}')" title="Convert to Invoice" style="color:var(--success);"><i class="fas fa-file-invoice-dollar"></i></button>` : ''}
            <button class="btn-icon" onclick="deleteQuotation('${q.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('quotations', pg.totalPages, pg.total, 'renderQuotations');
}

// ==================== INVOICES ====================
function populateQuoteDropdown() {
    const quotes = (appData.quotations || []).filter(q => q.status === 'Accepted');
    const sel = document.getElementById('invLinkedQuote');
    if (!sel) return;
    sel.innerHTML = '<option value="">None</option>' + quotes.map(q => `<option value="${q.id}">${esc(q.number)} - ${esc(q.customerName)}</option>`).join('');
}

function addInvLine() {
    const tbody = document.getElementById('invLineItemsBody');
    const row = document.createElement('tr');
    row.innerHTML = getInvLineRowHtml('', 1, 0);
    tbody.appendChild(row);
}
function removeInvLine(btn) {
    const tbody = document.getElementById('invLineItemsBody');
    if (tbody.children.length > 1) { btn.closest('tr').remove(); calcInvoiceTotal(); }
}
function calcInvoiceTotal() {
    let subtotal = 0;
    document.querySelectorAll('#invLineItemsBody tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.inv-qty').value) || 0;
        const price = parseFloat(row.querySelector('.inv-price').value) || 0;
        const lt = qty * price;
        row.querySelector('.inv-line-total').textContent = lt.toFixed(2);
        subtotal += lt;
    });
    const vatRate = getVatRate('invVatRate');
    const vat = subtotal * vatRate;
    document.getElementById('invSubtotal').textContent = 'AED ' + subtotal.toFixed(2);
    document.getElementById('invVat').textContent = 'AED ' + vat.toFixed(2);
    document.getElementById('invTotal').textContent = 'AED ' + (subtotal + vat).toFixed(2);
    if (typeof updateInvOutstandingHint === 'function') updateInvOutstandingHint();
    return { subtotal, vat, vatRate, total: subtotal + vat };
}

// ---- Invoice payment helpers ----
function invPaidAmount(inv) {
    return (inv.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
}
function invOutstanding(inv) {
    return Math.max(0, (inv.total || 0) - invPaidAmount(inv));
}
function invEffectiveStatus(inv) {
    const paid = invPaidAmount(inv);
    if (paid <= 0) return inv.status; // Draft, Sent, Overdue as set
    if (paid >= (inv.total || 0) - 0.01) return 'Paid';
    return 'Partial';
}

function openInvoicePaymentModal(id) {
    const inv = (appData.invoices || []).find(i => i.id === id);
    if (!inv) return;
    document.getElementById('invPayInvoiceId').value = id;
    document.getElementById('invPayDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('invPayAmount').value = '';
    document.getElementById('invPayMethod').value = 'Cash';
    document.getElementById('invPayNotes').value = '';
    const paid = invPaidAmount(inv);
    const outstanding = invOutstanding(inv);
    document.getElementById('invPayInfo').innerHTML =
        `<strong>${esc(inv.number)}</strong> — ${esc(inv.customerName)}<br>` +
        `Invoice Total: <strong>${fmt(inv.total)}</strong> &nbsp;|&nbsp; ` +
        `Paid: <strong style="color:var(--success)">${fmt(paid)}</strong> &nbsp;|&nbsp; ` +
        `Outstanding: <strong style="color:var(--warning)">${fmt(outstanding)}</strong>`;
    const hist = (inv.payments || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    document.getElementById('invPayHistorySection').innerHTML = hist.length
        ? `<h4 style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">Payment History</h4>
           <table class="data-table" style="font-size:12px;">
               <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Notes</th></tr></thead>
               <tbody>${hist.map(p => `<tr><td>${p.date}</td><td>${fmt(p.amount)}</td><td>${esc(p.method||'-')}</td><td>${esc(p.notes||'-')}</td></tr>`).join('')}</tbody>
           </table>` : '';
    openModal('invoicePaymentModal');
}

function saveInvoicePayment() {
    if (!_beginSave()) return;
    const invoiceId = document.getElementById('invPayInvoiceId').value;
    const date = document.getElementById('invPayDate').value;
    const amount = parseFloat(document.getElementById('invPayAmount').value) || 0;
    const method = document.getElementById('invPayMethod').value;
    const notes = document.getElementById('invPayNotes').value.trim();
    if (!date) { _endSave(); return showToast('Please enter payment date', 'error'); }
    if (amount <= 0) { _endSave(); return showToast('Please enter a valid amount', 'error'); }
    const inv = (appData.invoices || []).find(i => i.id === invoiceId);
    if (!inv) { _endSave(); return; }
    const outstanding = invOutstanding(inv);
    if (amount > outstanding + 0.01) { _endSave(); return showToast('Payment (' + fmt(amount) + ') exceeds outstanding balance of ' + fmt(outstanding), 'error'); }
    const payments = [...(inv.payments || []), { id: Date.now().toString(), date, amount, method, notes }];
    const newPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const newStatus = newPaid >= (inv.total || 0) - 0.01 ? 'Paid' : 'Partial';
    fsUpdate('invoices', invoiceId, { payments, status: newStatus, paidAmount: newPaid }).then(() => {
        _endSave();
        closeModal('invoicePaymentModal');
        showToast(newStatus === 'Paid' ? '✅ Invoice fully paid!' : `Payment of ${fmt(amount)} recorded!`);
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

// ---- Bulk invoice selection & settle ----
function updateInvBulkBar() {
    const checked = document.querySelectorAll('.inv-select-cb:checked');
    const bar = document.getElementById('invBulkBar');
    const allCb = document.getElementById('invSelectAll');
    const allEnabled = document.querySelectorAll('.inv-select-cb:not([disabled])');
    if (!bar) return;
    if (checked.length > 0) {
        bar.style.display = 'flex';
        const totalOutstanding = [...checked].reduce((s, cb) => {
            const inv = (appData.invoices || []).find(i => i.id === cb.dataset.id);
            return s + (inv ? invOutstanding(inv) : 0);
        }, 0);
        document.getElementById('invBulkCount').textContent = `${checked.length} invoice${checked.length > 1 ? 's' : ''} selected — Total Outstanding: ${fmt(totalOutstanding)}`;
    } else {
        bar.style.display = 'none';
    }
    if (allCb && allEnabled.length > 0) {
        allCb.indeterminate = checked.length > 0 && checked.length < allEnabled.length;
        allCb.checked = allEnabled.length > 0 && checked.length === allEnabled.length;
    }
}

function toggleAllInvoices(masterCb) {
    document.querySelectorAll('.inv-select-cb:not([disabled])').forEach(cb => { cb.checked = masterCb.checked; });
    updateInvBulkBar();
}

function clearInvoiceSelection() {
    document.querySelectorAll('.inv-select-cb').forEach(cb => { cb.checked = false; });
    const allCb = document.getElementById('invSelectAll');
    if (allCb) { allCb.checked = false; allCb.indeterminate = false; }
    updateInvBulkBar();
}

function bulkSettleInvoices() {
    const checked = document.querySelectorAll('.inv-select-cb:checked');
    if (!checked.length) return;
    const ids = [...checked].map(cb => cb.dataset.id);
    const invoices = ids.map(id => (appData.invoices || []).find(i => i.id === id)).filter(Boolean);
    const totalOutstanding = invoices.reduce((s, inv) => s + invOutstanding(inv), 0);
    document.getElementById('bulkPayDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('bulkPayMethod').value = 'Cash';
    document.getElementById('bulkPayNotes').value = '';
    document.getElementById('bulkSettleSummary').innerHTML =
        `Settling <strong>${invoices.length} invoice${invoices.length > 1 ? 's' : ''}</strong> — ` +
        `Total amount: <strong style="color:var(--warning)">${fmt(totalOutstanding)}</strong>`;
    document.getElementById('bulkSettleList').innerHTML =
        `<table class="data-table" style="font-size:12px;">
            <thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Outstanding</th></tr></thead>
            <tbody>${invoices.map(inv => `<tr><td><strong>${esc(inv.number)}</strong></td><td>${esc(inv.customerName)}</td><td>${fmt(inv.total)}</td><td style="color:var(--warning)"><strong>${fmt(invOutstanding(inv))}</strong></td></tr>`).join('')}</tbody>
        </table>`;
    // store IDs for confirm step
    document.getElementById('bulkSettleModal').dataset.ids = JSON.stringify(ids);
    openModal('bulkSettleModal');
}

function confirmBulkSettle() {
    if (!_beginSave()) return;
    const date = document.getElementById('bulkPayDate').value;
    const method = document.getElementById('bulkPayMethod').value;
    const notes = document.getElementById('bulkPayNotes').value.trim();
    if (!date) { _endSave(); return showToast('Please enter payment date', 'error'); }
    const ids = JSON.parse(document.getElementById('bulkSettleModal').dataset.ids || '[]');
    const invoices = ids.map(id => (appData.invoices || []).find(i => i.id === id)).filter(Boolean);
    if (!invoices.length) { _endSave(); return; }
    let done = 0;
    const total = invoices.length;
    let hasError = false;
    invoices.forEach(inv => {
        const outstanding = invOutstanding(inv);
        if (outstanding <= 0) { done++; if (done === total && !hasError) { _endSave(); closeModal('bulkSettleModal'); clearInvoiceSelection(); showToast(`${total} invoice${total > 1 ? 's' : ''} marked as settled!`); } return; }
        const payments = [...(inv.payments || []), { id: Date.now().toString() + Math.random(), date, amount: outstanding, method, notes }];
        const newPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
        fsUpdate('invoices', inv.id, { payments, status: 'Paid', paidAmount: newPaid }).then(() => {
            done++;
            if (done === total && !hasError) {
                _endSave();
                closeModal('bulkSettleModal');
                clearInvoiceSelection();
                showToast(`✅ ${total} invoice${total > 1 ? 's' : ''} marked as settled!`);
            }
        }).catch(e => { hasError = true; _endSave(); showToast('Error: ' + e.message, 'error'); });
    });
}

// Show/hide partial-payment row when status changes
function onInvStatusChange() {
    const status = document.getElementById('invStatus').value;
    const row = document.getElementById('invPartialRow');
    if (!row) return;
    row.style.display = status === 'Partial' ? '' : 'none';
    if (status === 'Partial') updateInvOutstandingHint();
}

// Live outstanding hint while user types Paid amount
function updateInvOutstandingHint() {
    const totalEl = document.getElementById('invTotal');
    const total = totalEl ? parseFloat(totalEl.textContent.replace(/[^0-9.]/g, '')) || 0 : 0;
    const paid  = parseFloat(document.getElementById('invPaidAmount')?.value) || 0;
    const outstanding = Math.max(0, total - paid);
    const hint = document.getElementById('invOutstandingHint');
    if (hint) hint.value = 'AED ' + outstanding.toFixed(2);
}

function saveInvoice() {
    if (!_beginSave()) return;
    const editId = document.getElementById('invEditId').value;
    const customerId = document.getElementById('invCustomer').value;
    const customer = appData.contacts.find(c => c.id === customerId);
    const s = appData.settings;

    const lines = [];
    document.querySelectorAll('#invLineItemsBody tr').forEach(row => {
        const desc = row.querySelector('.inv-desc').value.trim();
        const qty = parseFloat(row.querySelector('.inv-qty').value) || 0;
        const price = parseFloat(row.querySelector('.inv-price').value) || 0;
        if (desc && qty > 0) lines.push({ desc, qty, price, total: qty * price });
    });
    if (!lines.length) { _endSave(); return showToast('Add at least one line item', 'error'); }
    const totals = calcInvoiceTotal();
    const autoNumber = (s.invPrefix || 'INV-') + (s.invNext || 1001);
    const enteredNumber = (document.getElementById('invNumber').value || '').trim();
    const invoiceNumber = enteredNumber || autoNumber;
    let status = document.getElementById('invStatus').value;

    // ---- Inline payment handling: minimize edits ----
    const editingInv     = editId ? (appData.invoices || []).find(i => i.id === editId) : null;
    const existingPaid   = editingInv ? invPaidAmount(editingInv) : 0;
    const existingPays   = editingInv ? (editingInv.payments || []) : [];
    const today          = new Date().toISOString().slice(0, 10);
    let payments         = existingPays;
    let paidAmount       = existingPaid;

    if (status === 'Paid') {
        // Auto-settle: top-up to total in one entry
        paidAmount = totals.total;
        const topUp = totals.total - existingPaid;
        if (topUp > 0.01) {
            payments = [...existingPays, { id: 'pay_' + Date.now(), date: today, amount: topUp, method: 'Cash', notes: 'Marked as Paid' }];
        }
    } else if (status === 'Partial') {
        const enteredPaid = parseFloat(document.getElementById('invPaidAmount').value) || 0;
        if (enteredPaid <= 0)               { _endSave(); return showToast('Enter the amount paid so far', 'error'); }
        if (enteredPaid > totals.total + 0.01) { _endSave(); return showToast('Paid amount cannot exceed total', 'error'); }
        if (enteredPaid >= totals.total - 0.01) {
            // Promote to Paid automatically
            status = 'Paid';
            paidAmount = totals.total;
            const topUp = totals.total - existingPaid;
            if (topUp > 0.01) {
                payments = [...existingPays, { id: 'pay_' + Date.now(), date: today, amount: topUp, method: 'Cash', notes: 'Auto-promoted to Paid' }];
            }
        } else if (Math.abs(enteredPaid - existingPaid) < 0.01) {
            // No change in amount → keep existing payments untouched
            paidAmount = existingPaid;
        } else if (enteredPaid > existingPaid) {
            // Adding a top-up
            const topUp = enteredPaid - existingPaid;
            paidAmount = enteredPaid;
            payments = [...existingPays, { id: 'pay_' + Date.now(), date: today, amount: topUp, method: 'Cash', notes: 'Partial payment via edit' }];
        } else {
            // Reduced amount → consolidate into a single entry
            paidAmount = enteredPaid;
            payments = [{ id: 'pay_' + Date.now(), date: today, amount: enteredPaid, method: 'Cash', notes: 'Adjusted via edit' }];
        }
    } else {
        // Draft / Sent / Overdue → clear any payments
        payments = [];
        paidAmount = 0;
    }

    const invoice = {
        number: invoiceNumber,
        date: document.getElementById('invDate').value,
        dueDate: document.getElementById('invDueDate').value,
        customerId, customerName: customer ? customer.name : 'Walk-in Customer',
        title: document.getElementById('invTitle').value.trim(),
        status,
        lines, subtotal: totals.subtotal, vat: totals.vat, vatRate: totals.vatRate, total: totals.total,
        notes: document.getElementById('invNotes').value.trim(),
        linkedQuote: document.getElementById('invLinkedQuote').value || '',
        payments, paidAmount
    };
    let promise;
    if (editId) { promise = fsUpdate('invoices', editId, invoice); }
    else {
        promise = fsAdd('invoices', invoice).then(() => {
            // Only auto-increment if number was not manually edited
            if (invoiceNumber === autoNumber) return incrementCounter('invNext');
        });
    }
    promise.then(() => { _endSave(); closeModal('invoiceModal'); resetInvoiceForm(); showToast('Invoice saved!'); })
        .catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetInvoiceForm() {
    const s = appData.settings || {};
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dueStr = new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0];
    document.getElementById('invEditId').value = '';
    document.getElementById('invNumber').value = (s.invPrefix || 'INV-') + (s.invNext || 1001);
    document.getElementById('invDate').value = todayStr;
    document.getElementById('invDueDate').value = dueStr;
    document.getElementById('invCustomer').value = '';
    document.getElementById('invTitle').value = '';
    document.getElementById('invStatus').value = 'Draft';
    document.getElementById('invNotes').value = '';
    document.getElementById('invVatRate').value = '0';
    if (document.getElementById('invLinkedQuote')) document.getElementById('invLinkedQuote').value = '';
    document.getElementById('invoiceModalTitle').textContent = 'New Invoice';
    document.getElementById('invLineItemsBody').innerHTML = '<tr>' + getInvLineRowHtml('', 1, 0) + '</tr>';
    if (document.getElementById('invPaidAmount')) document.getElementById('invPaidAmount').value = '';
    if (document.getElementById('invPartialRow')) document.getElementById('invPartialRow').style.display = 'none';
    calcInvoiceTotal();
}

function editInvoice(id) {
    const inv = appData.invoices.find(i => i.id === id);
    if (!inv) return;
    document.getElementById('invEditId').value = inv.id;
    document.getElementById('invNumber').value = inv.number;
    document.getElementById('invDate').value = inv.date;
    document.getElementById('invDueDate').value = inv.dueDate;
    document.getElementById('invTitle').value = inv.title || '';
    document.getElementById('invStatus').value = inv.status;
    document.getElementById('invNotes').value = inv.notes || '';
    document.getElementById('invoiceModalTitle').textContent = 'Edit Invoice ' + inv.number;
    document.getElementById('invLineItemsBody').innerHTML = (inv.lines||[]).map(l => '<tr>' + getInvLineRowHtml(l.desc, l.qty, l.price) + '</tr>').join('');
    openModal('invoiceModal');
    setTimeout(() => {
        document.getElementById('invCustomer').value = inv.customerId || '';
        document.getElementById('invLinkedQuote').value = inv.linkedQuote || '';
        if (inv.vatRate !== undefined) document.getElementById('invVatRate').value = inv.vatRate;
        calcInvoiceTotal();
        // Pre-fill partial-payment field if applicable
        const paid = invPaidAmount(inv);
        if (document.getElementById('invPaidAmount')) {
            document.getElementById('invPaidAmount').value = (inv.status === 'Partial' && paid > 0) ? paid : '';
        }
        onInvStatusChange();
    }, 100);
}

function deleteInvoice(id) {
    if (!confirm('Delete this invoice?')) return;
    fsDelete('invoices', id).then(() => showToast('Invoice deleted'));
}

function previewInvoice(id) {
    const inv = appData.invoices.find(i => i.id === id);
    if (!inv) return;
    document.getElementById('printModalTitle').textContent = 'Invoice Preview';
    document.getElementById('printPreviewContent').innerHTML = buildDocPreview({
        type: 'INVOICE', doc: inv, settings: appData.settings,
        extraMeta: `<div>Due: ${inv.dueDate}</div>${inv.title ? '<div>Re: ' + esc(inv.title) + '</div>' : ''}`,
        footer: (inv.notes ? '<strong>Notes:</strong> ' + esc(inv.notes) + '<br>' : '') + '<em>Tax invoice issued per UAE FTA regulations.</em>'
    });
    openModal('printModal');
}

function renderInvoices() {
    const invoices = appData.invoices || [];
    const search = (document.getElementById('salesSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('salesStatusFilter')?.value || '';
    const customerFilter = document.getElementById('salesCustomerFilter')?.value || '';
    const sortVal = document.getElementById('salesSort')?.value || 'date-desc';

    // Populate customer filter dropdown
    const custSelect = document.getElementById('salesCustomerFilter');
    if (custSelect) {
        const customers = [...new Set(invoices.map(i => i.customerName).filter(Boolean))].sort();
        const cv = custSelect.value;
        custSelect.innerHTML = '<option value="">All Customers</option>' + customers.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
        custSelect.value = cv;
    }

    let filtered = invoices.filter(inv => {
        return (!search || (inv.number||'').toLowerCase().includes(search) || (inv.customerName||'').toLowerCase().includes(search) || (inv.title||'').toLowerCase().includes(search))
            && (!statusFilter || inv.status === statusFilter)
            && (!customerFilter || inv.customerName === customerFilter);
    });
    filtered = filterByDateInputs(filtered, 'date', 'salesFromDate', 'salesToDate');
    filtered = sortList(filtered, sortVal);
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No invoices found</td></tr>'; renderPagination('invoices', 0, 0, 'renderInvoices'); }
    else {
        const pg = paginate(filtered, 'invoices');
        tbody.innerHTML = pg.items.map(inv => {
            const paid = invPaidAmount(inv);
            const outstanding = invOutstanding(inv);
            const st = invEffectiveStatus(inv);
            const stColor = st === 'Paid' ? 'Paid' : st === 'Partial' ? 'Sent' : st === 'Overdue' ? 'Overdue' : 'Draft';
            const canSelect = outstanding > 0;
            return `<tr>
                <td><input type="checkbox" class="inv-select-cb" data-id="${inv.id}" ${!canSelect ? 'disabled style="opacity:0.3"' : ''} onchange="updateInvBulkBar()"></td>
                <td><strong>${esc(inv.number)}</strong></td><td>${inv.date||''}</td>
                <td>${esc(inv.customerName)}</td>
                <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(inv.title || '-')}</td>
                <td><strong>${fmt(inv.total)}</strong></td>
                <td style="color:var(--success)">${paid > 0 ? fmt(paid) : '-'}</td>
                <td style="color:${outstanding > 0 ? 'var(--warning)' : 'var(--success)'}"><strong>${outstanding > 0 ? fmt(outstanding) : '✓ Settled'}</strong></td>
                <td><span class="status-badge status-${stColor}">${st}</span></td>
                <td style="white-space:nowrap;">
                    ${outstanding > 0 ? `<button class="btn btn-sm btn-primary" onclick="openInvoicePaymentModal('${inv.id}')" title="Record Payment"><i class="fas fa-money-bill"></i></button>` : ''}
                    <button class="btn-icon" onclick="previewInvoice('${inv.id}')" title="Preview"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" onclick="editInvoice('${inv.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteInvoice('${inv.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td></tr>`;
        }).join('');
        renderPagination('invoices', pg.totalPages, pg.total, 'renderInvoices');
    }
    updateInvBulkBar();
    // VAT summary
    const paidInv = invoices.filter(i => i.status === 'Paid' || i.status === 'Partial');
    const outputVat = paidInv.reduce((s, i) => s + (i.vat || 0), 0);
    const expenses = appData.expenses || [];
    const purchases = appData.purchases || [];
    const inputVatExp = expenses.filter(e => e.vatIncl === 'yes').reduce((s, e) => s + (parseFloat(e.amount) * DEFAULT_VAT_RATE), 0);
    const inputVatPO = purchases.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.vat || 0), 0);
    const totalInputVat = inputVatExp + inputVatPO;
    if (document.getElementById('outputVat')) document.getElementById('outputVat').textContent = fmt(outputVat);
    if (document.getElementById('inputVat')) document.getElementById('inputVat').textContent = fmt(totalInputVat);
    if (document.getElementById('netVat')) document.getElementById('netVat').textContent = fmt(outputVat - totalInputVat);
}

// ==================== PURCHASE ORDERS ====================
function addPOLine() {
    const tbody = document.getElementById('poLineItemsBody');
    const row = document.createElement('tr');
    row.innerHTML = `<td><input type="text" class="input po-desc" placeholder="Item / service description"></td>
        <td><input type="number" class="input po-qty" value="1" min="1" oninput="calcPOTotal()"></td>
        <td><input type="number" class="input po-price" value="0" step="0.01" oninput="calcPOTotal()"></td>
        <td class="po-line-total">0.00</td>
        <td><button class="btn-icon" onclick="removePOLine(this)"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(row);
}
function removePOLine(btn) {
    const tbody = document.getElementById('poLineItemsBody');
    if (tbody.children.length > 1) { btn.closest('tr').remove(); calcPOTotal(); }
}
function calcPOTotal() {
    let subtotal = 0;
    document.querySelectorAll('#poLineItemsBody tr').forEach(row => {
        const qty = parseFloat(row.querySelector('.po-qty').value) || 0;
        const price = parseFloat(row.querySelector('.po-price').value) || 0;
        const lt = qty * price;
        row.querySelector('.po-line-total').textContent = lt.toFixed(2);
        subtotal += lt;
    });
    const vatRate = getVatRate('poVatRate');
    const vat = subtotal * vatRate;
    document.getElementById('poSubtotal').textContent = 'AED ' + subtotal.toFixed(2);
    document.getElementById('poVat').textContent = 'AED ' + vat.toFixed(2);
    document.getElementById('poTotal').textContent = 'AED ' + (subtotal + vat).toFixed(2);
    return { subtotal, vat, vatRate, total: subtotal + vat };
}

function savePurchaseOrder() {
    if (!_beginSave()) return;
    const editId = document.getElementById('poEditId').value;
    const supplierId = document.getElementById('poSupplier').value;
    const supplier = appData.contacts.find(c => c.id === supplierId);
    const s = appData.settings;
    const lines = [];
    document.querySelectorAll('#poLineItemsBody tr').forEach(row => {
        const desc = row.querySelector('.po-desc').value.trim();
        const qty = parseFloat(row.querySelector('.po-qty').value) || 0;
        const price = parseFloat(row.querySelector('.po-price').value) || 0;
        if (desc && qty > 0) lines.push({ desc, qty, price, total: qty * price });
    });
    if (!lines.length) { _endSave(); return showToast('Add at least one line item', 'error'); }
    const totals = calcPOTotal();
    const po = {
        number: editId ? (appData.purchases.find(p => p.id === editId) || {}).number : (s.poPrefix || 'PO-') + (s.poNext || 1001),
        date: document.getElementById('poDate').value,
        deliveryDate: document.getElementById('poDeliveryDate').value,
        supplierId, supplierName: supplier ? supplier.name : 'Unknown Supplier',
        status: document.getElementById('poStatus').value,
        payTerms: document.getElementById('poPayTerms').value,
        lines, subtotal: totals.subtotal, vat: totals.vat, vatRate: totals.vatRate, total: totals.total,
        notes: document.getElementById('poNotes').value.trim()
    };
    let promise;
    if (editId) { promise = fsUpdate('purchases', editId, po); }
    else { promise = fsAdd('purchases', po).then(() => incrementCounter('poNext')); }
    promise.then(() => { _endSave(); closeModal('purchaseModal'); resetPOForm(); showToast('Purchase Order saved!'); })
        .catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetPOForm() {
    const s = appData.settings || {};
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const delivStr = new Date(today.getTime() + 7 * 86400000).toISOString().split('T')[0];
    document.getElementById('poEditId').value = '';
    document.getElementById('poDate').value = todayStr;
    document.getElementById('poDeliveryDate').value = delivStr;
    document.getElementById('poSupplier').value = '';
    document.getElementById('poStatus').value = 'Draft';
    document.getElementById('poPayTerms').value = 'Net 30';
    document.getElementById('poNotes').value = '';
    if (document.getElementById('poNumber')) document.getElementById('poNumber').value = (s.poPrefix || 'PO-') + (s.poNext || 1001);
    if (document.getElementById('poVatRate')) document.getElementById('poVatRate').value = '0';
    document.getElementById('purchaseModalTitle').textContent = 'New Purchase Order';
    document.getElementById('poLineItemsBody').innerHTML = `<tr>
        <td><input type="text" class="input po-desc" placeholder="Item / service description"></td>
        <td><input type="number" class="input po-qty" value="1" min="1" oninput="calcPOTotal()"></td>
        <td><input type="number" class="input po-price" value="0" step="0.01" oninput="calcPOTotal()"></td>
        <td class="po-line-total">0.00</td>
        <td><button class="btn-icon" onclick="removePOLine(this)"><i class="fas fa-trash"></i></button></td></tr>`;
    calcPOTotal();
}

function editPurchaseOrder(id) {
    const po = appData.purchases.find(p => p.id === id);
    if (!po) return;
    document.getElementById('poEditId').value = po.id;
    document.getElementById('poDate').value = po.date;
    document.getElementById('poDeliveryDate').value = po.deliveryDate;
    document.getElementById('poStatus').value = po.status;
    document.getElementById('poPayTerms').value = po.payTerms || 'Net 30';
    document.getElementById('poNotes').value = po.notes || '';
    document.getElementById('purchaseModalTitle').textContent = 'Edit PO ' + po.number;
    document.getElementById('poLineItemsBody').innerHTML = (po.lines||[]).map(l => `<tr>
        <td><input type="text" class="input po-desc" value="${esc(l.desc)}"></td>
        <td><input type="number" class="input po-qty" value="${l.qty}" min="1" oninput="calcPOTotal()"></td>
        <td><input type="number" class="input po-price" value="${l.price}" step="0.01" oninput="calcPOTotal()"></td>
        <td class="po-line-total">${l.total.toFixed(2)}</td>
        <td><button class="btn-icon" onclick="removePOLine(this)"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    openModal('purchaseModal');
    setTimeout(() => {
        document.getElementById('poSupplier').value = po.supplierId || '';
        if (po.vatRate !== undefined) document.getElementById('poVatRate').value = po.vatRate;
        calcPOTotal();
    }, 100);
}

function deletePurchaseOrder(id) {
    if (!confirm('Delete this purchase order?')) return;
    fsDelete('purchases', id).then(() => showToast('Purchase order deleted'));
}

function previewPurchaseOrder(id) {
    const po = appData.purchases.find(p => p.id === id);
    if (!po) return;
    document.getElementById('printModalTitle').textContent = 'Purchase Order Preview';
    document.getElementById('printPreviewContent').innerHTML = buildDocPreview({
        type: 'PURCHASE ORDER', doc: po, settings: appData.settings,
        partyLabel: 'Supplier', partyName: po.supplierName,
        extraMeta: `<div>Delivery: ${po.deliveryDate}</div><div>Payment: ${po.payTerms}</div>`,
        footer: po.notes ? '<strong>Notes:</strong> ' + esc(po.notes) : ''
    });
    openModal('printModal');
}

function renderPurchases() {
    const purchases = appData.purchases || [];
    const search = (document.getElementById('poSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('poStatusFilter')?.value || '';
    const sortVal = document.getElementById('poSort')?.value || 'date-desc';
    let filtered = purchases.filter(p => {
        return (!search || (p.number||'').toLowerCase().includes(search) || (p.supplierName||'').toLowerCase().includes(search))
            && (!statusFilter || p.status === statusFilter);
    });
    filtered = filterByDateInputs(filtered, 'date', 'poFromDate', 'poToDate');
    filtered = sortList(filtered, sortVal);
    const tbody = document.getElementById('purchasesTableBody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No purchase orders found</td></tr>'; renderPagination('purchases', 0, 0, 'renderPurchases'); }
    else {
        const pg = paginate(filtered, 'purchases');
        tbody.innerHTML = pg.items.map(p => `<tr>
            <td><strong>${esc(p.number)}</strong></td><td>${p.date||''}</td>
            <td>${esc(p.supplierName)}</td>
            <td>${fmt(p.subtotal)}</td><td>${fmt(p.vat)}</td>
            <td><strong>${fmt(p.total)}</strong></td>
            <td><span class="status-badge status-${p.status}">${p.status}</span></td>
            <td style="white-space:nowrap;">
                <button class="btn-icon" onclick="previewPurchaseOrder('${p.id}')" title="Preview"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editPurchaseOrder('${p.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deletePurchaseOrder('${p.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td></tr>`).join('');
        renderPagination('purchases', pg.totalPages, pg.total, 'renderPurchases');
    }
    const now = new Date();
    const monthPOs = purchases.filter(p => { const d = new Date(p.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    if (document.getElementById('totalPurchases')) document.getElementById('totalPurchases').textContent = fmt(monthPOs.reduce((s, p) => s + (p.total||0), 0));
    if (document.getElementById('pendingPayment')) document.getElementById('pendingPayment').textContent = fmt(monthPOs.filter(p => p.status !== 'Paid' && p.status !== 'Cancelled').reduce((s, p) => s + (p.total||0), 0));
    if (document.getElementById('purchaseInputVat')) document.getElementById('purchaseInputVat').textContent = fmt(monthPOs.reduce((s, p) => s + (p.vat||0), 0));
}

// ==================== INVENTORY ====================
function saveInventoryItem() {
    if (!_beginSave()) return;
    const editId = document.getElementById('itemEditId').value;
    const item = {
        sku: document.getElementById('itemSku').value.trim(),
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value.trim(),
        qty: parseInt(document.getElementById('itemQty').value) || 0,
        cost: parseFloat(document.getElementById('itemCost').value) || 0,
        price: parseFloat(document.getElementById('itemPrice').value) || 0,
        reorder: parseInt(document.getElementById('itemReorder').value) || 10,
    };
    if (!item.name) { _endSave(); return showToast('Please enter an item name', 'error'); }
    const promise = editId ? fsUpdate('inventory', editId, item) : fsAdd('inventory', item);
    promise.then(() => {
        _endSave();
        closeModal('inventoryModal');
        clearForm(['itemSku','itemName','itemCategory','itemEditId']);
        document.getElementById('itemQty').value = 0; document.getElementById('itemCost').value = 0;
        document.getElementById('itemPrice').value = 0; document.getElementById('itemReorder').value = 10;
        document.getElementById('inventoryModalTitle').textContent = 'Add Inventory Item';
        showToast('Item saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetInventoryForm() {
    clearForm(['itemSku','itemName','itemCategory','itemEditId']);
    document.getElementById('itemQty').value = 0;
    document.getElementById('itemCost').value = 0;
    document.getElementById('itemPrice').value = 0;
    document.getElementById('itemReorder').value = 10;
    document.getElementById('inventoryModalTitle').textContent = 'Add Inventory Item';
}

function editInventoryItem(id) {
    const item = appData.inventory.find(i => i.id === id);
    if (!item) return;
    document.getElementById('itemEditId').value = item.id;
    document.getElementById('itemSku').value = item.sku;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemQty').value = item.qty;
    document.getElementById('itemCost').value = item.cost;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemReorder').value = item.reorder;
    document.getElementById('inventoryModalTitle').textContent = 'Edit Item';
    openModal('inventoryModal');
}

function deleteInventoryItem(id) {
    if (!confirm('Delete this item?')) return;
    fsDelete('inventory', id).then(() => showToast('Item deleted'));
}

function renderInventory() {
    const items = appData.inventory || [];
    const search = (document.getElementById('invSearch')?.value || '').toLowerCase();
    const catFilter = document.getElementById('invCategoryFilter')?.value || '';
    const sortVal = document.getElementById('inventorySort')?.value || 'name-asc';
    let filtered = items.filter(i => {
        return (!search || i.name.toLowerCase().includes(search) || (i.sku||'').toLowerCase().includes(search))
            && (!catFilter || i.category === catFilter);
    });
    filtered = sortList(filtered, sortVal);
    const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
    const catSelect = document.getElementById('invCategoryFilter');
    if (catSelect) {
        const cv = catSelect.value;
        catSelect.innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
        catSelect.value = cv;
    }
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No inventory items found</td></tr>'; renderPagination('inventory', 0, 0, 'renderInventory'); return; }
    const pg = paginate(filtered, 'inventory');
    tbody.innerHTML = pg.items.map(i => `<tr>
        <td>${esc(i.sku)}</td><td><strong>${esc(i.name)}</strong></td><td>${esc(i.category || '-')}</td>
        <td>${i.qty <= i.reorder ? '<span style="color:var(--danger);font-weight:600;">' + i.qty + '</span>' : i.qty}</td>
        <td>${fmt(i.cost)}</td><td>${fmt(i.price)}</td><td>${fmt(i.qty * i.cost)}</td>
        <td>
            <button class="btn-icon" onclick="editInventoryItem('${i.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteInventoryItem('${i.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('inventory', pg.totalPages, pg.total, 'renderInventory');
}

// ==================== ACCOUNTING ====================
function renderCOA() {
    const coa = appData.coa || [];
    const tbody = document.getElementById('coaTableBody');
    if (!tbody) return;
    const types = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
    let html = '';
    types.forEach(type => {
        const accounts = coa.filter(a => a.type === type);
        if (!accounts.length) return;
        html += `<tr style="background:#f0f4f8;"><td colspan="4" style="font-weight:700;color:var(--primary);padding:8px 12px;">${type}</td></tr>`;
        accounts.forEach(a => { html += `<tr><td>${a.code}</td><td>${esc(a.name)}</td><td>${a.type}</td><td>${fmt(a.balance)}</td></tr>`; });
    });
    tbody.innerHTML = html;
}

function populateAccountDropdowns() {
    const coa = appData.coa || [];
    document.querySelectorAll('.je-account').forEach(sel => {
        const cv = sel.value;
        sel.innerHTML = '<option value="">Select Account</option>' + coa.map(a => `<option value="${a.code}">${a.code} - ${esc(a.name)}</option>`).join('');
        sel.value = cv;
    });
}

function addJELine() {
    const tbody = document.getElementById('jeLinesBody');
    const row = document.createElement('tr');
    row.innerHTML = `<td><select class="input je-account"></select></td>
        <td><input type="number" class="input je-debit" step="0.01" value="0" oninput="calcJEBalance()"></td>
        <td><input type="number" class="input je-credit" step="0.01" value="0" oninput="calcJEBalance()"></td>
        <td><button class="btn-icon" onclick="removeJELine(this)"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(row);
    populateAccountDropdowns();
}
function removeJELine(btn) {
    const tbody = document.getElementById('jeLinesBody');
    if (tbody.children.length > 2) { btn.closest('tr').remove(); calcJEBalance(); }
}
function calcJEBalance() {
    let totalDebit = 0, totalCredit = 0;
    document.querySelectorAll('#jeLinesBody tr').forEach(row => {
        totalDebit += parseFloat(row.querySelector('.je-debit').value) || 0;
        totalCredit += parseFloat(row.querySelector('.je-credit').value) || 0;
    });
    document.getElementById('jeDebitTotal').textContent = totalDebit.toFixed(2);
    document.getElementById('jeCreditTotal').textContent = totalCredit.toFixed(2);
    const status = document.getElementById('jeBalanceStatus');
    if (Math.abs(totalDebit - totalCredit) < 0.01) { status.textContent = 'Balanced'; status.className = 'balance-ok'; }
    else { status.textContent = 'Unbalanced (' + Math.abs(totalDebit - totalCredit).toFixed(2) + ')'; status.className = 'balance-off'; }
    return { totalDebit, totalCredit };
}

function saveJournalEntry() {
    if (!_beginSave()) return;
    const { totalDebit, totalCredit } = calcJEBalance();
    if (Math.abs(totalDebit - totalCredit) > 0.01) { _endSave(); return showToast('Journal entry must be balanced!', 'error'); }
    if (totalDebit === 0) { _endSave(); return showToast('Entry cannot be zero', 'error'); }
    const lines = [];
    document.querySelectorAll('#jeLinesBody tr').forEach(row => {
        const account = row.querySelector('.je-account').value;
        const debit = parseFloat(row.querySelector('.je-debit').value) || 0;
        const credit = parseFloat(row.querySelector('.je-credit').value) || 0;
        if (account && (debit > 0 || credit > 0)) lines.push({ account, debit, credit });
    });
    const entry = {
        date: document.getElementById('jeDate').value,
        ref: document.getElementById('jeRef').value.trim(),
        desc: document.getElementById('jeDesc').value.trim(),
        lines, totalDebit, totalCredit
    };
    fsAdd('journalEntries', entry).then(() => {
        // Update COA balances in Firestore
        const batch = db.batch();
        lines.forEach(line => {
            const account = appData.coa.find(a => a.code === line.account);
            if (account) {
                const delta = ['Asset', 'Expense'].includes(account.type) ? line.debit - line.credit : line.credit - line.debit;
                batch.update(db.collection('coa').doc(account._id || account.code), {
                    balance: firebase.firestore.FieldValue.increment(delta)
                });
            }
        });
        return batch.commit();
    }).then(() => {
        _endSave();
        closeModal('journalModal');
        showToast('Journal entry saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetJournalForm() {
    document.getElementById('jeRef').value = '';
    document.getElementById('jeDesc').value = '';
    document.getElementById('jeLinesBody').innerHTML = `<tr>
        <td><select class="input je-account">${(appData.coa||[]).map(a => '<option value="'+a.code+'">'+a.code+' - '+esc(a.name)+'</option>').join('')}</select></td>
        <td><input type="number" class="input je-debit" value="0" step="0.01" oninput="calcJEBalance()"></td>
        <td><input type="number" class="input je-credit" value="0" step="0.01" oninput="calcJEBalance()"></td>
        <td><button class="btn-icon" onclick="this.closest('tr').remove();calcJEBalance()"><i class="fas fa-trash"></i></button></td></tr>`;
    calcJEBalance();
}

function renderJournal() {
    const entries = appData.journalEntries || [];
    const tbody = document.getElementById('journalTableBody');
    if (!tbody) return;
    if (!entries.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No journal entries yet</td></tr>'; return; }
    let html = '';
    entries.slice().reverse().forEach(e => {
        (e.lines||[]).forEach((l, i) => {
            html += `<tr>${i === 0 ? `<td rowspan="${e.lines.length}">${e.date}</td><td rowspan="${e.lines.length}">${esc(e.ref)}</td><td rowspan="${e.lines.length}">${esc(e.desc)}</td>` : ''}
                <td>${l.debit > 0 ? fmt(l.debit) : ''}</td><td>${l.credit > 0 ? fmt(l.credit) : ''}</td></tr>`;
        });
    });
    tbody.innerHTML = html;
}

// ==================== EXPENSES ====================
function saveExpense() {
    if (!_beginSave()) return;
    const editId = document.getElementById('expEditId').value;
    const expense = {
        date: document.getElementById('expDate').value,
        category: document.getElementById('expCategory').value,
        desc: document.getElementById('expDesc').value.trim(),
        amount: parseFloat(document.getElementById('expAmount').value) || 0,
        vatIncl: document.getElementById('expVatIncl').value,
        supplierId: document.getElementById('expSupplier').value
    };
    if (expense.amount <= 0) { _endSave(); return showToast('Please enter a valid amount', 'error'); }
    const promise = editId ? fsUpdate('expenses', editId, expense) : fsAdd('expenses', expense);
    promise.then(() => {
        _endSave();
        closeModal('expenseModal');
        resetExpenseForm();
        showToast('Expense saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function editExpense(id) {
    const e = (appData.expenses || []).find(x => x.id === id);
    if (!e) return;
    document.getElementById('expEditId').value = e.id;
    document.getElementById('expDate').value = e.date;
    document.getElementById('expCategory').value = e.category;
    document.getElementById('expDesc').value = e.desc || '';
    document.getElementById('expAmount').value = e.amount;
    document.getElementById('expVatIncl').value = e.vatIncl || 'no';
    document.getElementById('expenseModalTitle').textContent = 'Edit Expense';
    openModal('expenseModal');
    setTimeout(() => { document.getElementById('expSupplier').value = e.supplierId || ''; }, 100);
}

function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    fsDelete('expenses', id).then(() => showToast('Expense deleted'));
}

function resetExpenseForm() {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('expEditId').value = '';
    document.getElementById('expDate').value = todayStr;
    document.getElementById('expDesc').value = '';
    document.getElementById('expAmount').value = 0;
    document.getElementById('expVatIncl').value = 'no';
    if (document.getElementById('expSupplier')) document.getElementById('expSupplier').value = '';
    if (document.getElementById('expCategory')) document.getElementById('expCategory').selectedIndex = 0;
    document.getElementById('expenseModalTitle').textContent = 'Record Expense';
}

// ==================== CASH MEMO / ADHOC INCOME ====================
function saveCashMemo() {
    if (!_beginSave()) return;
    const editId = document.getElementById('cmEditId').value;
    const vatRate = parseFloat(document.getElementById('cmVatRate').value) || 0;
    const amount = parseFloat(document.getElementById('cmAmount').value) || 0;
    const vat = amount * vatRate;
    const memo = {
        date: document.getElementById('cmDate').value,
        receipt: document.getElementById('cmReceipt').value.trim(),
        customer: document.getElementById('cmCustomer').value.trim(),
        desc: document.getElementById('cmDesc').value.trim(),
        amount: amount,
        vatRate: vatRate,
        vat: vat,
        total: amount + vat,
        payMode: document.getElementById('cmPayMode').value
    };
    if (memo.amount <= 0) { _endSave(); return showToast('Please enter a valid amount', 'error'); }
    if (!memo.desc) { _endSave(); return showToast('Please enter a description', 'error'); }

    const promise = editId ? fsUpdate('cashMemos', editId, memo) : fsAdd('cashMemos', memo);
    promise.then(() => {
        _endSave();
        closeModal('cashMemoModal');
        resetCashMemoForm();
        showToast('Cash memo saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function editCashMemo(id) {
    const m = (appData.cashMemos || []).find(x => x.id === id);
    if (!m) return;
    document.getElementById('cmEditId').value = m.id;
    document.getElementById('cmDate').value = m.date;
    document.getElementById('cmReceipt').value = m.receipt || '';
    document.getElementById('cmCustomer').value = m.customer || '';
    document.getElementById('cmDesc').value = m.desc || '';
    document.getElementById('cmAmount').value = m.amount;
    document.getElementById('cmVatRate').value = m.vatRate || 0;
    document.getElementById('cmPayMode').value = m.payMode || 'Cash';
    document.getElementById('cashMemoModalTitle').textContent = 'Edit Cash Memo';
    openModal('cashMemoModal');
}

function deleteCashMemo(id) {
    if (!confirm('Delete this cash memo?')) return;
    fsDelete('cashMemos', id).then(() => showToast('Cash memo deleted'));
}

function resetCashMemoForm() {
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('cmEditId').value = '';
    document.getElementById('cmDate').value = todayStr;
    document.getElementById('cmReceipt').value = '';
    document.getElementById('cmCustomer').value = '';
    document.getElementById('cmDesc').value = '';
    document.getElementById('cmAmount').value = 0;
    document.getElementById('cmVatRate').value = '0';
    if (document.getElementById('cmPayMode')) document.getElementById('cmPayMode').selectedIndex = 0;
    document.getElementById('cashMemoModalTitle').textContent = 'New Cash Memo';
}

function renderCashMemos() {
    let memos = [...(appData.cashMemos || [])];
    const search = (document.getElementById('cashMemoSearch')?.value || '').toLowerCase();
    const sortVal = document.getElementById('cashMemoSort')?.value || 'date-desc';
    if (search) memos = memos.filter(m => (m.receipt||'').toLowerCase().includes(search) || (m.customer||'').toLowerCase().includes(search) || (m.desc||'').toLowerCase().includes(search));
    memos = filterByDateInputs(memos, 'date', 'cashMemoFromDate', 'cashMemoToDate');
    memos = sortList(memos, sortVal);
    const tbody = document.getElementById('cashMemosTableBody');
    if (!tbody) return;
    if (!memos.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No cash memos yet</td></tr>'; renderPagination('cashMemos', 0, 0, 'renderCashMemos'); return; }
    const pg = paginate(memos, 'cashMemos');
    tbody.innerHTML = pg.items.map(m => `<tr>
        <td>${m.date}</td>
        <td><strong>${esc(m.receipt || '-')}</strong></td>
        <td>${esc(m.customer || '-')}</td>
        <td>${esc(m.desc || '-')}</td>
        <td><strong>${fmt(m.total || m.amount)}</strong></td>
        <td><span class="status-badge">${esc(m.payMode)}</span></td>
        <td style="white-space:nowrap;">
            <button class="btn-icon" onclick="editCashMemo('${m.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteCashMemo('${m.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('cashMemos', pg.totalPages, pg.total, 'renderCashMemos');
}

function renderExpenses() {
    let expenses = [...(appData.expenses || [])];
    const sortVal = document.getElementById('expenseSort')?.value || 'date-desc';
    const supplierFilter = document.getElementById('expSupplierFilter')?.value || '';
    const categoryFilter = document.getElementById('expCategoryFilter')?.value || '';
    const search = (document.getElementById('expenseSearch')?.value || '').toLowerCase();

    // Populate supplier filter
    const supSelect = document.getElementById('expSupplierFilter');
    if (supSelect) {
        const suppliers = (appData.contacts || []).filter(c => c.type === 'Supplier' || c.type === 'Both');
        const cv = supSelect.value;
        supSelect.innerHTML = '<option value="">All Suppliers</option>' + suppliers.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
        supSelect.value = cv;
    }

    if (search) expenses = expenses.filter(e => (e.desc || '').toLowerCase().includes(search) || (e.category || '').toLowerCase().includes(search));
    if (supplierFilter) expenses = expenses.filter(e => e.supplierId === supplierFilter);
    if (categoryFilter) expenses = expenses.filter(e => e.category === categoryFilter);
    expenses = filterByDateInputs(expenses, 'date', 'expFromDate', 'expToDate');
    expenses = sortList(expenses, sortVal);

    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    if (!expenses.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No expenses recorded</td></tr>'; renderPagination('expenses', 0, 0, 'renderExpenses'); return; }
    const pg = paginate(expenses, 'expenses');
    tbody.innerHTML = pg.items.map(e => {
        const vatAmt = e.vatIncl === 'yes' ? ((e.amount||0) * DEFAULT_VAT_RATE) : 0;
        const supplierName = e.supplierId ? ((appData.contacts || []).find(c => c.id === e.supplierId)?.name || '-') : '-';
        return `<tr><td>${e.date}</td><td>${esc(e.category)}</td><td>${esc(supplierName)}</td><td>${esc(e.desc || '-')}</td>
            <td>${fmt(e.amount)}</td><td>${vatAmt > 0 ? fmt(vatAmt) : '-'}</td>
            <td style="white-space:nowrap;">
                <button class="btn-icon" onclick="editExpense('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteExpense('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td></tr>`;
    }).join('');
    renderPagination('expenses', pg.totalPages, pg.total, 'renderExpenses');
}

function renderPnL() {
    const invoices = (appData.invoices || []).filter(i => i.status === 'Paid' || i.status === 'Partial');
    const cashMemos = appData.cashMemos || [];
    const expenses = appData.expenses || [];
    const purchases = (appData.purchases || []).filter(p => p.status === 'Paid');
    // Revenue = actual cash received (paidAmount for partial, subtotal for fully paid)
    const invoiceRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? (i.subtotal||0) : invPaidAmount(i)), 0);
    const cashMemoRevenue = cashMemos.reduce((s, m) => s + (m.amount||0), 0);
    const totalRevenue = invoiceRevenue + cashMemoRevenue;
    if (document.getElementById('pnlInvRevenue')) document.getElementById('pnlInvRevenue').textContent = fmt(invoiceRevenue);
    if (document.getElementById('pnlCashMemoRevenue')) document.getElementById('pnlCashMemoRevenue').textContent = fmt(cashMemoRevenue);
    if (document.getElementById('pnlTotalRevenue')) document.getElementById('pnlTotalRevenue').textContent = fmt(totalRevenue);
    const totalCost = purchases.reduce((s, p) => s + (p.subtotal||0), 0);
    const costDiv = document.getElementById('pnlCostLines');
    if (costDiv) costDiv.innerHTML = purchases.length ? purchases.map(p => `<div class="pnl-line"><span>${esc(p.supplierName)} (${esc(p.number)})</span><span>${fmt(p.subtotal)}</span></div>`).join('') : '<div class="pnl-line"><span>-</span><span>AED 0.00</span></div>';
    if (document.getElementById('pnlTotalCost')) document.getElementById('pnlTotalCost').textContent = fmt(totalCost);
    if (document.getElementById('pnlGross')) document.getElementById('pnlGross').textContent = fmt(totalRevenue - totalCost);
    const expByCategory = {};
    expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + (e.amount||0); });
    const totalExpenses = Object.values(expByCategory).reduce((s, v) => s + v, 0);
    if (document.getElementById('pnlExpenseLines')) document.getElementById('pnlExpenseLines').innerHTML = Object.entries(expByCategory).map(([cat, amt]) => `<div class="pnl-line"><span>${esc(cat)}</span><span>${fmt(amt)}</span></div>`).join('');
    if (document.getElementById('pnlTotalExpenses')) document.getElementById('pnlTotalExpenses').textContent = fmt(totalExpenses);
    const net = totalRevenue - totalCost - totalExpenses;
    const netEl = document.getElementById('pnlNet');
    if (netEl) { netEl.textContent = fmt(net); netEl.style.color = net >= 0 ? 'var(--success)' : 'var(--danger)'; }
    // Outstanding loans memo
    const loans = (appData.loans || []).filter(l => l.status !== 'Paid');
    const loanLines = document.getElementById('pnlLoanLines');
    const totalLoans = loans.reduce((s, l) => s + loanOutstanding(l), 0);
    if (loanLines) loanLines.innerHTML = loans.length ? loans.map(l => `<div class="pnl-line"><span>${esc(l.lenderName)} (${esc(l.lenderType)})</span><span>${fmt(loanOutstanding(l))}</span></div>`).join('') : '<div class="pnl-line"><span>No outstanding loans</span><span>AED 0.00</span></div>';
    if (document.getElementById('pnlTotalLoans')) document.getElementById('pnlTotalLoans').textContent = fmt(totalLoans);
}

// ==================== LOANS & LIABILITIES ====================

function loanRepaid(loan) {
    return ((loan.repayments || []).reduce((s, r) => s + (r.amount || 0), 0));
}
function loanOutstanding(loan) {
    return Math.max(0, (loan.amount || 0) - loanRepaid(loan));
}
function loanStatus(loan) {
    const outstanding = loanOutstanding(loan);
    if (outstanding <= 0) return 'Paid';
    if (loanRepaid(loan) > 0) return 'Partial';
    return 'Outstanding';
}

function saveLoan() {
    if (!_beginSave()) return;
    const editId = document.getElementById('loanEditId').value;
    const loan = {
        lenderName: document.getElementById('loanLenderName').value.trim(),
        lenderType: document.getElementById('loanLenderType').value,
        amount: parseFloat(document.getElementById('loanAmount').value) || 0,
        date: document.getElementById('loanDate').value,
        dueDate: document.getElementById('loanDueDate').value || '',
        purpose: document.getElementById('loanPurpose').value.trim(),
        notes: document.getElementById('loanNotes').value.trim(),
    };
    if (!loan.lenderName) { _endSave(); return showToast('Please enter lender name', 'error'); }
    if (loan.amount <= 0) { _endSave(); return showToast('Please enter a valid amount', 'error'); }
    if (!loan.date) { _endSave(); return showToast('Please enter the date', 'error'); }
    if (!editId) loan.repayments = [];
    loan.status = editId ? loanStatus({ ...loan, repayments: (appData.loans.find(l => l.id === editId) || {}).repayments || [] }) : 'Outstanding';

    const promise = editId ? fsUpdate('loans', editId, loan) : fsAdd('loans', loan);
    promise.then(() => {
        _endSave();
        closeModal('loanModal');
        resetLoanForm();
        showToast('Loan saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetLoanForm() {
    document.getElementById('loanEditId').value = '';
    document.getElementById('loanLenderName').value = '';
    document.getElementById('loanLenderType').value = 'Partner';
    document.getElementById('loanAmount').value = '';
    document.getElementById('loanDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('loanDueDate').value = '';
    document.getElementById('loanPurpose').value = '';
    document.getElementById('loanNotes').value = '';
    document.getElementById('loanModalTitle').textContent = 'Add Loan / Liability';
}

function editLoan(id) {
    const loan = (appData.loans || []).find(l => l.id === id);
    if (!loan) return;
    document.getElementById('loanEditId').value = loan.id;
    document.getElementById('loanLenderName').value = loan.lenderName || '';
    document.getElementById('loanLenderType').value = loan.lenderType || 'Partner';
    document.getElementById('loanAmount').value = loan.amount || '';
    document.getElementById('loanDate').value = loan.date || '';
    document.getElementById('loanDueDate').value = loan.dueDate || '';
    document.getElementById('loanPurpose').value = loan.purpose || '';
    document.getElementById('loanNotes').value = loan.notes || '';
    document.getElementById('loanModalTitle').textContent = 'Edit Loan';
    openModal('loanModal');
}

function deleteLoan(id) {
    if (!confirm('Delete this loan record? This cannot be undone.')) return;
    fsDelete('loans', id).then(() => showToast('Loan deleted'));
}

function openRepaymentModal(id) {
    const loan = (appData.loans || []).find(l => l.id === id);
    if (!loan) return;
    document.getElementById('repayLoanId').value = id;
    document.getElementById('repayDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('repayAmount').value = '';
    document.getElementById('repayNotes').value = '';
    const repaid = loanRepaid(loan);
    const outstanding = loanOutstanding(loan);
    document.getElementById('repayLoanInfo').innerHTML =
        `<strong>${esc(loan.lenderName)}</strong> (${esc(loan.lenderType)})<br>` +
        `Principal: <strong>${fmt(loan.amount)}</strong> &nbsp;|&nbsp; ` +
        `Repaid: <strong style="color:var(--success)">${fmt(repaid)}</strong> &nbsp;|&nbsp; ` +
        `Outstanding: <strong style="color:var(--warning)">${fmt(outstanding)}</strong>`;
    // Show repayment history
    const hist = (loan.repayments || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const histSection = document.getElementById('repayHistorySection');
    histSection.innerHTML = hist.length ? `<h4 style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">Repayment History</h4>
        <table class="data-table" style="font-size:12px;">
            <thead><tr><th>Date</th><th>Amount</th><th>Notes</th></tr></thead>
            <tbody>${hist.map(r => `<tr><td>${r.date}</td><td>${fmt(r.amount)}</td><td>${esc(r.notes||'-')}</td></tr>`).join('')}</tbody>
        </table>` : '';
    openModal('repaymentModal');
}

function saveRepayment() {
    if (!_beginSave()) return;
    const loanId = document.getElementById('repayLoanId').value;
    const date = document.getElementById('repayDate').value;
    const amount = parseFloat(document.getElementById('repayAmount').value) || 0;
    const notes = document.getElementById('repayNotes').value.trim();
    if (!date) { _endSave(); return showToast('Please enter payment date', 'error'); }
    if (amount <= 0) { _endSave(); return showToast('Please enter a valid amount', 'error'); }
    const loan = (appData.loans || []).find(l => l.id === loanId);
    if (!loan) { _endSave(); return; }
    const outstanding = loanOutstanding(loan);
    if (amount > outstanding + 0.01) { _endSave(); return showToast('Payment exceeds outstanding balance of ' + fmt(outstanding), 'error'); }
    const repayments = [...(loan.repayments || []), { id: Date.now().toString(), date, amount, notes }];
    const newOutstanding = loanOutstanding({ ...loan, repayments });
    const newStatus = newOutstanding <= 0 ? 'Paid' : repayments.length > 0 ? 'Partial' : 'Outstanding';
    fsUpdate('loans', loanId, { repayments, status: newStatus }).then(() => {
        _endSave();
        closeModal('repaymentModal');
        showToast(newStatus === 'Paid' ? '✅ Loan fully repaid!' : 'Payment recorded!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function renderLoans() {
    let loans = [...(appData.loans || [])];
    const search = (document.getElementById('loanSearch')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('loanStatusFilter')?.value || '';
    const sortVal = document.getElementById('loanSort')?.value || 'date-desc';
    if (search) loans = loans.filter(l => (l.lenderName||'').toLowerCase().includes(search) || (l.purpose||'').toLowerCase().includes(search));
    if (statusFilter) loans = loans.filter(l => l.status === statusFilter);
    loans = filterByDateInputs(loans, 'date', 'loanFromDate', 'loanToDate');
    // Recalculate status live
    loans = loans.map(l => ({ ...l, _repaid: loanRepaid(l), _outstanding: loanOutstanding(l), _status: loanStatus(l) }));
    if (sortVal === 'date-asc') loans.sort((a,b) => new Date(a.date) - new Date(b.date));
    else if (sortVal === 'amount-desc') loans.sort((a,b) => b.amount - a.amount);
    else if (sortVal === 'outstanding-desc') loans.sort((a,b) => b._outstanding - a._outstanding);
    else loans.sort((a,b) => new Date(b.date) - new Date(a.date));

    // Summary cards
    const all = appData.loans || [];
    const totalBorrowed = all.reduce((s, l) => s + (l.amount || 0), 0);
    const totalRepaid = all.reduce((s, l) => s + loanRepaid(l), 0);
    const totalOutstanding = all.reduce((s, l) => s + loanOutstanding(l), 0);
    const activeCount = all.filter(l => loanStatus(l) !== 'Paid').length;
    if (document.getElementById('loanTotalBorrowed')) document.getElementById('loanTotalBorrowed').textContent = fmt(totalBorrowed);
    if (document.getElementById('loanTotalRepaid')) document.getElementById('loanTotalRepaid').textContent = fmt(totalRepaid);
    if (document.getElementById('loanTotalOutstanding')) document.getElementById('loanTotalOutstanding').textContent = fmt(totalOutstanding);
    if (document.getElementById('loanActiveCount')) document.getElementById('loanActiveCount').textContent = activeCount;

    const tbody = document.getElementById('loansTableBody');
    if (!tbody) return;
    if (!loans.length) { tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No loans recorded</td></tr>'; renderPagination('loans', 0, 0, 'renderLoans'); return; }
    const pg = paginate(loans, 'loans');
    const statusColor = { Outstanding: 'danger', Partial: 'warning', Paid: 'Paid' };
    tbody.innerHTML = pg.items.map(l => {
        const st = l._status;
        return `<tr>
            <td>${l.date}</td>
            <td><strong>${esc(l.lenderName)}</strong></td>
            <td><span class="status-badge" style="background:#e8f0ff;color:#2b6cb5">${esc(l.lenderType)}</span></td>
            <td>${esc(l.purpose||'-')}</td>
            <td>${fmt(l.amount)}</td>
            <td style="color:var(--success)">${fmt(l._repaid)}</td>
            <td style="color:${l._outstanding > 0 ? 'var(--warning)' : 'var(--success)'}"><strong>${fmt(l._outstanding)}</strong></td>
            <td>${l.dueDate || '-'}</td>
            <td><span class="status-badge status-${st === 'Paid' ? 'Paid' : st === 'Partial' ? 'Sent' : 'Draft'}">${st}</span></td>
            <td>
                ${st !== 'Paid' ? `<button class="btn btn-sm btn-primary" onclick="openRepaymentModal('${l.id}')" title="Record Payment"><i class="fas fa-money-bill"></i> Pay</button>` : ''}
                <button class="btn-icon" onclick="editLoan('${l.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteLoan('${l.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
    renderPagination('loans', pg.totalPages, pg.total, 'renderLoans');
}

function renderLoansReport() {
    const loans = appData.loans || [];
    const totalBorrowed = loans.reduce((s, l) => s + (l.amount || 0), 0);
    const totalRepaid = loans.reduce((s, l) => s + loanRepaid(l), 0);
    const totalOutstanding = loans.reduce((s, l) => s + loanOutstanding(l), 0);
    const activeCount = loans.filter(l => loanStatus(l) !== 'Paid').length;
    if (document.getElementById('rptLoanBorrowed')) document.getElementById('rptLoanBorrowed').textContent = fmt(totalBorrowed);
    if (document.getElementById('rptLoanRepaid')) document.getElementById('rptLoanRepaid').textContent = fmt(totalRepaid);
    if (document.getElementById('rptLoanOutstanding')) document.getElementById('rptLoanOutstanding').textContent = fmt(totalOutstanding);
    if (document.getElementById('rptLoanCount')) document.getElementById('rptLoanCount').textContent = activeCount;

    const tbody = document.getElementById('rptLoansBody');
    if (tbody) {
        tbody.innerHTML = loans.length ? [...loans].sort((a,b) => new Date(b.date) - new Date(a.date)).map(l => {
            const repaid = loanRepaid(l); const outstanding = loanOutstanding(l); const st = loanStatus(l);
            return `<tr><td>${l.date}</td><td><strong>${esc(l.lenderName)}</strong></td><td>${esc(l.lenderType)}</td><td>${fmt(l.amount)}</td><td style="color:var(--success)">${fmt(repaid)}</td><td style="color:${outstanding > 0 ? 'var(--warning)' : 'var(--success)'}"><strong>${fmt(outstanding)}</strong></td><td><span class="status-badge status-${st === 'Paid' ? 'Paid' : st === 'Partial' ? 'Sent' : 'Draft'}">${st}</span></td></tr>`;
        }).join('') : '<tr><td colspan="7" class="empty-state">No loans recorded</td></tr>';
    }

    // Repayment history table
    const rBody = document.getElementById('rptRepaymentsBody');
    if (rBody) {
        const rows = [];
        loans.forEach(l => { (l.repayments || []).forEach(r => rows.push({ ...r, lenderName: l.lenderName })); });
        rows.sort((a, b) => new Date(b.date) - new Date(a.date));
        rBody.innerHTML = rows.length ? rows.map(r => `<tr><td>${r.date}</td><td><strong>${esc(r.lenderName)}</strong></td><td>${fmt(r.amount)}</td><td>${esc(r.notes||'-')}</td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No repayments recorded</td></tr>';
    }
}

// ==================== HR & PAYROLL ====================
function saveEmployee() {
    if (!_beginSave()) return;
    const editId = document.getElementById('empEditId').value;
    const emp = {
        empId: document.getElementById('empId').value.trim(),
        name: document.getElementById('empName').value.trim(),
        position: document.getElementById('empPosition').value,
        dept: document.getElementById('empDept').value,
        joinDate: document.getElementById('empJoinDate').value,
        visa: document.getElementById('empVisa').value,
        basic: parseFloat(document.getElementById('empBasic').value) || 0,
        housing: parseFloat(document.getElementById('empHousing').value) || 0,
        transport: parseFloat(document.getElementById('empTransport').value) || 0,
        other: parseFloat(document.getElementById('empOther').value) || 0,
    };
    emp.totalSalary = emp.basic + emp.housing + emp.transport + emp.other;
    if (!emp.name) { _endSave(); return showToast('Please enter employee name', 'error'); }
    const promise = editId ? fsUpdate('employees', editId, emp) : fsAdd('employees', emp);
    promise.then(() => {
        _endSave();
        closeModal('employeeModal');
        clearForm(['empName','empId','empEditId']);
        document.getElementById('empPosition').value = '';
        ['empBasic','empHousing','empTransport','empOther'].forEach(id => document.getElementById(id).value = 0);
        document.getElementById('employeeModalTitle').textContent = 'Add Employee';
        showToast('Employee saved!');
    }).catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function resetEmployeeForm() {
    clearForm(['empName','empId','empEditId']);
    document.getElementById('empPosition').value = '';
    document.getElementById('empDept').value = 'Operations';
    document.getElementById('empJoinDate').value = '';
    document.getElementById('empVisa').value = 'Employment';
    ['empBasic','empHousing','empTransport','empOther'].forEach(id => document.getElementById(id).value = 0);
    document.getElementById('employeeModalTitle').textContent = 'Add Employee';
}

function editEmployee(id) {
    const emp = appData.employees.find(e => e.id === id);
    if (!emp) return;
    document.getElementById('empEditId').value = emp.id;
    document.getElementById('empId').value = emp.empId;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empPosition').value = emp.position;
    document.getElementById('empDept').value = emp.dept;
    document.getElementById('empJoinDate').value = emp.joinDate;
    document.getElementById('empVisa').value = emp.visa || 'Employment';
    document.getElementById('empBasic').value = emp.basic;
    document.getElementById('empHousing').value = emp.housing;
    document.getElementById('empTransport').value = emp.transport;
    document.getElementById('empOther').value = emp.other;
    document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
    openModal('employeeModal');
}

function deleteEmployee(id) {
    if (!confirm('Delete this employee?')) return;
    fsDelete('employees', id).then(() => showToast('Employee deleted'));
}

function renderEmployees() {
    let employees = [...(appData.employees || [])];
    const sortVal = document.getElementById('employeeSort')?.value || 'name-asc';
    employees = sortList(employees, sortVal);
    const tbody = document.getElementById('employeesTableBody');
    if (!tbody) return;
    if (!employees.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No employees yet</td></tr>'; renderPagination('employees', 0, 0, 'renderEmployees'); return; }
    const pg = paginate(employees, 'employees');
    tbody.innerHTML = pg.items.map(e => `<tr>
        <td>${esc(e.empId)}</td><td><strong>${esc(e.name)}</strong></td>
        <td>${esc(e.position || '-')}</td><td>${esc(e.dept || '-')}</td><td>${e.joinDate || '-'}</td>
        <td>${fmt(e.basic)}</td><td>${fmt((e.housing||0) + (e.transport||0) + (e.other||0))}</td>
        <td><strong>${fmt(e.totalSalary)}</strong></td>
        <td>
            <button class="btn-icon" onclick="editEmployee('${e.id}')" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-icon" onclick="deleteEmployee('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
        </td></tr>`).join('');
    renderPagination('employees', pg.totalPages, pg.total, 'renderEmployees');
}

function runPayroll() {
    const employees = appData.employees || [];
    if (!employees.length) return showToast('No employees to process', 'error');
    const now = new Date();
    const month = now.toLocaleDateString('en-AE', { year: 'numeric', month: 'long' });
    if ((appData.payrollRuns || []).find(p => p.month === month)) return showToast('Payroll already processed for ' + month, 'error');
    let totalBasic = 0, totalAllowances = 0, totalNet = 0;
    employees.forEach(e => {
        totalBasic += e.basic || 0;
        totalAllowances += (e.housing||0) + (e.transport||0) + (e.other||0);
        totalNet += e.totalSalary || 0;
    });
    fsAdd('payrollRuns', {
        month, date: now.toISOString().split('T')[0],
        employeeCount: employees.length, totalBasic, totalAllowances, deductions: 0, netPayroll: totalNet
    }).then(() => showToast('Payroll processed for ' + month + '!'));
}

function renderPayroll() {
    const payrollRuns = appData.payrollRuns || [];
    const tbody = document.getElementById('payrollTableBody');
    if (!tbody) return;
    if (!payrollRuns.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No payroll runs yet</td></tr>'; return; }
    tbody.innerHTML = payrollRuns.slice().reverse().map(p => `<tr>
        <td><strong>${esc(p.month)}</strong></td><td>${p.employeeCount}</td>
        <td>${fmt(p.totalBasic)}</td><td>${fmt(p.totalAllowances)}</td>
        <td>${fmt(p.deductions)}</td><td><strong>${fmt(p.netPayroll)}</strong></td></tr>`).join('');
}

// ==================== GRATUITY CALCULATOR ====================
function calculateGratuity() {
    const basic = parseFloat(document.getElementById('gratBasic').value) || 0;
    const years = parseFloat(document.getElementById('gratYears').value) || 0;
    const type = document.getElementById('gratType').value;
    if (basic <= 0 || years <= 0) return showToast('Please enter valid salary and years', 'error');
    let gratuity = 0, breakdown = '';
    const dailyWage = basic / 30;
    if (type === 'employer') {
        if (years <= 5) { gratuity = 21 * dailyWage * years; breakdown = `21 days x ${years} years = AED ${gratuity.toFixed(2)}`; }
        else { const f5 = 21*dailyWage*5; const rem = 30*dailyWage*(years-5); gratuity = f5+rem; breakdown = `First 5yr: AED ${f5.toFixed(2)} + Remaining ${(years-5).toFixed(1)}yr: AED ${rem.toFixed(2)}`; }
    } else {
        if (years < 1) { gratuity = 0; breakdown = 'No gratuity for < 1 year.'; }
        else if (years < 3) { gratuity = 0; breakdown = 'No gratuity for resignation < 3 years.'; }
        else if (years < 5) { gratuity = (21*dailyWage*years)/3; breakdown = `1/3 of gratuity = AED ${gratuity.toFixed(2)}`; }
        else { gratuity = years<=5 ? 21*dailyWage*years : (21*dailyWage*5)+(30*dailyWage*(years-5)); breakdown = `Full gratuity = AED ${gratuity.toFixed(2)}`; }
    }
    const cap = basic * 24;
    if (gratuity > cap) { gratuity = cap; breakdown += ` (Capped at AED ${cap.toFixed(2)})`; }
    document.getElementById('gratuityAmount').textContent = 'AED ' + gratuity.toFixed(2);
    document.getElementById('gratuityBreakdown').textContent = breakdown;
    document.getElementById('gratuityResult').style.display = 'block';
}

// ==================== DASHBOARD ====================
// ==================== EXPIRY ALERTS ====================
function getDaysUntil(dateStr) {
    if (!dateStr) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const expiry = new Date(dateStr); expiry.setHours(0,0,0,0);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function formatExpiryBadge(dateStr) {
    if (!dateStr) return '<span style="color:#aaa;">—</span>';
    const days = getDaysUntil(dateStr);
    const dateDisplay = formatDateDMY(dateStr);
    if (days < 0) return `<span style="color:#fff;background:#c62828;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:600;"><i class="fas fa-exclamation-circle"></i> Expired</span><br><small style="color:#999;">${dateDisplay}</small>`;
    if (days <= 7) return `<span style="color:#fff;background:#e74c3c;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:600;">${days}d left</span><br><small style="color:#999;">${dateDisplay}</small>`;
    if (days <= 30) return `<span style="color:#fff;background:#f39c12;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:600;">${days}d left</span><br><small style="color:#999;">${dateDisplay}</small>`;
    if (days <= 60) return `<span style="color:#856404;background:#fff3cd;padding:2px 8px;border-radius:10px;font-size:0.75rem;">${days}d</span><br><small style="color:#999;">${dateDisplay}</small>`;
    return `<span style="color:#27ae60;font-size:0.8rem;">${dateDisplay}</span>`;
}

function renderExpiryAlerts() {
    const card = document.getElementById('expiryAlertsCard');
    const tbody = document.getElementById('expiryAlertsBody');
    const companyDiv = document.getElementById('companyExpiryAlerts');
    if (!card || !tbody) return;

    const alerts = [];
    const today = new Date(); today.setHours(0,0,0,0);

    // Company expiry alerts from settings
    const s = appData.settings || {};
    const companyDocs = [
        { label: 'Trade License', date: s.licenseExpiry },
        { label: 'Immigration Card', date: s.immigrationExpiry },
        { label: 'Establishment Card', date: s.estabExpiry },
        { label: 'Lease/Tenancy', date: s.leaseExpiry }
    ];
    let companyHtml = '';
    companyDocs.forEach(d => {
        if (!d.date) return;
        const days = getDaysUntil(d.date);
        if (days !== null && days <= 30) {
            const color = days < 0 ? '#c62828' : days <= 7 ? '#e74c3c' : '#f39c12';
            const status = days < 0 ? 'EXPIRED' : days + ' days left';
            companyHtml += `<div style="display:inline-flex;align-items:center;gap:8px;background:${days < 0 ? '#fde8e8' : '#fff8e1'};padding:6px 14px;border-radius:8px;margin:0 8px 8px 0;border:1px solid ${color}33;">
                <i class="fas fa-building" style="color:${color};"></i>
                <strong style="color:${color};">Company ${d.label}:</strong>
                <span>${formatDateDMY(d.date)}</span>
                <span style="color:#fff;background:${color};padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:600;">${status}</span>
            </div>`;
        }
    });
    if (companyDiv) companyDiv.innerHTML = companyHtml;

    // Customer expiry alerts
    const contacts = appData.contacts || [];
    const expiryFields = [
        { key: 'licenseExpiry', label: 'Trade License' },
        { key: 'visaExpiry', label: 'Visa / Emirates ID' },
        { key: 'immigrationExpiry', label: 'Immigration Card' },
        { key: 'estabExpiry', label: 'Establishment Card' }
    ];
    contacts.forEach(c => {
        expiryFields.forEach(f => {
            if (!c[f.key]) return;
            const days = getDaysUntil(c[f.key]);
            if (days !== null && days <= 30) {
                alerts.push({ name: c.name, doc: f.label, date: c[f.key], days: days, id: c.id });
            }
        });
    });

    // Sort: expired first, then by days ascending
    alerts.sort((a, b) => a.days - b.days);

    if (!alerts.length && !companyHtml) { card.style.display = 'none'; return; }
    card.style.display = 'block';

    if (!alerts.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No customer expiry alerts</td></tr>';
        return;
    }

    tbody.innerHTML = alerts.map(a => {
        const color = a.days < 0 ? '#c62828' : a.days <= 7 ? '#e74c3c' : '#f39c12';
        const statusText = a.days < 0 ? 'EXPIRED' : a.days + ' days left';
        const bgColor = a.days < 0 ? '#fde8e8' : a.days <= 7 ? '#fff0f0' : '#fff8e1';
        return `<tr style="background:${bgColor};">
            <td><strong>${esc(a.name)}</strong></td>
            <td>${a.doc}</td>
            <td>${formatDateDMY(a.date)}</td>
            <td style="font-weight:700;color:${color};">${a.days < 0 ? Math.abs(a.days) + 'd overdue' : a.days + 'd'}</td>
            <td><span style="color:#fff;background:${color};padding:3px 10px;border-radius:10px;font-size:0.75rem;font-weight:600;">${statusText}</span></td>
        </tr>`;
    }).join('');
}

function updateDashboard() {
    const invoices = appData.invoices || [];
    const quotations = appData.quotations || [];
    const purchases = appData.purchases || [];
    const inventory = appData.inventory || [];
    const employees = appData.employees || [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const cashMemos = appData.cashMemos || [];
    const mtdInvRevenue = invoices.filter(i => i.status === 'Paid' && new Date(i.date) >= monthStart).reduce((s, i) => s + (i.total||0), 0);
    const mtdCashRevenue = cashMemos.filter(m => new Date(m.date) >= monthStart).reduce((s, m) => s + (m.total || m.amount || 0), 0);
    const mtdRevenue = mtdInvRevenue + mtdCashRevenue;
    const outstanding = invoices.filter(i => i.status !== 'Paid' && i.status !== 'Cancelled').reduce((s, i) => s + invOutstanding(i), 0);
    if (document.getElementById('kpiRevenue')) document.getElementById('kpiRevenue').textContent = fmt(mtdRevenue);
    if (document.getElementById('kpiOutstanding')) document.getElementById('kpiOutstanding').textContent = fmt(outstanding);
    if (document.getElementById('kpiQuotations')) document.getElementById('kpiQuotations').textContent = quotations.filter(q => ['Draft','Sent'].includes(q.status)).length;
    if (document.getElementById('kpiPurchases')) document.getElementById('kpiPurchases').textContent = purchases.filter(p => !['Paid','Cancelled'].includes(p.status)).length;
    if (document.getElementById('kpiInventory')) document.getElementById('kpiInventory').textContent = fmt(inventory.reduce((s, i) => s + ((i.qty||0)*(i.cost||0)), 0));
    if (document.getElementById('kpiEmployees')) document.getElementById('kpiEmployees').textContent = employees.length;

    // Recent tables
    const dashInv = document.getElementById('dashRecentInvoices');
    if (dashInv) { const r = invoices.slice(-5).reverse(); dashInv.innerHTML = r.length ? r.map(i => `<tr><td>${esc(i.number)}</td><td>${esc(i.customerName)}</td><td>${fmt(i.total)}</td><td><span class="status-badge status-${i.status}">${i.status}</span></td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No invoices yet</td></tr>'; }
    const dashQt = document.getElementById('dashRecentQuotations');
    if (dashQt) { const r = quotations.slice(-5).reverse(); dashQt.innerHTML = r.length ? r.map(q => `<tr><td>${esc(q.number)}</td><td>${esc(q.customerName)}</td><td>${fmt(q.total)}</td><td><span class="status-badge status-${q.status}">${q.status}</span></td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No quotations yet</td></tr>'; }
    const dashPO = document.getElementById('dashRecentPOs');
    if (dashPO) { const r = purchases.filter(p => p.status!=='Paid').slice(-5).reverse(); dashPO.innerHTML = r.length ? r.map(p => `<tr><td>${esc(p.number)}</td><td>${esc(p.supplierName)}</td><td>${fmt(p.total)}</td><td><span class="status-badge status-${p.status}">${p.status}</span></td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No pending POs</td></tr>'; }
    const dashLow = document.getElementById('dashLowStock');
    if (dashLow) { const ls = inventory.filter(i => i.qty <= i.reorder); dashLow.innerHTML = ls.length ? ls.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.sku)}</td><td style="color:var(--danger);font-weight:600;">${i.qty}</td><td>${i.reorder}</td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No low stock items</td></tr>'; }
    renderCharts();
    renderExpiryAlerts();
    updateDashboardServiceStats();
    if (typeof renderDashboardTasks === 'function') renderDashboardTasks();
}

function renderCharts() {
    const invoices = (appData.invoices || []).filter(i => i.status === 'Paid');
    const expenses = appData.expenses || [];
    const months = [], revenueData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toLocaleDateString('en-AE', { month: 'short', year: '2-digit' }));
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        revenueData.push(invoices.filter(inv => { const id = new Date(inv.date); return id >= d && id <= end; }).reduce((s, inv) => s + (inv.total||0), 0));
    }
    if (window._revenueChart) window._revenueChart.destroy();
    if (window._expenseChart) window._expenseChart.destroy();
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        window._revenueChart = new Chart(revCtx, {
            type: 'bar', data: { labels: months, datasets: [{ label: 'Revenue (AED)', data: revenueData, backgroundColor: 'rgba(43,108,181,0.7)', borderColor: '#2b6cb5', borderWidth: 1, borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }
    const expByCategory = {};
    expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + (e.amount||0); });
    const colors = ['#2b6cb5','#3b82c4','#c0392b','#27ae60','#f39c12','#8e44ad','#e67e22','#16a085','#d35400','#2c3e50','#1abc9c','#e74c3c'];
    const expCtx = document.getElementById('expenseChart');
    if (expCtx) {
        const labels = Object.keys(expByCategory); const data = Object.values(expByCategory);
        window._expenseChart = new Chart(expCtx, {
            type: 'doughnut', data: { labels: labels.length ? labels : ['No expenses'], datasets: [{ data: data.length ? data : [1], backgroundColor: data.length ? colors.slice(0,labels.length) : ['#ecf0f1'], borderWidth: 2, borderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } } } }
        });
    }
}

// ==================== DOCUMENT PREVIEW ====================
function formatDateDMY(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
}

function buildDocPreview({ type, doc, settings, partyLabel, partyName, extraMeta, showGovtSvc, footer }) {
    const s = settings || {};
    const party = partyName || doc.customerName || 'N/A';
    const typeUpper = (type || '').toUpperCase();
    const defaultToLabel = typeUpper.includes('PURCHASE') ? 'Order To' : typeUpper.includes('QUOTATION') ? 'Quotation To' : 'Invoice To';
    const defaultFromLabel = typeUpper.includes('PURCHASE') ? 'Order From' : typeUpper.includes('QUOTATION') ? 'Quotation From' : 'Invoice From';
    const label = partyLabel || defaultToLabel;
    const lines = doc.lines || [];
    const vatPct = doc.vatRate !== undefined ? (doc.vatRate * 100).toFixed(0) : '0';
    const subject = doc.title || doc.subject || '';
    const currentUserName = (typeof auth !== 'undefined' && auth.currentUser) ? (auth.currentUser.displayName || auth.currentUser.email) : '';
    const preparedBy = doc.createdBy || currentUserName || s.email || '';

    // Build line items rows with alternating stripes
    let linesHtml = '';
    if (showGovtSvc) {
        linesHtml = lines.map((l, i) => `<tr class="${i%2===0?'row-stripe':''}">
            <td class="td-desc">${esc(l.desc)}</td><td class="td-num">${(l.govt||0).toFixed(2)}</td>
            <td class="td-num">${(l.svc||0).toFixed(2)}</td><td class="td-num">${l.qty}</td>
            <td class="td-num">${l.total.toFixed(2)}</td></tr>`).join('');
    } else {
        linesHtml = lines.map((l, i) => `<tr class="${i%2===0?'row-stripe':''}">
            <td class="td-desc">${esc(l.desc)}</td><td class="td-num">${(l.price||0).toFixed(2)}</td>
            <td class="td-num">${l.qty}</td><td class="td-num">${l.total.toFixed(2)}</td></tr>`).join('');
    }
    const thCols = showGovtSvc
        ? '<th class="th-desc">DESCRIPTION</th><th class="th-num">GOVT FEE(AED)</th><th class="th-num">SVC FEE(AED)</th><th class="th-num">QTY</th><th class="th-num">TOTAL</th>'
        : '<th class="th-desc">DESCRIPTION</th><th class="th-num">PRICE(AED)</th><th class="th-num">QTY</th><th class="th-num">TOTAL</th>';

    return `<div class="doc-preview" id="printableDoc">
        <!-- WATERMARK -->
        <div class="doc-watermark" aria-hidden="true"><img src="logo.JPG" alt=""></div>
        <!-- HEADER BAR -->
        <div class="doc-header-bar">
            <div class="doc-logo">
                <img src="logo.JPG" alt="Danoor">
            </div>
            <div class="doc-header-right">
                <div class="doc-type-title">${type}</div>
                <div class="doc-header-meta">Date: ${formatDateDMY(doc.date)}</div>
                <div class="doc-header-meta">ID NO: ${esc(doc.number)}</div>
            </div>
        </div>

        <!-- PARTIES -->
        <div class="doc-parties">
            <div class="doc-party-col">
                <div class="doc-party-label">${label} :</div>
                <div class="doc-party-details">
                    <div class="doc-party-name">${esc(party)}</div>
                    ${subject ? '<div class="doc-party-line">Subject: ' + esc(subject) + '</div>' : ''}
                    ${preparedBy ? '<div class="doc-party-line">Prepared By: ' + esc(preparedBy) + '</div>' : ''}
                </div>
            </div>
            <div class="doc-party-col doc-align-right">
                <div class="doc-party-label">${defaultFromLabel} :</div>
                <div class="doc-party-details">
                    <div class="doc-party-name">${esc(s.companyName || 'Danoor Services')}</div>
                    <div class="doc-party-line">${esc(s.businessType || 'Documents Clearing')}</div>
                    ${s.address ? '<div class="doc-party-line">' + esc(s.address) + '</div>' : ''}
                    ${s.phone ? '<div class="doc-party-line">Phone: ' + esc(s.phone) + '</div>' : ''}
                    ${s.email ? '<div class="doc-party-line">Email: ' + esc(s.email) + '</div>' : ''}
                </div>
            </div>
        </div>

        <!-- LINE ITEMS TABLE -->
        <table class="doc-table">
            <thead><tr>${thCols}</tr></thead>
            <tbody>${linesHtml}</tbody>
        </table>

        <!-- TOTALS -->
        <div class="doc-totals-bar">
            <div class="doc-totals-spacer"></div>
            <div class="doc-totals-section">
                ${doc.vat > 0 ? '<div class="doc-total-line"><span>Subtotal</span><span>' + (doc.subtotal||0).toFixed(2) + '</span></div>' : ''}
                ${doc.vat > 0 ? '<div class="doc-total-line"><span>VAT (' + vatPct + '%)</span><span>' + (doc.vat||0).toFixed(2) + '</span></div>' : ''}
                <div class="doc-total-grand"><span>Total</span><span>${(doc.total||0).toFixed(2)}</span></div>
            </div>
        </div>

        <!-- FOOTER: PAYMENT & CONTACT -->
        <div class="doc-footer-section">
            ${typeUpper.includes('INVOICE') ? `<div class="doc-footer-col">
                <div class="doc-footer-label">Payment Method :</div>
                <div class="doc-footer-details">
                    ${s.iban ? '<div>IBAN: ' + esc(s.iban) + '</div>' : ''}
                    ${s.accountTitle ? '<div>Account Title: ' + esc(s.accountTitle) + '</div>' : '<div>Account Title: ' + esc(s.companyName || 'DANOOR DOCUMENTS CLEARING SERVICES') + '</div>'}
                    ${s.swift ? '<div>SWIFT: ' + esc(s.swift) + '</div>' : ''}
                </div>
            </div>` : ''}
            <div class="doc-footer-col doc-align-right" style="margin-left:auto;">
                <div class="doc-footer-label">Contact Info :</div>
                <div class="doc-footer-details">
                    ${s.phone ? '<div>Phone: ' + esc(s.phone) + '</div>' : ''}
                    ${s.email ? '<div>Email: ' + esc(s.email) + '</div>' : ''}
                    ${s.website ? '<div>Web: ' + esc(s.website) + '</div>' : ''}
                </div>
            </div>
        </div>

        <div class="doc-thanks">Thanks for your business</div>
        <div class="doc-terms">Terms & Conditions: This is a computer generated document and does not bear a signature.${footer ? '<br>' + footer : ''}</div>
    </div>`;
}

function printDocument() {
    const content = document.getElementById('printableDoc').outerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Document</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>${getPrintStyles()}</style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 500);
}

function getDocFileName() {
    const el = document.getElementById('printableDoc');
    if (!el) return 'document';
    const idEl = el.querySelectorAll('.doc-header-meta');
    let docId = '';
    idEl.forEach(m => { if (m.textContent.includes('ID NO:')) docId = m.textContent.replace('ID NO:', '').trim(); });
    // Get first word of subject/title from the party details
    let subjectWord = '';
    const partyLines = el.querySelectorAll('.doc-party-line');
    partyLines.forEach(line => {
        if (line.textContent.startsWith('Subject:')) {
            const subjectText = line.textContent.replace('Subject:', '').trim();
            subjectWord = subjectText.split(/\s+/)[0] || '';
        }
    });
    // Build filename: SubjectFirstWord_INV-1001
    let parts = [];
    if (subjectWord) parts.push(subjectWord);
    if (docId) parts.push(docId);
    return (parts.length ? parts.join('_') : 'document').replace(/[^a-zA-Z0-9_-]/g, '');
}

// ---- Shared PDF setup: works on iOS, Android & desktop ----
function _isMobileDevice() {
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

// Wait for all <img> in a node to fully load (or timeout) — critical for mobile
// where html2canvas may snapshot the DOM before the logo is decoded.
function _waitForImagesIn(el) {
    const imgs = el.querySelectorAll('img');
    if (!imgs.length) return Promise.resolve();
    return Promise.all(Array.from(imgs).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(resolve => {
            const done = () => resolve();
            img.addEventListener('load',  done, { once: true });
            img.addEventListener('error', done, { once: true });
            setTimeout(done, 4000); // hard timeout so we never hang
        });
    }));
}

// Builds the off-screen rendering wrapper with a fixed 800px stage so the
// PDF layout is identical regardless of device viewport.
function _buildPdfStage(sourceEl) {
    const clone = sourceEl.cloneNode(true);
    clone.style.width  = '800px';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.background = '#fff';

    const wrapper = document.createElement('div');
    // Keep it offscreen but with real dimensions so layout actually computes.
    wrapper.style.position      = 'fixed';
    wrapper.style.left          = '0';
    wrapper.style.top           = '0';
    wrapper.style.width         = '800px';
    wrapper.style.zIndex        = '-1';
    wrapper.style.opacity       = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.background    = '#fff';
    wrapper.style.overflow      = 'hidden';

    const styleEl = document.createElement('style');
    styleEl.textContent = getPrintStyles();
    wrapper.appendChild(styleEl);
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    return { clone, wrapper };
}

function _pdfOptions(fileName) {
    const mobile = _isMobileDevice();
    return {
        margin: 0,
        filename: fileName,
        image:   { type: 'jpeg', quality: 0.95 },
        html2canvas: {
            scale:            mobile ? 1.5 : 2,
            useCORS:          true,
            letterRendering:  true,
            width:            800,
            windowWidth:      800,         // forces layout to render at desktop width
            windowHeight:     1200,
            backgroundColor:  '#ffffff',
            logging:          false,
            allowTaint:       true,
            imageTimeout:     5000,
            scrollX:          0,
            scrollY:          0,
            x:                0,
            y:                0,
        },
        jsPDF:    { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        // Use natural page breaks so multi-page docs don't get cropped on mobile.
        pagebreak:{ mode: ['css', 'legacy'] }
    };
}

function exportPDF() {
    const el = document.getElementById('printableDoc');
    if (!el) { showToast('No document to export', 'error'); return; }
    const fileName = getDocFileName() + '.pdf';
    showToast('Generating PDF...');

    const { clone, wrapper } = _buildPdfStage(el);
    _waitForImagesIn(clone).then(() => {
        return html2pdf().set(_pdfOptions(fileName)).from(clone).save();
    }).then(() => {
        document.body.removeChild(wrapper);
        showToast('PDF downloaded: ' + fileName, 'success');
    }).catch(err => {
        if (wrapper.parentNode) document.body.removeChild(wrapper);
        showToast('PDF export failed: ' + (err.message || err), 'error');
    });
}

function exportPDFBlob() {
    return new Promise((resolve, reject) => {
        const el = document.getElementById('printableDoc');
        if (!el) { reject('No document'); return; }
        const { clone, wrapper } = _buildPdfStage(el);
        _waitForImagesIn(clone).then(() => {
            return html2pdf().set(_pdfOptions('document.pdf')).from(clone).outputPdf('blob');
        }).then(blob => {
            document.body.removeChild(wrapper);
            resolve(blob);
        }).catch(err => {
            if (wrapper.parentNode) document.body.removeChild(wrapper);
            reject(err);
        });
    });
}

function sharePDFWhatsApp() {
    const el = document.getElementById('printableDoc');
    if (!el) { showToast('No document to share', 'error'); return; }
    const fileName = getDocFileName() + '.pdf';

    showToast('Preparing PDF for sharing...');

    exportPDFBlob().then(blob => {
        const file = new File([blob], fileName, { type: 'application/pdf' });

        // Try native share (works on mobile with WhatsApp, etc.)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: fileName.replace('.pdf', '').replace(/_/g, ' '),
                files: [file]
            }).then(() => {
                showToast('Shared successfully!', 'success');
            }).catch(err => {
                if (err.name !== 'AbortError') {
                    // Fallback: download + open WhatsApp
                    fallbackWhatsAppShare(blob, fileName);
                }
            });
        } else {
            // Desktop or unsupported: download PDF then open WhatsApp web
            fallbackWhatsAppShare(blob, fileName);
        }
    }).catch(err => {
        showToast('Failed to generate PDF: ' + err, 'error');
    });
}

function fallbackWhatsAppShare(blob, fileName) {
    // Download the PDF first
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    // Open WhatsApp with a message
    const docName = fileName.replace('.pdf', '').replace(/_/g, ' ');
    const msg = encodeURIComponent('Please find attached: ' + docName + '\n\nFrom Danoor Services');
    window.open('https://wa.me/?text=' + msg, '_blank');
    showToast('PDF downloaded. Attach it in WhatsApp chat.', 'success');
}

function getPrintStyles() {
    return `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',Arial,sans-serif; color:#333; font-size:14px; }
    .doc-preview { position:relative; max-width:800px; margin:0 auto; }
    .doc-watermark { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-20deg); opacity:0.05; pointer-events:none; z-index:0; width:380px; }
    .doc-watermark img { width:100%; display:block; }
    .doc-preview > *:not(.doc-watermark) { position:relative; z-index:1; }
    .doc-header-bar { background:linear-gradient(135deg,#2b49a6,#3361b5); color:#fff; padding:22px 30px; display:flex; justify-content:space-between; align-items:center; border-radius:0; }
    .doc-logo img { height:80px; border-radius:6px; }
    .doc-header-right { text-align:right; }
    .doc-type-title { font-size:28px; font-weight:700; letter-spacing:1px; }
    .doc-header-meta { font-size:13px; margin-top:4px; opacity:0.9; }
    .doc-parties { display:flex; justify-content:space-between; padding:22px 30px 16px; }
    .doc-party-col { width:48%; }
    .doc-align-right { text-align:right; }
    .doc-party-label { background:#3361b5; color:#fff; font-size:12px; font-weight:600; padding:5px 12px; display:inline-block; border-radius:3px; margin-bottom:8px; }
    .doc-party-name { font-size:15px; font-weight:700; margin-bottom:4px; }
    .doc-party-line { font-size:13px; color:#555; line-height:1.7; }
    .doc-table { width:calc(100% - 60px); margin:10px 30px; border-collapse:collapse; }
    .doc-table thead tr { background:#3361b5; color:#fff; }
    .doc-table th { padding:11px 12px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
    .th-desc { text-align:left; }
    .th-num { text-align:right; width:110px; }
    .doc-table td { padding:11px 12px; font-size:14px; border-bottom:1px solid #eee; }
    .td-desc { text-align:left; }
    .td-num { text-align:right; }
    .row-stripe { background:#f7f7f7; }
    .doc-totals-bar { display:flex; justify-content:flex-end; padding:0 30px; }
    .doc-totals-section { width:270px; }
    .doc-total-line { display:flex; justify-content:space-between; padding:7px 12px; font-size:13px; border-bottom:1px solid #eee; }
    .doc-total-grand { display:flex; justify-content:space-between; padding:11px 12px; font-size:16px; font-weight:700; background:#f5a623; color:#fff; border-radius:3px; margin-top:2px; }
    .doc-footer-section { display:flex; justify-content:space-between; padding:30px 30px 10px; margin-top:20px; }
    .doc-footer-col { width:48%; }
    .doc-footer-label { background:#3361b5; color:#fff; font-size:12px; font-weight:600; padding:5px 12px; display:inline-block; border-radius:3px; margin-bottom:8px; }
    .doc-footer-details { font-size:13px; color:#555; line-height:1.9; }
    .doc-thanks { text-align:center; font-size:15px; font-weight:600; color:#3361b5; margin:22px 0 8px; }
    .doc-terms { text-align:center; font-size:12px; color:#999; padding:0 30px 20px; line-height:1.6; }
    @media print { body{padding:0;} .doc-preview{max-width:100%;} }
    `;
}

// ==================== DATE-RANGE FILTER HELPER ====================
// Filters an array by a date field using values from From/To date inputs
function filterByDateInputs(arr, dateField, fromInputId, toInputId) {
    const from = document.getElementById(fromInputId)?.value || '';
    const to   = document.getElementById(toInputId)?.value   || '';
    if (!from && !to) return arr;
    return arr.filter(item => {
        const d = item[dateField];
        if (!d) return false;
        if (from && d < from) return false;
        if (to   && d > to)   return false;
        return true;
    });
}
// Reset both date inputs in a list's filter bar and re-render
function clearDateRange(fromId, toId, renderFn, pageKey) {
    const f = document.getElementById(fromId); if (f) f.value = '';
    const t = document.getElementById(toId);   if (t) t.value = '';
    if (pageKey) setPage(pageKey, 1);
    if (typeof window[renderFn] === 'function') window[renderFn]();
}

// ==================== UTILITIES ====================
// ==================== PAGINATION ====================
const PAGE_SIZE = 15;
const pageState = {};

function getPage(key) { return pageState[key] || 1; }
function setPage(key, page) { pageState[key] = page; }

function paginate(arr, key) {
    const page = getPage(key);
    const totalPages = Math.max(1, Math.ceil(arr.length / PAGE_SIZE));
    if (page > totalPages) setPage(key, totalPages);
    const currentPage = getPage(key);
    const start = (currentPage - 1) * PAGE_SIZE;
    return {
        items: arr.slice(start, start + PAGE_SIZE),
        page: currentPage,
        totalPages,
        total: arr.length
    };
}

function renderPagination(key, totalPages, total, renderFn) {
    const page = getPage(key);
    const containerId = key + 'Pagination';
    let container = document.getElementById(containerId);
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = total > 0 ? `<span class="page-info">${total} record${total !== 1 ? 's' : ''}</span>` : ''; return; }
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    let html = `<span class="page-info">${start}-${end} of ${total}</span>`;
    html += `<button class="btn btn-sm page-btn" ${page <= 1 ? 'disabled' : ''} onclick="setPage('${key}',1);${renderFn}()"><i class="fas fa-angles-left"></i></button>`;
    html += `<button class="btn btn-sm page-btn" ${page <= 1 ? 'disabled' : ''} onclick="setPage('${key}',${page - 1});${renderFn}()"><i class="fas fa-chevron-left"></i></button>`;
    html += `<span class="page-current">${page} / ${totalPages}</span>`;
    html += `<button class="btn btn-sm page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="setPage('${key}',${page + 1});${renderFn}()"><i class="fas fa-chevron-right"></i></button>`;
    html += `<button class="btn btn-sm page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="setPage('${key}',${totalPages});${renderFn}()"><i class="fas fa-angles-right"></i></button>`;
    container.innerHTML = html;
}

function sortList(arr, sortVal) {
    if (!sortVal) return arr;
    const [field, dir] = sortVal.split('-');
    const sorted = [...arr];
    sorted.sort((a, b) => {
        let va, vb;
        if (field === 'date' || field === 'joinDate') { va = new Date(a.date || a.joinDate || 0); vb = new Date(b.date || b.joinDate || 0); }
        else if (field === 'number') { va = (a.number || '').toLowerCase(); vb = (b.number || '').toLowerCase(); }
        else if (field === 'customer') { va = (a.customerName || '').toLowerCase(); vb = (b.customerName || '').toLowerCase(); }
        else if (field === 'supplier') { va = (a.supplierName || '').toLowerCase(); vb = (b.supplierName || '').toLowerCase(); }
        else if (field === 'name') { va = (a.name || '').toLowerCase(); vb = (b.name || '').toLowerCase(); }
        else if (field === 'type') { va = (a.type || '').toLowerCase(); vb = (b.type || '').toLowerCase(); }
        else if (field === 'balance') { va = a.balance || 0; vb = b.balance || 0; }
        else if (field === 'total') { va = a.total || ((a.govtFee||0) + (a.serviceFee||0)); vb = b.total || ((b.govtFee||0) + (b.serviceFee||0)); }
        else if (field === 'code') { va = (a.code || '').toLowerCase(); vb = (b.code || '').toLowerCase(); }
        else if (field === 'category') { va = (a.category || '').toLowerCase(); vb = (b.category || '').toLowerCase(); }
        else if (field === 'sku') { va = (a.sku || '').toLowerCase(); vb = (b.sku || '').toLowerCase(); }
        else if (field === 'qty') { va = a.qty || 0; vb = b.qty || 0; }
        else if (field === 'value') { va = (a.qty||0)*(a.cost||0); vb = (b.qty||0)*(b.cost||0); }
        else if (field === 'empId') { va = (a.empId || '').toLowerCase(); vb = (b.empId || '').toLowerCase(); }
        else if (field === 'salary') { va = a.totalSalary || 0; vb = b.totalSalary || 0; }
        else if (field === 'amount') { va = a.amount || 0; vb = b.amount || 0; }
        else { va = a[field]; vb = b[field]; }
        if (va < vb) return dir === 'asc' ? -1 : 1;
        if (va > vb) return dir === 'asc' ? 1 : -1;
        return 0;
    });
    return sorted;
}

function fmt(n) { return 'AED ' + (parseFloat(n) || 0).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function esc(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function clearForm(ids) { ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); }

function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:80px;right:20px;z-index:9999;padding:12px 20px;border-radius:8px;color:#fff;
        font-size:0.85rem;font-family:Inter,sans-serif;background:${type==='error'?'#e74c3c':'#27ae60'};
        box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:fadeIn 0.3s ease;max-width:350px;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.3s'; setTimeout(()=>toast.remove(),300); }, 3000);
}

// ==================== REPORTS ====================
function getDateRange(period) {
    const now = new Date();
    let start;
    if (period === 'month') { start = new Date(now.getFullYear(), now.getMonth(), 1); }
    else if (period === 'quarter') { const q = Math.floor(now.getMonth() / 3) * 3; start = new Date(now.getFullYear(), q, 1); }
    else if (period === 'year') { start = new Date(now.getFullYear(), 0, 1); }
    else { start = new Date(2000, 0, 1); }
    return { start, end: now };
}

function filterByDate(items, period, dateField = 'date') {
    const { start, end } = getDateRange(period);
    return items.filter(item => {
        const d = new Date(item[dateField]);
        return d >= start && d <= end;
    });
}

// ==================== SERVICE STATISTICS ====================
const SERVICE_TYPES = ['New Visa', 'Renewal Visa', 'Visa Cancellation', 'Visit Visa', 'New Trade License', 'Renewal Trade License'];

// Keyword fallback: match description text → service type
function getServiceTypeForDesc(desc) {
    if (!desc) return null;
    const d = desc.toLowerCase();

    // 1. Item master takes priority — match by serviceType tag on item
    for (const item of (appData.itemMaster || [])) {
        if (item.serviceType && item.name && d.includes(item.name.toLowerCase())) return item.serviceType;
    }

    // 2. Word-presence matching — checks individual keywords exist anywhere in description
    //    regardless of word order, punctuation or separators
    const has = (...words) => words.some(w => d.includes(w));

    const isVisit     = has('visit');
    const isVisa      = has('visa');
    const isTrade     = has('trade lic', 'trade license', 'trade licence');
    const isLicOnly   = !isVisa && has('licence', 'license');  // "licence renewal" without "trade" still counts
    const isTradeLic  = isTrade || isLicOnly;
    const isNew       = has('new ') || d.startsWith('new');
    const isRenewal   = has('renew', 'extension');   // covers renewal / renewed / renewing / renew
    const isCancel    = has('cancel');               // covers cancel / cancellation / cancelled

    // Priority: cancellation FIRST — overrides even Visit Visa
    if (isVisa  && isCancel)   return 'Visa Cancellation';

    // Visit Visa — check before general new/renewal rules (only if NOT a cancellation)
    if (isVisa && isVisit) return 'Visit Visa';

    // Then renewal, then new
    if (isVisa  && isRenewal)  return 'Renewal Visa';
    if (isVisa  && isNew)      return 'New Visa';
    if (isTradeLic && isRenewal) return 'Renewal Trade License';
    if (isTradeLic && isNew)     return 'New Trade License';

    // 3. Standalone word fallback — if ONLY "new visa / renewal / cancellation" written without extra context
    if (isVisa && !isRenewal && !isCancel)  return 'New Visa';      // bare "visa" → assume new
    if (isCancel && !isVisa)                return null;             // cancel without visa — ignore
    if (isTradeLic && !isRenewal)           return 'New Trade License'; // bare "licence" → assume new

    return null;
}

// Returns array of { type, qty, revenue, invoiceId, invoiceNumber, customerName, date, desc }
function extractServiceLines(invoices) {
    const rows = [];
    invoices.forEach(inv => {
        (inv.lines || []).forEach(line => {
            const type = getServiceTypeForDesc(line.desc);
            if (type) {
                rows.push({
                    type,
                    qty: line.qty || 1,
                    revenue: (line.qty || 1) * (line.price || ((line.govt || 0) + (line.svc || 0))),
                    invoiceId: inv.id,
                    invoiceNumber: inv.number,
                    customerName: inv.customerName || '',
                    date: inv.date || '',
                    desc: line.desc,
                });
            }
        });
    });
    return rows;
}

function countServiceTypes(invoices) {
    const counts = {}, revenue = {};
    SERVICE_TYPES.forEach(t => { counts[t] = 0; revenue[t] = 0; });
    extractServiceLines(invoices).forEach(r => {
        counts[r.type] = (counts[r.type] || 0) + r.qty;
        revenue[r.type] = (revenue[r.type] || 0) + r.revenue;
    });
    return { counts, revenue };
}

let _svcBarChart, _svcRevChart, _svcTrendChart;

function renderServiceStats() {
    const period = document.getElementById('rptSvcPeriod')?.value || 'year';
    const invoices = filterByDate((appData.invoices || []).filter(i => i.status !== 'Cancelled'), period);
    const { counts, revenue } = countServiceTypes(invoices);
    const total = SERVICE_TYPES.reduce((s, t) => s + counts[t], 0);
    const totalRev = SERVICE_TYPES.reduce((s, t) => s + revenue[t], 0);
    const ids = { 'New Visa': 'NewVisa', 'Renewal Visa': 'RenewalVisa', 'Visa Cancellation': 'VisaCancel', 'Visit Visa': 'VisitVisa', 'New Trade License': 'NewTL', 'Renewal Trade License': 'RenewalTL' };
    SERVICE_TYPES.forEach(t => {
        const id = ids[t];
        if (document.getElementById('svcCount' + id)) document.getElementById('svcCount' + id).textContent = counts[t];
        if (document.getElementById('svcRev' + id)) document.getElementById('svcRev' + id).textContent = fmt(revenue[t]);
    });
    if (document.getElementById('svcCountTotal')) document.getElementById('svcCountTotal').textContent = total;
    if (document.getElementById('svcRevTotal')) document.getElementById('svcRevTotal').textContent = fmt(totalRev);

    const colors = ['#2b6cb5','#27ae60','#e74c3c','#f39c12','#8e44ad'];

    // Bar chart - counts
    if (_svcBarChart) _svcBarChart.destroy();
    const barCtx = document.getElementById('svcBarChart');
    if (barCtx) {
        _svcBarChart = new Chart(barCtx, {
            type: 'bar',
            data: { labels: SERVICE_TYPES, datasets: [{ label: 'Count', data: SERVICE_TYPES.map(t => counts[t]), backgroundColor: colors.map(c => c + 'cc'), borderRadius: 6, borderSkipped: false }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }

    // Doughnut - revenue
    if (_svcRevChart) _svcRevChart.destroy();
    const revCtx = document.getElementById('svcRevChart');
    if (revCtx) {
        const data = SERVICE_TYPES.map(t => revenue[t]);
        _svcRevChart = new Chart(revCtx, {
            type: 'doughnut',
            data: { labels: SERVICE_TYPES, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 11 } } } } }
        });
    }

    // Monthly trend - last 6 months
    const now = new Date();
    const trendLabels = [], trendDatasets = SERVICE_TYPES.map((t, i) => ({ label: t, data: [], borderColor: colors[i], backgroundColor: colors[i] + '22', fill: false, tension: 0.3, borderWidth: 2, pointRadius: 3 }));
    for (let m = 5; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        trendLabels.push(d.toLocaleDateString('en-AE', { month: 'short', year: '2-digit' }));
        const monthInv = (appData.invoices || []).filter(i => i.status !== 'Cancelled' && new Date(i.date) >= d && new Date(i.date) <= end);
        const mc = countServiceTypes(monthInv).counts;
        SERVICE_TYPES.forEach((t, i) => trendDatasets[i].data.push(mc[t]));
    }
    if (_svcTrendChart) _svcTrendChart.destroy();
    const trendCtx = document.getElementById('svcTrendChart');
    if (trendCtx) {
        _svcTrendChart = new Chart(trendCtx, {
            type: 'line',
            data: { labels: trendLabels, datasets: trendDatasets },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }

    // Detail table
    const rows = extractServiceLines(invoices).sort((a, b) => new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById('rptSvcDetailBody');
    if (tbody) {
        tbody.innerHTML = rows.length ? rows.map(r => {
            const col = colors[SERVICE_TYPES.indexOf(r.type)] || '#888';
            return `<tr><td>${r.date}</td><td><strong>${esc(r.invoiceNumber)}</strong></td><td>${esc(r.customerName)}</td><td>${esc(r.desc)}</td>
                <td><span class="status-badge" style="background:${col}22;color:${col};border:1px solid ${col}44">${esc(r.type)}</span></td>
                <td>${r.qty}</td><td>${fmt(r.revenue)}</td></tr>`;
        }).join('') : '<tr><td colspan="7" class="empty-state">No matching service lines found. Tip: Set Service Type on Item Master items.</td></tr>';
    }
}

function updateDashboardServiceStats() {
    const period = document.getElementById('dashSvcPeriod')?.value || 'month';
    const labels = { month: 'This Month', quarter: 'This Quarter', year: 'This Year' };
    const el = document.getElementById('dashSvcPeriodLabel');
    if (el) el.textContent = '— ' + (labels[period] || '');
    const invoices = filterByDate((appData.invoices || []).filter(i => i.status !== 'Cancelled'), period);
    const { counts } = countServiceTypes(invoices);
    const total = SERVICE_TYPES.reduce((s, t) => s + counts[t], 0);
    const ids = { 'New Visa': 'NewVisa', 'Renewal Visa': 'RenewalVisa', 'Visa Cancellation': 'VisaCancel', 'Visit Visa': 'VisitVisa', 'New Trade License': 'NewTL', 'Renewal Trade License': 'RenewalTL' };
    SERVICE_TYPES.forEach(t => { const el = document.getElementById('dashSvc' + ids[t]); if (el) el.textContent = counts[t]; });
    const tot = document.getElementById('dashSvcTotal'); if (tot) tot.textContent = total;
}

function renderAllReports() {
    renderReportPnL();
    renderRevenueReport();
    renderVatReport();
    renderAgingReport();
    renderLoansReport();
    renderServiceStats();
    if (typeof renderCorporateTax === 'function') renderCorporateTax();
}

// Chart instance storage
let _rptPnlChart, _rptExpChart, _rptRevChart, _rptAgingChart;

function renderReportPnL() {
    const period = document.getElementById('rptPnlPeriod')?.value || 'year';
    const invoices = filterByDate((appData.invoices || []).filter(i => i.status === 'Paid' || i.status === 'Partial'), period);
    const cashMemos = filterByDate(appData.cashMemos || [], period);
    const expenses = filterByDate(appData.expenses || [], period);
    const purchases = filterByDate((appData.purchases || []).filter(p => p.status === 'Paid'), period);

    const invoiceRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? (i.subtotal || 0) : invPaidAmount(i)), 0);
    const cashMemoRevenue = cashMemos.reduce((s, m) => s + (m.amount || 0), 0);
    const totalRevenue = invoiceRevenue + cashMemoRevenue;
    const totalCost = purchases.reduce((s, p) => s + (p.subtotal || 0), 0);
    const grossProfit = totalRevenue - totalCost;

    const expByCategory = {};
    expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + (e.amount || 0); });
    const totalExpenses = Object.values(expByCategory).reduce((s, v) => s + v, 0);
    const netProfit = grossProfit - totalExpenses;

    // KPIs
    if (document.getElementById('rptTotalRevenue')) document.getElementById('rptTotalRevenue').textContent = fmt(totalRevenue);
    if (document.getElementById('rptTotalCost')) document.getElementById('rptTotalCost').textContent = fmt(totalCost);
    if (document.getElementById('rptGrossProfit')) document.getElementById('rptGrossProfit').textContent = fmt(grossProfit);
    if (document.getElementById('rptTotalExpenses')) document.getElementById('rptTotalExpenses').textContent = fmt(totalExpenses);
    const netEl = document.getElementById('rptNetProfit');
    if (netEl) { netEl.textContent = fmt(netProfit); netEl.style.color = netProfit >= 0 ? 'var(--success)' : 'var(--danger)'; }

    // Detailed P&L
    const detailEl = document.getElementById('rptPnlDetail');
    if (detailEl) {
        let html = '<div class="pnl-section"><h3>Revenue</h3>';
        html += '<div class="pnl-line"><span>Invoice Revenue (Paid)</span><span>' + fmt(invoiceRevenue) + '</span></div>';
        html += '<div class="pnl-line"><span>Cash Memo / Ad-hoc Income</span><span>' + fmt(cashMemoRevenue) + '</span></div>';
        html += '<div class="pnl-total"><span>Total Revenue</span><span>' + fmt(totalRevenue) + '</span></div></div>';
        html += '<div class="pnl-section"><h3>Cost of Services</h3>';
        if (purchases.length) purchases.forEach(p => { html += '<div class="pnl-line"><span>' + esc(p.supplierName) + ' (' + esc(p.number) + ')</span><span>' + fmt(p.subtotal) + '</span></div>'; });
        else html += '<div class="pnl-line"><span>-</span><span>AED 0.00</span></div>';
        html += '<div class="pnl-total"><span>Total Cost</span><span>' + fmt(totalCost) + '</span></div></div>';
        html += '<div class="pnl-section"><div class="pnl-total"><span>Gross Profit</span><span>' + fmt(grossProfit) + '</span></div></div>';
        html += '<div class="pnl-section"><h3>Operating Expenses</h3>';
        Object.entries(expByCategory).forEach(([cat, amt]) => { html += '<div class="pnl-line"><span>' + esc(cat) + '</span><span>' + fmt(amt) + '</span></div>'; });
        html += '<div class="pnl-total"><span>Total Expenses</span><span>' + fmt(totalExpenses) + '</span></div></div>';
        html += '<div class="pnl-section pnl-net"><div class="pnl-total highlight"><span>Net Profit / (Loss)</span><span style="color:' + (netProfit >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + fmt(netProfit) + '</span></div></div>';
        detailEl.innerHTML = html;
    }

    // P&L Bar Chart - Revenue vs Cost vs Expenses vs Net
    if (_rptPnlChart) _rptPnlChart.destroy();
    const pnlCtx = document.getElementById('rptPnlChart');
    if (pnlCtx) {
        _rptPnlChart = new Chart(pnlCtx, {
            type: 'bar',
            data: {
                labels: ['Revenue', 'Cost of Services', 'Operating Expenses', 'Net Profit'],
                datasets: [{
                    label: 'AED',
                    data: [totalRevenue, totalCost, totalExpenses, netProfit],
                    backgroundColor: ['rgba(43,108,181,0.8)', 'rgba(231,76,60,0.7)', 'rgba(243,156,18,0.7)', netProfit >= 0 ? 'rgba(39,174,96,0.8)' : 'rgba(231,76,60,0.8)'],
                    borderRadius: 6, borderSkipped: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Expense Breakdown Doughnut
    if (_rptExpChart) _rptExpChart.destroy();
    const expCtx = document.getElementById('rptExpBreakdownChart');
    if (expCtx) {
        const labels = Object.keys(expByCategory);
        const data = Object.values(expByCategory);
        const colors = ['#2b6cb5','#c0392b','#27ae60','#f39c12','#8e44ad','#e67e22','#16a085','#d35400','#2c3e50','#1abc9c','#3498db','#e74c3c'];
        _rptExpChart = new Chart(expCtx, {
            type: 'doughnut',
            data: { labels: labels.length ? labels : ['No expenses'], datasets: [{ data: data.length ? data : [1], backgroundColor: data.length ? colors.slice(0, labels.length) : ['#ecf0f1'], borderWidth: 2, borderColor: '#fff' }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 8, font: { size: 11 } } } } }
        });
    }
}

function renderRevenueReport() {
    const months = parseInt(document.getElementById('rptRevPeriod')?.value || '12');
    const invoices = (appData.invoices || []).filter(i => i.status === 'Paid' || i.status === 'Partial');
    const allCashMemos = appData.cashMemos || [];
    const now = new Date();
    const labels = [], revenueData = [], cashMemoData = [], expenseData = [];
    const allExpenses = appData.expenses || [];

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        labels.push(d.toLocaleDateString('en-AE', { month: 'short', year: '2-digit' }));
        const invRev = invoices.filter(inv => { const id = new Date(inv.date); return id >= d && id <= end; }).reduce((s, inv) => s + (inv.status === 'Paid' ? (inv.total || 0) : invPaidAmount(inv)), 0);
        const cmRev = allCashMemos.filter(m => { const md = new Date(m.date); return md >= d && md <= end; }).reduce((s, m) => s + (m.amount || 0), 0);
        revenueData.push(invRev + cmRev);
        cashMemoData.push(cmRev);
        expenseData.push(allExpenses.filter(e => { const ed = new Date(e.date); return ed >= d && ed <= end; }).reduce((s, e) => s + (e.amount || 0), 0));
    }

    if (_rptRevChart) _rptRevChart.destroy();
    const ctx = document.getElementById('rptRevenueChart');
    if (ctx) {
        _rptRevChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Total Revenue', data: revenueData, borderColor: '#2b6cb5', backgroundColor: 'rgba(43,108,181,0.1)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 4 },
                    { label: 'Cash Memo Income', data: cashMemoData, borderColor: '#27ae60', backgroundColor: 'rgba(39,174,96,0.08)', fill: false, tension: 0.3, borderWidth: 2, pointRadius: 3, borderDash: [5,3] },
                    { label: 'Expenses', data: expenseData, borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.1)', fill: true, tension: 0.3, borderWidth: 2, pointRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Revenue by customer table (invoices + cash memos)
    const custMap = {};
    invoices.forEach(inv => {
        const name = inv.customerName || 'Walk-in';
        if (!custMap[name]) custMap[name] = { count: 0, subtotal: 0, vat: 0, total: 0, type: 'Invoice' };
        const isPaid = inv.status === 'Paid';
        custMap[name].count++;
        custMap[name].subtotal += isPaid ? (inv.subtotal || 0) : invPaidAmount(inv);
        custMap[name].vat += isPaid ? (inv.vat || 0) : 0;
        custMap[name].total += isPaid ? (inv.total || 0) : invPaidAmount(inv);
    });
    allCashMemos.forEach(m => {
        const name = (m.customer || 'Walk-in') + ' (Cash Memo)';
        if (!custMap[name]) custMap[name] = { count: 0, subtotal: 0, vat: 0, total: 0, type: 'Cash Memo' };
        custMap[name].count++;
        custMap[name].subtotal += m.amount || 0;
        custMap[name].vat += m.vat || 0;
        custMap[name].total += m.total || (m.amount || 0);
    });
    const tbody = document.getElementById('rptRevCustBody');
    if (tbody) {
        const sorted = Object.entries(custMap).sort((a, b) => b[1].total - a[1].total);
        tbody.innerHTML = sorted.length ? sorted.map(([name, d]) =>
            `<tr><td><strong>${esc(name)}</strong></td><td>${d.count}</td><td>${fmt(d.subtotal)}</td><td>${fmt(d.vat)}</td><td><strong>${fmt(d.total)}</strong></td></tr>`
        ).join('') : '<tr><td colspan="5" class="empty-state">No revenue data</td></tr>';
    }
}

function renderVatReport() {
    const period = document.getElementById('rptVatPeriod')?.value || 'quarter';
    const invoices = filterByDate((appData.invoices || []).filter(i => i.status === 'Paid' || i.status === 'Partial'), period);
    const purchases = filterByDate((appData.purchases || []).filter(p => p.status === 'Paid'), period);
    const expenses = filterByDate((appData.expenses || []).filter(e => e.vatIncl === 'yes'), period);

    // For partial invoices, count VAT proportional to amount collected
    const outputVat = invoices.reduce((s, i) => {
        if (i.status === 'Paid') return s + (i.vat || 0);
        const ratio = (inv => inv.total > 0 ? invPaidAmount(inv) / inv.total : 0)(i);
        return s + (i.vat || 0) * ratio;
    }, 0);
    const inputVatPO = purchases.reduce((s, p) => s + (p.vat || 0), 0);
    const inputVatExp = expenses.reduce((s, e) => s + ((e.amount || 0) * DEFAULT_VAT_RATE), 0);
    const totalInputVat = inputVatPO + inputVatExp;
    const netVat = outputVat - totalInputVat;

    if (document.getElementById('rptOutputVat')) document.getElementById('rptOutputVat').textContent = fmt(outputVat);
    if (document.getElementById('rptInputVat')) document.getElementById('rptInputVat').textContent = fmt(totalInputVat);
    const netVatEl = document.getElementById('rptNetVat');
    if (netVatEl) { netVatEl.textContent = fmt(netVat); netVatEl.style.color = netVat >= 0 ? 'var(--danger)' : 'var(--success)'; }

    // VAT transactions table
    const rows = [];
    invoices.forEach(inv => {
        if (inv.vat > 0) rows.push({ date: inv.date, doc: inv.number, party: inv.customerName, subtotal: inv.subtotal, vatRate: inv.vatRate !== undefined ? inv.vatRate : DEFAULT_VAT_RATE, vat: inv.vat, type: 'Output' });
    });
    purchases.forEach(po => {
        if (po.vat > 0) rows.push({ date: po.date, doc: po.number, party: po.supplierName, subtotal: po.subtotal, vatRate: po.vatRate !== undefined ? po.vatRate : DEFAULT_VAT_RATE, vat: po.vat, type: 'Input' });
    });
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById('rptVatBody');
    if (tbody) {
        tbody.innerHTML = rows.length ? rows.map(r =>
            `<tr><td>${r.date}</td><td>${esc(r.doc)}</td><td>${esc(r.party)}</td><td>${fmt(r.subtotal)}</td><td>${(r.vatRate * 100).toFixed(0)}%</td><td>${fmt(r.vat)}</td><td><span class="status-badge status-${r.type === 'Output' ? 'Sent' : 'Draft'}">${r.type}</span></td></tr>`
        ).join('') : '<tr><td colspan="7" class="empty-state">No VAT transactions</td></tr>';
    }
}

function renderAgingReport() {
    const unpaid = (appData.invoices || []).filter(i => i.status !== 'Paid' && i.status !== 'Cancelled');
    const now = new Date();
    const buckets = { current: 0, d31: 0, d61: 0, d90: 0 };

    const rows = unpaid.map(inv => {
        const due = new Date(inv.dueDate || inv.date);
        const days = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
        const outstanding = invOutstanding(inv);
        if (days <= 30) buckets.current += outstanding;
        else if (days <= 60) buckets.d31 += outstanding;
        else if (days <= 90) buckets.d61 += outstanding;
        else buckets.d90 += outstanding;
        return { ...inv, daysOut: days, _outstanding: outstanding };
    }).sort((a, b) => b.daysOut - a.daysOut);

    if (document.getElementById('rptAging030')) document.getElementById('rptAging030').textContent = fmt(buckets.current);
    if (document.getElementById('rptAging3160')) document.getElementById('rptAging3160').textContent = fmt(buckets.d31);
    if (document.getElementById('rptAging6190')) document.getElementById('rptAging6190').textContent = fmt(buckets.d61);
    const el90 = document.getElementById('rptAging90');
    if (el90) { el90.textContent = fmt(buckets.d90); el90.style.color = buckets.d90 > 0 ? 'var(--danger)' : ''; }

    // Aging bar chart
    if (_rptAgingChart) _rptAgingChart.destroy();
    const ctx = document.getElementById('rptAgingChart');
    if (ctx) {
        _rptAgingChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Current (0-30)', '31-60 Days', '61-90 Days', '90+ Days'],
                datasets: [{ label: 'AED', data: [buckets.current, buckets.d31, buckets.d61, buckets.d90], backgroundColor: ['rgba(39,174,96,0.7)', 'rgba(243,156,18,0.7)', 'rgba(230,126,34,0.7)', 'rgba(231,76,60,0.8)'], borderRadius: 6 }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    const tbody = document.getElementById('rptAgingBody');
    if (tbody) {
        tbody.innerHTML = rows.length ? rows.map(inv =>
            `<tr><td><strong>${esc(inv.number)}</strong></td><td>${esc(inv.customerName)}</td><td>${inv.date}</td><td>${inv.dueDate || '-'}</td>
             <td>${fmt(inv.total)}${inv._outstanding < inv.total ? ` <small style="color:var(--success)">(Paid: ${fmt(inv.total - inv._outstanding)})</small>` : ''}</td>
             <td><strong style="color:var(--warning)">${fmt(inv._outstanding)}</strong></td>
             <td>${inv.daysOut > 0 ? '<span style="color:var(--danger);font-weight:600;">' + inv.daysOut + ' days</span>' : 'Current'}</td>
             <td><span class="status-badge status-${inv.status === 'Partial' ? 'Sent' : inv.status}">${inv.status}</span></td></tr>`
        ).join('') : '<tr><td colspan="8" class="empty-state">No outstanding invoices</td></tr>';
    }
}

// ==================== REPORT EXPORT ====================
function exportReportCSV() {
    const activeTab = document.querySelector('#page-reports .tab-content.active');
    if (!activeTab) return;
    const tabId = activeTab.id;
    let csv = '', filename = 'report';

    if (tabId === 'tab-rptPnl') {
        filename = 'profit-and-loss';
        const period = document.getElementById('rptPnlPeriod')?.value || 'year';
        const invoices = filterByDate((appData.invoices || []).filter(i => i.status === 'Paid'), period);
        const cashMemos = filterByDate(appData.cashMemos || [], period);
        const expenses = filterByDate(appData.expenses || [], period);
        const purchases = filterByDate((appData.purchases || []).filter(p => p.status === 'Paid'), period);
        const invoiceRevenue = invoices.reduce((s, i) => s + (i.subtotal || 0), 0);
        const cashMemoRevenue = cashMemos.reduce((s, m) => s + (m.amount || 0), 0);
        const totalRevenue = invoiceRevenue + cashMemoRevenue;
        const totalCost = purchases.reduce((s, p) => s + (p.subtotal || 0), 0);
        const expByCategory = {};
        expenses.forEach(e => { expByCategory[e.category] = (expByCategory[e.category] || 0) + (e.amount || 0); });
        const totalExpenses = Object.values(expByCategory).reduce((s, v) => s + v, 0);
        csv = 'Category,Amount (AED)\n';
        csv += 'Invoice Revenue (Paid),' + invoiceRevenue.toFixed(2) + '\n';
        csv += 'Cash Memo / Ad-hoc Income,' + cashMemoRevenue.toFixed(2) + '\n';
        csv += 'Total Revenue,' + totalRevenue.toFixed(2) + '\n';
        csv += 'Cost of Services,' + totalCost.toFixed(2) + '\n';
        csv += 'Gross Profit,' + (totalRevenue - totalCost).toFixed(2) + '\n';
        Object.entries(expByCategory).forEach(([cat, amt]) => { csv += cat + ',' + amt.toFixed(2) + '\n'; });
        csv += 'Total Expenses,' + totalExpenses.toFixed(2) + '\n';
        csv += 'Net Profit,' + (totalRevenue - totalCost - totalExpenses).toFixed(2) + '\n';
    } else if (tabId === 'tab-rptRevenue') {
        filename = 'revenue-by-customer';
        const invoices = (appData.invoices || []).filter(i => i.status === 'Paid');
        csv = 'Customer,Invoices,Subtotal,VAT,Total\n';
        const custMap = {};
        invoices.forEach(inv => {
            const name = inv.customerName || 'Walk-in';
            if (!custMap[name]) custMap[name] = { count: 0, subtotal: 0, vat: 0, total: 0 };
            custMap[name].count++; custMap[name].subtotal += inv.subtotal || 0; custMap[name].vat += inv.vat || 0; custMap[name].total += inv.total || 0;
        });
        Object.entries(custMap).forEach(([name, d]) => { csv += '"' + name + '",' + d.count + ',' + d.subtotal.toFixed(2) + ',' + d.vat.toFixed(2) + ',' + d.total.toFixed(2) + '\n'; });
    } else if (tabId === 'tab-rptVat') {
        filename = 'vat-report';
        csv = 'Date,Document,Party,Subtotal,VAT Rate,VAT Amount,Type\n';
        const period = document.getElementById('rptVatPeriod')?.value || 'quarter';
        const invoices = filterByDate((appData.invoices || []).filter(i => i.status === 'Paid'), period);
        const purchases = filterByDate((appData.purchases || []).filter(p => p.status === 'Paid'), period);
        invoices.forEach(i => { if (i.vat > 0) csv += i.date + ',' + i.number + ',"' + (i.customerName||'') + '",' + (i.subtotal||0).toFixed(2) + ',' + ((i.vatRate||DEFAULT_VAT_RATE)*100).toFixed(0) + '%,' + (i.vat||0).toFixed(2) + ',Output\n'; });
        purchases.forEach(p => { if (p.vat > 0) csv += p.date + ',' + p.number + ',"' + (p.supplierName||'') + '",' + (p.subtotal||0).toFixed(2) + ',' + ((p.vatRate||DEFAULT_VAT_RATE)*100).toFixed(0) + '%,' + (p.vat||0).toFixed(2) + ',Input\n'; });
    } else if (tabId === 'tab-rptAging') {
        filename = 'receivables-aging';
        csv = 'Invoice,Customer,Date,Due Date,Total,Outstanding,Days Outstanding,Status\n';
        const unpaid = (appData.invoices || []).filter(i => i.status !== 'Paid' && i.status !== 'Cancelled');
        const now = new Date();
        unpaid.forEach(inv => {
            const due = new Date(inv.dueDate || inv.date);
            const days = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
            csv += inv.number + ',"' + (inv.customerName||'') + '",' + inv.date + ',' + (inv.dueDate||'-') + ',' + (inv.total||0).toFixed(2) + ',' + invOutstanding(inv).toFixed(2) + ',' + days + ',' + inv.status + '\n';
        });
    } else if (tabId === 'tab-rptLoans') {
        filename = 'loans-liabilities';
        csv = 'Date,Lender,Type,Purpose,Principal,Repaid,Outstanding,Due Date,Status\n';
        (appData.loans || []).forEach(l => {
            const repaid = loanRepaid(l);
            const outstanding = loanOutstanding(l);
            csv += l.date + ',"' + (l.lenderName||'') + '",' + (l.lenderType||'') + ',"' + (l.purpose||'') + '",' + (l.amount||0).toFixed(2) + ',' + repaid.toFixed(2) + ',' + outstanding.toFixed(2) + ',' + (l.dueDate||'-') + ',' + l.status + '\n';
        });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = filename + '-' + new Date().toISOString().split('T')[0] + '.csv';
    a.click(); URL.revokeObjectURL(url);
    showToast('Report exported as CSV!');
}

function printReport() {
    const activeTab = document.querySelector('#page-reports .tab-content.active');
    if (!activeTab) return;
    const content = activeTab.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Report</title><link rel="stylesheet" href="style.css">
        <style>body{padding:20px;font-family:Inter,sans-serif;} .report-filter-bar{display:none;} canvas{max-width:100%;} @media print{.btn,.report-filter-bar{display:none!important;}}</style></head>
        <body><h2>${document.querySelector('#page-reports .tabs .tab.active')?.textContent || 'Report'} - ${appData.settings?.companyName || 'Danoor Services'}</h2>${content}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 600);
}

function exportAllData(silent) {
    const data = {
        settings: appData.settings, contacts: appData.contacts, services: appData.services,
        quotations: appData.quotations, invoices: appData.invoices, purchases: appData.purchases,
        inventory: appData.inventory, employees: appData.employees, expenses: appData.expenses,
        journalEntries: appData.journalEntries, payrollRuns: appData.payrollRuns,
        cashMemos: appData.cashMemos, itemMaster: appData.itemMaster, coa: appData.coa,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = 'danoor-erp-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click(); URL.revokeObjectURL(url);
    localStorage.setItem('lastBackupDate', new Date().toISOString().split('T')[0]);
    updateBackupStatus();
    if (!silent) showToast('Backup downloaded!');
}

function checkAutoBackup() {
    const lastBackup = localStorage.getItem('lastBackupDate');
    const today = new Date().toISOString().split('T')[0];
    if (lastBackup !== today) {
        // Auto backup reminder - wait 5 seconds after load to not block the UI
        setTimeout(() => {
            if (confirm('Daily backup reminder: Download today\'s backup?\n\nLast backup: ' + (lastBackup || 'Never'))) {
                exportAllData(true);
                showToast('Daily backup downloaded!', 'success');
            }
        }, 3000);
    }
}

function updateBackupStatus() {
    const el = document.getElementById('lastBackupDisplay');
    if (!el) return;
    const lastBackup = localStorage.getItem('lastBackupDate');
    const today = new Date().toISOString().split('T')[0];
    if (!lastBackup) {
        el.innerHTML = '<span style="color:#e74c3c;"><i class="fas fa-exclamation-triangle"></i> No backup taken yet</span>';
    } else if (lastBackup === today) {
        el.innerHTML = '<span style="color:#27ae60;"><i class="fas fa-check-circle"></i> Backed up today (' + lastBackup + ')</span>';
    } else {
        el.innerHTML = '<span style="color:#f39c12;"><i class="fas fa-clock"></i> Last backup: ' + lastBackup + '</span>';
    }
}

function importBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                if (!data.exportDate) { showToast('Invalid backup file', 'error'); return; }
                if (!confirm('Restore backup from ' + data.exportDate + '?\n\nThis will OVERWRITE all current data. Are you sure?')) return;
                // Restore each collection
                const collections = ['contacts','services','quotations','invoices','purchases','inventory','employees','expenses','journalEntries','payrollRuns','cashMemos','itemMaster'];
                let promises = [];
                // Restore settings
                if (data.settings) {
                    promises.push(db.collection('config').doc('settings').set(data.settings));
                }
                // Restore COA
                if (data.coa && data.coa.length) {
                    data.coa.forEach(a => {
                        const code = a.code || a._id;
                        if (code) promises.push(db.collection('coa').doc(code).set({ code: a.code, name: a.name, type: a.type, balance: a.balance || 0 }));
                    });
                }
                // Restore collections
                collections.forEach(col => {
                    if (data[col] && Array.isArray(data[col])) {
                        data[col].forEach(item => {
                            const docData = { ...item };
                            delete docData.id; delete docData._id;
                            // Remove Firestore timestamp objects that can't be re-written directly
                            if (docData.createdAt && typeof docData.createdAt === 'object') delete docData.createdAt;
                            if (item.id) {
                                promises.push(db.collection(col).doc(item.id).set(docData));
                            } else {
                                promises.push(db.collection(col).add(docData));
                            }
                        });
                    }
                });
                Promise.all(promises).then(() => {
                    showToast('Backup restored successfully! Reloading...', 'success');
                    setTimeout(() => location.reload(), 2000);
                }).catch(err => showToast('Restore error: ' + err.message, 'error'));
            } catch (err) {
                showToast('Invalid JSON file: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ==================== FLOATING CALCULATOR ====================
const _calc = {
    display: '0', expr: '',
    operand1: null, operator: null,
    waitingForOperand2: false, justEqualed: false
};

function toggleCalc() {
    const panel = document.getElementById('calcPanel');
    const fab   = document.getElementById('calcFAB');
    const open  = panel.style.display !== 'none' && panel.style.display !== '';
    panel.style.display = open ? 'none' : 'block';
    fab.innerHTML = open
        ? '<i class="fas fa-calculator"></i>'
        : '<i class="fas fa-xmark"></i>';
}

function _calcUpdate() {
    document.getElementById('calcDisplay').textContent = _calc.display;
    document.getElementById('calcExpr').textContent    = _calc.expr;
    // Highlight active operator button
    ['Add','Sub','Mul','Div'].forEach(id => {
        const el = document.getElementById('calcOp' + id);
        if (el) el.classList.remove('active-op');
    });
    if (_calc.operator && _calc.waitingForOperand2) {
        const map = { '+': 'Add', '-': 'Sub', '*': 'Mul', '/': 'Div' };
        const btn = document.getElementById('calcOp' + map[_calc.operator]);
        if (btn) btn.classList.add('active-op');
    }
}

function calcNum(n) {
    if (_calc.waitingForOperand2 || _calc.justEqualed) {
        _calc.display = n === '.' ? '0.' : n;
        _calc.waitingForOperand2 = false;
        _calc.justEqualed = false;
    } else {
        if (n === '.' && _calc.display.includes('.')) return;
        _calc.display = (_calc.display === '0' && n !== '.') ? n : _calc.display + n;
    }
    _calcUpdate();
}

function calcOp(op) {
    const cur = parseFloat(_calc.display);
    if (_calc.operator && !_calc.waitingForOperand2) {
        const res = _calcDo(_calc.operand1, cur, _calc.operator);
        _calc.display = _calcFmt(res);
        _calc.operand1 = res;
    } else {
        _calc.operand1 = cur;
    }
    _calc.operator = op;
    _calc.waitingForOperand2 = true;
    _calc.justEqualed = false;
    const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
    _calc.expr = _calcFmt(_calc.operand1) + ' ' + sym;
    _calcUpdate();
}

function _calcDo(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b === 0 ? 0 : a / b;
    return b;
}

function _calcFmt(n) {
    if (!isFinite(n) || isNaN(n)) return 'Error';
    return parseFloat(n.toPrecision(12)).toString();
}

function calcFn(fn) {
    const cur = parseFloat(_calc.display);
    if (fn === 'clear') {
        _calc.display = '0'; _calc.expr = '';
        _calc.operand1 = null; _calc.operator = null;
        _calc.waitingForOperand2 = false; _calc.justEqualed = false;
    } else if (fn === 'negate') {
        _calc.display = _calcFmt(-cur);
    } else if (fn === 'percent') {
        if (_calc.operand1 !== null && _calc.operator) {
            // e.g. 200 + 15% → 200 + 30
            _calc.display = _calcFmt(_calc.operand1 * cur / 100);
        } else {
            _calc.display = _calcFmt(cur / 100);
        }
    } else if (fn === 'back') {
        if (_calc.justEqualed || _calc.waitingForOperand2) return;
        _calc.display = _calc.display.length > 1 ? _calc.display.slice(0, -1) : '0';
    } else if (fn === 'equals') {
        if (_calc.operator !== null && _calc.operand1 !== null) {
            const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[_calc.operator];
            const res = _calcDo(_calc.operand1, cur, _calc.operator);
            _calc.expr = _calcFmt(_calc.operand1) + ' ' + sym + ' ' + _calcFmt(cur) + ' =';
            _calc.display = _calcFmt(res);
            _calc.operand1 = null; _calc.operator = null;
            _calc.waitingForOperand2 = false; _calc.justEqualed = true;
        }
    }
    _calcUpdate();
}

function calcCopy() {
    navigator.clipboard.writeText(_calc.display).then(() => {
        const btn = document.getElementById('calcCopyBtn');
        if (!btn) return;
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 1600);
    }).catch(() => {});
}

// Keyboard support when calculator is open
document.addEventListener('keydown', e => {
    const panel = document.getElementById('calcPanel');
    if (!panel || panel.style.display === 'none' || panel.style.display === '') return;
    // Don't intercept when typing in an input/textarea
    if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
    if (e.key >= '0' && e.key <= '9') { calcNum(e.key); e.preventDefault(); }
    else if (e.key === '.')  { calcNum('.'); e.preventDefault(); }
    else if (e.key === '+')  { calcOp('+'); e.preventDefault(); }
    else if (e.key === '-')  { calcOp('-'); e.preventDefault(); }
    else if (e.key === '*')  { calcOp('*'); e.preventDefault(); }
    else if (e.key === '/')  { calcOp('/'); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === '=') { calcFn('equals'); e.preventDefault(); }
    else if (e.key === 'Backspace') { calcFn('back'); e.preventDefault(); }
    else if (e.key === 'Escape') { toggleCalc(); e.preventDefault(); }
    else if (e.key === 'c' || e.key === 'C') { calcFn('clear'); e.preventDefault(); }
});

// ==================== TASKS / WORK-IN-PROGRESS ====================
const TASK_PRIORITY_RANK = { 'Urgent': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
const TASK_STATUS_LABEL  = { 'Pending': 'Pending', 'InProgress': 'In Progress', 'Done': 'Done' };
const TASK_STATUS_COLOR  = { 'Pending': '#7e8794', 'InProgress': '#2b6cb5', 'Done': '#27ae60' };

function _todayISO() { return new Date().toISOString().slice(0,10); }
function _isOverdue(t) {
    return t.status !== 'Done' && t.dueDate && t.dueDate < _todayISO();
}

function quickAddTask() {
    resetTaskForm();
    openModal('taskModal');
    setTimeout(() => { const ti = document.getElementById('taskTitle'); if (ti) ti.focus(); }, 200);
}

function resetTaskForm() {
    document.getElementById('taskEditId').value = '';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDueDate').value = _todayISO();
    document.getElementById('taskPriority').value = 'Medium';
    document.getElementById('taskStatus').value = 'Pending';
    document.getElementById('taskNotes').value = '';
    document.getElementById('taskModalTitle').textContent = 'Add Task';
    populateTaskDropdowns();
}

function populateTaskDropdowns() {
    const custSel = document.getElementById('taskCustomer');
    if (custSel) {
        const cv = custSel.value;
        const customers = (appData.contacts || []).filter(c => c.type === 'Customer' || c.type === 'Both');
        custSel.innerHTML = '<option value="">- None -</option>' +
            customers.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
        custSel.value = cv;
    }
    const invSel = document.getElementById('taskLinkedInvoice');
    if (invSel) {
        const cv = invSel.value;
        const invs = (appData.invoices || []).slice().sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 100);
        invSel.innerHTML = '<option value="">- None -</option>' +
            invs.map(i => `<option value="${i.id}">${esc(i.number)} - ${esc(i.customerName||'')}</option>`).join('');
        invSel.value = cv;
    }
    const qSel = document.getElementById('taskLinkedQuote');
    if (qSel) {
        const cv = qSel.value;
        const qs = (appData.quotations || []).slice().sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 100);
        qSel.innerHTML = '<option value="">- None -</option>' +
            qs.map(q => `<option value="${q.id}">${esc(q.number)} - ${esc(q.customerName||'')}</option>`).join('');
        qSel.value = cv;
    }
}

function saveTask() {
    if (!_beginSave()) return;
    const editId = document.getElementById('taskEditId').value;
    const title  = document.getElementById('taskTitle').value.trim();
    if (!title) { _endSave(); return showToast('Task title is required', 'error'); }

    const customerId = document.getElementById('taskCustomer').value || '';
    const customer   = customerId ? (appData.contacts || []).find(c => c.id === customerId) : null;
    const linkedInvId = document.getElementById('taskLinkedInvoice').value || '';
    const linkedInv   = linkedInvId ? (appData.invoices || []).find(i => i.id === linkedInvId) : null;
    const linkedQuoteId = document.getElementById('taskLinkedQuote').value || '';
    const linkedQuote   = linkedQuoteId ? (appData.quotations || []).find(q => q.id === linkedQuoteId) : null;

    const status = document.getElementById('taskStatus').value;
    const task = {
        title,
        customerId, customerName: customer ? customer.name : '',
        linkedInvoiceId: linkedInvId, linkedInvoiceNumber: linkedInv ? linkedInv.number : '',
        linkedQuoteId, linkedQuoteNumber: linkedQuote ? linkedQuote.number : '',
        priority: document.getElementById('taskPriority').value,
        status,
        dueDate: document.getElementById('taskDueDate').value || '',
        notes:   document.getElementById('taskNotes').value.trim(),
        completedAt: status === 'Done' ? _todayISO() : ''
    };

    const promise = editId ? fsUpdate('tasks', editId, task) : fsAdd('tasks', task);
    promise.then(() => { _endSave(); closeModal('taskModal'); showToast('Task saved!'); })
           .catch(e => { _endSave(); showToast('Error: ' + e.message, 'error'); });
}

function editTask(id) {
    const t = (appData.tasks || []).find(x => x.id === id);
    if (!t) return;
    document.getElementById('taskEditId').value = t.id;
    document.getElementById('taskTitle').value = t.title || '';
    document.getElementById('taskDueDate').value = t.dueDate || '';
    document.getElementById('taskPriority').value = t.priority || 'Medium';
    document.getElementById('taskStatus').value = t.status || 'Pending';
    document.getElementById('taskNotes').value = t.notes || '';
    document.getElementById('taskModalTitle').textContent = 'Edit Task';
    openModal('taskModal');
    setTimeout(() => {
        populateTaskDropdowns();
        document.getElementById('taskCustomer').value = t.customerId || '';
        document.getElementById('taskLinkedInvoice').value = t.linkedInvoiceId || '';
        document.getElementById('taskLinkedQuote').value = t.linkedQuoteId || '';
    }, 100);
}

function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    fsDelete('tasks', id).then(() => showToast('Task deleted'));
}

// One-click status cycle: Pending -> InProgress -> Done -> Pending
function cycleTaskStatus(id) {
    const t = (appData.tasks || []).find(x => x.id === id);
    if (!t) return;
    const next = t.status === 'Pending' ? 'InProgress' : t.status === 'InProgress' ? 'Done' : 'Pending';
    fsUpdate('tasks', id, { status: next, completedAt: next === 'Done' ? _todayISO() : '' });
}

function toggleTaskDone(id) {
    const t = (appData.tasks || []).find(x => x.id === id);
    if (!t) return;
    const newStatus = t.status === 'Done' ? 'Pending' : 'Done';
    fsUpdate('tasks', id, { status: newStatus, completedAt: newStatus === 'Done' ? _todayISO() : '' });
}

function renderTasks() {
    let tasks = [...(appData.tasks || [])];

    const custSel = document.getElementById('taskCustomerFilter');
    if (custSel) {
        const cv = custSel.value;
        const customerNames = [...new Set(tasks.map(t => t.customerName).filter(Boolean))].sort();
        custSel.innerHTML = '<option value="">All Customers</option>' +
            customerNames.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
        custSel.value = cv;
    }

    const search   = (document.getElementById('taskSearch')?.value || '').toLowerCase();
    const stFilter = document.getElementById('taskStatusFilter')?.value;
    const prFilter = document.getElementById('taskPriorityFilter')?.value || '';
    const cuFilter = document.getElementById('taskCustomerFilter')?.value || '';
    const sortVal  = document.getElementById('taskSort')?.value || 'due-asc';

    if (search) tasks = tasks.filter(t =>
        (t.title||'').toLowerCase().includes(search) ||
        (t.customerName||'').toLowerCase().includes(search) ||
        (t.notes||'').toLowerCase().includes(search));
    if (stFilter === 'active') tasks = tasks.filter(t => t.status !== 'Done');
    else if (stFilter)         tasks = tasks.filter(t => t.status === stFilter);
    if (prFilter) tasks = tasks.filter(t => t.priority === prFilter);
    if (cuFilter) tasks = tasks.filter(t => t.customerName === cuFilter);
    tasks = filterByDateInputs(tasks, 'dueDate', 'taskFromDate', 'taskToDate');

    if (sortVal === 'priority') {
        tasks.sort((a,b) => (TASK_PRIORITY_RANK[a.priority]||9) - (TASK_PRIORITY_RANK[b.priority]||9));
    } else if (sortVal === 'created-desc') {
        tasks.sort((a,b) => {
            const ad = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
            const bd = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
            return bd - ad;
        });
    } else if (sortVal === 'due-desc') {
        tasks.sort((a,b) => (b.dueDate||'').localeCompare(a.dueDate||''));
    } else {
        tasks.sort((a,b) => {
            const av = a.dueDate || '9999-99-99';
            const bv = b.dueDate || '9999-99-99';
            return av.localeCompare(bv);
        });
    }

    const all = appData.tasks || [];
    const today = _todayISO();
    const cPend = all.filter(t => t.status === 'Pending').length;
    const cProg = all.filter(t => t.status === 'InProgress').length;
    const cDone = all.filter(t => t.status === 'Done' && t.completedAt === today).length;
    const cOver = all.filter(_isOverdue).length;
    if (document.getElementById('taskCountPending'))    document.getElementById('taskCountPending').textContent = cPend;
    if (document.getElementById('taskCountInProgress')) document.getElementById('taskCountInProgress').textContent = cProg;
    if (document.getElementById('taskCountDoneToday'))  document.getElementById('taskCountDoneToday').textContent = cDone;
    if (document.getElementById('taskCountOverdue'))    document.getElementById('taskCountOverdue').textContent = cOver;

    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) { renderDashboardTasks(); return; }
    if (!tasks.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No tasks match the filter</td></tr>'; renderPagination('tasks', 0, 0, 'renderTasks'); renderDashboardTasks(); return; }
    const pg = paginate(tasks, 'tasks');
    tbody.innerHTML = pg.items.map(t => {
        const overdue = _isOverdue(t);
        const rowCls  = (t.status === 'Done' ? 'task-row-done' : '') + (overdue ? ' task-row-overdue' : '');
        const statusColor = TASK_STATUS_COLOR[t.status] || '#888';
        const linked = t.linkedInvoiceNumber ? `INV ${esc(t.linkedInvoiceNumber)}` :
                       t.linkedQuoteNumber  ? `QT ${esc(t.linkedQuoteNumber)}`   : '-';
        const dueCell = t.dueDate
            ? (overdue ? `<span style="color:#c62828;font-weight:600;">${t.dueDate} !</span>` : t.dueDate)
            : '<span style="color:#bbb;">-</span>';
        const noteSnip = t.notes ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${esc(t.notes.slice(0,80))}${t.notes.length>80?'...':''}</div>` : '';
        return `<tr class="${rowCls}">
            <td><input type="checkbox" ${t.status === 'Done' ? 'checked' : ''} onchange="toggleTaskDone('${t.id}')" title="Mark done"></td>
            <td><div class="task-title">${esc(t.title)}</div>${noteSnip}</td>
            <td>${esc(t.customerName) || '<span style="color:#bbb;">-</span>'}</td>
            <td><span class="pri-badge pri-${t.priority||'Medium'}">${t.priority||'Medium'}</span></td>
            <td><span class="status-badge" style="background:${statusColor}22;color:${statusColor};border:1px solid ${statusColor}66">${TASK_STATUS_LABEL[t.status]||t.status}</span></td>
            <td>${dueCell}</td>
            <td style="font-size:11px;">${linked}</td>
            <td style="white-space:nowrap;">
                <button class="btn-icon" onclick="cycleTaskStatus('${t.id}')" title="Advance status"><i class="fas fa-forward"></i></button>
                <button class="btn-icon" onclick="editTask('${t.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteTask('${t.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
    renderPagination('tasks', pg.totalPages, pg.total, 'renderTasks');
    renderDashboardTasks();
}

function renderDashboardTasks() {
    const wrap = document.getElementById('dashTasksList');
    if (!wrap) return;
    const all = appData.tasks || [];
    let active = all.filter(t => t.status !== 'Done');
    active.sort((a,b) => {
        const pa = TASK_PRIORITY_RANK[a.priority] || 9;
        const pb = TASK_PRIORITY_RANK[b.priority] || 9;
        if (pa !== pb) return pa - pb;
        const da = a.dueDate || '9999-99-99';
        const db = b.dueDate || '9999-99-99';
        return da.localeCompare(db);
    });
    const top = active.slice(0, 5);

    const summaryEl = document.getElementById('dashTaskSummary');
    if (summaryEl) {
        const overdue = all.filter(_isOverdue).length;
        summaryEl.textContent = `- ${active.length} active${overdue ? ', ' + overdue + ' overdue' : ''}`;
    }

    if (!top.length) {
        wrap.innerHTML = '<div style="text-align:center;padding:18px;color:var(--text-secondary);font-size:13px;">All caught up! <a href="#" onclick="quickAddTask();return false;" style="color:var(--primary);">Add a task</a></div>';
        return;
    }
    wrap.innerHTML = top.map(t => {
        const overdue = _isOverdue(t);
        const statusColor = TASK_STATUS_COLOR[t.status];
        const customerStr = t.customerName ? esc(t.customerName) : '';
        const dueStr = t.dueDate ? (customerStr ? ' . ' : '') + (overdue ? '<span style="color:#c62828;font-weight:600;">'+t.dueDate+' !</span>' : t.dueDate) : '';
        return `<div class="dash-task-item">
            <input type="checkbox" onchange="toggleTaskDone('${t.id}')" title="Mark done">
            <div class="task-title" onclick="editTask('${t.id}')" style="cursor:pointer;">${esc(t.title)}</div>
            <span class="pri-badge pri-${t.priority||'Medium'}">${t.priority||'Medium'}</span>
            <span class="dash-task-meta">${customerStr}${dueStr}</span>
            <span class="status-badge" style="background:${statusColor}22;color:${statusColor};border:1px solid ${statusColor}66;font-size:10px;padding:2px 8px;">${TASK_STATUS_LABEL[t.status]}</span>
        </div>`;
    }).join('');
}

// ==================== CORPORATE TAX REPORT (UAE FTA) ====================
// Constants per Federal Decree-Law 47 of 2022 + Ministerial Decision 73 of 2023
const CT_RATE                  = 0.09;
const CT_FREE_THRESHOLD        = 375000;
const CT_SBR_REVENUE_THRESHOLD = 3000000;

function _ctInRange(dateStr, from, to) {
    if (!dateStr) return false;
    if (from && dateStr < from) return false;
    if (to   && dateStr > to)   return false;
    return true;
}

function computeCorporateTax(fromDate, toDate, basis) {
    const invoices  = (appData.invoices  || []).filter(i => i.status !== 'Cancelled');
    const cashMemos = appData.cashMemos  || [];
    const expenses  = appData.expenses   || [];
    const purchases = (appData.purchases || []).filter(p => p.status !== 'Cancelled');
    const payrolls  = appData.payrollRuns|| [];

    let invRevenue = 0;
    if (basis === 'cash') {
        invoices.forEach(i => {
            if (!_ctInRange(i.date, fromDate, toDate)) return;
            invRevenue += (i.status === 'Paid') ? (i.subtotal || 0) : (invPaidAmount(i) / (1 + (i.vatRate||0))) || 0;
        });
    } else {
        invoices.forEach(i => {
            if (!_ctInRange(i.date, fromDate, toDate)) return;
            invRevenue += (i.subtotal || 0);
        });
    }

    let memoRevenue = 0;
    cashMemos.forEach(m => {
        if (!_ctInRange(m.date, fromDate, toDate)) return;
        memoRevenue += (m.amount || m.total || 0);
    });
    const totalRevenue = invRevenue + memoRevenue;

    const expByCategory = {};
    let totalExpenses = 0;
    expenses.forEach(e => {
        if (!_ctInRange(e.date, fromDate, toDate)) return;
        const cat = e.category || 'Uncategorised';
        const amt = e.amount || 0;
        expByCategory[cat] = (expByCategory[cat] || 0) + amt;
        totalExpenses += amt;
    });

    let purchaseExp = 0;
    purchases.forEach(p => {
        if (!_ctInRange(p.date, fromDate, toDate)) return;
        if (basis === 'cash' && p.status !== 'Paid') return;
        purchaseExp += (p.subtotal || 0);
    });
    if (purchaseExp > 0) {
        expByCategory['Purchases / Cost of Goods'] = purchaseExp;
        totalExpenses += purchaseExp;
    }

    let payrollExp = 0;
    payrolls.forEach(pr => {
        if (!_ctInRange(pr.date || pr.month, fromDate, toDate)) return;
        payrollExp += (pr.totalGross || pr.totalNet || 0);
    });
    if (payrollExp > 0) {
        expByCategory['Salaries & Wages'] = (expByCategory['Salaries & Wages'] || 0) + payrollExp;
        totalExpenses += payrollExp;
    }

    const netProfit = totalRevenue - totalExpenses;
    const sbrEligible = totalRevenue <= CT_SBR_REVENUE_THRESHOLD;
    const taxableIncome = Math.max(0, netProfit);
    const ctTaxableAboveThreshold = Math.max(0, taxableIncome - CT_FREE_THRESHOLD);
    const ctWithoutSBR = ctTaxableAboveThreshold * CT_RATE;
    const ctWithSBR = sbrEligible ? 0 : ctWithoutSBR;

    return {
        invRevenue, memoRevenue, totalRevenue,
        expByCategory, totalExpenses,
        netProfit, taxableIncome,
        sbrEligible, ctWithoutSBR, ctWithSBR,
        ctTaxableAboveThreshold
    };
}

function renderCorporateTax() {
    const fromDate = document.getElementById('ctFromDate')?.value || '2025-05-01';
    const toDate   = document.getElementById('ctToDate')?.value   || '2025-12-31';
    const basis    = document.getElementById('ctBasis')?.value    || 'accrual';
    const r = computeCorporateTax(fromDate, toDate, basis);

    if (document.getElementById('ctRevenue'))   document.getElementById('ctRevenue').textContent   = fmt(r.totalRevenue);
    if (document.getElementById('ctExpenses'))  document.getElementById('ctExpenses').textContent  = fmt(r.totalExpenses);
    if (document.getElementById('ctNetProfit')) document.getElementById('ctNetProfit').textContent = fmt(r.netProfit);
    if (document.getElementById('ctLiability')) document.getElementById('ctLiability').textContent = fmt(r.ctWithSBR);

    const sbrStatus = document.getElementById('ctSbrStatus');
    if (sbrStatus) {
        if (r.sbrEligible) {
            sbrStatus.style.background = '#e8f5e9';
            sbrStatus.style.color = '#2e7d32';
            sbrStatus.style.border = '1px solid #a5d6a7';
            sbrStatus.innerHTML =
                '<div style="font-size:18px;font-weight:600;margin-bottom:6px;">✅ Eligible for Small Business Relief</div>' +
                '<div>Your revenue of <strong>' + fmt(r.totalRevenue) + '</strong> is below the AED 3,000,000 threshold.</div>' +
                '<div style="margin-top:8px;">By electing SBR on your return, your taxable income is treated as <strong>NIL</strong> and your Corporate Tax liability is <strong>AED 0.00</strong>.</div>' +
                '<div style="margin-top:8px;color:#1b5e20;"><strong>Action:</strong> On the EmaraTax return, tick the "Small Business Relief" election box.</div>';
        } else {
            sbrStatus.style.background = '#fff3e0';
            sbrStatus.style.color = '#bf360c';
            sbrStatus.style.border = '1px solid #ffab91';
            sbrStatus.innerHTML =
                '<div style="font-size:18px;font-weight:600;margin-bottom:6px;">❌ Not Eligible for Small Business Relief</div>' +
                '<div>Your revenue of <strong>' + fmt(r.totalRevenue) + '</strong> exceeds the AED 3,000,000 threshold.</div>' +
                '<div style="margin-top:8px;">Standard CT computation applies. Estimated liability: <strong>' + fmt(r.ctWithoutSBR) + '</strong>.</div>';
        }
    }

    const compBody = document.getElementById('ctComputationBody');
    if (compBody) {
        compBody.innerHTML =
            '<tr><td>Total Revenue (excl. VAT)</td><td style="text-align:right;">' + fmt(r.totalRevenue) + '</td><td style="text-align:right;">' + fmt(r.totalRevenue) + '</td></tr>' +
            '<tr><td>Total Expenses</td><td style="text-align:right;">(' + fmt(r.totalExpenses) + ')</td><td style="text-align:right;">(' + fmt(r.totalExpenses) + ')</td></tr>' +
            '<tr><td><strong>Net Accounting Profit</strong></td><td style="text-align:right;"><strong>' + fmt(r.netProfit) + '</strong></td><td style="text-align:right;"><strong>' + fmt(r.netProfit) + '</strong></td></tr>' +
            '<tr><td>Adjustments (entertainment, fines, etc.)</td><td style="text-align:right;color:#888;">Apply manually</td><td style="text-align:right;color:#888;">Apply manually</td></tr>' +
            '<tr><td><strong>Taxable Income</strong></td><td style="text-align:right;"><strong>' + (r.sbrEligible ? 'NIL (SBR elected)' : fmt(r.taxableIncome)) + '</strong></td><td style="text-align:right;"><strong>' + fmt(r.taxableIncome) + '</strong></td></tr>' +
            '<tr><td>Less: 0% threshold (AED 375,000)</td><td style="text-align:right;">—</td><td style="text-align:right;">(' + fmt(Math.min(r.taxableIncome, CT_FREE_THRESHOLD)) + ')</td></tr>' +
            '<tr><td>Amount taxed at 9%</td><td style="text-align:right;">—</td><td style="text-align:right;">' + fmt(r.ctTaxableAboveThreshold) + '</td></tr>' +
            '<tr style="background:#fff8e1;"><td><strong>Corporate Tax Liability</strong></td><td style="text-align:right;font-size:16px;color:#27ae60;"><strong>AED 0.00</strong></td><td style="text-align:right;font-size:16px;color:#e74c3c;"><strong>' + fmt(r.ctWithoutSBR) + '</strong></td></tr>';
    }

    const revBody = document.getElementById('ctRevenueBody');
    if (revBody) {
        const pct = (v) => r.totalRevenue > 0 ? (v / r.totalRevenue * 100).toFixed(1) + '%' : '0.0%';
        revBody.innerHTML =
            '<tr><td>Invoices (excl. VAT)</td><td style="text-align:right;">' + fmt(r.invRevenue) + '</td><td style="text-align:right;">' + pct(r.invRevenue) + '</td></tr>' +
            '<tr><td>Cash Memos / Vouchers</td><td style="text-align:right;">' + fmt(r.memoRevenue) + '</td><td style="text-align:right;">' + pct(r.memoRevenue) + '</td></tr>' +
            '<tr style="background:#f5f7fa;"><td><strong>Total Revenue</strong></td><td style="text-align:right;"><strong>' + fmt(r.totalRevenue) + '</strong></td><td style="text-align:right;"><strong>100.0%</strong></td></tr>';
    }

    const expBody = document.getElementById('ctExpenseBody');
    if (expBody) {
        const treatment = (cat) => {
            const c = (cat || '').toLowerCase();
            if (c.includes('entertain'))                                                            return '<span style="color:#e65100;">50% disallowed (Art. 32)</span>';
            if (c.includes('fine') || c.includes('penalty'))                                        return '<span style="color:#c62828;">100% disallowed</span>';
            if (c.includes('donation'))                                                             return '<span style="color:#e65100;">Disallowed unless qualifying entity</span>';
            if (c.includes('salar') || c.includes('wage') || c.includes('payroll'))                 return '<span style="color:#2e7d32;">Allowed</span>';
            return '<span style="color:#2e7d32;">Allowed (verify)</span>';
        };
        const sorted = Object.entries(r.expByCategory).sort((a,b) => b[1] - a[1]);
        if (!sorted.length) {
            expBody.innerHTML = '<tr><td colspan="4" class="empty-state">No expenses recorded in this period</td></tr>';
        } else {
            const pct = (v) => r.totalExpenses > 0 ? (v / r.totalExpenses * 100).toFixed(1) + '%' : '0.0%';
            expBody.innerHTML = sorted.map(([cat, amt]) =>
                '<tr><td>' + esc(cat) + '</td><td style="text-align:right;">' + fmt(amt) + '</td><td style="text-align:right;">' + pct(amt) + '</td><td>' + treatment(cat) + '</td></tr>'
            ).join('') +
            '<tr style="background:#f5f7fa;"><td><strong>Total Expenses</strong></td><td style="text-align:right;"><strong>' + fmt(r.totalExpenses) + '</strong></td><td style="text-align:right;"><strong>100.0%</strong></td><td></td></tr>';
        }
    }

    const methEl = document.getElementById('ctMethPeriod');
    if (methEl) {
        const fmtD = (s) => {
            if (!s) return '';
            const [y, m, d] = s.split('-');
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            return parseInt(d,10) + ' ' + months[parseInt(m,10)-1] + ' ' + y;
        };
        methEl.textContent = fmtD(fromDate) + ' – ' + fmtD(toDate);
    }
}

// Clean figures-only PDF — no disclaimers, no FTA / SBR / tax wording.
// Just a professional financial summary with revenue, expenses, and net profit.
function exportCTFiguresPDF() {
    const fromDate = document.getElementById('ctFromDate')?.value || '2025-05-01';
    const toDate   = document.getElementById('ctToDate')?.value   || '2025-12-31';
    const basis    = document.getElementById('ctBasis')?.value    || 'accrual';
    const r = computeCorporateTax(fromDate, toDate, basis);

    const s = appData.settings || {};
    const companyName = s.companyName || 'Danoor Services';

    const fmtD = (str) => {
        if (!str) return '';
        const [y, m, d] = str.split('-');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return parseInt(d,10) + ' ' + months[parseInt(m,10)-1] + ' ' + y;
    };
    const today = (() => {
        const t = new Date();
        return fmtD(t.toISOString().slice(0,10));
    })();

    const revBody =
        '<tr><td>Service Revenue (Invoices)</td><td class="num">' + fmt(r.invRevenue) + '</td></tr>' +
        (r.memoRevenue > 0 ? '<tr><td>Cash Memos / Vouchers</td><td class="num">' + fmt(r.memoRevenue) + '</td></tr>' : '') +
        '<tr class="total-row"><td><strong>Total Revenue</strong></td><td class="num"><strong>' + fmt(r.totalRevenue) + '</strong></td></tr>';

    const sortedExp = Object.entries(r.expByCategory).sort((a,b) => b[1] - a[1]);
    const expBody = sortedExp.length
        ? sortedExp.map(([cat, amt]) => '<tr><td>' + esc(cat) + '</td><td class="num">' + fmt(amt) + '</td></tr>').join('') +
          '<tr class="total-row"><td><strong>Total Expenses</strong></td><td class="num"><strong>' + fmt(r.totalExpenses) + '</strong></td></tr>'
        : '<tr><td colspan="2" style="text-align:center;color:#888;padding:14px;">No expenses recorded</td></tr>';

    const profitColor = r.netProfit >= 0 ? '#1b5e20' : '#c62828';

    // Tax computation - both scenarios (figures only)
    const compBody =
        '<tr><td>Total Revenue</td><td class="num">' + fmt(r.totalRevenue) + '</td><td class="num">' + fmt(r.totalRevenue) + '</td></tr>' +
        '<tr><td>Total Expenses</td><td class="num">(' + fmt(r.totalExpenses) + ')</td><td class="num">(' + fmt(r.totalExpenses) + ')</td></tr>' +
        '<tr class="sub-row"><td><strong>Net Accounting Profit</strong></td><td class="num"><strong>' + fmt(r.netProfit) + '</strong></td><td class="num"><strong>' + fmt(r.netProfit) + '</strong></td></tr>' +
        '<tr><td>Taxable Income</td><td class="num">' + (r.sbrEligible ? 'NIL' : fmt(r.taxableIncome)) + '</td><td class="num">' + fmt(r.taxableIncome) + '</td></tr>' +
        '<tr><td>Less: 0% threshold (AED 375,000)</td><td class="num">&mdash;</td><td class="num">(' + fmt(Math.min(r.taxableIncome, CT_FREE_THRESHOLD)) + ')</td></tr>' +
        '<tr><td>Amount taxed at 9%</td><td class="num">&mdash;</td><td class="num">' + fmt(r.ctTaxableAboveThreshold) + '</td></tr>' +
        '<tr class="total-row"><td><strong>Tax Liability</strong></td><td class="num"><strong style="color:#1b5e20;">AED 0.00</strong></td><td class="num"><strong style="color:#c62828;">' + fmt(r.ctWithoutSBR) + '</strong></td></tr>';

    const html =
        '<div id="figReport" style="font-family:\'Inter\',Arial,sans-serif;color:#1a1a2e;padding:32px 40px;width:800px;background:#fff;">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #2b6cb5;padding-bottom:14px;margin-bottom:24px;">' +
                '<div>' +
                    '<div style="font-size:22px;font-weight:700;color:#2b6cb5;">' + esc(companyName) + '</div>' +
                    (s.businessType ? '<div style="font-size:13px;color:#666;margin-top:3px;">' + esc(s.businessType) + '</div>' : '') +
                    (s.address ? '<div style="font-size:11px;color:#888;margin-top:2px;">' + esc(s.address) + '</div>' : '') +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:18px;font-weight:600;color:#1a1a2e;">Financial Summary</div>' +
                    '<div style="font-size:12px;color:#666;margin-top:4px;">Period: ' + fmtD(fromDate) + ' &ndash; ' + fmtD(toDate) + '</div>' +
                    '<div style="font-size:11px;color:#888;">Generated: ' + today + '</div>' +
                '</div>' +
            '</div>' +

            '<div style="display:flex;gap:14px;margin-bottom:26px;">' +
                '<div style="flex:1;background:#e8f5e9;border:1px solid #a5d6a7;border-radius:8px;padding:14px;">' +
                    '<div style="font-size:11px;color:#2e7d32;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Total Revenue</div>' +
                    '<div style="font-size:22px;font-weight:700;color:#1b5e20;margin-top:6px;">' + fmt(r.totalRevenue) + '</div>' +
                '</div>' +
                '<div style="flex:1;background:#ffebee;border:1px solid #ef9a9a;border-radius:8px;padding:14px;">' +
                    '<div style="font-size:11px;color:#c62828;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Total Expenses</div>' +
                    '<div style="font-size:22px;font-weight:700;color:#b71c1c;margin-top:6px;">' + fmt(r.totalExpenses) + '</div>' +
                '</div>' +
                '<div style="flex:1;background:#e3f2fd;border:1px solid #90caf9;border-radius:8px;padding:14px;">' +
                    '<div style="font-size:11px;color:#1565c0;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Net Profit</div>' +
                    '<div style="font-size:22px;font-weight:700;color:' + profitColor + ';margin-top:6px;">' + fmt(r.netProfit) + '</div>' +
                '</div>' +
            '</div>' +

            '<h3 style="font-size:15px;font-weight:600;color:#2b6cb5;margin:0 0 10px 0;border-bottom:1px solid #ddd;padding-bottom:6px;">Revenue</h3>' +
            '<table class="ft" style="width:100%;border-collapse:collapse;margin-bottom:28px;">' +
                '<thead><tr style="background:#f5f7fa;"><th style="text-align:left;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Source</th><th style="text-align:right;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Amount (AED)</th></tr></thead>' +
                '<tbody>' + revBody + '</tbody>' +
            '</table>' +

            '<h3 style="font-size:15px;font-weight:600;color:#2b6cb5;margin:0 0 10px 0;border-bottom:1px solid #ddd;padding-bottom:6px;">Expenses by Category</h3>' +
            '<table class="ft" style="width:100%;border-collapse:collapse;margin-bottom:28px;">' +
                '<thead><tr style="background:#f5f7fa;"><th style="text-align:left;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Category</th><th style="text-align:right;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Amount (AED)</th></tr></thead>' +
                '<tbody>' + expBody + '</tbody>' +
            '</table>' +

            '<h3 style="font-size:15px;font-weight:600;color:#2b6cb5;margin:0 0 10px 0;border-bottom:1px solid #ddd;padding-bottom:6px;">Corporate Tax Computation &mdash; Both Scenarios</h3>' +
            '<table class="ft" style="width:100%;border-collapse:collapse;margin-bottom:28px;">' +
                '<thead><tr style="background:#f5f7fa;">' +
                    '<th style="text-align:left;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Item</th>' +
                    '<th style="text-align:right;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Scenario A (AED)</th>' +
                    '<th style="text-align:right;padding:9px 12px;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #ddd;">Scenario B (AED)</th>' +
                '</tr></thead>' +
                '<tbody>' + compBody + '</tbody>' +
            '</table>' +

            '<div style="background:#fafafa;border-top:2px solid #2b6cb5;padding:16px;display:flex;justify-content:space-between;align-items:center;">' +
                '<div style="font-size:14px;font-weight:600;color:#1a1a2e;">Net Profit / (Loss) for the Period</div>' +
                '<div style="font-size:20px;font-weight:700;color:' + profitColor + ';">' + fmt(r.netProfit) + '</div>' +
            '</div>' +

            '<style>' +
                '.ft td { padding:8px 12px; font-size:13px; border-bottom:1px solid #eee; }' +
                '.ft .num { text-align:right; font-variant-numeric: tabular-nums; }' +
                '.ft .sub-row { background:#fafbfc; }' +
                '.ft .total-row { background:#f5f7fa; }' +
                '.ft .total-row td { border-top:1px solid #999; }' +
            '</style>' +
        '</div>';

    // Build offscreen wrapper and export
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '800px';
    wrapper.style.zIndex = '-1';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.background = '#fff';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    const target = wrapper.querySelector('#figReport');

    const fileName = companyName.replace(/[^a-zA-Z0-9]/g,'') + '_FinancialSummary_' + fromDate + '_to_' + toDate + '.pdf';
    showToast('Generating PDF...');

    _waitForImagesIn(target).then(() => {
        return html2pdf().set(_pdfOptions(fileName)).from(target).save();
    }).then(() => {
        document.body.removeChild(wrapper);
        showToast('PDF downloaded: ' + fileName, 'success');
    }).catch(err => {
        if (wrapper.parentNode) document.body.removeChild(wrapper);
        showToast('Export failed: ' + (err.message || err), 'error');
    });
}

function exportCTReportPDF() {
    const src = document.getElementById('tab-rptCT');
    if (!src) { showToast('Open the Corporate Tax tab first', 'error'); return; }
    showToast('Generating CT report PDF...');

    const clone = src.cloneNode(true);
    clone.style.background = '#fff';
    clone.style.padding = '24px';
    clone.style.width = '800px';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.width = '800px';
    wrapper.style.zIndex = '-1';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.background = '#fff';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const company = (appData.settings && appData.settings.companyName) || 'Danoor';
    const fileName = company.replace(/[^a-zA-Z0-9]/g,'') + '_CorporateTax_FY2025.pdf';

    _waitForImagesIn(clone).then(() => {
        return html2pdf().set(_pdfOptions(fileName)).from(clone).save();
    }).then(() => {
        document.body.removeChild(wrapper);
        showToast('PDF downloaded: ' + fileName, 'success');
    }).catch(err => {
        if (wrapper.parentNode) document.body.removeChild(wrapper);
        showToast('Export failed: ' + (err.message || err), 'error');
    });
}

// ==================== UAE REFERENCE — LICENSING AUTHORITIES & PRO SERVICES ====================
// All prices are approximate ranges in AED for a new general/commercial trading licence.
// Fees change frequently — always verify with the authority's official website.
const UAE_LICENSING_AUTHORITIES = [
    // ==================== DUBAI ====================
    { name: 'Dubai Department of Economy & Tourism (DET)', short: 'Dubai DET / DED', emirate: 'Dubai', type: 'Mainland', sector: 'All sectors', website: 'https://business.dubai.gov.ae', phone: '600 545 555', email: 'info@dedc.gov.ae', priceMin: 12000, priceMax: 25000, notes: 'Mainland Dubai licence. Can trade anywhere in UAE.' },
    { name: 'DMCC (Dubai Multi Commodities Centre)', short: 'DMCC', emirate: 'Dubai', type: 'Free Zone', sector: 'Commodities, Trading, Services', website: 'https://www.dmcc.ae', phone: '+971 4 424 9600', email: 'info@dmcc.ae', priceMin: 20000, priceMax: 35000, notes: 'Premium free zone in JLT. 0% tax, 100% foreign ownership.' },
    { name: 'IFZA (International Free Zone Authority)', short: 'IFZA', emirate: 'Dubai', type: 'Free Zone', sector: 'Trading, Services, Consultancy', website: 'https://www.ifza.com', phone: '+971 4 455 8000', email: 'info@ifza.com', priceMin: 12500, priceMax: 18000, notes: 'One of the most affordable Dubai free zones. Based in Dubai Silicon Oasis.' },
    { name: 'Meydan Free Zone', short: 'Meydan FZ', emirate: 'Dubai', type: 'Free Zone', sector: 'Trading, Services, Consultancy', website: 'https://www.meydanfz.ae', phone: '+971 4 381 8888', email: 'enquiry@meydanfz.ae', priceMin: 12500, priceMax: 18500, notes: 'Affordable digital free zone. Virtual offices available.' },
    { name: 'JAFZA (Jebel Ali Free Zone)', short: 'JAFZA', emirate: 'Dubai', type: 'Free Zone', sector: 'Trading, Logistics, Industrial', website: 'https://www.jafza.ae', phone: '+971 4 881 5555', email: 'info@jafza.ae', priceMin: 30000, priceMax: 65000, notes: 'Largest free zone in the Middle East. Near Jebel Ali Port.' },
    { name: 'DAFZA (Dubai Airport Free Zone)', short: 'DAFZA', emirate: 'Dubai', type: 'Free Zone', sector: 'Aviation, Logistics, Trading', website: 'https://www.dafz.ae', phone: '+971 4 299 5555', email: 'info@dafz.ae', priceMin: 27000, priceMax: 50000, notes: 'Adjacent to Dubai International Airport. Premium location.' },
    { name: 'DIFC (Dubai International Financial Centre)', short: 'DIFC', emirate: 'Dubai', type: 'Financial', sector: 'Finance, Fintech, Legal, Wealth', website: 'https://www.difc.ae', phone: '+971 4 362 2222', email: 'info@difc.ae', priceMin: 40000, priceMax: 150000, notes: 'Independent legal jurisdiction. English common law.' },
    { name: 'Dubai Internet City (DIC) — TECOM', short: 'DIC', emirate: 'Dubai', type: 'Free Zone', sector: 'Tech, IT, Software', website: 'https://www.dic.ae', phone: '+971 4 391 1111', email: 'info@tecom.ae', priceMin: 25000, priceMax: 50000, notes: 'Part of TECOM Group. Home to Microsoft, Google, IBM, etc.' },
    { name: 'Dubai Media City (DMC) — TECOM', short: 'DMC', emirate: 'Dubai', type: 'Free Zone', sector: 'Media, Marketing, Advertising', website: 'https://www.dmc.ae', phone: '+971 4 391 1111', email: 'info@tecom.ae', priceMin: 25000, priceMax: 50000, notes: 'For media, broadcasting, PR, advertising companies.' },
    { name: 'Dubai Knowledge Park (DKP) — TECOM', short: 'DKP', emirate: 'Dubai', type: 'Free Zone', sector: 'Education, HR, Training', website: 'https://www.dkv.ae', phone: '+971 4 391 1111', email: 'info@tecom.ae', priceMin: 20000, priceMax: 40000, notes: 'For education, training, and HR-related companies.' },
    { name: 'Dubai Design District (d3) — TECOM', short: 'd3', emirate: 'Dubai', type: 'Free Zone', sector: 'Design, Fashion, Art', website: 'https://www.dubaidesigndistrict.com', phone: '+971 4 433 3000', email: 'info@dubaidesigndistrict.com', priceMin: 25000, priceMax: 50000, notes: 'For designers, fashion brands, architects, artists.' },
    { name: 'Dubai Production City', short: 'DPC', emirate: 'Dubai', type: 'Free Zone', sector: 'Print, Publishing, Packaging', website: 'https://www.dpc.ae', phone: '+971 4 391 1111', email: 'info@tecom.ae', priceMin: 22000, priceMax: 45000, notes: 'For print, publishing, packaging businesses.' },
    { name: 'Dubai Healthcare City (DHCC)', short: 'DHCC', emirate: 'Dubai', type: 'Free Zone', sector: 'Healthcare, Medical, Wellness', website: 'https://www.dhcc.ae', phone: '+971 4 383 4040', email: 'info@dhcc.ae', priceMin: 25000, priceMax: 60000, notes: 'For clinics, hospitals, pharmaceuticals, wellness.' },
    { name: 'Dubai Silicon Oasis (DSO)', short: 'DSO', emirate: 'Dubai', type: 'Free Zone', sector: 'Tech, R&D, Manufacturing', website: 'https://www.dsoa.ae', phone: '+971 4 372 4444', email: 'info@dsoa.ae', priceMin: 14500, priceMax: 30000, notes: 'Technology park. Now hosts IFZA.' },
    { name: 'Dubai South / Dubai World Central (DWC)', short: 'Dubai South', emirate: 'Dubai', type: 'Free Zone', sector: 'Aviation, Logistics, Trade', website: 'https://www.dubaisouth.ae', phone: '+971 4 870 0000', email: 'info@dubaisouth.ae', priceMin: 12500, priceMax: 35000, notes: 'Around Al Maktoum International Airport. Expo 2020 site.' },
    { name: 'Dubai CommerCity', short: 'DCC', emirate: 'Dubai', type: 'Free Zone', sector: 'E-commerce, Digital trade', website: 'https://www.dubaicommercity.ae', phone: '+971 4 514 0700', email: 'info@dubaicommercity.ae', priceMin: 20000, priceMax: 40000, notes: 'First dedicated e-commerce free zone in MENA.' },
    { name: 'Dubai Studio City — TECOM', short: 'DSC', emirate: 'Dubai', type: 'Free Zone', sector: 'Film, Broadcasting, Music', website: 'https://www.dubaistudiocity.com', phone: '+971 4 391 1111', email: 'info@tecom.ae', priceMin: 22000, priceMax: 45000, notes: 'For TV, film, music production.' },
    { name: 'Dubai Maritime City Authority (DMCA)', short: 'DMCA', emirate: 'Dubai', type: 'Free Zone', sector: 'Maritime, Shipping', website: 'https://www.dma.gov.ae', phone: '+971 4 345 8888', email: 'info@dma.gov.ae', priceMin: 25000, priceMax: 60000, notes: 'For maritime, ship management, marine services.' },
    { name: 'JAFZA Offshore', short: 'JAFZA Offshore', emirate: 'Dubai', type: 'Offshore', sector: 'Holding, IP, Investment', website: 'https://www.jafza.ae', phone: '+971 4 881 5555', email: 'info@jafza.ae', priceMin: 12000, priceMax: 18000, notes: 'Offshore company. No physical presence required, no UAE residency.' },

    // ==================== ABU DHABI ====================
    { name: 'Abu Dhabi Department of Economic Development (ADDED)', short: 'Abu Dhabi DED', emirate: 'Abu Dhabi', type: 'Mainland', sector: 'All sectors', website: 'https://added.gov.ae', phone: '800 555', email: 'info@added.gov.ae', priceMin: 8000, priceMax: 25000, notes: 'Mainland Abu Dhabi. Tamm portal for services.' },
    { name: 'ADGM (Abu Dhabi Global Market)', short: 'ADGM', emirate: 'Abu Dhabi', type: 'Financial', sector: 'Finance, Fintech, Holding', website: 'https://www.adgm.com', phone: '+971 2 333 8888', email: 'info@adgm.com', priceMin: 30000, priceMax: 100000, notes: 'Independent jurisdiction, English common law. On Al Maryah Island.' },
    { name: 'KIZAD (Khalifa Industrial Zone)', short: 'KIZAD', emirate: 'Abu Dhabi', type: 'Free Zone', sector: 'Industrial, Logistics, Manufacturing', website: 'https://www.kizad.ae', phone: '800 102 030', email: 'info@adports.ae', priceMin: 15000, priceMax: 40000, notes: 'Operated by AD Ports Group. Near Khalifa Port.' },
    { name: 'Masdar City Free Zone', short: 'Masdar City FZ', emirate: 'Abu Dhabi', type: 'Free Zone', sector: 'Renewable Energy, Sustainability, Tech', website: 'https://www.masdarcityfreezone.com', phone: '+971 2 653 6000', email: 'info@masdarcityfreezone.com', priceMin: 11000, priceMax: 30000, notes: 'Sustainability-focused free zone.' },
    { name: 'twofour54', short: 'twofour54', emirate: 'Abu Dhabi', type: 'Free Zone', sector: 'Media, Content, Entertainment', website: 'https://www.twofour54.com', phone: '+971 2 401 2454', email: 'info@twofour54.com', priceMin: 9000, priceMax: 25000, notes: 'Abu Dhabi media free zone.' },
    { name: 'Abu Dhabi Airports Free Zone (ADAFZ)', short: 'ADAFZ', emirate: 'Abu Dhabi', type: 'Free Zone', sector: 'Aviation, Logistics', website: 'https://www.adac.ae', phone: '+971 2 505 5555', email: 'info@adac.ae', priceMin: 15000, priceMax: 35000, notes: 'Adjacent to Abu Dhabi International Airport.' },

    // ==================== SHARJAH ====================
    { name: 'Sharjah Economic Development Department (SEDD)', short: 'Sharjah DED', emirate: 'Sharjah', type: 'Mainland', sector: 'All sectors', website: 'https://sedd.shj.ae', phone: '80080000', email: 'info@sedd.ae', priceMin: 8000, priceMax: 20000, notes: 'Mainland Sharjah.' },
    { name: 'SAIF Zone (Sharjah Airport Free Zone)', short: 'SAIF Zone', emirate: 'Sharjah', type: 'Free Zone', sector: 'Trading, Industrial, Logistics', website: 'https://www.saif-zone.com', phone: '+971 6 557 8000', email: 'info@saif-zone.com', priceMin: 11000, priceMax: 25000, notes: 'Located at Sharjah International Airport.' },
    { name: 'Hamriyah Free Zone (HFZA)', short: 'HFZA', emirate: 'Sharjah', type: 'Free Zone', sector: 'Industrial, Maritime, Petrochemicals', website: 'https://www.hfza.ae', phone: '+971 6 526 3333', email: 'info@hfza.ae', priceMin: 8000, priceMax: 25000, notes: 'Heavy industries, oil & gas, manufacturing.' },
    { name: 'Sharjah Media City (SHAMS)', short: 'SHAMS', emirate: 'Sharjah', type: 'Free Zone', sector: 'Media, Creative, Digital', website: 'https://www.shams.ae', phone: '+971 6 575 7000', email: 'info@shams.ae', priceMin: 5750, priceMax: 11500, notes: 'Among the cheapest UAE free zones. Great for freelancers and media.' },
    { name: 'Sharjah Publishing City (SPC Free Zone)', short: 'SPC FZ', emirate: 'Sharjah', type: 'Free Zone', sector: 'Publishing, Trading, Services', website: 'https://www.spcfz.ae', phone: '+971 6 503 7777', email: 'info@spcfz.ae', priceMin: 6875, priceMax: 15000, notes: 'Despite the name, allows almost all activities. Affordable.' },
    { name: 'Sharjah Research, Technology & Innovation Park (SRTIP)', short: 'SRTIP', emirate: 'Sharjah', type: 'Free Zone', sector: 'R&D, Tech, Innovation', website: 'https://www.srtip.ae', phone: '+971 6 597 8000', email: 'info@srtip.ae', priceMin: 12000, priceMax: 30000, notes: 'For research, innovation and tech.' },

    // ==================== AJMAN ====================
    { name: 'Ajman Department of Economic Development', short: 'Ajman DED', emirate: 'Ajman', type: 'Mainland', sector: 'All sectors', website: 'https://www.ajmanded.ae', phone: '+971 6 711 1111', email: 'info@ajmanded.ae', priceMin: 7000, priceMax: 18000, notes: 'Mainland Ajman.' },
    { name: 'Ajman Free Zone (AFZ)', short: 'AFZ', emirate: 'Ajman', type: 'Free Zone', sector: 'Trading, Services, Industrial', website: 'https://www.afz.ae', phone: '+971 6 701 1555', email: 'info@afz.ae', priceMin: 9000, priceMax: 20000, notes: 'Affordable free zone with virtual office options.' },
    { name: 'Ajman Media City Free Zone (AMC)', short: 'AMC FZ', emirate: 'Ajman', type: 'Free Zone', sector: 'Media, Marketing, Services', website: 'https://www.amcfz.ae', phone: '+971 6 745 2666', email: 'info@amcfz.ae', priceMin: 5500, priceMax: 14000, notes: 'Very affordable. Allows wide range of activities.' },

    // ==================== RAS AL KHAIMAH ====================
    { name: 'RAKEZ (Ras Al Khaimah Economic Zone)', short: 'RAKEZ', emirate: 'Ras Al Khaimah', type: 'Free Zone', sector: 'All sectors', website: 'https://rakez.com', phone: '+971 7 207 0000', email: 'info@rakez.com', priceMin: 11000, priceMax: 25000, notes: 'One of the largest, most affordable free zones. 50+ industries.' },
    { name: 'RAK ICC (RAK International Corporate Centre)', short: 'RAK ICC', emirate: 'Ras Al Khaimah', type: 'Offshore', sector: 'Holding, IP, Investment', website: 'https://www.rakicc.com', phone: '+971 7 206 8666', email: 'info@rakicc.com', priceMin: 9000, priceMax: 14000, notes: 'Premier UAE offshore jurisdiction. No physical presence required.' },
    { name: 'RAK Maritime City', short: 'RAK MC', emirate: 'Ras Al Khaimah', type: 'Free Zone', sector: 'Maritime, Shipping', website: 'https://www.rakmaritimecity.ae', phone: '+971 7 206 8666', email: 'info@rakmaritimecity.ae', priceMin: 15000, priceMax: 35000, notes: 'Maritime-focused free zone.' },
    { name: 'RAK DED (Ras Al Khaimah DED)', short: 'RAK DED', emirate: 'Ras Al Khaimah', type: 'Mainland', sector: 'All sectors', website: 'https://www.ded.rak.ae', phone: '+971 7 207 7222', email: 'info@ded.rak.ae', priceMin: 7000, priceMax: 18000, notes: 'Mainland Ras Al Khaimah.' },

    // ==================== FUJAIRAH ====================
    { name: 'Fujairah Department of Economic Development', short: 'Fujairah DED', emirate: 'Fujairah', type: 'Mainland', sector: 'All sectors', website: 'https://ded.fujairah.ae', phone: '+971 9 222 9999', email: 'info@ded.fujairah.ae', priceMin: 8000, priceMax: 18000, notes: 'Mainland Fujairah.' },
    { name: 'Fujairah Free Zone (FFZ)', short: 'FFZ', emirate: 'Fujairah', type: 'Free Zone', sector: 'Trading, Industrial', website: 'https://www.fujairahfreezone.com', phone: '+971 9 222 8000', email: 'info@fujairahfreezone.com', priceMin: 8500, priceMax: 22000, notes: 'Near Fujairah Port.' },
    { name: 'Creative City Fujairah', short: 'Creative City', emirate: 'Fujairah', type: 'Free Zone', sector: 'Media, Creative, Consulting', website: 'https://creativecity.ae', phone: '+971 9 222 5780', email: 'info@creativecity.ae', priceMin: 6500, priceMax: 14000, notes: 'Affordable, virtual-office friendly.' },

    // ==================== UMM AL QUWAIN ====================
    { name: 'UAQ Free Trade Zone', short: 'UAQ FTZ', emirate: 'Umm Al Quwain', type: 'Free Zone', sector: 'Trading, Services, Industrial', website: 'https://uaqftz.com', phone: '+971 6 765 1666', email: 'info@uaqftz.com', priceMin: 6500, priceMax: 18000, notes: 'Affordable free zone with virtual offices.' },
    { name: 'UAQ Department of Economic Development', short: 'UAQ DED', emirate: 'Umm Al Quwain', type: 'Mainland', sector: 'All sectors', website: 'https://www.ded.uaq.ae', phone: '+971 6 765 5125', email: 'info@ded.uaq.ae', priceMin: 7000, priceMax: 16000, notes: 'Mainland UAQ.' },
];

const UAE_PRO_SERVICES = [
    // ==================== VISA & RESIDENCY ====================
    { name: 'GDRFA Dubai (General Directorate of Residency & Foreigners Affairs)', short: 'GDRFA Dubai', category: 'Visa & Residency', services: 'Entry permits, visa stamping, residency, exit/re-entry permits', portal: 'https://gdrfad.gov.ae', portal2: 'https://smartservices.icp.gov.ae', phone: '800 5111', email: 'info@gdrfad.gov.ae', notes: 'Dubai residency services. Use Amer centres for in-person.' },
    { name: 'ICP (Federal Authority for Identity, Citizenship, Customs & Ports)', short: 'ICP / ICA', category: 'Visa & Residency', services: 'Emirates ID, visa, citizenship, passport (all emirates)', portal: 'https://icp.gov.ae', portal2: 'https://smartservices.icp.gov.ae', phone: '600 522 222', email: 'contactus@icp.gov.ae', notes: 'For all emirates except Dubai (use GDRFA for Dubai).' },
    { name: 'Amer Centres (GDRFA Authorized Service Centres)', short: 'Amer', category: 'Visa & Residency', services: 'Visa applications, renewals, status updates, typing', portal: 'https://gdrfad.gov.ae', portal2: '', phone: '800 5111', email: '', notes: 'Authorized Dubai GDRFA service centres. Multiple locations across Dubai.' },
    { name: 'Wafid (Medical Test Centres)', short: 'Wafid', category: 'Visa & Residency', services: 'Medical fitness test for visa', portal: 'https://wafid.com', portal2: '', phone: '600 525 252', email: '', notes: 'Mandatory medical test for residency visa.' },

    // ==================== LABOUR & EMPLOYMENT ====================
    { name: 'MOHRE (Ministry of Human Resources & Emiratisation)', short: 'MOHRE', category: 'Labour & Employment', services: 'Work permits, labour cards, employment contracts, complaints', portal: 'https://www.mohre.gov.ae', portal2: 'https://eservices.mohre.gov.ae', phone: '800 60', email: 'info@mohre.gov.ae', notes: 'All employer-employee matters.' },
    { name: 'Tasheel (MOHRE Authorized Service Centres)', short: 'Tas-heel', category: 'Labour & Employment', services: 'MOHRE applications, work permits, contract amendments', portal: 'https://www.tasheel.ae', portal2: '', phone: '800 665', email: '', notes: 'Authorized MOHRE service centres.' },
    { name: 'Tawjeeh (Worker Orientation)', short: 'Tawjeeh', category: 'Labour & Employment', services: 'Mandatory worker orientation, contract awareness session', portal: 'https://www.tawjeeh.ae', portal2: '', phone: '800 665', email: '', notes: 'Required for new visa applicants.' },
    { name: 'Tadbeer Centres (Domestic Workers)', short: 'Tadbeer', category: 'Labour & Employment', services: 'Domestic worker recruitment, sponsorship, contracts', portal: 'https://www.mohre.gov.ae', portal2: '', phone: '800 60', email: '', notes: 'For maids, cooks, drivers, nannies.' },

    // ==================== TAX ====================
    { name: 'FTA (Federal Tax Authority)', short: 'FTA', category: 'Tax', services: 'VAT registration, VAT returns, Corporate Tax, Excise tax', portal: 'https://tax.gov.ae', portal2: 'https://eservices.tax.gov.ae', phone: '600 599 994', email: 'info@tax.gov.ae', notes: 'Login via EmaraTax for all tax filings.' },
    { name: 'EmaraTax (FTA Portal)', short: 'EmaraTax', category: 'Tax', services: 'Online tax registration, returns, payments, refunds', portal: 'https://eservices.tax.gov.ae', portal2: '', phone: '600 599 994', email: 'info@tax.gov.ae', notes: 'Replaced the old e-Services portal in 2022.' },

    // ==================== TRADE LICENCE ====================
    { name: 'Dubai DET — Invest in Dubai', short: 'Invest in Dubai', category: 'Trade Licence', services: 'Trade name reservation, initial approval, licence issuance, renewals', portal: 'https://business.dubai.gov.ae', portal2: 'https://invest.dubai.gov.ae', phone: '600 545 555', email: 'info@dedc.gov.ae', notes: 'Dubai mainland licensing.' },
    { name: 'TAMM (Abu Dhabi Government Services)', short: 'TAMM', category: 'Trade Licence', services: 'All Abu Dhabi government services including trade licences', portal: 'https://www.tamm.abudhabi', portal2: '', phone: '800 555', email: 'info@tamm.abudhabi', notes: 'Single-window portal for Abu Dhabi government services.' },
    { name: 'Dubai Chamber of Commerce', short: 'Dubai Chamber', category: 'Trade Licence', services: 'Certificate of Origin, ATA Carnet, member services', portal: 'https://www.dubaichamber.com', portal2: '', phone: '+971 4 228 0000', email: 'customercare@dubaichamber.com', notes: 'Mandatory chamber membership for mainland trade licences.' },

    // ==================== ATTESTATION ====================
    { name: 'MOFA (Ministry of Foreign Affairs & International Cooperation)', short: 'MOFA', category: 'Attestation', services: 'Document attestation, certificate legalization', portal: 'https://www.mofa.gov.ae', portal2: 'https://www.mofaic.gov.ae', phone: '02 444 4488', email: 'info@mofa.gov.ae', notes: 'For UAE issued docs used abroad, and foreign docs used in UAE.' },
    { name: 'UAE Embassies (Outbound Attestation)', short: 'UAE Embassies', category: 'Attestation', services: 'Attestation of UAE documents at destination country', portal: 'https://www.mofa.gov.ae', portal2: '', phone: '', email: '', notes: 'For UAE documents to be used in foreign countries.' },
    { name: 'Notary Public (Dubai Courts)', short: 'Notary Public', category: 'Attestation', services: 'Document notarization, POAs, contracts, declarations', portal: 'https://www.dc.gov.ae', portal2: '', phone: '+971 4 334 7777', email: 'info@dc.gov.ae', notes: 'Both in-person and online (notary.dc.gov.ae).' },

    // ==================== PROPERTY & REAL ESTATE ====================
    { name: 'DLD (Dubai Land Department)', short: 'DLD', category: 'Property & Real Estate', services: 'Property registration, title deeds, Oqood, mortgages', portal: 'https://www.dubailand.gov.ae', portal2: 'https://dubairest.gov.ae', phone: '800 4488', email: 'info@dubailand.gov.ae', notes: 'All Dubai real estate transactions.' },
    { name: 'Ejari (Tenancy Contract Registration — Dubai)', short: 'Ejari', category: 'Property & Real Estate', services: 'Tenancy contract registration (mandatory for tenants/landlords)', portal: 'https://www.dubailand.gov.ae', portal2: '', phone: '800 4488', email: '', notes: 'Required for DEWA, visa renewals, schooling, etc.' },
    { name: 'RERA (Real Estate Regulatory Agency — Dubai)', short: 'RERA', category: 'Property & Real Estate', services: 'Real estate broker licensing, dispute resolution', portal: 'https://www.dubailand.gov.ae', portal2: '', phone: '800 4488', email: '', notes: 'Under DLD.' },

    // ==================== HEALTH ====================
    { name: 'DHA (Dubai Health Authority)', short: 'DHA', category: 'Health', services: 'Medical professional licensing, clinic licensing, insurance', portal: 'https://www.dha.gov.ae', portal2: 'https://services.dha.gov.ae', phone: '800 342', email: 'feedback@dha.gov.ae', notes: 'For all Dubai health-related licensing.' },
    { name: 'DOH (Department of Health — Abu Dhabi)', short: 'DOH', category: 'Health', services: 'Healthcare professional licensing in Abu Dhabi', portal: 'https://www.doh.gov.ae', portal2: '', phone: '800 50', email: 'info@doh.gov.ae', notes: 'Abu Dhabi equivalent of DHA.' },
    { name: 'MOHAP (Ministry of Health & Prevention)', short: 'MOHAP', category: 'Health', services: 'Healthcare licensing in northern emirates', portal: 'https://www.mohap.gov.ae', portal2: '', phone: '80011111', email: 'info@mohap.gov.ae', notes: 'For Sharjah, Ajman, RAK, Fujairah, UAQ.' },

    // ==================== TRANSPORT ====================
    { name: 'RTA (Roads & Transport Authority — Dubai)', short: 'RTA', category: 'Transport', services: 'Driving licence, vehicle registration, Salik, public transport', portal: 'https://www.rta.ae', portal2: '', phone: '8009090', email: 'ask@rta.ae', notes: 'All Dubai transport matters.' },
    { name: 'Tasjeel (Vehicle Testing — Emirates Driving Company)', short: 'Tasjeel', category: 'Transport', services: 'Vehicle inspection, registration, renewal', portal: 'https://www.tasjeel.ae', portal2: '', phone: '8002626', email: '', notes: 'Authorized RTA centres for vehicle services.' },
    { name: 'Abu Dhabi ITC (Integrated Transport Centre)', short: 'AD ITC', category: 'Transport', services: 'Abu Dhabi transport, driving licence, vehicle registration', portal: 'https://itc.gov.ae', portal2: '', phone: '+971 2 599 6000', email: '', notes: 'Abu Dhabi equivalent of RTA.' },

    // ==================== UTILITIES ====================
    { name: 'DEWA (Dubai Electricity & Water Authority)', short: 'DEWA', category: 'Utilities', services: 'Electricity & water connection, billing, smart meters', portal: 'https://www.dewa.gov.ae', portal2: '', phone: '991', email: 'customercare@dewa.gov.ae', notes: 'Dubai utilities.' },
    { name: 'ADDC (Abu Dhabi Distribution Company)', short: 'ADDC', category: 'Utilities', services: 'Electricity & water for Abu Dhabi', portal: 'https://www.addc.ae', portal2: '', phone: '800 2332', email: 'customercare@addc.ae', notes: 'Abu Dhabi utilities.' },
    { name: 'SEWA (Sharjah Electricity, Water & Gas)', short: 'SEWA', category: 'Utilities', services: 'Utilities for Sharjah', portal: 'https://www.sewa.gov.ae', portal2: '', phone: '991', email: 'cs@sewa.gov.ae', notes: 'Sharjah utilities (incl. gas).' },
    { name: 'FEWA (Federal Electricity & Water Authority)', short: 'FEWA', category: 'Utilities', services: 'Utilities for northern emirates', portal: 'https://www.fewa.gov.ae', portal2: '', phone: '991', email: 'fewainfo@fewa.gov.ae', notes: 'Ajman, RAK, Fujairah, UAQ.' },

    // ==================== OTHER ====================
    { name: 'Dubai Municipality', short: 'DM', category: 'Other', services: 'Trade name approval, food licences, building permits, signage', portal: 'https://www.dm.gov.ae', portal2: '', phone: '800 900', email: 'info@dm.gov.ae', notes: 'Municipal approvals & permits.' },
    { name: 'Dubai Police', short: 'Dubai Police', category: 'Other', services: 'Good conduct certificate, traffic fines, security clearances', portal: 'https://www.dubaipolice.gov.ae', portal2: '', phone: '901', email: 'mail@dubaipolice.gov.ae', notes: 'Use 999 for emergencies.' },
    { name: 'Civil Defence', short: 'Civil Defence', category: 'Other', services: 'Fire safety permits, building approvals', portal: 'https://www.dcd.gov.ae', portal2: '', phone: '997', email: '', notes: 'Required for new business premises.' },
    { name: 'UAE Pass', short: 'UAE Pass', category: 'Other', services: 'National digital identity, signing, login to all govt portals', portal: 'https://www.uaepass.ae', portal2: '', phone: '600 56 0000', email: 'info@uaepass.ae', notes: 'Essential for all online government services.' },
    { name: 'DubaiNow App (Smart Dubai)', short: 'DubaiNow', category: 'Other', services: 'Pay bills, fines, renew licences in one app', portal: 'https://dubainow.dubai.ae', portal2: '', phone: '800 9090', email: '', notes: '120+ Dubai government services on one mobile app.' },
];

function _renderLicCard(a) {
    const badgeCls = 'ref-badge-' + a.type.toLowerCase().replace(/[^a-z]/g, '');
    const phoneClean = (a.phone || '').replace(/[^+0-9]/g, '');
    return '<div class="ref-card">' +
        '<div class="ref-card-header">' +
            '<div>' +
                '<div class="ref-card-title">' + esc(a.name) + '</div>' +
                '<div class="ref-card-sub">' + esc(a.emirate) + ' &middot; ' + esc(a.sector) + '</div>' +
            '</div>' +
            '<span class="ref-badge ' + badgeCls + '">' + esc(a.type) + '</span>' +
        '</div>' +
        (a.notes ? '<div class="ref-line"><i class="fas fa-info-circle"></i>' + esc(a.notes) + '</div>' : '') +
        '<div class="ref-line"><i class="fas fa-globe"></i><a href="' + a.website + '" target="_blank">' + a.website.replace(/^https?:\/\//, '') + '</a></div>' +
        (a.phone ? '<div class="ref-line"><i class="fas fa-phone"></i>' + esc(a.phone) + '</div>' : '') +
        (a.email ? '<div class="ref-line"><i class="fas fa-envelope"></i><a href="mailto:' + a.email + '">' + esc(a.email) + '</a></div>' : '') +
        '<div class="ref-price">' +
            '<div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.4px;">New Licence &mdash; Approx. Range</div>' +
            '<div class="ref-price-amt">AED ' + a.priceMin.toLocaleString() + ' &ndash; ' + a.priceMax.toLocaleString() + '</div>' +
        '</div>' +
        '<div class="ref-actions">' +
            '<a class="btn-website" href="' + a.website + '" target="_blank"><i class="fas fa-arrow-up-right-from-square"></i> Website</a>' +
            (phoneClean ? '<a class="btn-call" href="tel:' + phoneClean + '"><i class="fas fa-phone"></i> Call</a>' : '') +
            (a.email ? '<a class="btn-email" href="mailto:' + a.email + '"><i class="fas fa-envelope"></i> Email</a>' : '') +
        '</div>' +
    '</div>';
}

function _renderProCard(p) {
    const phoneClean = (p.phone || '').replace(/[^+0-9]/g, '');
    return '<div class="ref-card">' +
        '<div class="ref-card-header">' +
            '<div>' +
                '<div class="ref-card-title">' + esc(p.name) + '</div>' +
                '<div class="ref-card-sub">' + esc(p.category) + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="ref-services"><strong>Services:</strong> ' + esc(p.services) + '</div>' +
        (p.notes ? '<div class="ref-line"><i class="fas fa-info-circle"></i>' + esc(p.notes) + '</div>' : '') +
        '<div class="ref-line"><i class="fas fa-globe"></i><a href="' + p.portal + '" target="_blank">' + p.portal.replace(/^https?:\/\//, '') + '</a></div>' +
        (p.portal2 ? '<div class="ref-line"><i class="fas fa-globe"></i><a href="' + p.portal2 + '" target="_blank">' + p.portal2.replace(/^https?:\/\//, '') + '</a></div>' : '') +
        (p.phone ? '<div class="ref-line"><i class="fas fa-phone"></i>' + esc(p.phone) + '</div>' : '') +
        (p.email ? '<div class="ref-line"><i class="fas fa-envelope"></i><a href="mailto:' + p.email + '">' + esc(p.email) + '</a></div>' : '') +
        '<div class="ref-actions">' +
            '<a class="btn-website" href="' + p.portal + '" target="_blank"><i class="fas fa-arrow-up-right-from-square"></i> Portal</a>' +
            (phoneClean ? '<a class="btn-call" href="tel:' + phoneClean + '"><i class="fas fa-phone"></i> Call</a>' : '') +
            (p.email ? '<a class="btn-email" href="mailto:' + p.email + '"><i class="fas fa-envelope"></i> Email</a>' : '') +
        '</div>' +
    '</div>';
}

function renderUaeReference() {
    // --- Licensing Authorities ---
    const licGrid = document.getElementById('uaeLicGrid');
    if (licGrid) {
        const search   = (document.getElementById('uaeLicSearch')?.value || '').toLowerCase();
        const emirate  = document.getElementById('uaeLicEmirate')?.value || '';
        const typeFlt  = document.getElementById('uaeLicType')?.value || '';
        const sortBy   = document.getElementById('uaeLicSort')?.value || 'emirate';

        let list = UAE_LICENSING_AUTHORITIES.slice();
        if (search) list = list.filter(a =>
            (a.name + ' ' + a.short + ' ' + a.sector + ' ' + a.emirate + ' ' + (a.notes || '')).toLowerCase().includes(search));
        if (emirate) list = list.filter(a => a.emirate === emirate);
        if (typeFlt) list = list.filter(a => a.type === typeFlt);

        if (sortBy === 'price-asc')       list.sort((a,b) => a.priceMin - b.priceMin);
        else if (sortBy === 'price-desc') list.sort((a,b) => b.priceMin - a.priceMin);
        else if (sortBy === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
        else /* emirate */                list.sort((a,b) => (a.emirate + a.name).localeCompare(b.emirate + b.name));

        licGrid.innerHTML = list.length
            ? list.map(_renderLicCard).join('')
            : '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-secondary);">No matching authorities found.</div>';
    }

    // --- PRO Services ---
    const proGrid = document.getElementById('uaeProGrid');
    if (proGrid) {
        const search   = (document.getElementById('uaeProSearch')?.value || '').toLowerCase();
        const category = document.getElementById('uaeProCategory')?.value || '';

        let list = UAE_PRO_SERVICES.slice();
        if (search) list = list.filter(p =>
            (p.name + ' ' + p.short + ' ' + p.services + ' ' + p.category + ' ' + (p.notes || '')).toLowerCase().includes(search));
        if (category) list = list.filter(p => p.category === category);

        proGrid.innerHTML = list.length
            ? list.map(_renderProCard).join('')
            : '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--text-secondary);">No matching services found.</div>';
    }
}
