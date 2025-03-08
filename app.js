// Definición de las secciones disponibles
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

// Función para cargar una sección
async function loadSection(sectionName) {
    try {
        const sectionContainer = document.getElementById('section-container');
        if (!sectionContainer) {
            throw new Error('El contenedor de secciones no existe');
        }

        if (sections[sectionName]) {
            // Actualizar el título de la página
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
            }

            // Cargar el contenido de la sección
            const response = await fetch(sections[sectionName]);
            if (!response.ok) {
                throw new Error(`Error al cargar la sección: ${response.statusText}`);
            }

            const content = await response.text();
            sectionContainer.innerHTML = content;

            // Inicializar gráficos específicos
            if (sectionName === 'dashboard') {
                initDashboardCharts();
            } else if (sectionName === 'clients') {
                initClientCharts();
            }

            // Actualizar la clase activa en el sidebar
            updateActiveSidebarItem(sectionName);

            console.log(`Sección "${sectionName}" cargada correctamente`);
        } else {
            showAlert('error', `La sección "${sectionName}" no existe`);
        }
    } catch (error) {
        console.error('Error al cargar la sección:', error);
        showAlert('error', 'No se pudo cargar la sección');
    }
}

// Función para actualizar el elemento activo en el sidebar
function updateActiveSidebarItem(sectionName) {
    const sidebarItems = document.querySelectorAll('.sidebar li');
    if (sidebarItems.length === 0) {
        console.error('No se encontraron elementos en el sidebar');
        return;
    }

    sidebarItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(`.sidebar li[data-section="${sectionName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Event listener para los elementos del sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Cargar inicialmente la sección dashboard
    loadSection('dashboard');

    // Añadir event listener para cada elemento del sidebar
    const sidebarItems = document.querySelectorAll('.sidebar li');
    if (sidebarItems.length === 0) {
        console.error('No se encontraron elementos en el sidebar');
        return;
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.getAttribute('data-section');
            if (sectionName) {
                loadSection(sectionName);
            }
        });
    });
});
// Función para mostrar alertas
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <span class="alert-message">${message}</span>
        <span class="alert-close" onclick="this.parentElement.remove()">&times;</span>
    `;
    alertContainer.appendChild(alertDiv);
    
    // Auto-cerrar la alerta después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Función para inicializar los gráficos del dashboard
function initDashboardCharts() {
    // Gráfico de ingresos mensuales
    const incomeCtx = document.getElementById('incomeChart');
    if (incomeCtx) {
        new Chart(incomeCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ingresos ($)',
                    data: [1250, 1800, 1600, 2100, 1900, 2400],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de asistencia diaria
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Clientes por día',
                    data: [65, 59, 80, 81, 56, 40, 30],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Función para inicializar los gráficos de la sección de clientes
function initClientCharts() {
    // Gráfico de distribución de membresías
    const membershipCtx = document.getElementById('membershipDistributionChart');
    if (membershipCtx) {
        new Chart(membershipCtx, {
            type: 'pie',
            data: {
                labels: ['Básico', 'Estándar', 'Premium'],
                datasets: [{
                    data: [120, 85, 40],
                    backgroundColor: [
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgb(255, 159, 64)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    // Gráfico de nuevos clientes por mes
    const newClientsCtx = document.getElementById('newClientsChart');
    if (newClientsCtx) {
        new Chart(newClientsCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Nuevos clientes',
                    data: [15, 12, 18, 8, 10, 12],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Función para abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Función para cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Manejador para enviar recordatorios a clientes
function sendReminderEmail(clientId) {
    showAlert('success', `Recordatorio enviado al cliente #${clientId}`);
}

// Manejador para enviar recordatorios a todos los clientes por vencer
function sendReminderToAll() {
    showAlert('success', 'Recordatorios enviados a todos los clientes');
}

// Manejador para confirmar eliminación de cliente
function confirmDelete(clientId) {
    if (confirm(`¿Está seguro de eliminar al cliente #${clientId}?`)) {
        showAlert('success', `Cliente #${clientId} eliminado correctamente`);
    }
}

// Manejador para registrar pagos
function registerPayment() {
    const clientId = document.getElementById('paymentClientId').value;
    const amount = document.getElementById('paymentAmount').value;
    
    if (!clientId || !amount) {
        showAlert('error', 'Por favor complete los campos requeridos');
        return;
    }
    
    showAlert('success', 'Pago registrado correctamente');
}

// Manejador para filtrar pagos
function filterPayments() {
    const filter = document.getElementById('paymentFilter').value;
    console.log(`Filtrando pagos por: ${filter}`);
    // Aquí iría la lógica para filtrar los pagos
}

// Manejador para generar reportes
function generateReport(reportType) {
    if (!reportType) {
        showAlert('error', 'Por favor seleccione un tipo de reporte');
        return;
    }
    
    showAlert('success', `Generando reporte de ${reportType}...`);
    // Aquí iría la lógica para generar el reporte
}

// Manejador para guardar configuraciones
function saveSettings(settingsType) {
    showAlert('success', `Configuración de ${settingsType} guardada correctamente`);
}

// Manejador para crear respaldo
function createBackup() {
    showAlert('success', 'Respaldo creado correctamente');
}

// Manejador para las pestañas en configuración
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('tab')) {
        const tabId = e.target.getAttribute('data-tab');
        const tabContainer = e.target.closest('.tabs').parentElement;
        
        // Remover clase active de todas las pestañas
        tabContainer.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remover clase active de todos los contenidos
        tabContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Añadir clase active a la pestaña seleccionada
        e.target.classList.add('active');
        
        // Añadir clase active al contenido seleccionado
        const tabContent = tabContainer.querySelector(`#${tabId}`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
});

