script.js// ============================
// NEXORA INTERACTIONS
// ============================

// Mobile navigation

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});


// Search

const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");

searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("open");

    if (searchBox.classList.contains("open")) {
        searchInput.focus();
    }
});

searchClose.addEventListener("click", () => {
    searchBox.classList.remove("open");
    searchInput.value = "";
    applyFilters();
});


// Product filtering and search

const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const emptyMessage = document.getElementById("emptyMessage");

let activeCategory = "all";

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name.toLowerCase();

        const categoryMatch =
            activeCategory === "all" ||
            category === activeCategory;

        const searchMatch = name.includes(query);

        const shouldShow = categoryMatch && searchMatch;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    emptyMessage.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        activeCategory = button.dataset.filter;

        applyFilters();
    });
});

searchInput.addEventListener("input", applyFilters);


// Shopping cart

const cartButton = document.getElementById("cartButton");
const cartDialog = document.getElementById("cartDialog");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const cart = [];

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function renderCart() {
    cartItems.replaceChildren();

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price);

        const remove = document.createElement("button");
        remove.textContent = "Remove";

        remove.addEventListener("click", () => {
            cart.splice(index, 1);
            renderCart();
        });

        details.append(name, price, remove);
        row.append(details);

        cartItems.append(row);
    });

    const total = cart.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    cartCount.textContent = cart.length;
    cartTotal.textContent = formatPrice(total);

    if (cart.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your bag is waiting for something special.";
        message.style.padding = "25px 0";

        cartItems.append(message);
    }
}

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const product = button.closest(".product-card");

        cart.push({
            name: product.dataset.name,
            price: Number(product.dataset.price)
        });

        renderCart();

        button.textContent = "✓ Added!";

        setTimeout(() => {
            button.textContent = "+ Add to Cart";
        }, 900);
    });
});

cartButton.addEventListener("click", () => {
    if (!cartDialog.open) {
        cartDialog.showModal();
    }
});

cartClose.addEventListener("click", () => {
    cartDialog.close();
});


// Demo newsletter form

const newsletterForm = document.getElementById("newsletterForm");
const formMessage = document.getElementById("formMessage");

newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    formMessage.textContent =
        "Thanks! This is a demo form; no email was actually collected.";

    newsletterForm.reset();
});


// Initial cart state

renderCart();
