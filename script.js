// ===== GLOBALE VARIABLEN =====
let selectedBikeType = '';
let selectedRidingStyle = '';

// ===== MODELL-DATEN =====
const modelOptions = {
    'riese_muller': [
        {value: 'riese_muller_charger4', text: 'Charger4'},
        {value: 'riese_muller_nevo4', text: 'Nevo4'},
        {value: 'riese_muller_delite', text: 'Delite'},
        {value: 'riese_muller_general', text: 'Allgemein'}
    ],
    'specialized': [
        {value: 'specialized_standard', text: 'Standard Größen'},
        {value: 'specialized_s_sizing', text: 'S-Sizing (MTB)'}
    ],
    'focus': [
        {value: 'focus_thron_68', text: 'Thron² 6.8'},
        {value: 'focus_aventura_68', text: 'Aventura² 6.8'},
        {value: 'focus_jarifa', text: 'Jarifa'},
        {value: 'focus_sam', text: 'Sam'},
        {value: 'focus_jam', text: 'Jam'},
        {value: 'focus', text: 'Allgemein'}
    ],
    'corratec': [
        {value: 'corratec_epower_mtc_elite_12s', text: 'E-Power MTC Elite 12S'},
        {value: 'corratec_general', text: 'Allgemein'}
    ],
    'cannondale': [
        {value: 'cannondale_tesoro_neo_x1', text: 'Tesoro Neo X1'},
        {value: 'cannondale', text: 'Allgemein'}
    ],
    'velo_de_ville': [
        {value: 'velo_de_ville_seb_990', text: 'SEB 990'},
        {value: 'velo_de_ville_general', text: 'Allgemein'}
    ],
    'general': [
        {value: 'general', text: 'Allgemeine Empfehlung'}
    ]
};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Marken-Auswahl Handler
    document.getElementById('brand').addEventListener('change', handleBrandChange);
    
    // Bike-Type Auswahl
    document.querySelectorAll('.bike-type[data-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            selectBikeType(this);
        });
    });
    
    // Fahrstil Auswahl
    document.querySelectorAll('.bike-type[data-style]').forEach(btn => {
        btn.addEventListener('click', function() {
            selectRidingStyle(this);
        });
    });
});

// ===== MARKEN-AUSWAHL HANDLER =====
function handleBrandChange() {
    const selectedBrand = this.value;
    const modelSelect = document.getElementById('model');
    
    // Model-Dropdown zurücksetzen
    modelSelect.innerHTML = '<option value="">-- Modell auswählen --</option>';
    
    if (selectedBrand && modelOptions[selectedBrand]) {
        modelSelect.disabled = false;
        
        // Modell-Optionen hinzufügen
        modelOptions[selectedBrand].forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });
    } else {
        modelSelect.disabled = true;
    }
}

// ===== BIKE-TYPE AUSWAHL =====
function selectBikeType(element) {
    document.querySelectorAll('.bike-type[data-type]').forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
    selectedBikeType = element.dataset.type;
}

// ===== FAHRSTIL AUSWAHL =====
function selectRidingStyle(element) {
    document.querySelectorAll('.bike-type[data-style]').forEach(b => b.classList.remove('selected'));
    element.classList.add('selected');
    selectedRidingStyle = element.dataset.style;
}

// ===== HAUPTBERECHNUNG =====
function calculateFrameSize() {
    // Input-Werte abrufen
    const height = parseInt(document.getElementById('height').value);
    const inseam = parseInt(document.getElementById('inseam').value) || null;
    const model = document.getElementById('model').value;
    
    // Validierung
    if (!height || height < 120 || height > 220) {
        showError('Bitte gib eine gültige Körpergröße zwischen 120-220 cm ein.');
        return;
    }
    if (!model) {
        showError('Bitte wähle eine Marke und ein Modell aus.');
        return;
    }
    if (!selectedBikeType) {
        showError('Bitte wähle einen e-Bike-Typ aus.');
        return;
    }
    
    // Berechnung durchführen
    const recommendations = getFrameSizeRecommendations(height, inseam, model, selectedBikeType, selectedRidingStyle);
    displayResults(recommendations);
}

// ===== FEHLERANZEIGE =====
function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.className = 'results error show';
    resultsDiv.innerHTML = `<div class="result-title">❌ Eingabefehler</div><p>${message}</p>`;
}

