fetch("/orders")
.then(res => res.json())
.then(orders => {

    const table = document.getElementById("ordersTable");

    table.innerHTML = "";

    if (orders.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No Orders Found
            </td>
        </tr>
        `;

        return;
    }

    orders.forEach(order => {

        table.innerHTML += `
        <tr>

            <td>#${String(order.id).slice(-6)}</td>

            <td>${order.name}</td>

            <td>${order.phone}</td>

            <td>${order.address}</td>

            <td>₹${order.total}</td>

            <td>
                <span class="badge ${
                order.status==="Placed"
                ? "bg-warning text-dark"
                : order.status==="Preparing"
                ? "bg-primary"
                : "bg-success"
                }">
                    ${order.status}
                </span>
            </td>

            <td>
                ${order.items.map(item => item.name).join(", ")}
            </td>

        </tr>
        `;

    });

});