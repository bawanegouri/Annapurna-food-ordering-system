function loadOrders() {

    fetch("/orders")
        .then(res => res.json())
        .then(orders => {

            const table = document.getElementById("ordersTable");

            table.innerHTML = "";
            if (orders.length === 0) {

    table.innerHTML = `
        <tr>

            <td colspan="4" class="text-center py-5">

                <h2>📦</h2>

                <h4>No Orders Yet</h4>

                <p class="text-muted">
                    Start ordering delicious food.
                </p>

                <a href="/customer/menu"
                   class="btn btn-warning">
                    Browse Menu
                </a>

            </td>

        </tr>
    `;

    return;
}

            orders.forEach(order => {

                let badge = "bg-warning text-dark";

                if (order.status === "Preparing") {
                    badge = "bg-primary";
                }

                if (order.status === "Delivered") {
                    badge = "bg-success";
                }

                table.innerHTML += `
                    <tr>

                        <td>${order.id}</td>

                        <td>${order.name}</td>

                        <td>₹${order.total}</td>

                        <td>
                            <span class="badge ${badge}">
                                ${order.status}
                            </span>
                        </td>

                    </tr>
                `;

            });

        })
        .catch(err => {
            console.log(err);
        });

}

// Load orders immediately
loadOrders();

// Refresh every 5 seconds
setInterval(loadOrders, 5000);