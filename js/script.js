/* =========================================
   CART
========================================= */

let cartCount = 0;

function addToCart(productName) {

    cartCount++;

    document.getElementById("cartCount").textContent = cartCount;

    showToast(`${productName} added to cart!`);
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================
   PRODUCT FILTER
========================================= */

const filters =
    document.querySelectorAll(".filter");

const products =
    document.querySelectorAll(".product-card");


filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item =>
            item.classList.remove("active")
        );

        filter.classList.add("active");

        const selectedCategory =
            filter.dataset.filter;

        products.forEach(product => {

            const category =
                product.dataset.category;

            if (
                selectedCategory === "all" ||
                category === selectedCategory
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});


/* =========================================
   CATEGORY FILTER
========================================= */

function filterCategory(category) {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

    filters.forEach(filter => {

        filter.classList.remove("active");

        if (filter.dataset.filter === category) {
            filter.classList.add("active");
        }

    });

    products.forEach(product => {

        if (product.dataset.category === category) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }

    });
}


/* =========================================
   SEARCH
========================================= */

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


function performSearch() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    if (!searchTerm) {

        products.forEach(product => {
            product.style.display = "block";
        });

        return;
    }

    products.forEach(product => {

        const productText =
            product.textContent.toLowerCase();

        if (productText.includes(searchTerm)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


searchButton.addEventListener(
    "click",
    performSearch
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            performSearch();
        }

    }
);


/* =========================================
   NAVIGATION
========================================= */

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function scrollToDeals() {

    document
        .getElementById("deals")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================
   DEAL TIMER
========================================= */

let totalSeconds =
    (8 * 60 * 60) +
    (42 * 60) +
    19;


function updateTimer() {

    if (totalSeconds <= 0) {
        totalSeconds = 24 * 60 * 60;
    }

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;


    document.getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");

    totalSeconds--;
}


updateTimer();

setInterval(updateTimer, 1000);


/* =========================================
   NEWSLETTER
========================================= */

const newsletterForm =
    document.getElementById("newsletterForm");


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const email =
            newsletterForm
                .querySelector("input")
                .value;

        showToast(
            `Thanks! ${email} is subscribed.`
        );

        newsletterForm.reset();

    }
);


/* =========================================
   CART BUTTON
========================================= */

document
    .getElementById("cartButton")
    .addEventListener("click", () => {

        if (cartCount === 0) {

            showToast(
                "Your cart is empty."
            );

        } else {

            showToast(
                `You have ${cartCount} item(s) in your cart.`
            );

        }

    });