let allDishes = [];

// Load menu
fetch("/api/menu")
    .then(response => response.json())
    .then(dishes => {

        allDishes = dishes;

        displayDishes(allDishes);
        updateCartCount();
    });

// Display dishes
function displayDishes(dishes) {

    const menu = document.getElementById("menuContainer");

    menu.innerHTML = "";

    if (dishes.length === 0) {

        menu.innerHTML = `
            <div class="col-12 text-center">

                <h3>😔 No dishes found</h3>

                <p class="text-muted">
                    Try another search.
                </p>

            </div>
        `;

        return;
    }

    dishes.forEach(dish => {

        menu.innerHTML += `
            <div class="col-md-4 mb-4">

                <div class="card h-100 shadow">

                    <img src="${dish.image}"
                         class="card-img-top"
                         style="height:220px;object-fit:cover;">

                    <div class="card-body">

                        <h5>${dish.name}</h5>

                        <p class="text-muted">
                            ${dish.category}
                        </p>

                        <h5 class="text-success">
                            ₹${dish.price}
                        </h5>

                        <button
                            class="btn btn-warning w-100"
                            onclick="addToCart(${dish.id})">

                            Add to Cart

                        </button>

                    </div>

                </div>

            </div>
        `;

    });

}

// Search + Filter
function filterMenu() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const category = document
        .getElementById("categoryFilter")
        .value;

    const filtered = allDishes.filter(dish => {

        const matchName =
            dish.name.toLowerCase().includes(search);

        const matchCategory =
            category === "All" ||
            dish.category === category;

        return matchName && matchCategory;

    });

    displayDishes(filtered);

}

// Search while typing
document
    .getElementById("searchInput")
    .addEventListener("input", filterMenu);

// Category change
document
    .getElementById("categoryFilter")
    .addEventListener("change", filterMenu);

function updateCartCount() {

    fetch("/cart")
        .then(res => res.json())
        .then(cart => {

            document.getElementById("cartBtn").innerHTML =
                `🛒 Cart (${cart.length})`;

        });

}

// Add to Cart
function addToCart(id) {

    fetch("/cart/add", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            dishId: id
        })

    })
    .then(res => res.json())
    .then(data => {
        updateCartCount();

        const toast = new bootstrap.Toast(
            document.getElementById("cartToast")
        );

        toast.show();

    });

}