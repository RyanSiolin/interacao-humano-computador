// State to store form data
const formData = {
    weight: '1',
    size: 'small',
    fragile: false,
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    date: '2026-06-24',
    dayName: 'HOJE',
    dayNumber: '24',
    time: ['manhã']
};

let currentStep = 1;
const totalSteps = 4;

// Navigation for bottom navbar
function setupBottomNav() {
    const navLinks = document.querySelectorAll('.BottomNavBar .Link');
    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            switch(index) {
                case 0:
                    window.location.href = 'index.html';
                    break;
                case 1:
                    window.location.href = 'rastreamento.html';
                    break;
                case 2:
                    window.location.href = 'agendar-coleta.html';
                    break;
            }
        });
    });
}

// Quick actions navigation on index.html
function setupQuickActions() {
    const quickActions = document.querySelectorAll('.Button.quick-action');
    if (quickActions.length > 0) {
        quickActions[0].addEventListener('click', () => {
            window.location.href = 'rastreamento.html';
        });
        quickActions[1].addEventListener('click', () => {
            window.location.href = 'agendar-coleta.html';
        });
    }
}

// Rastrear button on index.html
function setupRastrearButton() {
    const rastrearBtn = document.querySelector('.Button.rastrear');
    if (rastrearBtn) {
        rastrearBtn.addEventListener('click', () => {
            window.location.href = 'rastreamento.html';
        });
    }
}

// Setup weight options
function setupWeightOptions() {
    const weightOptions = document.querySelectorAll('.weight-options .Option');
    weightOptions.forEach(option => {
        option.addEventListener('click', () => {
            weightOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            formData.weight = option.dataset.weight;
        });
    });
}

// Setup size options
function setupSizeOptions() {
    const sizeOptions = document.querySelectorAll('.size-options .Option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            formData.size = option.dataset.size;
        });
    });
}

// Setup fragile checkbox
function setupFragileCheckbox() {
    const fragileCheckbox = document.getElementById('fragile-checkbox');
    if (fragileCheckbox) {
        fragileCheckbox.addEventListener('change', (e) => {
            formData.fragile = e.target.checked;
        });
    }
}

// Setup address inputs
function setupAddressInputs() {
    const cepInput = document.getElementById('cep-input');
    const logradouroInput = document.getElementById('logradouro-input');
    const numeroInput = document.getElementById('numero-input');
    const bairroInput = document.getElementById('bairro-input');
    const cidadeInput = document.getElementById('cidade-input');
    
    [cepInput, logradouroInput, numeroInput, bairroInput, cidadeInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                formData[input.id.replace('-input', '')] = e.target.value;
            });
        }
    });
}

// Setup date buttons
function setupDateButtons() {
    const dateButtons = document.querySelectorAll('.date-options .DateButton');
    dateButtons.forEach(button => {
        button.addEventListener('click', () => {
            dateButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            formData.date = button.dataset.date;
            formData.dayName = button.dataset.day;
            formData.dayNumber = button.dataset.dayNumber;
        });
    });
}

// Setup time checkboxes
function setupTimeCheckboxes() {
    const timeCheckboxes = document.querySelectorAll('.time-options .TimeCheckbox');
    timeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const time = e.target.id.replace('-checkbox', '');
            if (e.target.checked) {
                if (!formData.time.includes(time)) {
                    formData.time.push(time);
                }
            } else {
                formData.time = formData.time.filter(t => t !== time);
            }
        });
    });
}

// Update confirmation section
function updateConfirmation() {
    const confirmationSection = document.querySelector('.Section-Step-4-Confirmation');
    if (confirmationSection) {
        // Update package info
        const weightText = formData.weight === '1' ? 'Até 1kg' : formData.weight === '3' ? '1-3kg' : '3-5kg';
        const sizeText = formData.size === 'small' ? 'Pequeno' : formData.size === 'medium' ? 'Médio' : 'Grande';
        
        const packageInfo = confirmationSection.querySelector('.Container:nth-child(1) .Container:nth-child(2) .Text');
        if (packageInfo) {
            packageInfo.textContent = `${weightText}, ${sizeText}${formData.fragile ? ' • Frágil' : ''}`;
        }
        
        // Update address
        const addressInfo = confirmationSection.querySelector('.Container:nth-child(2) .Container:nth-child(2) .Text');
        if (addressInfo) {
            const addressParts = [
                formData.logradouro,
                formData.numero,
                formData.bairro,
                formData.cidade
            ].filter(part => part.trim() !== '');
            addressInfo.textContent = addressParts.join(', ') || 'Endereço não informado';
        }
        
        // Update date/time
        const dateTimeInfo = confirmationSection.querySelector('.Container:nth-child(3) .Container:nth-child(2) .Text');
        if (dateTimeInfo) {
            const dateText = `${formData.dayName}, ${formData.dayNumber} Jun`;
            const timeText = formData.time.join(' e ');
            dateTimeInfo.textContent = `${dateText} • ${timeText}`;
        }
    }
}

