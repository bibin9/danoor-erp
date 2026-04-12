// ==================== DANOOR ERP - Firebase Configuration ====================

const firebaseConfig = {
    apiKey: "AIzaSyD75nbG3jYvh4dvymzX2c_R0BqFIcU-dd0",
    authDomain: "danoor-erp.firebaseapp.com",
    projectId: "danoor-erp",
    storageBucket: "danoor-erp.firebasestorage.app",
    messagingSenderId: "910887837933",
    appId: "1:910887837933:web:375dd817109c7e66fb2ce4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore (works offline too!)
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    if (err.code === 'failed-precondition') {
        console.log('Persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
        console.log('Persistence not available in this browser');
    }
});

// ==================== AUTH FUNCTIONS ====================
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('authError');
    errorEl.style.display = 'none';

    if (!email || !password) { showAuthError('Please enter email and password'); return; }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => { /* onAuthStateChanged handles the rest */ })
        .catch(err => showAuthError(getAuthErrorMessage(err.code)));
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    const errorEl = document.getElementById('authError');
    errorEl.style.display = 'none';

    if (!name || !email || !password) { showAuthError('Please fill all fields'); return; }
    if (password.length < 6) { showAuthError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { showAuthError('Passwords do not match'); return; }

    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            // Update display name
            return cred.user.updateProfile({ displayName: name }).then(() => {
                // Create user document in Firestore
                return db.collection('users').doc(cred.user.uid).set({
                    name: name,
                    email: email,
                    role: 'admin', // First user is admin
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        })
        .then(() => { /* onAuthStateChanged handles the rest */ })
        .catch(err => showAuthError(getAuthErrorMessage(err.code)));
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.signOut();
    }
}

function handleResetPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) { showAuthError('Enter your email first, then click Reset'); return; }
    auth.sendPasswordResetEmail(email)
        .then(() => showAuthError('Password reset email sent! Check your inbox.', 'success'))
        .catch(err => showAuthError(getAuthErrorMessage(err.code)));
}

function showAuthError(msg, type = 'error') {
    const el = document.getElementById('authError');
    el.textContent = msg;
    el.style.display = 'block';
    el.style.background = type === 'success' ? '#e8f5e9' : '#fce4ec';
    el.style.color = type === 'success' ? '#2e7d32' : '#c62828';
}

function getAuthErrorMessage(code) {
    const messages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again',
        'auth/network-request-failed': 'Network error. Check your internet connection'
    };
    return messages[code] || 'Authentication error. Please try again.';
}

function toggleAuthMode() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTitle = document.getElementById('authTitle');
    const authToggleText = document.getElementById('authToggleText');
    const errorEl = document.getElementById('authError');
    errorEl.style.display = 'none';

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = 'Create Account';
        authToggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode();return false;">Login</a>';
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authTitle.textContent = 'Login to Danoor ERP';
        authToggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode();return false;">Sign Up</a>';
    }
}

// ==================== AUTH STATE LISTENER ====================
auth.onAuthStateChanged(user => {
    if (user) {
        // User is logged in
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appShell').style.display = 'flex';
        document.getElementById('currentUserName').textContent = user.displayName || user.email;
        document.getElementById('currentUserEmail').textContent = user.email;

        // Initialize app data from Firestore
        initFirestoreListeners();
        // Check daily backup after data loads
        setTimeout(() => { try { checkAutoBackup(); updateBackupStatus(); } catch(e){} }, 5000);
    } else {
        // User is logged out
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appShell').style.display = 'none';

        // Detach Firestore listeners
        detachListeners();
    }
});

// ==================== FIRESTORE DATA LAYER ====================
// In-memory data cache (populated by Firestore listeners)
const appData = {
    settings: {},
    contacts: [],
    services: [],
    quotations: [],
    invoices: [],
    purchases: [],
    inventory: [],
    employees: [],
    expenses: [],
    journalEntries: [],
    payrollRuns: [],
    cashMemos: [],
    itemMaster: [],
    coa: []
};

// Store unsubscribe functions for listeners
let unsubscribers = [];

