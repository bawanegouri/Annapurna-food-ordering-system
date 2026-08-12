const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const dataFolder = path.join(__dirname, "../data");
const reviewFile = path.join(dataFolder, "reviews.json");


// Make sure data folder and reviews.json exist
function getReviews() {

    // Create data folder if it doesn't exist
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    // Create reviews.json if it doesn't exist
    if (!fs.existsSync(reviewFile)) {
        fs.writeFileSync(reviewFile, "[]", "utf8");
    }

    const data = fs.readFileSync(reviewFile, "utf8");

    // If file is empty, return empty array
    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}


// GET all reviews
router.get("/reviews", (req, res) => {

    try {

        const reviews = getReviews();

        res.json(reviews);

    } catch (error) {

        console.error("Error loading reviews:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load reviews"
        });

    }

});


// POST a new review
router.post("/reviews/add", (req, res) => {

    try {

        const {
            dishId,
            rating,
            review
        } = req.body;


        // Validation
        if (!dishId || !rating || !review) {

            return res.status(400).json({

                success: false,

                message: "Please provide dish, rating and review."

            });

        }


        const numericRating = Number(rating);


        // Rating must be 1-5
        if (
            numericRating < 1 ||
            numericRating > 5
        ) {

            return res.status(400).json({

                success: false,

                message: "Rating must be between 1 and 5."

            });

        }


        const reviews = getReviews();


        const newReview = {

            id: Date.now(),

            dishId: Number(dishId),

            rating: numericRating,

            review: review.trim(),

            user: req.session && req.session.user
                ? (
                    req.session.user.name ||
                    req.session.user.email ||
                    "Customer"
                )
                : "Customer",

            date: new Date().toISOString()

        };


        // Add review
        reviews.push(newReview);


        // Save reviews
        fs.writeFileSync(
            reviewFile,
            JSON.stringify(reviews, null, 2),
            "utf8"
        );


        console.log("New review saved:", newReview);


        res.json({

            success: true,

            message: "Review submitted successfully!",

            review: newReview

        });


    } catch (error) {

        console.error("Review error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to save review."

        });

    }

});


module.exports = router;