// Change step
function changeStep(direction) {
    const newStep = currentStep + direction;
    if (newStep < 1 || newStep > totalSteps) return;
    
    // Hide current step
    const currentSectionClass = getSectionClass(currentStep);
    const currentSection = document.querySelector(`.Section-Step-${currentStep}-${currentSectionClass}`);
    if (currentSection) {
        currentSection.classList.add('hidden-section');
    }
    
    // Update current step
    currentStep = newStep;
    
    // Show new step
    const newSectionClass = getSectionClass(currentStep);
    const newSection = document.querySelector(`.Section-Step-${currentStep}-${newSectionClass}`);
    if (newSection) {
        newSection.classList.remove('hidden-section');
    }
    
    // Update progress stepper
    updateProgressStepper();
    
    // Update buttons
    setupStepNavigation();
    
    // Update confirmation if on last step
    if (currentStep === 4) {
        updateConfirmation();
    }
}

function getSectionClass(step) {
    return step === 1 ? 'Package-Details' : 
           step === 2 ? 'Pickup-Address' : 
           step === 3 ? 'Date-Time' : 'Confirmation';
}

function updateProgressStepper() {
    const stepperItems = document.querySelectorAll('.Progress-Stepper > .Container');
    stepperItems.forEach((item, index) => {
        const bg = item.querySelector('.Background');
        const text = item.querySelector('.Text');
        if (bg) {
            bg.classList.toggle('active', index < currentStep);
        }
        if (text) {
            text.classList.toggle('active', index < currentStep);
        }
    });
    
    // Update progress fill line with simple percentage
    const fillLine = document.querySelector('.Horizontal-Divider-Fill');
    if (fillLine) {
        // Calculate percentage based on current step (0 to 100%)
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        
        // Set left to 24px (start of line) and width based on percentage
        fillLine.style.left = '24px';
        fillLine.style.width = `calc(${progressPercentage} * (100% - 48px) / 100)`;
    }
}

// Step navigation setup
function setupStepNavigation() {
    const main = document.querySelector('.Main');
    if (main && document.querySelector('.Agendar-Coleta-em-Casa')) {
        let footer = document.querySelector('.Sticky-Footer-Action');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'Sticky-Footer-Action';
            main.appendChild(footer);
        }
        
        const isFirstStep = currentStep === 1;
        const isLastStep = currentStep === totalSteps;
        
        footer.innerHTML = `
            <div style="display: flex; gap: 12px; width: 100%; padding: 0 20px;">
                <button class="Button CTA prev-btn" ${isFirstStep ? 'style="opacity: 0.5; pointer-events: none; background: #C2C7D0;"' : ''}>
                    Anterior
                </button>
                <button class="Button CTA next-btn">
                    ${isLastStep ? 'Finalizar' : 'Próximo'}
                </button>
            </div>
        `;
        
        const prevBtn = footer.querySelector('.prev-btn');
        const nextBtn = footer.querySelector('.next-btn');
        
        prevBtn.onclick = () => changeStep(-1);
        nextBtn.onclick = () => {
            // Validate time selection before step 4
            if (currentStep === 3 && formData.time.length === 0) {
                alert('Por favor, selecione pelo menos um período de horário (Manhã ou Tarde).');
                return;
            }
            
            if (isLastStep) {
                alert('✅ Agendamento realizado com sucesso!\n\nEntraremos em contato em breve para confirmar.');
                window.location.href = 'index.html';
            } else {
                changeStep(1);
            }
        };
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupBottomNav();
    setupQuickActions();
    setupRastrearButton();
    setupWeightOptions();
    setupSizeOptions();
    setupFragileCheckbox();
    setupAddressInputs();
    setupDateButtons();
    setupTimeCheckboxes();
    setupStepNavigation();
    updateProgressStepper();
});
