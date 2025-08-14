/*
================================================================================
|                                                                              |
|                      UNIFIED JAVASCRIPT LOGIC (scripts.js)                     |
|                                                                              |
================================================================================
|                                                                              |
| This file merges the logic from app.js, scripts.js, and apptrainers.js.      |
| It follows a Single Page Application (SPA) model where sections are          |
| dynamically loaded. Data is persisted using localStorage.                    |
|                                                                              |
|------------------------------------------------------------------------------|
| SECTIONS:                                                                    |
|   1. Core App & Navigation                                                   |
|   2. Data Management (localStorage)                                          |
|   3. UI & Modals                                                             |
|   4. Chart Initialization                                                    |
|   5. Entity-Specific Logic (Clients, Memberships, etc.)                      |
|   6. Event Listeners                                                         |
--------------------------------------------------------------------------------
*/

// =============================================================================
// 1. CORE APP & NAVIGATION
// =============================================================================

const sections = {
    'dashboard': 'sections/dashboard.html',
    'clients': 'sections/clients.html',
    'memberships': 'sections/memberships.html',
    'attendance': 'sections/attendance.html',
    'payments': 'sections/payments.html',
    'trainers': 'sections/trainers.html',
    'reports': 'sections/reports.html',
    'settings': 'sections/settings.html'
};

/**
 * Loads a section dynamically into the main content area.
 * @param {string} sectionName - The name of the section to load.
 */
async function loadSection(sectionName) {
    try {
        const sectionContainer = document.getElementById('section-container');
        if (!sectionContainer) throw new Error('Section container not found');

        if (sections[sectionName]) {
            const response = await fetch(sections[sectionName]);
            if (!response.ok) throw new Error(`Failed to load section: ${response.statusText}`);

            sectionContainer.innerHTML = await response.text();

            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
            }

            updateActiveSidebarItem(sectionName);
            initSection(sectionName); // Initialize logic for the loaded section

            console.log(`Section "${sectionName}" loaded successfully.`);
        } else {
            showAlert('error', `Section "${sectionName}" does not exist.`);
        }
    } catch (error) {
        console.error('Error loading section:', error);
        showAlert('error', 'Could not load the requested section.');
    }
}

/**
 * Initializes charts, tables, and event listeners for a given section.
 * @param {string} sectionName - The name of the section to initialize.
 */
function initSection(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            initDashboardCharts();
            updateDashboardCounts();
            break;
        case 'clients':
            initClientCharts();
            loadClientsTable();
            initClientEventListeners();
            break;
        case 'memberships':
            loadMembershipsTable();
            initMembershipEventListeners();
            break;
        case 'trainers':
            loadTrainersTable();
            initTrainerEventListeners();
            break;
        case 'attendance':
            loadAttendanceTable();
            initAttendanceEventListeners();
            break;
        // Add cases for other sections as they are developed
    }
}


/**
 * Updates the 'active' class on the sidebar navigation items.
 * @param {string} sectionName - The currently active section.
 */
function updateActiveSidebarItem(sectionName) {
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
}


// =============================================================================
// 2. DATA MANAGEMENT (localStorage)
// =============================================================================

/**
 * Retrieves all gym data from localStorage.
 * @returns {object} The gym data object.
 */
function getGymData() {
    const defaultData = {
        clients: [],
        trainers: [],
        memberships: [],
        attendance: [],
        payments: [],
        counters: { clients: 0, trainers: 0, memberships: 0, attendance: 0, payments: 0 }
    };
    try {
        const data = JSON.parse(localStorage.getItem("gymData"));
        return data || defaultData;
    } catch (e) {
        return defaultData;
    }
}

/**
 * Saves the gym data object to localStorage.
 * @param {object} data - The gym data to save.
 */
function saveGymData(data) {
    localStorage.setItem("gymData", JSON.stringify(data));
}

/**
 * Generates a new unique ID for a given entity type.
 * @param {string} entity - The type of entity (e.g., 'clients', 'trainers').
 * @returns {number} The new unique ID.
 */
function generateId(entity) {
    let data = getGymData();
    data.counters[entity] = (data.counters[entity] || 0) + 1;
    saveGymData(data);
    return data.counters[entity];
}