// ===== BERECHNUNGSLOGIK =====
function getFrameSizeRecommendations(height, inseam, model, bikeType, ridingStyle) {
    const recommendations = [];
    let brandName = '';
    let specialNotes = '';
    
    // Multiplikatoren für verschiedene Bike-Typen
    const typeMultipliers = {
        'city': 1.0,
        'trekking': 0.98,
        'suv': 0.99,
        'mtb': 0.92,
        'gravel': 0.96
    };
    const multiplier = typeMultipliers[bikeType] || 1.0;
    
    // Marken-spezifische Empfehlungen
    switch (model) {
        case 'riese_muller_charger4':
            brandName = 'Riese & Müller Charger4';
            if (height >= 155 && height <= 175) recommendations.push({label: 'Empfohlen', size: '46 cm', description: 'Optimal für komfortable Fahrten'});
            if (height >= 170 && height <= 185) recommendations.push({label: height < 175 ? 'Alternative' : 'Empfohlen', size: '49 cm', description: 'Ausgewogenes Verhältnis'});
            if (height >= 180 && height <= 195) recommendations.push({label: height < 185 ? 'Alternative' : 'Empfohlen', size: '53 cm', description: 'Für größere Personen'});
            if (height >= 190 && height <= 210) recommendations.push({label: 'Empfohlen', size: '56 cm', description: 'Für sehr große Personen'});
            specialNotes = 'Charger4 mit 750Wh Akku und moderner Bosch-Technik.';
            break;
            
        case 'riese_muller_nevo4':
            brandName = 'Riese & Müller Nevo4';
            if (height >= 150 && height <= 168) recommendations.push({label: 'Empfohlen', size: '43 cm', description: 'Kompakte Größe für Komfort'});
            if (height >= 160 && height <= 178) recommendations.push({label: height < 168 ? 'Alternative' : 'Empfohlen', size: '47 cm', description: 'Mittlere Größe'});
            if (height >= 175 && height <= 190) recommendations.push({label: 'Empfohlen', size: '51 cm', description: 'Größere Rahmen'});
            if (height >= 185 && height <= 205) recommendations.push({label: 'Empfohlen', size: '56 cm', description: 'Für sehr große Personen'});
            specialNotes = 'Nevo4 mit tiefem Einstieg und komfortabler Sitzposition.';
            break;
            
        case 'specialized_s_sizing':
            brandName = 'Specialized (S-Sizing)';
            if (height >= 150 && height <= 165) {
                if (ridingStyle === 'comfort') recommendations.push({label: 'Komfort', size: 'S1', description: 'Wendiger'});
                recommendations.push({label: 'Standard', size: 'S2', description: 'Ausgewogen'});
                if (ridingStyle === 'sporty' || ridingStyle === 'aggressive') recommendations.push({label: 'Sportlich', size: 'S3', description: 'Stabiler'});
            } else if (height > 165 && height <= 175) {
                if (ridingStyle === 'comfort') recommendations.push({label: 'Komfort', size: 'S2', description: 'Wendiger'});
                recommendations.push({label: 'Standard', size: 'S3', description: 'Ausgewogen'});
                if (ridingStyle === 'sporty' || ridingStyle === 'aggressive') recommendations.push({label: 'Sportlich', size: 'S4', description: 'Stabiler'});
            } else if (height > 175 && height <= 185) {
                if (ridingStyle === 'comfort') recommendations.push({label: 'Komfort', size: 'S3', description: 'Wendiger'});
                recommendations.push({label: 'Standard', size: 'S4', description: 'Ausgewogen'});
                if (ridingStyle === 'sporty' || ridingStyle === 'aggressive') recommendations.push({label: 'Sportlich', size: 'S5', description: 'Stabiler'});
            } else if (height > 185) {
                recommendations.push({label: 'Standard', size: 'S5-S6', description: 'Je nach Fahrstil'});
            }
            specialNotes = 'S-Sizing: Kleinere Größen = wendiger, größere = stabiler.';
            break;
            
        case 'focus_thron_68':
            brandName = 'Focus Thron² 6.8';
            if (height >= 170 && height < 180) recommendations.push({label: 'Empfohlen', size: 'M (42 cm)', description: 'Für Körpergrößen von 170–180 cm'});
            if (height >= 180 && height < 190) recommendations.push({label: 'Empfohlen', size: 'L (45 cm)', description: 'Für Körpergrößen von 180–190 cm'});
            if (height >= 190) recommendations.push({label: 'Empfohlen', size: 'XL (48 cm)', description: 'Für Körpergrößen ab 190 cm'});
            specialNotes = 'Basierend auf den offiziellen Empfehlungen von Focus Bikes.';
            break;
            
        // Weitere Modelle...
        // (Hier würden alle anderen Modelle folgen - gekürzt für Übersichtlichkeit)
            
        default:
            brandName = 'Allgemeine Empfehlung';
            const generalSize = Math.round((height * 0.68) * multiplier);
            if (height >= 150 && height < 165) recommendations.push({label: 'Empfohlen', size: `${Math.round(generalSize-3)}-${generalSize} cm (S)`, description: 'Kleinere Rahmengröße'});
            else if (height >= 165 && height < 175) recommendations.push({label: 'Empfohlen', size: `${generalSize}-${Math.round(generalSize+2)} cm (M)`, description: 'Mittlere Rahmengröße'});
            else if (height >= 175 && height < 185) recommendations.push({label: 'Empfohlen', size: `${Math.round(generalSize+1)}-${Math.round(generalSize+4)} cm (L)`, description: 'Größere Rahmengröße'});
            else if (height >= 185) recommendations.push({label: 'Empfohlen', size: `${Math.round(generalSize+3)}+ cm (XL)`, description: 'Große Rahmengröße'});
            break;
    }
    
    // Innenbeinlängen-Berechnung
    if (inseam) {
        const inseamSize = Math.round(inseam * 0.67 * multiplier);
        recommendations.push({label: 'Basierend auf Innenbeinlänge', size: `${inseamSize} cm`, description: 'Präzisere Empfehlung'});
    }
    
    return {
        brand: brandName,
        bikeType: selectedBikeType,
        recommendations: recommendations,
        specialNotes: specialNotes,
        height: height,
        inseam: inseam
    };
}

// ===== ERGEBNISSE ANZEIGEN =====
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    
    if (data.recommendations.length === 0) {
        showError('Für deine Körpergröße konnten keine passenden Empfehlungen gefunden werden.');
        return;
    }
    
    const bikeTypeNames = {
        'city': 'City/Komfort',
        'trekking': 'Trekking',
        'suv': 'SUV',
        'mtb': 'Mountainbike',
        'gravel': 'Gravel'
    };
    
    let html = `
        <div class="result-title">✅ Deine Rahmengrößen-Empfehlungen</div
