// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.sidebar li');
    const sections = document.querySelectorAll('.section-content');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Update active navigation item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            // Update page title
            pageTitle.textContent = this.querySelector('span:last-child').textContent;
        });
    });

    // Create income chart
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    const incomeChart = new Chart(incomeCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ingresos ($)',
                data: [12500, 13200, 14800, 13500, 15890, 16200, 15700, 16800, 17200, 16500, 18000, 19500],
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });

    // Create attendance chart
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    const attendanceChart = new Chart(attendanceCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Asistencias',
                data: [65, 78, 82, 75, 95, 55, 32],
                fill: false,
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Alert functionality
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.innerHTML = `
        <span class="alert-message">${message}</span>
        <span class="alert-close" onclick="this.parentElement.remove()">×</span>
    `;
    alertContainer.appendChild(alertElement);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 5000);
}

// Form submission handlers
function submitClientForm(event, formId) {
    event.preventDefault();
    const form = document.getElementById(formId);
    // Here you would typically send the data to a server
    
    // For demo purposes, show success message
    showAlert('success', 'Cliente guardado correctamente');
    closeModal(formId.replace('Form', 'Modal'));
}

function submitMembershipForm(event, formId) {
    event.preventDefault();
    const form = document.getElementById(formId);
    // Here you would typically send the data to a server
    
    // For demo purposes, show success message
    showAlert('success', 'Membresía guardada correctamente');
    closeModal(formId.replace('Form', 'Modal'));
}

function submitPaymentForm(event) {
    event.preventDefault();
    const clientId = document.getElementById('paymentClientId').value;
    const membership = document.getElementById('paymentMembership').value;
    
    if (!clientId || !membership) {
        showAlert('error', 'Por favor, complete todos los campos obligatorios');
        return;
    }
    
    // For demo purposes, show success message
    showAlert('success', 'Pago registrado correctamente');
}

// Search functionality
function searchClients() {
    const input = document.getElementById('clientSearch');
    const filter = input.value.toUpperCase();
    const table = document.querySelector('#clients table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const nameCol = rows[i].getElementsByTagName('td')[1];
        if (nameCol) {
            const txtValue = nameCol.textContent || nameCol.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Mock data handling - in a real application, this would connect to a backend
const mockClients = [
    { id: 1, name: 'Ana Martínez', email: 'ana@example.com', phone: '555-1234', membership: 'Premium', status: 'active' },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '555-5678', membership: 'Básico', status: 'inactive' },
    { id: 3, name: 'María López', email: 'maria@example.com', phone: '555-9012', membership: 'Estándar', status: 'active' },
    { id: 4, name: 'Juan Gómez', email: 'juan@example.com', phone: '555-3456', membership: 'Premium', status: 'active' },
    { id: 5, name: 'Laura Sánchez', email: 'laura@example.com', phone: '555-7890', membership: 'Básico', status: 'pending' }
];

function loadClients() {
    const tbody = document.querySelector('#clients table tbody');
    tbody.innerHTML = '';
    
    mockClients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.membership}</td>
            <td><span class="status ${client.status}">${client.status === 'active' ? 'Activo' : client.status === 'inactive' ? 'Vencido' : 'Por vencer'}</span></td>
            <td>
                <button class="btn btn-primary action-btn" onclick="editClient(${client.id})">Editar</button>
                <button class="btn btn-danger action-btn" onclick="deleteClient(${client.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editClient(id) {
    const client = mockClients.find(c => c.id === id);
    if (client) {
        // In a real application, you would populate the form with client data
        openModal('editClientModal');
    }
}

function deleteClient(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        // In a real application, you would send a delete request to the server
        showAlert('success', 'Cliente eliminado correctamente');
    }
}

// Reports functionality
function generateReport(reportType) {
    // In a real application, this would create reports based on backend data
    showAlert('success', `Reporte de ${reportType} generado correctamente`);
}
