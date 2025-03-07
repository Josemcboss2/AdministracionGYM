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
});