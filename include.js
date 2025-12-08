
function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src*="${src}"]`)) {
            return resolve(); 
        }
        const s = document.createElement("script");
        s.src = src + "?v=2";
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    const includes = document.querySelectorAll("[data-include]");

    for (let el of includes) {
        const file = el.getAttribute("data-include");

        try {
            const res = await fetch(file);
            if (!res.ok) throw new Error("Include bulunamadı: " + file);

            const html = await res.text();
            el.innerHTML = html;

           
            if (file.includes("header.html")) {

                await Promise.all([
                    loadScriptOnce("js/jquery-3.2.1.min.js"),
                    loadScriptOnce("js/popper.min.js"),
                    loadScriptOnce("js/bootstrap.min.js"),
                    loadScriptOnce("js/jquery.superslides.min.js"),
                    loadScriptOnce("js/bootsnav.js"),
                    loadScriptOnce("js/inewsticker.js"),
                    loadScriptOnce("js/images-loded.min.js"),
                    loadScriptOnce("js/isotope.min.js"),
                    loadScriptOnce("js/owl.carousel.min.js"),
                    loadScriptOnce("js/baguetteBox.min.js"),
                    loadScriptOnce("js/cart.js"),
                    loadScriptOnce("js/custom.js"),
					loadScriptOnce("js/shopcustom.js"),
                ]);

                setTimeout(initHeaderScripts, 80);
            }

            
            if (file.includes("footer.html")) {
                if (typeof updateCartBadge === "function") updateCartBadge();
            }

        } catch (err) {
            el.innerHTML = "<div style='color:red'>Include yüklenemedi.</div>";
            console.error(err);
        }
    }
});


function initHeaderScripts() {
    console.log("HEADER INIT ✓");

    if (typeof $.fn.bootsnav === "function") {
        $(".navbar").bootsnav();
    }

    $(".side-menu a").off("click").on("click", function (e) {
        e.preventDefault();
        $(".side").addClass("on");
    });

    $(".close-side").off("click").on("click", function (e) {
        e.preventDefault();
        $(".side").removeClass("on");
    });

    $(".search a").off("click").on("click", function (e) {
        e.preventDefault();
        $(".top-search").slideToggle();
    });

    $(".close-search").off("click").on("click", function () {
        $(".top-search").slideUp();
    });

    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}
