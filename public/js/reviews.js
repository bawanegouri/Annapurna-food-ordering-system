function submitReview(dishId) {

    const ratingElement =
        document.getElementById("rating");

    const reviewElement =
        document.getElementById("reviewText");

    const rating = ratingElement.value;

    const review = reviewElement.value.trim();


    // Check review
    if (review === "") {

        alert("Please write a review first.");

        return;

    }


    // Send review to server
    fetch("/reviews/add", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            dishId: dishId,

            rating: Number(rating),

            review: review

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.success) {

            alert("⭐ Review submitted successfully!");

            // Clear form
            reviewElement.value = "";

            ratingElement.value = "5";

            // Show saved review
            showSubmittedReview(data.review);

        }

        else {

            alert(
                data.message ||
                "Could not submit review."
            );

        }

    })

    .catch(error => {

        console.error("Review error:", error);

        alert(
            "Something went wrong while submitting the review."
        );

    });

}


function showSubmittedReview(review) {

    const container =
        document.getElementById("submittedReviews");


    if (!container) return;


    const stars =
        "★".repeat(review.rating) +
        "☆".repeat(5 - review.rating);


    container.innerHTML += `

        <div class="card shadow-sm border-0 mt-3">

            <div class="card-body">

                <h6 class="fw-bold">

                    ${review.user}

                </h6>

                <div class="text-warning fs-5">

                    ${stars}

                </div>

                <p class="text-muted mb-0">

                    ${review.review}

                </p>

            </div>

        </div>

    `;

}