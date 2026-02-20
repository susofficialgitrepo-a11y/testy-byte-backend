// --- DOM ELEMENTS ---
const searchBtn = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');
const resultContainer = document.getElementById('result-container');
const modal = document.getElementById('recipe-modal');
const modalDetails = document.getElementById('modal-details');
const closeModalBtn = document.querySelector('.close-modal-btn');
const openMenuBtn = document.getElementById('open-menu');
const closeMenuBtn = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');
const navLinks = document.querySelectorAll('.main-nav a');
const sideNavLinks = document.querySelectorAll('.side-nav-links a');
const heroTitle = document.querySelector('.hero-text h2');
const heroSubtitle = document.querySelector('.hero-text p');
const heroBtn = document.getElementById('hero-btn');
const surpriseBtn = document.getElementById('surprise-btn');
const sectionTitle = document.querySelector('.section-title');
const spinner = document.getElementById('loading-spinner');

// --- CACHE MEMORY ---
const searchCache = new Map();

// --- 1. SIDEBAR LOGIC ---
if (openMenuBtn) openMenuBtn.addEventListener('click', () => sideMenu.classList.add('open'));
if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => sideMenu.classList.remove('open'));

// --- 2. MASTER NAVIGATION HANDLER ---
function handleNavigation(text) {
    const pageName = text.toLowerCase().trim();
    if (sideMenu) sideMenu.classList.remove('open');
    
    // Manage active state
    navLinks.forEach(l => l.classList.remove('active'));
    navLinks.forEach(l => {
        if(l.innerText.toLowerCase().includes(pageName.replace(' ❤️',''))) l.classList.add('active');
    });

    // Decide which page to load
    if (pageName === 'recipes') {
        resetHero(); fetchRecipes('chicken'); 
    } else if (pageName === 'chefs') {
        loadChefs();
    } else if (pageName === 'shop') {
        loadShop();
    } else if (pageName === "what's on tv") {
        loadSchedule();
    } else if (pageName === 'shows') {
        loadShows();
    } else if (pageName === 'trending') {
        loadTrending();
    } else if (pageName.includes('favorites')) {
        loadFavorites();
    } else {
        loadGenericMessage(text);
    }
}

navLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); handleNavigation(e.target.innerText); }));
sideNavLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); handleNavigation(e.target.innerText); }));

if (heroBtn) heroBtn.addEventListener('click', () => {
    if(resultContainer) resultContainer.scrollIntoView({ behavior: 'smooth' });
});
if (surpriseBtn) surpriseBtn.addEventListener('click', loadRandomRecipe);

// --- 3. FETCH FUNCTIONS (BACKEND) ---
// Note: Ensure node server.js is running in your terminal!
const API_BASE = "https://testy-byte-backend-3.onrender.com";

async function loadShows() { updateHero("Hit Shows", "Stream your favorites now"); if(sectionTitle) sectionTitle.innerText = "Popular Shows"; fetchFromBackend('shows', 'host', 'Hosted by'); }
async function loadTrending() { updateHero("Trending Now", "What everyone is cooking today"); if(sectionTitle) sectionTitle.innerText = "Viral Recipes"; fetchFromBackend('trending', 'views', '🔥'); }
async function loadChefs() { updateHero("Meet Our Chefs", "World-class culinary masters"); if(sectionTitle) sectionTitle.innerText = "Our Experts"; fetchFromBackend('chefs', 'specialty', 'Expert in'); }

async function fetchFromBackend(endpoint, subtextKey, subtextLabel) {
    if(resultContainer) resultContainer.innerHTML = ""; 
    if(spinner) spinner.style.display = "block";
    try {
        const response = await fetch(`${API_BASE}/${endpoint}`);
        const data = await response.json();
        if(spinner) spinner.style.display = "none";
        data.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('recipe-card');
            card.innerHTML = `<img src="${item.image}" style="height:220px; object-fit:cover;" loading="lazy"><h3>${item.title || item.name}</h3><p>${subtextLabel} ${item[subtextKey]}</p>`;
            if(resultContainer) resultContainer.appendChild(card);
        });
    } catch (e) { if(spinner) spinner.style.display = "none"; showError(); }
}

