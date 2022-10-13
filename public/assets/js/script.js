/*-----------------------------------------------------------------------------------

    Template Name:Oslo Theme
    Template URI: themes.pixelstrap.com/Oslo-Theme
    Description: This is Eccomerce Html Template
    Author: Pixelstrap
    Author URL: https://themeforest.net/user/pixelstrap

----------------------------------------------------------------------------------- */


// 01.Loader js
// 02.Ratio js 
// 03.Language And Unit Select js
// 04.Cart Mobile js
// 05.Plus Minus Item  Js
// 06.Footer Accordion Js 
// 07.Thumb Click Product Img Change js
// 08.Search Box Function
// 09.Add To Cart Notification js
// 10.Radio Parent Class js
// 11.SideBard Show Hide js
// 12.Blog Thumbs Active js
// 13.Select Dropdown Value Print js
// 14.Table Compare Remove Js
// 15.Tap To Top Js 
// 16.Input Number Length Validation Js 
// 17.Cookies js
// 18.Wishlist Remove js 
// 19.Cart Item Remove js
// 20.Pwa Service Worker Register


"use strict";


// Body Selection //
const body = document.querySelector("body");

/*==================
  01. Loader js
======================*/
const loaderSpan = document.querySelector(".loader").children
const animate = function () {
    document.querySelector(".loader").classList.toggle('animate');
}
const timeOutAnimation = setInterval(animate, 1000);
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {

        timeOutAnimation;
        body.classList.add("loader-overflow")
    } else {
        setTimeout(function () {
            document.querySelector(".loader-wrapper").classList.add("hidden")
            clearInterval(timeOutAnimation)
            body.classList.remove("loader-overflow")
        }, 1000)

    }
};

/*====================
   02. Ratio js
=======================*/
window.addEventListener('load', () => {
    const bgImg = document.querySelectorAll(".bg-img");
    for (i = 0; i < bgImg.length; i++) {

        let bgImgEl = bgImg[i];
        /// Optional Class Add /// 
        if (bgImgEl.classList.contains('bg-top')) {
            bgImgEl.parentNode.classList.add("b-top");
        }
        else if (bgImgEl.classList.contains('bg-bottom')) {
            bgImgEl.parentNode.classList.add("b-buttom");
        }
        else if (bgImgEl.classList.contains('bg-center')) {
            bgImgEl.parentNode.classList.add("b-center");
        }
        else if (bgImgEl.classList.contains('bg-left')) {
            bgImgEl.parentNode.classList.add("b-left");
        }
        else if (bgImgEl.classList.contains('bg-right')) {
            bgImgEl.parentNode.classList.add("b-right");
        }

        /// Lazyloader Class Add ///
        if (bgImgEl.classList.contains('blur-up')) {
            bgImgEl.parentNode.classList.add("blur-up", "lazyload");
        }

        /// Size Class Add ///
        if (bgImgEl.classList.contains('bg_size_content')) {
            bgImgEl.parentNode.classList.add("b_size_content");
        }

        /// Ratio Style ///
        bgImgEl.parentNode.classList.add("bg-size");
        const bgSrc = bgImgEl.src;
        bgImgEl.style.display = 'none';
        bgImgEl.parentNode.setAttribute("style", `
        background-image: url(${bgSrc});
        background-size:cover;
        background-position: center;
        background-repeat: no-repeat;
        display: block;
        `);
    }


    /*===============================
     Product Card After Image Set Js
     =====================================*/
    const productCard2 = document.querySelectorAll(".product-card2")
    productCard2?.forEach(el => {
        const primaryImg = el.querySelector(".primary-img").querySelector("img");
        const afterImg = el.querySelector(".after-img");
        afterImg.src = primaryImg.src
    })

});

/*===============================
  03. Language And Unit Select Js
=====================================*/
/// Language Select ///
const lang = document.querySelectorAll(".onhover-show-div .lang")
const languageSelected = document.querySelector("#languageSelected span")
for (var i = 0; i < lang.length; ++i) {
    lang[i].addEventListener('click', function () {
        languageSelected.innerHTML = this.innerHTML;
    })
}

/// Unit Select ///
const unit = document.querySelectorAll(".onhover-show-div .unit")
const unitSelected = document.querySelector("#unitSelected span")
for (var i = 0; i < unit.length; ++i) {
    unit[i].addEventListener('click', function () {
        unitSelected.innerHTML = this.innerHTML;
    })
}

/*=====================
   04. Cart Mobile js 
 ==========================*/
