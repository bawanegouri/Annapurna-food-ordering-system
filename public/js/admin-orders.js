// ===============================
// Load Customer Orders
// ===============================

fetch("/admin/orders")
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        return response.json();
    })

    .then(orders => {

        const table =
            document.getElementById("ordersTable");

        table.innerHTML = "";

        // No orders
        if (!orders || orders.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7"
                        class="text-muted py-4">

                        No orders found.

                    </td>
                </tr>
            `;

            return;
        }


        // Display orders
        orders.forEach(order => {

            // ===============================
            // Customer Name
            // ===============================

            const customerName =
                order.customerName ||
                order.name ||
                "Unknown Customer";


            // ===============================
            // Phone
            // ===============================

            const phone =
                order.phone ||
                "-";


            // ===============================
            // Address
            // ===============================

            const address =
                order.deliveryAddress ||
                order.address ||
                "-";


            // ===============================
            // Total
            // ===============================

            const total =
                Number(order.total || 0);


            // ===============================
            // Status
            // ===============================

            const status =
                order.status ||
                "Placed";


            // ===============================
            // Items
            // ===============================

            let itemsText = "-";

            if (
                Array.isArray(order.items) &&
                order.items.length > 0
            ) {

                itemsText =
                    order.items
                        .map(item => {

                            const name =
                                item.name ||
                                "Unknown Item";

                            const quantity =
                                item.quantity ||
                                1;

                            return `${name} × ${quantity}`;

                        })
                        .join(", ");
            }


            // ===============================
            // Order ID
            // ===============================

            const orderId =
                order.id ||
                "N/A";


            // ===============================
            // Create Row
            // ===============================

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    #${orderId}
                </td>

                <td>
                    ${customerName}
                </td>

                <td>
                    ${phone}
                </td>

                <td>
                    ${address}
                </td>

                <td>
                    ₹${total}
                </td>

                <td>

                    <span class="status">

                        ${status}

                    </span>

                </td>

                <td>
                    ${itemsText}
                </td>

            `;


            table.appendChild(row);

        });

    })

    .catch(error => {

        console.error(
            "Error loading orders:",
            error
        );


        document.getElementById(
            "ordersTable"
        ).innerHTML = `

            <tr>

                <td colspan="7"
                    class="text-danger py-4">

                    Unable to load orders.

                </td>

            </tr>

        `;

    });