// Funciones para abrir y cerrar modales
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

// Funciones para editar y eliminar entrenadores
function editTrainer(trainerId) {
    alert(`Editar entrenador con ID: ${trainerId}`);
}

function deleteTrainer(trainerId) {
    if (confirm(`¿Estás seguro de eliminar al entrenador con ID: ${trainerId}?`)) {
        alert(`Entrenador con ID: ${trainerId} eliminado`);
    }
}

// Manejador del formulario para agregar entrenador
document.getElementById('addTrainerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Entrenador agregado correctamente');
    closeModal('addTrainerModal');
});