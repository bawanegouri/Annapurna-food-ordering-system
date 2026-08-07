fetch("/api/menu")
.then(res => res.json())
.then(dishes => {

    const container = document.getElementById("foodContainer");

    container.innerHTML = "";

    dishes.forEach(dish => {

        container.innerHTML += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="food-card">

                <img src="${dish.image}" alt="${dish.name}">

                <div class="card-body p-4">

                    <h4>${dish.name}</h4>

                    <div class="category">

                        ${dish.category}

                    </div>

                    <div class="price">

                        ₹${dish.price}

                    </div>

                    <button
                    class="btn btn-danger delete-btn"
                    onclick="deleteFood(${dish.id})">

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </div>

            </div>

        </div>

        `;

    });

});

function deleteFood(id){

    if(!confirm("Delete this dish?")){

        return;

    }

    fetch("/admin/delete-food/"+id,{

        method:"DELETE"

    })

    .then(res=>res.json())

    .then(data=>{

        if(data.success){

            location.reload();

        }

    });

}