// =============================================================================
// 3. UI & MODALS
// =============================================================================

/**
 * Displays an alert message at the top of the page.
 * @param {string} type - The type of alert ('success', 'error', 'warning').
 * @param {string} message - The message to display.
 */
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <span class="alert-message">${message}</span>
        <span class="alert-close" onclick="this.parentElement.remove()">&times;</span>
    `;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => alertDiv.remove(), 5000);
}

/**
 * Opens a modal dialog.
 * @param {string} modalId - The ID of the modal to open.
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Closes a modal dialog.
 * @param {string} modalId - The ID of the modal to close.
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}


// =============================================================================
// 4. CHART INITIALIZATION
// =============================================================================

function initDashboardCharts() {
    const incomeCtx = document.getElementById('incomeChart');
    if (incomeCtx) {
        // Dummy data for now
        new Chart(incomeCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ingresos ($)',
                    data: [1250, 1800, 1600, 2100, 1900, 2400],
                    borderColor: '#4CAF50',
                    tension: 0.4,
                    fill: true
                }]
            }
        });
    }

    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        // Placeholder, as attendance data is not fully implemented
        new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Clientes por día',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Asistencia (Datos de demostración)'
                    }
                }
            }
        });
    }
}

function initClientCharts() {
    const data = getGymData();
    const membershipCtx = document.getElementById('membershipDistributionChart');
    if (membershipCtx) {
        const membershipCounts = data.memberships.map(m => ({
            name: m.name,
            count: data.clients.filter(c => c.membership_id === m.id).length
        }));

        new Chart(membershipCtx, {
            type: 'pie',
            data: {
                labels: membershipCounts.map(m => m.name),
                datasets: [{
                    data: membershipCounts.map(m => m.count),
                    backgroundColor: ['#ff9f40', '#36a2eb', '#9966ff', '#ff6384', '#4bc0c0']
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de membresías'
                    }
                }
            }
        });
    }
}

// =============================================================================
// 5. ENTITY-SPECIFIC LOGIC
// =============================================================================

// ---------- Dashboard ----------
function updateDashboardCounts() {
    const data = getGymData();
    const clientCountEl = document.getElementById("client-count");
    if(clientCountEl) clientCountEl.innerText = data.clients.length;
}


// ---------- Clients ----------
function loadClientsTable(clientsToRender) {
    const data = getGymData();
    const clients = clientsToRender || data.clients;
    const tableBody = document.getElementById("clients-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    if (clients.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='8'>No se encontraron clientes con los filtros aplicados.</td></tr>";
        return;
    }

    clients.forEach(client => {
        const membership = getMembershipById(client.membership_id) || { name: 'N/A' };
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${membership.name}</td>
            <td>${client.start_date}</td>
            <td><span class="status active">Activo</span></td>
            <td>
                <button class="btn btn-primary action-btn" onclick="editClient(${client.id})">Editar</button>
                <button class="btn btn-danger action-btn" onclick="deleteClient(${client.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function filterClients() {
    const data = getGymData();
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();

    const filteredClients = data.clients.filter(client => {
        const nameMatch = client.name.toLowerCase().includes(searchTerm);
        const emailMatch = client.email.toLowerCase().includes(searchTerm);
        const phoneMatch = client.phone.includes(searchTerm);
        return nameMatch || emailMatch || phoneMatch;
    });

    loadClientsTable(filteredClients);
}

function deleteClient(clientId) {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    let data = getGymData();
    data.clients = data.clients.filter(c => c.id !== clientId);
    saveGymData(data);
    loadClientsTable();
    updateDashboardCounts();
    showAlert('success', 'Cliente eliminado correctamente.');
}

function editClient(clientId) {
    // Placeholder - will be implemented later
    showAlert('info', `Funcionalidad para editar cliente #${clientId} no implementada.`);
}

