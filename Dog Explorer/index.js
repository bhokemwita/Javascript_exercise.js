// ======================== DOM Elements ========================
const breedsContainer = document.getElementById('breedsContainer');
const breedDetailContainer = document.getElementById('breedDetailContainer');
const factContainer = document.getElementById('factContainer');
const groupsContainer = document.getElementById('groupsContainer');
const globalStatusDiv = document.getElementById('globalStatus');

// Helper: Display status (loading, info, error) - central status manager
function setStatusMessage(message, isError = false) {
    globalStatusDiv.textContent = message;
    if (isError) {
        globalStatusDiv.classList.add('error-message');
    } else {
        globalStatusDiv.classList.remove('error-message');
    }
}

// Helper to set temporary loading text inside a specific container
function setContainerLoading(container, message) {
    container.innerHTML = `<div class="loading-spinner-text">⏳ ${message}</div>`;
}

function setContainerError(container, message) {
    container.innerHTML = `<div class="error-message" style="background:#ffe0db; padding:0.8rem; border-radius:20px;">⚠️ ${message}</div>`;
}

// ======================== 1. FETCH ALL BREEDS ========================
async function fetchBreeds() {
    setContainerLoading(breedsContainer, "Loading breeds...");
    setStatusMessage("🐕 Fetching breed list from Dog API...");

    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const breeds = data.data;
        if (!breeds || breeds.length === 0) {
            throw new Error("No breeds data received.");
        }
        renderBreeds(breeds);
        setStatusMessage(`✅ Loaded ${breeds.length} dog breeds successfully!`);
    } catch (error) {
        console.error("fetchBreeds error:", error);
        setContainerError(breedsContainer, `Failed to load breeds: ${error.message}`);
        setStatusMessage(`❌ Failed to load breeds. ${error.message}`, true);
    }
}

// Render breeds list with click handlers
function renderBreeds(breeds) {
    if (!breeds || breeds.length === 0) {
        breedsContainer.innerHTML = '<p>No breeds available.</p>';
        return;
    }
    
    const breedsHTML = breeds.map(breed => {
        const attrs = breed.attributes;
        const name = attrs.name || 'Unnamed breed';
        const hypoallergenic = attrs.hypoallergenic ? '✅ Hypoallergenic' : '❌ Not Hypoallergenic';
        const lifeSpan = attrs.life?.max ? `${attrs.life.min || '?'} - ${attrs.life.max} years` : (attrs.life?.min ? `${attrs.life.min}+ years` : 'N/A');
        const maleWeight = attrs.male_weight?.max ? `${attrs.male_weight.min || '?'} - ${attrs.male_weight.max} kg` : (attrs.male_weight?.min ? `${attrs.male_weight.min} kg` : 'N/A');
        const femaleWeight = attrs.female_weight?.max ? `${attrs.female_weight.min || '?'} - ${attrs.female_weight.max} kg` : (attrs.female_weight?.min ? `${attrs.female_weight.min} kg` : 'N/A');
        
        return `
            <div class="breed-item" data-breed-id="${breed.id}">
                <div class="breed-name">🐕 ${escapeHtml(name)}</div>
                <div class="breed-meta">
                    <span>${hypoallergenic}</span>
                    <span>📅 Life: ${lifeSpan}</span>
                    <span>⚖️ Male: ${maleWeight}</span>
                    <span>⚖️ Female: ${femaleWeight}</span>
                </div>
                <div style="font-size:0.8rem; margin-top:5px; color:#8b6946;">${escapeHtml(attrs.description ? attrs.description.substring(0, 100) : 'No description')}${attrs.description && attrs.description.length > 100 ? '...' : ''}</div>
            </div>
        `;
    }).join('');

    breedsContainer.innerHTML = breedsHTML;

    // Attach click event listeners to each breed item
    document.querySelectorAll('.breed-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const breedId = item.getAttribute('data-breed-id');
            if (breedId) {
                fetchBreedById(breedId);
            }
        });
    });
}

