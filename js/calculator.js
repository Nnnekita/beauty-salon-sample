const servicesData = {
    hair: [
        { id: 'haircut', name: 'Стрижка женская', price: 1500 },
        { id: 'haircut-men', name: 'Стрижка мужская', price: 1000 },
        { id: 'coloring', name: 'Окрашивание', price: 4000 },
        { id: 'highlighting', name: 'Мелирование', price: 5000 },
        { id: 'keratin', name: 'Кератиновое выпрямление', price: 6000 },
        { id: 'hair-treatment', name: 'Восстановление волос', price: 3000 },
        { id: 'styling', name: 'Укладка', price: 2000 },
    ],
    nails: [
        { id: 'manicure', name: 'Маникюр классический', price: 1200 },
        { id: 'manicure-gel', name: 'Маникюр + гель-лак', price: 2500 },
        { id: 'pedicure', name: 'Педикюр', price: 2000 },
        { id: 'pedicure-gel', name: 'Педикюр + гель-лак', price: 3000 },
        { id: 'nail-design', name: 'Дизайн ногтей', price: 500 },
    ],
    face: [
        { id: 'facial-cleansing', name: 'Чистка лица', price: 3500 },
        { id: 'peeling', name: 'Пилинг', price: 2500 },
        { id: 'mesotherapy', name: 'Мезотерапия', price: 5000 },
        { id: 'biorevitalization', name: 'Биоревитализация', price: 8000 },
        { id: 'facial-care', name: 'Уход за лицом', price: 4000 },
    ],
    body: [
        { id: 'classic-massage', name: 'Классический массаж', price: 3000 },
        { id: 'relax-massage', name: 'Расслабляющий массаж', price: 3500 },
        { id: 'anti-cellulite', name: 'Антицеллюлитный массаж', price: 4000 },
        { id: 'body-wrap', name: 'Обёртывание', price: 4500 },
        { id: 'wax-legs', name: 'Депиляция ног', price: 2000 },
        { id: 'wax-bikini', name: 'Депиляция бикини', price: 1500 },
        { id: 'wax-arms', name: 'Депиляция рук', price: 1000 },
        { id: 'sugaring', name: 'Шугаринг', price: 800 },
    ],
    makeup: [
        { id: 'day-makeup', name: 'Дневной макияж', price: 3000 },
        { id: 'evening-makeup', name: 'Вечерний макияж', price: 4000 },
        { id: 'bridal-makeup', name: 'Свадебный макияж', price: 6000 },
    ],
};

let selectedServices = [];

function renderServices(category) {
    const container = document.getElementById('calcServices');
    const services = servicesData[category] || [];
    
    container.innerHTML = services.map(service => {
        const isSelected = selectedServices.some(s => s.id === service.id);
        return `
            <div class="calc-service-item ${isSelected ? 'selected' : ''}" data-id="${service.id}" data-name="${service.name}" data-price="${service.price}">
                <input type="checkbox" ${isSelected ? 'checked' : ''}>
                <div class="calc-checkbox">
                    <img src="icons/check.svg" alt="Check">
                </div>
                <div class="calc-service-info">
                    <div class="calc-service-name">${service.name}</div>
                    <div class="calc-service-price">${service.price.toLocaleString('ru-RU')} ₽</div>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.calc-service-item').forEach(item => {
        item.addEventListener('click', () => toggleService(item));
    });
}

function toggleService(item) {
    const id = item.dataset.id;
    const name = item.dataset.name;
    const price = parseInt(item.dataset.price);
    
    const index = selectedServices.findIndex(s => s.id === id);
    
    if (index > -1) {
        selectedServices.splice(index, 1);
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    } else {
        selectedServices.push({ id, name, price });
        item.classList.add('selected');
        item.querySelector('input').checked = true;
    }
    
    updateSummary();
}

function updateSummary() {
    const summaryList = document.getElementById('summaryList');
    const totalPrice = document.getElementById('totalPrice');
    
    if (selectedServices.length === 0) {
        summaryList.innerHTML = '<p class="summary-empty">Выберите услуги из списка</p>';
        totalPrice.textContent = '0 ₽';
        return;
    }
    
    summaryList.innerHTML = selectedServices.map(service => `
        <div class="summary-item">
            <span class="summary-item-name">${service.name}</span>
            <span class="summary-item-price">${service.price.toLocaleString('ru-RU')} ₽</span>
            <button class="summary-item-remove" data-id="${service.id}">&times;</button>
        </div>
    `).join('');
    
    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
    totalPrice.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    
    summaryList.querySelectorAll('.summary-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            removeService(id);
        });
    });
}

function removeService(id) {
    selectedServices = selectedServices.filter(s => s.id !== id);
    
    const item = document.querySelector(`.calc-service-item[data-id="${id}"]`);
    if (item) {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    }
    
    updateSummary();
}

document.querySelectorAll('.calc-category').forEach(category => {
    category.addEventListener('click', () => {
        document.querySelectorAll('.calc-category').forEach(c => c.classList.remove('active'));
        category.classList.add('active');
        renderServices(category.dataset.category);
    });
});

renderServices('hair');

document.getElementById('bookSelected').addEventListener('click', (e) => {
    if (selectedServices.length === 0) {
        e.preventDefault();
        return;
    }
    
    const serviceSelect = document.getElementById('service');
    const firstService = selectedServices[0].id;
    const option = serviceSelect.querySelector(`option[value="${firstService}"]`);
    if (option) {
        option.selected = true;
    }
});