const cartButton = document.querySelector(".cart-button");
const cartBackButton = document.querySelector(".back-cart");
const showCard = document.querySelector(".shopingbag .onhover-show-div");
const overlay = document.querySelector(".overlay-general");
const overlayCart = document.querySelector(".overlay-cart");
if (window.matchMedia("(max-width: 768px)").matches) {
    cartButton?.addEventListener('click', function () {
        showCard.classList.add("show");
        overlayCart.classList.add("show");

    });
    const backCardSidemenu = function () {
        showCard.classList.remove("show");
        overlayCart.classList.remove("show");

    }
    cartBackButton?.addEventListener('click', backCardSidemenu)
    overlayCart?.addEventListener('click', backCardSidemenu)
}

/*=====================
 05. Plus Minus Item Js 
==========================*/
const plusMinus = document.querySelectorAll(".plus-minus ");
feather.replace();
for (var i = 0; i < plusMinus.length; ++i) {
    const addButton = plusMinus[i].querySelector(".add")
    const subButton = plusMinus[i].querySelector(".sub")
    addButton?.addEventListener('click', function () {
        const inputEl = this.parentNode.querySelector("input[type='number']");
        if (inputEl.value < 10) {
            inputEl.value = Number(inputEl.value) + 1;
        }
    })
    subButton?.addEventListener('click', function () {
        const inputEl = this.parentNode.querySelector("input[type='number']");
        if (inputEl.value >= 1) {
            inputEl.value = Number(inputEl.value) - 1;
        }
    })
};

/*=====================
 06. Footer Accordion Js 
==========================*/
const footerButton = document.querySelectorAll(".nav-footer h5");
const showNav = document.querySelector(".nav");
for (var i = 0; i < footerButton.length; ++i) {
    footerButton[i].addEventListener('click', function () {
        this.parentNode.classList.toggle('open');
    })
}

/*====================================
  0.7 Thumb Click Product Img Change js
 ========================================*/
const thumbEl = document.querySelectorAll(".product-card .thumbnail-img .thumb");
for (var i = 0; i < thumbEl.length; ++i) {
    thumbEl[i].addEventListener("click", function () {
        const parentEl = this.parentElement.children;
        [...parentEl].forEach((el) => {
            el.classList.remove("active");
        })
        this.classList.add("active");
        var imgSrc = this.querySelector("img").src;
        this.closest(".product-card").querySelector(".primary-img").style.backgroundImage = `url('${imgSrc}')`;
    });

};

/*=====================
 08. Search Box Function
 ==========================*/
const searchButton = document.querySelector(".search-button");
const searchFull = document.querySelector(".search-full");
searchButton?.addEventListener('click', function () {
    searchFull.classList.add("open");
});
window.addEventListener('load', () => {
    /// open search suggestion ///
    const searchType = document.querySelector(".search-type");
    searchType?.addEventListener('click', function () {
        this.parentNode.parentNode.classList.add("show");
    });

    /// close search  ///
    const closeSearch = document.querySelector(".close-search");
    closeSearch?.addEventListener('click', function () {
        const classes = ["open", "show"];
        classes.forEach(c => {
            if (searchFull.classList.contains(c)) {
                searchFull.classList.remove(c);
            }
        })
    });

});

/*================================
  09. Add To Cart Notification js
  ==================================*/
window.addEventListener('load', () => {
    const addToCartButton = document.querySelectorAll(".addtocart-btn ");
    addToCartButton.forEach((el) => {
        el.addEventListener("click", function () {
            document.querySelector(".addToCart").classList.add("show");
            setTimeout(() => { document.querySelector(".addToCart").classList.remove("show") }, 4000);
        })
    });
    const wishListButton = document.querySelectorAll(".wishlist-btn ");
    wishListButton.forEach((el) => {
        el.addEventListener("click", function () {
            document.querySelector(".addToWishlist").classList.add("show");
            setTimeout(() => { document.querySelector(".addToWishlist").classList.remove("show") }, 4000);
        })
    })

});


/*=====================
  10. Radio Parent Class js
 ==========================*/
const radio = document.querySelectorAll(".radio-input");
for (const radioEl of radio) {
    const parentAddressBox = document.querySelectorAll(".address-box");
    if (parentAddressBox.length !== 0) {
        radioEl?.addEventListener("change", function () {
            [...parentAddressBox].forEach((el) => {
                el.classList.remove("checked")
            })
            this.closest(".address-box")?.classList.add("checked")
        })
    }

}

/*=====================
  11. SideBard Show Hide js
  ==========================*/
/// Common Template ///
const sidebarToggle = function (showBtn, sidebar, overlay, backBtn) {
    showBtn?.addEventListener("click", function () {
        sidebar.classList.add("show-menu");
        overlay.classList.add("show");
        const removeFun = function () {
            sidebar.classList.remove("show-menu");
            overlay.classList.remove("show");

        }
        backBtn.addEventListener("click", removeFun)
        overlay.addEventListener("click", removeFun)
    });
}





