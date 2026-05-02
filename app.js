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
    document.getElementById('quoteEditId').value = '';
    document.getElementById('quoteCustomer').value = '';
    document.getElementById('quoteSubject').value = '';
    document.getElementById('quoteStatus').value = 'Draft';
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
    const invoice = {
        number: invoiceNumber,
        date: document.getElementById('invDate').value,
        dueDate: document.getElementById('invDueDate').value,
        customerId, customerName: customer ? customer.name : 'Walk-in Customer',
        title: document.getElementById('invTitle').value.trim(),
        status: document.getElementById('invStatus').value,
        lines, subtotal: totals.subtotal, vat: totals.vat, vatRate: totals.vatRate, total: totals.total,
        notes: document.getElementById('invNotes').value.trim(),
        linkedQuote: document.getElementById('invLinkedQuote').value || ''
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
    document.getElementById('invEditId').value = '';
    document.getElementById('invNumber').value = (s.invPrefix || 'INV-') + (s.invNext || 1001);
    document.getElementById('invCustomer').value = '';
    document.getElementById('invTitle').value = '';
    document.getElementById('invStatus').value = 'Draft';
    document.getElementById('invNotes').value = '';
    document.getElementById('invVatRate').value = '0';
    document.getElementById('invoiceModalTitle').textContent = 'New Invoice';
    document.getElementById('invLineItemsBody').innerHTML = '<tr>' + getInvLineRowHtml('', 1, 0) + '</tr>';
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
        type: 'TAX INVOICE', doc: inv, settings: appData.settings,
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
    document.getElementById('poEditId').value = '';
    document.getElementById('poSupplier').value = '';
    document.getElementById('poStatus').value = 'Draft';
    document.getElementById('poPayTerms').value = 'Net 30';
    document.getElementById('poNotes').value = '';
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
    document.getElementById('expEditId').value = '';
    document.getElementById('expDesc').value = '';
    document.getElementById('expAmount').value = 0;
    document.getElementById('expVatIncl').value = 'no';
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
    document.getElementById('cmEditId').value = '';
    document.getElementById('cmReceipt').value = '';
    document.getElementById('cmCustomer').value = '';
    document.getElementById('cmDesc').value = '';
    document.getElementById('cmAmount').value = 0;
    document.getElementById('cmVatRate').value = '0';
    document.getElementById('cashMemoModalTitle').textContent = 'New Cash Memo';
}

function renderCashMemos() {
    let memos = [...(appData.cashMemos || [])];
    const search = (document.getElementById('cashMemoSearch')?.value || '').toLowerCase();
    const sortVal = document.getElementById('cashMemoSort')?.value || 'date-desc';
    if (search) memos = memos.filter(m => (m.receipt||'').toLowerCase().includes(search) || (m.customer||'').toLowerCase().includes(search) || (m.desc||'').toLowerCase().includes(search));
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

function exportPDF() {
    const el = document.getElementById('printableDoc');
    if (!el) { showToast('No document to export', 'error'); return; }
    const fileName = getDocFileName() + '.pdf';

    // Show loading
    showToast('Generating PDF...');

    // Clone the element so we can style it for export without affecting the modal
    const clone = el.cloneNode(true);
    clone.style.width = '800px';
    clone.style.margin = '0';
    clone.style.padding = '0';

    // Create a temporary container
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Apply print styles inline to the clone
    const styleEl = document.createElement('style');
    styleEl.textContent = getPrintStyles();
    wrapper.insertBefore(styleEl, clone);

    const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, width: 800 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(clone).save().then(() => {
        document.body.removeChild(wrapper);
        showToast('PDF downloaded: ' + fileName, 'success');
    }).catch(err => {
        document.body.removeChild(wrapper);
        showToast('PDF export failed: ' + err.message, 'error');
    });
}

function exportPDFBlob() {
    return new Promise((resolve, reject) => {
        const el = document.getElementById('printableDoc');
        if (!el) { reject('No document'); return; }

        const clone = el.cloneNode(true);
        clone.style.width = '800px';
        clone.style.margin = '0';
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.appendChild(clone);
        const styleEl = document.createElement('style');
        styleEl.textContent = getPrintStyles();
        wrapper.insertBefore(styleEl, clone);
        document.body.appendChild(wrapper);

        const opt = {
            margin: 0,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, width: 800 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(clone).outputPdf('blob').then(blob => {
            document.body.removeChild(wrapper);
            resolve(blob);
        }).catch(err => {
            document.body.removeChild(wrapper);
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
    body { font-family:'Inter',Arial,sans-serif; color:#333; font-size:12px; }
    .doc-preview { max-width:800px; margin:0 auto; }
    .doc-header-bar { background:linear-gradient(135deg,#2b49a6,#3361b5); color:#fff; padding:20px 30px; display:flex; justify-content:space-between; align-items:center; border-radius:0; }
    .doc-logo img { height:75px; border-radius:6px; }
    .doc-header-right { text-align:right; }
    .doc-type-title { font-size:26px; font-weight:700; letter-spacing:1px; }
    .doc-header-meta { font-size:12px; margin-top:3px; opacity:0.9; }
    .doc-parties { display:flex; justify-content:space-between; padding:20px 30px 15px; }
    .doc-party-col { width:48%; }
    .doc-align-right { text-align:right; }
    .doc-party-label { background:#3361b5; color:#fff; font-size:11px; font-weight:600; padding:5px 12px; display:inline-block; border-radius:3px; margin-bottom:8px; }
    .doc-party-name { font-size:13px; font-weight:700; margin-bottom:3px; }
    .doc-party-line { font-size:11px; color:#555; line-height:1.6; }
    .doc-table { width:calc(100% - 60px); margin:10px 30px; border-collapse:collapse; }
    .doc-table thead tr { background:#3361b5; color:#fff; }
    .doc-table th { padding:10px 12px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
    .th-desc { text-align:left; }
    .th-num { text-align:right; width:100px; }
    .doc-table td { padding:10px 12px; font-size:12px; border-bottom:1px solid #eee; }
    .td-desc { text-align:left; }
    .td-num { text-align:right; }
    .row-stripe { background:#f7f7f7; }
    .doc-totals-bar { display:flex; justify-content:flex-end; padding:0 30px; }
    .doc-totals-section { width:250px; }
    .doc-total-line { display:flex; justify-content:space-between; padding:6px 12px; font-size:12px; border-bottom:1px solid #eee; }
    .doc-total-grand { display:flex; justify-content:space-between; padding:10px 12px; font-size:14px; font-weight:700; background:#f5a623; color:#fff; border-radius:3px; margin-top:2px; }
    .doc-footer-section { display:flex; justify-content:space-between; padding:30px 30px 10px; margin-top:20px; }
    .doc-footer-col { width:48%; }
    .doc-footer-label { background:#3361b5; color:#fff; font-size:11px; font-weight:600; padding:5px 12px; display:inline-block; border-radius:3px; margin-bottom:8px; }
    .doc-footer-details { font-size:11px; color:#555; line-height:1.8; }
    .doc-thanks { text-align:center; font-size:14px; font-weight:600; color:#3361b5; margin:20px 0 8px; }
    .doc-terms { text-align:center; font-size:10px; color:#999; padding:0 30px 20px; line-height:1.5; }
    @media print { body{padding:0;} .doc-preview{max-width:100%;} }
    `;
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

    // Visit Visa — check BEFORE general visa rules so it gets its own bucket
    if (isVisa && isVisit) return 'Visit Visa';

    // Priority: cancellation first, then renewal, then new
    if (isVisa  && isCancel)   return 'Visa Cancellation';
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
