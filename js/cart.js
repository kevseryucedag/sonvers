

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


function removeItem(id) {
    let cart = readCart();
    cart = cart.filter(i => String(i.id) !== String(id));
    writeCart(cart);
    renderCart();
}


function updateQty(id, newQty) {
    let cart = readCart();
    const row = cart.find(i => String(i.id) === String(id));
    if (!row) return;

    row.qty = Math.max(1, Number(newQty));
    writeCart(cart);
    renderCart();
}


async function loadProducts() {
    const res = await fetch("products.json");
    return await res.json();
}


async function renderCart() {
    const cart = readCart();
    const tbody = document.querySelector("#cart-body");
    const totalBox = document.querySelector("#grand-total");

    
    if (!tbody) return;

    
    if (!cart.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; font-family:'Press Start 2P'; color:#0aff0a;">
                    SEPETİNİZ BOŞ
                </td>
            </tr>`;
        totalBox.textContent = "₺0";
        return;
    }

    const PRODUCTS = await loadProducts();
    let html = "";
    let grandTotal = 0;

    for (let item of cart) {
        const p = PRODUCTS.find(i => String(i.id) === String(item.id));
        if (!p) continue;

        const price = Number(p.price.replace(/[₺ ,]/g, ""));
        const total = price * item.qty;
        grandTotal += total;

        html += `
        <tr>
            <td class="thumbnail-img">
                <img src="${p.images[0]}" class="img-fluid" style="width:80px; border-radius:6px;">
            </td>

            <td class="name-pr">
                <span style="font-family:'Press Start 2P'; font-size:12px;">${p.title}</span>
            </td>

            <td class="price-pr">
                <span style="color:#0aff0a;">${p.price}</span>
            </td>

            <td class="quantity-box">
    <div class="qty-controller" data-id="${p.id}">
        <button class="qty-btn minus">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn plus">+</button>
    </div>
</td>


            <td class="total-pr">
                <span style="color:#0aff0a;">₺${total.toLocaleString()}</span>
            </td>

            <td class="remove-pr">
                <a href="#" onclick="removeItem('${p.id}')">
                    <i class="fas fa-times" style="color:#ff4444;"></i>
                </a>
            </td>
        </tr>`;
    }

    tbody.innerHTML = html;
    totalBox.textContent = "₺" + grandTotal.toLocaleString();
}

document.addEventListener("DOMContentLoaded", renderCart);





async function renderSideCart() {
    const side = document.querySelector("#side-cart");
    if (!side) return;

    const cart = readCart();
    const products = await loadProducts();

    if (!cart.length) {
        side.innerHTML = `
            <li style="text-align:center; padding:20px; color:#0aff0a; font-family:'Press Start 2P';">
                SEPETİN BOŞ
            </li>
        `;
        return;
    }

    let html = "";

    for (let item of cart) {
        const p = products.find(pr => String(pr.id) === String(item.id));
        if (!p) continue;

        html += `
            <li>
                <a href="#" class="photo">
                    <img src="${p.images[0]}" class="cart-thumb" alt="" />
                </a>
                <h6>
                    ${p.title}
                    <br>
                    <small>${item.qty} × ${p.price}</small>
                </h6>
            </li>
        `;
    }

    html += `
        <li class="total">
            <a href="cart.html" class="btn btn-default hvr-hover btn-cart">Sepete Git</a>
        </li>
    `;

    side.innerHTML = html;
}


document.addEventListener("click", e => {
    if (e.target.closest(".side-menu a")) {
        setTimeout(renderSideCart, 50);  
    }
});



async function renderSideCart() {
    const box = document.querySelector("#side-cart");
    if (!box) return;

    const cart = readCart();
    const PRODUCTS = await loadProducts();

    if (cart.length === 0) {
        box.innerHTML = `
            <li style="
                padding: 30px;
                font-family: 'Press Start 2P';
                font-size: 12px;
                color: #0aff9d;
                text-align: center;
            ">
                SEPETİN BOŞ
            </li>`;
        return;
    }

    let html = "";
    let total = 0;

    for (const item of cart) {
        const p = PRODUCTS.find(pr => String(pr.id) === String(item.id));
        if (!p) continue;

        const price = Number(p.price.replace(/[₺ ,]/g, ""));
        const line = price * item.qty;
        total += line;

        html += `
            <li class="mini-item">
                <img src="${p.images[0]}" class="mini-img">

                <div class="mini-info">
                    <p class="mini-title">${p.title}</p>
                    <p class="mini-price">${item.qty} × ${p.price}</p>
                </div>

                
            </li>
        `;
    }

    html += `
        <li class="mini-total">
            <div>TOPLAM:</div>
            <div class="m-amount">₺${total.toLocaleString()}</div>
        </li>

        <li style="text-align:center; padding:15px;">
            <a href="cart.html" class="mini-btn">SEPETE GİT</a>
        </li>
    `;

    box.innerHTML = html;
}


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("qty-btn")) {
        const box = e.target.closest(".qty-controller");
        const id = box.getAttribute("data-id");
        const valEl = box.querySelector(".qty-value");
        let qty = Number(valEl.textContent);

        if (e.target.classList.contains("plus")) qty++;
        if (e.target.classList.contains("minus")) qty = Math.max(1, qty - 1);

        valEl.textContent = qty;
        updateQty(id, qty);
    }
});
