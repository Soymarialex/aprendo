document.addEventListener('DOMContentLoaded', () => {
    const daysData = [
        { spanish: 'Lunes', english: 'Monday' },
        { spanish: 'Martes', english: 'Tuesday' },
        { spanish: 'Miércoles', english: 'Wednesday' },
        { spanish: 'Jueves', english: 'Thursday' },
        { spanish: 'Viernes', english: 'Friday' },
        { spanish: 'Sábado', english: 'Saturday' },
        { spanish: 'Domingo', english: 'Sunday' }
    ];

    const spanishDraggablesDiv = document.getElementById('spanish-draggables');
    const englishTargetsDiv = document.getElementById('english-targets');
    const messageBox = document.getElementById('message');

    // --- Generar días en inglés (ordenados) ---
    daysData.forEach(day => {
        const target = document.createElement('div');
        target.classList.add('drop-target');
        target.textContent = day.english;
        target.dataset.target = day.english;
        englishTargetsDiv.appendChild(target);
    });

    // --- Generar días en español (aleatorios y arrastrables) ---
    const shuffledDaysData = [...daysData];
    shuffleArray(shuffledDaysData);

    shuffledDaysData.forEach(day => {
        const item = document.createElement('div');
        item.classList.add('day-item');
        item.textContent = day.spanish;
        item.setAttribute('draggable', true);
        item.dataset.match = day.english;
        spanishDraggablesDiv.appendChild(item);
    });

    // --- Lógica de Arrastrar y Soltar ---
    let draggedItem = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('day-item')) {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', draggedItem.dataset.match);
            
            setTimeout(() => {
                draggedItem.style.opacity = '0.4';
            }, 0);
        }
    });

    document.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.style.opacity = '1';
            draggedItem = null;
        }
    });

    englishTargetsDiv.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('.drop-target');
        if (dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#ff7043';
        }
    });

    englishTargetsDiv.addEventListener('dragleave', (e) => {
        const dropTarget = e.target.closest('.drop-target');
        if (dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#a5d6a7';
        }
    });

    englishTargetsDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('.drop-target');

        if (draggedItem && dropTarget && !dropTarget.classList.contains('correct')) {
            dropTarget.style.borderColor = '#a5d6a7';
            const draggedDayEnglish = e.dataTransfer.getData('text/plain');
            const targetEnglish = dropTarget.dataset.target;

            if (draggedDayEnglish === targetEnglish) {
                dropTarget.textContent = draggedItem.textContent;
                dropTarget.classList.add('correct');
                draggedItem.remove();
                showMessage('¡Fantástico! 🎉', '#388e3c');
            } else {
                showMessage('¡Mmm, no es correcto! 😅', '#ff7043');
            }
        }
    });

    // Función para mezclar un array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showMessage(text, color) {
        messageBox.textContent = text;
        messageBox.style.color = color;
        setTimeout(() => {
            messageBox.textContent = '';
        }, 2500);
    }
});