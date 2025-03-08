document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.sidebar li');
    const sectionContainer = document.getElementById('section-container');
    const pageTitle = document.getElementById('page-title');

    // Función para cargar una sección
    function loadSection(sectionId) {
        fetch(`sections/${sectionId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar la sección');
                }
                return response.text();
            })
            .then(html => {
                sectionContainer.innerHTML = html;
                pageTitle.textContent = document.querySelector(`.sidebar li[data-section="${sectionId}"] span:last-child`).textContent;
            })
            .catch(error => {
                console.error('Error:', error);
                sectionContainer.innerHTML = `<p>Error al cargar la sección: ${sectionId}</p>`;
            });
    }

    // Cargar la sección inicial (Dashboard)
    loadSection('dashboard');

    // Manejar clics en los elementos del sidebar
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');

            // Actualizar el ítem activo en el sidebar
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Cargar la sección correspondiente
            loadSection(sectionId);
        });
    });

    // Función para abrir modales
    function openModal(modalId) {
        fetch(`modals/${modalId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el modal');
                }
                return response.text();
            })
            .then(html => {
                // Insertar el modal en el body
                document.body.insertAdjacentHTML('beforeend', html);

                // Mostrar el modal
                const modal = document.getElementById(modalId);
                modal.style.display = 'block';

                // Asignar eventos al modal recién creado
                assignModalEvents(modalId);
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('error', 'Error al cargar el modal');
            });
    }

    // Función para cerrar modales
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
        }
    }

    // Función para asignar eventos a los modales
    function assignModalEvents(modalId) {
        const modal = document.getElementById(modalId);

        // Cerrar el modal al hacer clic en la "X"
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => closeModal(modalId));
        }

        // Cerrar el modal al hacer clic fuera del contenido
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modalId);
            }
        });

        // Asignar eventos de envío de formularios
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                submitForm(event, modalId);
            });
        }
    }

    // Función para manejar el envío de formularios
    function submitForm(event, modalId) {
        const form = event.target;
        const formData = new FormData(form);

        // Aquí puedes enviar los datos a un servidor o manejarlos localmente
        console.log('Datos del formulario:', Object.fromEntries(formData.entries()));

        // Mostrar mensaje de éxito
        showAlert('success', 'Formulario enviado correctamente');

        // Cerrar el modal
        closeModal(modalId);
    }

    // Función para mostrar alertas
    function showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.innerHTML = `
            <span class="alert-message">${message}</span>
            <span class="alert-close" onclick="this.parentElement.remove()">×</span>
        `;
        alertContainer.appendChild(alertElement);

        // Auto-dismiss después de 5 segundos
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }

    // Asignar eventos a los botones que abren modales
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-primary') && event.target.hasAttribute('onclick')) {
            const modalId = event.target.getAttribute('onclick').match(/openModal\('(.*)'\)/)[1];
            openModal(modalId);
        }
    });
});

function loadSection(sectionId) {
    console.log(`Cargando sección: ${sectionId}`);
    fetch(`sections/${sectionId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar la sección: ${sectionId}`);
            }
            return response.text();
        })
        .then(html => {
            console.log(`Sección cargada: ${sectionId}`);
            document.getElementById('section-container').innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            document.getElementById('section-container').innerHTML = `<p>Error al cargar la sección: ${sectionId}</p>`;
        });
}