// ---------- Memberships ----------
function loadMembershipsTable() {
    const data = getGymData();
    const tableBody = document.getElementById("memberships-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    if (data.memberships.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No hay membresías para mostrar.</td></tr>";
        return;
    }

    data.memberships.forEach(m => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.description}</td>
            <td>${m.duration} días</td>
            <td>$${m.price}</td>
            <td>
                <button class="btn btn-danger action-btn" onclick="deleteMembership(${m.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteMembership(membershipId) {
    if (!confirm("¿Seguro que deseas eliminar esta membresía?")) return;
    let data = getGymData();
    const isAssigned = data.clients.some(c => c.membership_id === membershipId);
    if (isAssigned) {
        showAlert('error', 'No se puede eliminar una membresía asignada a un cliente.');
        return;
    }
    data.memberships = data.memberships.filter(m => m.id !== membershipId);
    saveGymData(data);
    loadMembershipsTable();
    showAlert('success', 'Membresía eliminada correctamente.');
}

function getMembershipById(id) {
    return getGymData().memberships.find(m => m.id === id);
}

// ---------- Trainers ----------
function loadTrainersTable() {
     const data = getGymData();
    const tableBody = document.getElementById("trainers-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    if (data.trainers.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No hay entrenadores para mostrar.</td></tr>";
        return;
    }
    // Placeholder for trainer table rendering
}

function deleteTrainer(trainerId) {
     if (!confirm("¿Seguro que deseas eliminar este entrenador?")) return;
     // Placeholder
     showAlert('success', `Entrenador #${trainerId} eliminado.`);
}

// ---------- Attendance ----------
function loadAttendanceTable() {
    const data = getGymData();
    const tableBody = document.getElementById("attendance-table-body");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    if (data.attendance.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6'>No hay registros de asistencia.</td></tr>";
    }
    // Placeholder for attendance table rendering
}


// =============================================================================
// 6. EVENT LISTENERS
// =============================================================================

function initClientEventListeners() {
    const addClientBtn = document.getElementById("add-client-btn");
    if (addClientBtn) {
        addClientBtn.addEventListener("click", () => openModal("addClientModal"));
    }

    const clientForm = document.getElementById("addClientForm");
    if (clientForm) {
        clientForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = getGymData();
            const newClient = {
                id: generateId("clients"),
                name: document.getElementById("clientName").value,
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                membership_id: parseInt(document.getElementById("clientMembership").value),
                start_date: new Date().toISOString().split('T')[0],
            };
            data.clients.push(newClient);
            saveGymData(data);
            loadClientsTable();
            updateDashboardCounts();
            closeModal("addClientModal");
            showAlert('success', 'Cliente agregado correctamente.');
            clientForm.reset();
        });
    }

    const searchInput = document.getElementById('clientSearch');
    if(searchInput) {
        searchInput.addEventListener('keyup', filterClients);
    }
}

function initMembershipEventListeners() {
    const addMembershipBtn = document.getElementById("add-membership-btn");
    if(addMembershipBtn) {
        addMembershipBtn.addEventListener("click", () => openModal("addMembershipModal"));
    }

    const membershipForm = document.getElementById("addMembershipForm");
    if(membershipForm) {
        membershipForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = getGymData();
            const newMembership = {
                id: generateId("memberships"),
                name: document.getElementById("membershipName").value,
                description: document.getElementById("membershipDescription").value,
                duration: parseInt(document.getElementById("membershipDuration").value),
                price: parseFloat(document.getElementById("membershipPrice").value)
            };
            data.memberships.push(newMembership);
            saveGymData(data);
            loadMembershipsTable();
            closeModal("addMembershipModal");
            showAlert('success', 'Membresía agregada correctamente.');
            membershipForm.reset();
        });
    }
}

function initTrainerEventListeners() {
     const addTrainerBtn = document.getElementById("add-trainer-btn");
    if(addTrainerBtn) {
        addTrainerBtn.addEventListener("click", () => openModal("addTrainerModal"));
    }
    // Add form submission logic
}

function initAttendanceEventListeners() {
    const addAttendanceBtn = document.getElementById("add-attendance-btn");
    if(addAttendanceBtn) {
        addAttendanceBtn.addEventListener("click", () => openModal("addAttendanceModal"));
    }
    // Add form submission logic
}


/**
 * Main initialization logic on DOM content loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set up sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            if (sectionName) {
                loadSection(sectionName);
            }
        });
    });

    // Set up modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Load the initial dashboard section
    loadSection('dashboard');
});
