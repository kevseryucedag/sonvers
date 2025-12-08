

let PRODUCTS = [];
let activeCategory = "all";
let minPrice = 0;
let maxPrice = 10000;
let searchTerm = "";


function cleanPrice(t) {
    return Number(t.replace(/[₺,. ]/g, ""));
}


function card(p){
    const img = p.images[0];

    return `
    <div class="col-lg-4 col-md-6">
        <div class="products-single fix" data-id="${p.id}">
            <div class="box-img-hover" data-role="open">
                <img src="${img}" class="img-fluid" alt="${p.title}">

                <div class="mask-icon">
                    <a class="cart" data-role="cart">Sepete Ekle</a>
                </div>
            </div>

            <div class="why-text">
                <h4>${p.title}</h4>

                <h5 class="price-area">
                    <span class="new-price">${p.price}</span>
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice}</span>` : ""}
                </h5>
            </div>
        </div>
    </div>`;
}

function render(list){
    document.getElementById("grid").innerHTML = list.map(card).join("");
    document.getElementById("count").textContent = list.length;
    document.getElementById("empty").style.display = list.length ? "none" : "block";
}


function applyFilters(){
    let list = PRODUCTS;

    
    if (activeCategory !== "all"){
        list = list.filter(p => p.category === activeCategory);
    }

   
    if (searchTerm.length > 0){
        list = list.filter(p => p.title.toLowerCase().includes(searchTerm));
    }

    
    list = list.filter(p => {
        const price = cleanPrice(p.price);
        return price >= minPrice && price <= maxPrice;
    });

    render(list);
    renderActiveTags();
}


function renderActiveTags(){
    const box = document.getElementById("activeFilters");
    box.innerHTML = "";

    if (activeCategory !== "all"){
        box.innerHTML += `<span class="filter-tag" data-clear="cat">${activeCategory}</span>`;
    }
    if (searchTerm){
        box.innerHTML += `<span class="filter-tag" data-clear="search">${searchTerm}</span>`;
    }
}


document.addEventListener("DOMContentLoaded", async () => {

    const res = await fetch("products.json");
    PRODUCTS = await res.json();

    applyFilters();

    
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = btn.dataset.cat;
            applyFilters();
        });
    });

    
    document.getElementById("search").addEventListener("input", e => {
        searchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    
    const minR = document.getElementById("minPrice");
    const maxR = document.getElementById("maxPrice");

    minR.oninput = () => {
        minPrice = Number(minR.value);
        document.getElementById("min-label").textContent = "₺" + minPrice;
        applyFilters();
    };

    maxR.oninput = () => {
        maxPrice = Number(maxR.value);
        document.getElementById("max-label").textContent = "₺" + maxPrice;
        applyFilters();
    };

    
    document.getElementById("activeFilters").addEventListener("click", e => {
        if (e.target.classList.contains("filter-tag")){

            if (e.target.dataset.clear === "cat"){
                activeCategory = "all";
                document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
                document.querySelector("[data-cat='all']").classList.add("active");
            }

            if (e.target.dataset.clear === "search"){
                searchTerm = "";
                document.getElementById("search").value = "";
            }

            applyFilters();
        }
    });

});
document.getElementById("grid").addEventListener("click", (e) => {
    const card = e.target.closest(".products-single");
    if (!card) return;

    const id = card.dataset.id;

    
    if (e.target.closest("[data-role='cart']")) {
        e.preventDefault();
        addToCart(id);
        return;
    }

    
    if (
        e.target.closest("[data-role='open']") ||
        e.target.tagName === "IMG" ||
        e.target.classList.contains("products-single")
    ) {
        window.location.href = `urun-detay.html?id=${id}`;
    }
});




document.addEventListener("click", function(e) {

   
    const card = e.target.closest(".products-single");
    if (!card) return;

    const id = card.getAttribute("data-id");

    
    if (e.target.closest("[data-role='cart']")) {
        e.preventDefault();
        addToCart(id, 1);
        updateCartBadge();
        console.log("SEPETE EKLENDİ:", id);
        return;
    }

    
    if (e.target.closest("[data-role='open']")) {
        e.preventDefault();
        window.location.href = `urun-detay.html?id=${id}`;
        return;
    }
});





const CART_KEY = "skx_cart_v1";


function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
        return [];
    }
}


function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


function addToCart(id, qty = 1) {
    let cart = readCart();
    qty = Number(qty);

    let item = cart.find(x => String(x.id) === String(id));
    if (item) {
        item.qty += qty;
    } else {
        cart.push({ id, qty });
    }

    writeCart(cart);
    updateCartBadge();
}


function updateCartBadge() {
    const badge = document.querySelector(".attr-nav .badge");
    if (!badge) return;

    let total = readCart().reduce((sum, item) => sum + (item.qty || 0), 0);
    badge.textContent = total;
}


document.addEventListener("DOMContentLoaded", updateCartBadge);