function initFirestoreListeners() {
    // Settings (single document)
    const unsub1 = db.collection('config').doc('settings').onSnapshot(doc => {
        if (doc.exists) {
            appData.settings = doc.data();
        } else {
            // First time: create default settings
            const defaults = {
                companyName: 'Danoor Services',
                businessType: 'Document Clearing Services',
                trn: '100000000000000',
                license: '', address: '', phone: '', email: '',
                fyStart: '01',
                quotePrefix: 'QT-', quoteNext: 1001,
                invPrefix: 'INV-', invNext: 1001,
                poPrefix: 'PO-', poNext: 1001
            };
            db.collection('config').doc('settings').set(defaults);
            appData.settings = defaults;
        }
        loadSettingsUI();
    });
    unsubscribers.push(unsub1);

    // COA (Chart of Accounts)
    const unsub2 = db.collection('coa').orderBy('code').onSnapshot(snap => {
        if (snap.empty && appData.coa.length === 0) {
            // First time: seed default COA
            const batch = db.batch();
            DEFAULT_COA.forEach(a => {
                const ref = db.collection('coa').doc(a.code);
                batch.set(ref, a);
            });
            batch.commit();
            return;
        }
        appData.coa = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
        renderCOA();
    });
    unsubscribers.push(unsub2);

    // Services
    const unsub3 = db.collection('services').orderBy('code').onSnapshot(snap => {
        if (snap.empty && appData.services.length === 0) {
            // Seed default services
            const batch = db.batch();
            DEFAULT_SERVICES.forEach(s => {
                const ref = db.collection('services').doc(s.id);
                batch.set(ref, s);
            });
            batch.commit();
            return;
        }
        appData.services = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
        renderServices();
    });
    unsubscribers.push(unsub3);

    // Generic collection listeners
    const collections = [
        { name: 'contacts', key: 'contacts', render: renderContacts },
        { name: 'quotations', key: 'quotations', render: renderQuotations },
        { name: 'invoices', key: 'invoices', render: renderInvoices },
        { name: 'purchases', key: 'purchases', render: renderPurchases },
        { name: 'inventory', key: 'inventory', render: renderInventory },
        { name: 'employees', key: 'employees', render: renderEmployees },
        { name: 'expenses', key: 'expenses', render: renderExpenses },
        { name: 'journalEntries', key: 'journalEntries', render: renderJournal },
        { name: 'payrollRuns', key: 'payrollRuns', render: renderPayroll },
        { name: 'cashMemos', key: 'cashMemos', render: renderCashMemos },
        { name: 'itemMaster', key: 'itemMaster', render: renderItemMaster },
    ];

    collections.forEach(col => {
        const unsub = db.collection(col.name).onSnapshot(snap => {
            appData[col.key] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            try { col.render(); } catch (e) { }
            try { updateDashboard(); } catch (e) { }
        });
        unsubscribers.push(unsub);
    });

    // Initial dashboard render after a short delay
    setTimeout(() => {
        try { updateDashboard(); renderPnL(); } catch (e) { }
    }, 1500);
}

function detachListeners() {
    unsubscribers.forEach(unsub => unsub());
    unsubscribers = [];
    // Clear in-memory data
    Object.keys(appData).forEach(k => {
        appData[k] = Array.isArray(appData[k]) ? [] : {};
    });
}

// ==================== FIRESTORE CRUD HELPERS ====================
function fsAdd(collection, data) {
    // Remove undefined fields
    Object.keys(data).forEach(k => { if (data[k] === undefined) delete data[k]; });
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    data.createdBy = auth.currentUser ? (auth.currentUser.displayName || auth.currentUser.email) : '';
    return db.collection(collection).add(data);
}

function fsUpdate(collection, docId, data) {
    Object.keys(data).forEach(k => { if (data[k] === undefined) delete data[k]; });
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    return db.collection(collection).doc(docId).update(data);
}

function fsDelete(collection, docId) {
    return db.collection(collection).doc(docId).delete();
}

function fsSet(collection, docId, data) {
    Object.keys(data).forEach(k => { if (data[k] === undefined) delete data[k]; });
    return db.collection(collection).doc(docId).set(data, { merge: true });
}

// ==================== DATA ACCESS (replaces old getData/setData) ====================
function getData(key, fallback) {
    if (key === 'settings') return appData.settings || fallback || {};
    return appData[key] || fallback || [];
}

function setData(key, val) {
    // This is kept for backward compatibility but Firestore handles persistence now
    appData[key] = val;
}

// Settings update goes directly to Firestore
function saveSettingsToFirestore(settings) {
    return db.collection('config').doc('settings').set(settings);
}

// Increment counters atomically
function incrementCounter(field) {
    return db.collection('config').doc('settings').update({
        [field]: firebase.firestore.FieldValue.increment(1)
    });
}