async function loadShop() {
    updateHero("Kitchen Store", "Professional tools for your home"); if(sectionTitle) sectionTitle.innerText = "Shop Best Sellers"; 
    if(resultContainer) resultContainer.innerHTML = ""; 
    if(spinner) spinner.style.display = "block";
    try {
        const response = await fetch(`${API_BASE}/shop`);
        const data = await response.json();
        if(spinner) spinner.style.display = "none";
        data.forEach(item => {
            const card = document.createElement('div'); card.classList.add('recipe-card');
            card.innerHTML = `<img src="${item.image}" style="height:200px; padding:20px; object-fit:contain;" loading="lazy"><h3>${item.name}</h3><p style="color:#CA2125; font-weight:bold;">${item.price}</p><button style="background:#CA2125; color:white; border:none; padding:10px; width:80%; margin:10px auto; display:block; cursor:pointer;">Add to Cart</button>`;
            if(resultContainer) resultContainer.appendChild(card);
        });
    } catch (e) { if(spinner) spinner.style.display = "none"; showError(); }
}

async function loadSchedule() {
    updateHero("TV Schedule", "Don't miss a single episode"); if(sectionTitle) sectionTitle.innerText = "On Air Today"; 
    if(resultContainer) resultContainer.innerHTML = ""; 
    if(spinner) spinner.style.display = "block";
    try {
        const response = await fetch(`${API_BASE}/schedule`);
        const data = await response.json();
        if(spinner) spinner.style.display = "none";
        data.forEach(item => {
            const card = document.createElement('div'); card.classList.add('recipe-card');
            card.innerHTML = `<div style="height:150px; background:#333; display:flex; align-items:center; justify-content:center; color:white; font-size:2rem;">📺</div><h3 style="color:#CA2125;">${item.time}</h3><p style="padding-bottom:20px;">${item.show}</p>`;
            if(resultContainer) resultContainer.appendChild(card);
        });
    } catch (e) { if(spinner) spinner.style.display = "none"; showError(); }
}

// --- 4. RECIPE API & LOGIC ---

async function fetchRecipes(query) {
    if(sectionTitle) sectionTitle.innerText = `Search Results for "${query}"`;
    if(resultContainer) resultContainer.innerHTML = ""; 
    if(spinner) spinner.style.display = "block";
    const term = query.toLowerCase().trim();

    if (searchCache.has(term)) { if(spinner) spinner.style.display = "none"; displayMeals(searchCache.get(term)); return; }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        if(spinner) spinner.style.display = "none";
        if (data.meals) { searchCache.set(term, data.meals); displayMeals(data.meals); } 
        else { if(resultContainer) resultContainer.innerHTML = "<h3>No recipes found. Try 'Cake' or 'Beef'.</h3>"; }
    } catch (error) { if(spinner) spinner.style.display = "none"; if(resultContainer) resultContainer.innerHTML = "<h3>Could not load recipes.</h3>"; }
}

async function loadRandomRecipe() {
    if(resultContainer) resultContainer.innerHTML = ""; 
    if(spinner) spinner.style.display = "block";
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        if(spinner) spinner.style.display = "none";
        updateHero("Surprise!", "We picked this just for you");
        if(sectionTitle) sectionTitle.innerText = "Your Random Pick";
        displayMeals(data.meals);
        openModal(data.meals[0]); 
    } catch (e) { if(spinner) spinner.style.display = "none"; if(resultContainer) resultContainer.innerHTML = "<h3>Error loading.</h3>"; }
}

function displayMeals(meals) {
    const limitedMeals = meals.slice(0, 12);
    limitedMeals.forEach(meal => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy"><h3>${meal.strMeal}</h3><p>${meal.strArea} Cuisine</p>`;
        card.addEventListener('click', () => openModal(meal));
        if(resultContainer) resultContainer.appendChild(card);
    });
}

// --- 5. FAVORITES LOGIC ---

