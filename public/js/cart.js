fetch("/cart")
    .then(response => response.json())
    .then(cart => {

        const table = document.getElementById("cartTable");

        table.innerHTML = "";

        // Empty cart
        if (cart.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">

                        <h2>🛒</h2>

                        <h4>Your cart is empty</h4>

                        <p class="text-muted">
                            Add some delicious food first.
                        </p>

                        <a href="/customer/menu"
                           class="btn btn-warning">
                            Browse Menu
                        </a>

                    </td>
                </tr>
            `;

            document.getElementById("grandTotal").innerHTML =
                "Total: ₹0";

            return;
        }

        let total = 0;

        cart.forEach(item => {

            total += item.price;

            table.innerHTML += `
                <tr>

                    <td>${item.name}</td>

                    <td>₹${item.price}</td>

                    <td>1</td>

                    <td>₹${item.price}</td>

                    <td>

                        <button
                        class="btn btn-danger btn-sm"
                        onclick="removeItem(${item.id})">

                            Remove

                        </button>

                    </td>

                </tr>
            `;

        });

        document.getElementById("grandTotal").innerHTML =
            `Total: ₹${total}`;

    })
    .catch(err => console.log(err));

function removeItem(id) {

    fetch("/cart/remove", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            dishId: id
        })

    })
    .then(res => res.json())
    .then(() => {

        location.reload();

    });

}