/// User Dashboard SideBar ///
const settingMenuBtn = document.querySelector(".setting-menu");
const sideBarEl = document.querySelector(".side-bar");
const backBtnEl = document.querySelector(".back-side");
sidebarToggle(settingMenuBtn, sideBarEl, overlay, backBtnEl);

/// Shop Page SideBar ///
const filterOptionBtn = document.querySelector(".filter-btn");
const shopSideBar = document.querySelector(".sidebar-controll");
const backShopBtn = document.querySelector(".back-box");
sidebarToggle(filterOptionBtn, shopSideBar, overlay, backShopBtn);

/// Shop Top Filter Sidebar ///
const filterTopBtn = document.querySelector(".filter-top-btn");
const filterTopSidebar = document.querySelector(".filter-top-wrapper");
const filterTopBackBtn = document.querySelector(".filter-top-back");
sidebarToggle(filterTopBtn, filterTopSidebar, overlay, filterTopBackBtn);


/*=====================
  12. Blog Thumbs Active js
 ==========================*/
const actionBlogEl = document.querySelectorAll(".action-box .like-btn");
actionBlogEl.forEach(el => {
    el.addEventListener("click", function () {
        const parentEl = this.closest(".action-box").querySelectorAll(".like");
        parentEl.forEach(el => {
            el.classList.remove("active")
        })
        el.parentNode.classList.add("active");
    })
});


/*==================================
  13. Select Dropdown Value Print js
  =====================================*/
const selectList = document.querySelectorAll(".select-vallist");
selectList.forEach(function (el) {
    el.addEventListener("click", function (e) {
        e.preventDefault();
        const clicked = e.target.closest(".select-list")
        if (!clicked) return;
        const text = clicked.textContent
        const btnChangeText = this.closest(".dropdown").querySelector(".select-showval span");
        btnChangeText.textContent = text

    })
})


/*=========================
 14. Table Compare Remove Js 
=============================*/
const compareTable = document.querySelector(".table-compare")
compareTable?.addEventListener("click", function (e) {
    const clicked = e.target.closest(".remove")
    if (!clicked) return
    const th = [...clicked.closest("tr").children]
    const index = th.indexOf(clicked)
    const tableTd = clicked.closest(".table-compare").querySelectorAll("tbody tr ")

    tableTd.forEach(tr => {
        const td = tr.querySelectorAll("td")
        td[index].style.display = "none";
    })
    th[index].style.display = "none";
    return;
})



/*===================== 
15. Tap To Top Js 
==========================*/
const tapTopBtn = document.querySelector(".tap-to-top-button")
const tapTopTopBox = document.querySelector(".tap-to-top-box")
tapTopBtn?.addEventListener("click", function () {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    });
})
if (tapTopTopBox) {
    window.onscroll = function () {
        if (pageYOffset >= 1000) {
            tapTopTopBox.classList.remove("hide")
        } else {
            tapTopTopBox.classList.add("hide")
        }
    }
}


/*===================================
16. Input Number Length Validation Js 
=======================================*/
function constrainUserInput() {
    const inputNumber = document.querySelectorAll("input[type='number']");
    inputNumber?.forEach(function (el) {
        el.addEventListener("keypress", function (e) {
            const maxLength = +el?.getAttribute("maxlength")
            if (maxLength) {
                const value = el.value
                if (value.length >= maxLength) {
                    el.value = value.substring(0, (el.maxLength - 1))
                }
            }
        })
    })
}
constrainUserInput();


/*===================
17. Cookies  js
=======================*/
const cookiesContainer = document.querySelector(".cookie-bar");
const cookiesAcceptBtn = document.querySelector(".cookies-accept")
window.addEventListener("load", function () {
    setTimeout(() => {
        cookiesContainer?.classList.add("show")
        if (cookiesContainer?.classList.contains("show")) {
            setTimeout(() => {
                cookiesContainer?.classList.remove("show")
            }, 10000);
        }
        cookiesAcceptBtn?.addEventListener("click", function () {
            cookiesContainer?.classList.remove("show")
        })
    }, 10000);

})


/*=====================
  18. Wishlist Remove js
  ==========================*/
const wishlistProduct = document.querySelectorAll(".product-wishlist")
wishlistProduct?.forEach(el => {
    const deleteButton = el.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        this.closest(".col").style.display = "none"
    })
})

/*=====================
  19. Cart Item Remove js
  ==========================*/
const cartBagProduct = document.querySelector(".shopingbag")
const cartRemoveBtn = cartBagProduct?.querySelectorAll(".remove-cart")
cartRemoveBtn?.forEach(el => {
    el.addEventListener("click", function () {
        this.closest(".cart-card").style.display = "none"
    })
})

/*=========================
  20.Pwa Service Worker Register
  ==============================*/
window.addEventListener("load", function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js');
    }
})