function toggleFavorite(meal, btnElement) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    let index = favs.findIndex(f => f.idMeal === meal.idMeal);

    if (index === -1) {
        favs.push(meal); 
        btnElement.innerText = "❤️ Saved";
        btnElement.style.background = "#CA2125";
    } else {
        favs.splice(index, 1); 
        btnElement.innerText = "🤍 Save to Favorites";
        btnElement.style.background = "#555";
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function loadFavorites() {
    updateHero("My Favorites", "Your personal recipe collection");
    if(sectionTitle) sectionTitle.innerText = "Saved Recipes";
    if(resultContainer) resultContainer.innerHTML = "";
    
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favs.length === 0) {
        if(resultContainer) resultContainer.innerHTML = "<h3>You haven't saved any recipes yet!</h3>";
        return;
    }
    displayMeals(favs);
}

// --- 6. MODAL & PRINT LOGIC ---
if(searchBtn) searchBtn.addEventListener('click', () => fetchRecipes(searchBox.value));
if(searchBox) searchBox.addEventListener('keypress', (e) => { if(e.key === 'Enter') fetchRecipes(searchBox.value); });

function openModal(meal) {
    let ingredients = "";
    for(let i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) ingredients += `<li>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }

    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    let isFav = favs.some(f => f.idMeal === meal.idMeal);
    let btnText = isFav ? "❤️ Saved" : "🤍 Save to Favorites";
    let btnColor = isFav ? "#CA2125" : "#555";

    if(modalDetails) modalDetails.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <div style="display:flex; gap:10px; margin: 15px 0;">
            <button class="print-btn" onclick="window.print()" style="padding:10px; background:#333; color:white; border:none; border-radius:5px; cursor:pointer;">🖨️ Print Recipe</button>
            <button class="fav-btn" style="padding:10px; background:${btnColor}; color:white; border:none; border-radius:5px; cursor:pointer;">${btnText}</button>
        </div>
        <img src="${meal.strMealThumb}" style="width:100%; border-radius:10px; margin-bottom:15px;">
        <h3>Ingredients</h3><ul>${ingredients}</ul>
        <h3 style="margin-top:15px;">Instructions</h3><p>${meal.strInstructions}</p>
        <a href="${meal.strYoutube}" target="_blank" style="display:block; margin-top:15px; color:red; font-weight:bold;">Watch Video</a>
    `;

    const favBtn = modalDetails.querySelector('.fav-btn');
    if(favBtn) favBtn.addEventListener('click', () => toggleFavorite(meal, favBtn));

    if(modal) modal.classList.remove('hidden');
}

if(closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if (e.target === modal && modal) modal.classList.add('hidden'); });

// --- HELPER FUNCTIONS ---
function updateHero(title, subtitle) {
    if(heroTitle) heroTitle.innerText = title;
    if(heroSubtitle) heroSubtitle.innerText = subtitle;
    if(resultContainer) resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function resetHero() {
    if(heroTitle) heroTitle.innerText = "What's Cooking";
    if(heroSubtitle) heroSubtitle.innerText = "50 Easy Dinner Recipes Everyone Will Love";
}

function showError() {
    if(resultContainer) resultContainer.innerHTML = `<div style="text-align:center;">
        <h3 style="color:red;">Server Not Connected</h3>
        <p>Make sure you are running <code>node server.js</code> in your terminal!</p>
    </div>`;
}

function loadGenericMessage(page) {
    updateHero(page, "Coming Soon!");
    
    // FIX: Update the section title so it doesn't get stuck on the old one!
    if(sectionTitle) sectionTitle.innerText = "Coming Soon";
    
    // Bonus: Made the message centered and styled so it looks professional
    if(resultContainer) {
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; width: 100%;">
                <h2 style="color: #CA2125; font-size: 3rem; margin-bottom: 10px;">🚧</h2>
                <h3 style="color: #333; font-size: 1.5rem;">The '${page}' page is under construction!</h3>
                <p style="color: #777; margin-top: 10px;">Check back later for updates.</p>
            </div>
        `;
    }
}

// Initial Load
fetchRecipes('chicken');