// ======================== 2. FETCH SINGLE BREED BY ID ========================
async function fetchBreedById(breedId) {
    setContainerLoading(breedDetailContainer, `Fetching detailed info for breed ID: ${breedId}...`);
    setStatusMessage(`🔍 Loading breed details...`);
    
    try {
        const response = await fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch breed details (${response.status})`);
        }
        const data = await response.json();
        const breed = data.data;
        if (!breed || !breed.attributes) {
            throw new Error("Invalid breed detail structure");
        }
        renderBreedDetail(breed);
        setStatusMessage(`📖 Breed details loaded for ${breed.attributes.name || 'breed'}!`);
    } catch (error) {
        console.error("fetchBreedById error:", error);
        setContainerError(breedDetailContainer, `Could not load breed details: ${error.message}`);
        setStatusMessage(`❌ Detail error: ${error.message}`, true);
    }
}

function renderBreedDetail(breed) {
    const attrs = breed.attributes;
    const name = attrs.name || 'Unknown breed';
    const description = attrs.description || 'No description available.';
    const hypo = attrs.hypoallergenic ? 'Yes, hypoallergenic 🧴' : 'Not hypoallergenic';
    const life = attrs.life ? `${attrs.life.min || '?'} - ${attrs.life.max || '?'} years` : 'Unknown';
    const maleWeight = attrs.male_weight ? `${attrs.male_weight.min || '?'} - ${attrs.male_weight.max || '?'} kg` : 'N/A';
    const femaleWeight = attrs.female_weight ? `${attrs.female_weight.min || '?'} - ${attrs.female_weight.max || '?'} kg` : 'N/A';
    const breedGroup = attrs.breed_group || 'Not specified';
    const bredFor = attrs.bred_for || 'Unknown';
    
    const detailHtml = `
        <div class="detail-box">
            <div class="detail-title">🐾 ${escapeHtml(name)}</div>
            <p><strong>📝 Description:</strong> ${escapeHtml(description)}</p>
            <p><strong>🏷️ Hypoallergenic:</strong> ${hypo}</p>
            <p><strong>⏳ Life span:</strong> ${life}</p>
            <p><strong>⚖️ Male Weight:</strong> ${maleWeight}</p>
            <p><strong>⚖️ Female Weight:</strong> ${femaleWeight}</p>
            <p><strong>📌 Breed Group:</strong> ${escapeHtml(breedGroup)}</p>
            <p><strong>🎯 Bred For:</strong> ${escapeHtml(bredFor)}</p>
            <hr>
            <small>🔎 ID: ${breed.id}</small>
        </div>
    `;
    breedDetailContainer.innerHTML = detailHtml;
}

// ======================== 3. FETCH RANDOM DOG FACT ========================
async function fetchDogFact() {
    setContainerLoading(factContainer, "Fetching an amazing dog fact...");
    setStatusMessage("🐶 Fetching random dog fact...");
    
    try {
        const response = await fetch('https://dogapi.dog/api/v2/facts?limit=1');
        if (!response.ok) {
            throw new Error(`Fact API error: ${response.status}`);
        }
        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            throw new Error("No fact returned from API");
        }
        const factText = data.data[0].attributes.body;
        renderDogFact(factText);
        setStatusMessage("✨ New dog fact revealed!");
    } catch (error) {
        console.error("fetchDogFact error:", error);
        setContainerError(factContainer, `Failed to load dog fact: ${error.message}`);
        setStatusMessage(`❌ Dog fact error: ${error.message}`, true);
    }
}

function renderDogFact(fact) {
    factContainer.innerHTML = `
        <div class="fact-text">
            🐕 💬 "${escapeHtml(fact)}"
        </div>
    `;
}

// ======================== 4. FETCH DOG GROUPS ========================
async function fetchGroups() {
    setContainerLoading(groupsContainer, "Loading dog groups...");
    setStatusMessage("🐩 Fetching breed groups...");
    
    try {
        const response = await fetch('https://dogapi.dog/api/v2/groups');
        if (!response.ok) {
            throw new Error(`Groups API error: ${response.status}`);
        }
        const data = await response.json();
        const groups = data.data;
        if (!groups || groups.length === 0) {
            throw new Error("No groups data found");
        }
        renderGroups(groups);
        setStatusMessage(`📋 Loaded ${groups.length} dog groups!`);
    } catch (error) {
        console.error("fetchGroups error:", error);
        setContainerError(groupsContainer, `Failed to load groups: ${error.message}`);
        setStatusMessage(`❌ Groups error: ${error.message}`, true);
    }
}

function renderGroups(groups) {
    if (!groups.length) {
        groupsContainer.innerHTML = '<p>No groups available.</p>';
        return;
    }
    
    const groupsHtml = groups.map(group => {
        const attrs = group.attributes;
        const groupName = attrs.name || 'Unnamed group';
        const purpose = attrs.purpose || 'No purpose info';
        let breedIds = [];
        if (group.relationships && group.relationships.breeds && group.relationships.breeds.data) {
            breedIds = group.relationships.breeds.data.map(b => b.id);
        }
        const breedIdsText = breedIds.length ? breedIds.join(', ') : 'No breeds listed';
        return `
            <div class="group-item">
                <div class="group-name">📌 ${escapeHtml(groupName)}</div>
                <div><small>${escapeHtml(purpose)}</small></div>
                <div class="breed-ids"><strong>🐕 Related breed IDs:</strong> ${escapeHtml(breedIdsText)}</div>
            </div>
        `;
    }).join('');
    groupsContainer.innerHTML = groupsHtml;
}

// Helper to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// Initialize event listeners
function init() {
    const loadBreedsBtn = document.getElementById('loadBreedsBtn');
    const getFactBtn = document.getElementById('getFactBtn');
    const loadGroupsBtn = document.getElementById('loadGroupsBtn');
    
    loadBreedsBtn.addEventListener('click', () => {
        fetchBreeds();
    });
    getFactBtn.addEventListener('click', () => {
        fetchDogFact();
    });
    loadGroupsBtn.addEventListener('click', () => {
        fetchGroups();
    });
    
    setStatusMessage("🐕 Ready! Use buttons to explore breeds, facts, and groups.");
}

// Start the application
init();