let allDishes = [];

// =========================
// Load Menu
// =========================

fetch("/api/menu")
    .then(response => response.json())
    .then(dishes => {

        allDishes = dishes;

        displayDishes(allDishes);

        updateCartCount();

    })
    .catch(error => {

        console.error("Error loading menu:", error);

        const menu = document.getElementById("menuContainer");

        if (menu) {

            menu.innerHTML = `
                <div class="col-12 text-center">

                    <h3>⚠️ Unable to load menu</h3>

                    <p class="text-muted">
                        Please refresh the page and try again.
                    </p>

                </div>
            `;

        }

    });


// =========================
// Display Dishes
// =========================

function displayDishes(dishes) {

    const menu =
        document.getElementById("menuContainer");

    if (!menu) {
        console.error("menuContainer not found.");
        return;
    }

    menu.innerHTML = "";


    // =========================
    // No Dishes
    // =========================

    if (dishes.length === 0) {

        menu.innerHTML = `
            <div class="col-12 text-center">

                <h3>😔 No dishes found</h3>

                <p class="text-muted">
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }


    // =========================
    // Create Food Cards
    // =========================

    dishes.forEach(dish => {


        // =========================
        // Check Combo
        // =========================

        const isCombo =
            dish.category === "Combo" ||
            dish.type === "combo";


        // =========================
        // Combo Badge
        // =========================

        let comboBadge = "";

        if (isCombo) {

            comboBadge = `
                <span
                    class="badge bg-warning text-dark
                    position-absolute top-0 start-0 m-3
                    px-3 py-2"
                    style="z-index: 2;">

                    ⭐ SPECIAL COMBO

                </span>
            `;

        }


        // =========================
        // Price Section
        // =========================

        let priceSection = "";


        if (
            isCombo &&
            dish.originalPrice &&
            Number(dish.originalPrice) > Number(dish.price)
        ) {

            priceSection = `

                <div class="mb-3">

                    <span
                        class="text-muted
                        text-decoration-line-through
                        me-2">

                        ₹${dish.originalPrice}

                    </span>

                    <span
                        class="text-success
                        fw-bold fs-5">

                        ₹${dish.price}

                    </span>

                </div>

            `;

        }

        else {

            priceSection = `

                <h5 class="text-success fw-bold">

                    ₹${dish.price}

                </h5>

            `;

        }


        // =========================
        // Offer Section
        // =========================

        let offerSection = "";


        if (isCombo && dish.offer) {

            offerSection = `

                <div
                    class="alert alert-warning
                    py-2 mb-3">

                    🎁
                    <strong>
                        ${dish.offer}
                    </strong>

                </div>

            `;

        }


        // =========================
        // Combo Card Class
        // =========================

        const comboClass =
            isCombo
                ? "combo-card"
                : "";


        // =========================
        // Category Display
        // =========================

        const category =
            dish.category || "Food";


        // =========================
        // Food Card
        // =========================

        menu.innerHTML += `

            <div class="col-md-4 mb-4">

                <div
                    class="card h-100 shadow
                    position-relative ${comboClass}">


                    ${comboBadge}


                    <img
                        src="${dish.image}"
                        class="card-img-top"
                        alt="${dish.name}"
                        style="
                            height:220px;
                            object-fit:cover;
                        ">


                    <div class="card-body">


                        <h5 class="fw-bold">

                            ${dish.name}

                        </h5>


                        <p class="text-muted">

                            ${category}

                        </p>


                        ${priceSection}


                        ${offerSection}


                        <button
                            class="btn btn-warning
                            w-100"
                            onclick="addToCart(${dish.id})">

                            🛒 Add to Cart

                        </button>


                    </div>

                </div>

            </div>

        `;

    });

}


// =========================
// Search + Filter
// =========================

function filterMenu() {

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "All";


    const filtered =
        allDishes.filter(dish => {


            const dishName =
                String(dish.name || "")
                    .toLowerCase();


            const dishCategory =
                String(dish.category || "");


            const matchName =
                dishName.includes(search);


            const matchCategory =
                category === "All" ||
                dishCategory === category;


            return (
                matchName &&
                matchCategory
            );

        });


    displayDishes(filtered);

}


// =========================
// Search While Typing
// =========================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterMenu
    );

}


// =========================
// Category Change
// =========================

const categoryFilter =
    document.getElementById("categoryFilter");


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterMenu
    );

}


// =========================
// Update Cart Count
// =========================

function updateCartCount() {

    fetch("/cart")

        .then(res => res.json())

        .then(cart => {


            const cartBtn =
                document.getElementById("cartBtn");


            if (cartBtn) {

                cartBtn.innerHTML =
                    `🛒 Cart (${cart.length})`;

            }

        })

        .catch(error => {

            console.error(
                "Unable to update cart count:",
                error
            );

        });

}


// =========================
// Add To Cart
// =========================

function addToCart(id) {

    fetch("/cart/add", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            dishId: id

        })

    })

    .then(res => res.json())

    .then(data => {


        console.log(
            "Cart response:",
            data
        );


        updateCartCount();


        // =========================
        // Show Toast
        // =========================

        const toastElement =
            document.getElementById(
                "cartToast"
            );


        if (toastElement) {

            const toast =
                new bootstrap.Toast(
                    toastElement
                );

            toast.show();

        }

    })

    .catch(error => {

        console.error(
            "Error adding item to cart:",
            error
        );

        alert(
            "Unable to add item to cart."
        );

    });

}