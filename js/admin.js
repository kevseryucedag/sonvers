

console.log("%cSkatex Admin Panel Loaded", "color:#00ff99; font-size:14px;");



function loadView(viewName) {
    const viewPath = `views/${viewName}.html`;
    const container = document.getElementById("admin-view");

    container.innerHTML = `<p style="color:#00ff99; font-family:'Press Start 2P';">Yükleniyor...</p>`;

    fetch(viewPath)
        .then(response => {
            if (!response.ok) throw new Error("View bulunamadı: " + viewName);
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            console.log(`%c[VIEW] ${viewName} yüklendi`, "color:#00ff99");

            
            if (typeof window.onViewLoaded === "function") {
                window.onViewLoaded(viewName);
            }
        })
        .catch(err => {
            container.innerHTML =
                `<p style="color:red; font-family:'Press Start 2P';">View yüklenemedi.</p>`;
            console.error(err);
        });
}




document.querySelectorAll(".admin-menu li[data-view]").forEach(item => {
    item.addEventListener("click", () => {

       
        document.querySelectorAll(".admin-menu li").forEach(li => {
            li.classList.remove("active");
        });

       
        item.classList.add("active");

       
        const view = item.getAttribute("data-view");
        loadView(view);
    });
});




document.querySelector(".logout-btn").addEventListener("click", () => {
    alert("Çıkış yapıldı (simülasyon).");
});




window.addEventListener("DOMContentLoaded", () => {
    loadView("dashboard");
});



document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.removeItem("skx_logged_in");
    window.location.href = "login.html";
});
