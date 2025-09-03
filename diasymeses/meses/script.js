document.addEventListener('DOMContentLoaded', () => {
    const monthsData = [
        { spanish: 'Enero', english: 'January' },
        { spanish: 'Febrero', english: 'February' },
        { spanish: 'Marzo', english: 'March' },
        { spanish: 'Abril', english: 'April' },
        { spanish: 'Mayo', english: 'May' },
        { spanish: 'Junio', english: 'June' },
        { spanish: 'Julio', english: 'July' },
        { spanish: 'Agosto', english: 'August' },
        { spanish: 'Septiembre', english: 'September' },
        { spanish: 'Octubre', english: 'October' },
        { spanish: 'Noviembre', english: 'November' },
        { spanish: 'Diciembre', english: 'December' }
    ];

    const spanishDraggablesDiv = document.getElementById('spanish-draggables');
    const englishTargetsDiv = document.getElementById('english-targets');
    const messageBox = document.getElementById('message');

    // --- Generar meses en inglés (ordenados) ---
    monthsData.forEach(month => {
        const target = document.createElement('div');
        target.classList.add('drop-target');
        target.textContent = month.english;
        target.dataset.target = month.english; // Para la verificación
        englishTargetsDiv.appendChild(target);
    });

    // --- Generar meses en español (aleatorios y arrastrables) ---
    // Clonar el array y mezclarlo para los arrastrables
    const shuffledMonthsData = [...monthsData];
    shuffleArray(shuffledMonthsData);

    shuffledMonthsData.forEach(month => {
        const item = document.createElement('div');
        item.classList.add('month-item');
        item.textContent = month.spanish;
        item.setAttribute('draggable', true);
        item.dataset.match = month.english; // El valor con el que debe coincidir
        spanishDraggablesDiv.appendChild(item);
    });

    // --- Lógica de Arrastrar y Soltar ---
    let draggedItem = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('month-item')) {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', draggedItem.dataset.match); // Pasa el English month como dato
            
            // Oculta el item arrastrado suavemente
            setTimeout(() => {
                draggedItem.style.opacity = '0.4';
            }, 0);
        }
    });

    document.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.style.opacity = '1'; // Restaura la opacidad
            draggedItem = null;
        }
    });

    // Permite que las zonas de destino reciban el elemento
    englishTargetsDiv.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necesario para permitir el 'drop'
        const dropTarget = e.target.closest('.drop-target');
        if (dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#ff4500'; // Resaltar el borde al pasar por encima
        }
    });

    englishTargetsDiv.addEventListener('dragleave', (e) => {
        const dropTarget = e.target.closest('.drop-target');
        if (dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#b0c4de'; // Restaurar el borde
        }
    });

    englishTargetsDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('.drop-target');

        if (draggedItem && dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#b0c4de'; // Restaurar el borde
            const draggedMonthEnglish = e.dataTransfer.getData('text/plain'); // El mes en inglés que trae el arrastrable
            const targetEnglish = dropTarget.dataset.target; // El mes en inglés del destino

            if (draggedMonthEnglish === targetEnglish) {
                dropTarget.textContent = draggedItem.textContent; // Muestra el mes en español en el destino
                dropTarget.classList.add('correct');
                draggedItem.remove(); // Elimina el elemento arrastrado
                showMessage('¡Muy bien! 🎉', '#3cb371'); // Verde
            } else {
                showMessage('¡Oops! Intenta de nuevo. 😔', '#ff6347'); // Naranja rojizo
            }
        }
    });

    // Función para mezclar un array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showMessage(text, color) {
        messageBox.textContent = text;
        messageBox.style.color = color;
        // Limpiar el mensaje después de un tiempo
        setTimeout(() => {
            messageBox.textContent = '';
        }, 2500);
    }
});