const port = 3000;
const host = 'localhost';
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href="http://${host}:${port}/docs">/docs</a>`);
});

let doctors = [
    { id: 1, name: "Jane Doe", rating: 3, contact: "" },
    { id: 2, name: "Joe Doe", rating: 5, contact: "" },
];
let users = [
    { id: 1, name: "User1", contact: "user1@example.com" },
    { id: 2, name: "User2", contact: "user2@example.com" }
];
let comments = [
    { id: 1, comment: "Great service", doctorId: 1, userId: 1 },
    { id: 2, comment: "Needs improvement", doctorId: 2, userId: 2 }
];

app.post("/doctors", (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }

    const newRating = parseFloat(req.body.rating);
    if (newRating < 0 || newRating > 5) {
        return res.status(400).send({ error: "Rating must be between 0 and 5" });
    }

    const newDoctor = {
        id: createId(),
        name: req.body.name,
        rating: isNaN(newRating) ? null : newRating,
        contact: req.body.contact || "" 
    };

    doctors.push(newDoctor);
    res.status(201)
        .location(`${getBaseUrl(req)}/doctors/${newDoctor.id}`)
        .send(newDoctor);
});

app.get("/doctors/:id", (req, res) => {
    const doctor = getDoctor(req, res);
    if (!doctor) { return; }
    return res.send(doctor);
});

app.put("/doctors/:id", (req, res) => {
    const doctor = getDoctor(req, res);
    if (!doctor) { return; }
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }

    const newRating = parseFloat(req.body.rating);
    if (newRating < 0 || newRating > 5) {
        return res.status(400).send({ error: "Rating must be between 0 and 5" });
    }

    doctor.name = req.body.name;
    doctor.rating = isNaN(newRating) ? null : newRating;
    doctor.contact = req.body.contact || ""; // Update contact details

    return res
        .location(`${getBaseUrl(req)}/doctors/${doctor.id}`)
        .send(doctor);
});

app.delete("/doctors/:id", (req, res) => {
    const doctor = getDoctor(req, res);
    if (!doctor) { return; }
    doctors.splice(doctors.indexOf(doctor), 1);
    return res.status(204).send();
});

app.listen(port, () => {
    console.log(`API up at: http://${host}:${port}`);
});

function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`;
}

function createId() {
    const maxIdDoctor = doctors.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
    return maxIdDoctor.id + 1;
}

function getDoctor(req, res) {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `ID must be a whole number: ${req.params.id}` });
        return null;
    }
    const doctor = doctors.find(g => g.id === idNumber);
    if (!doctor) {
        res.status(404).send({ error: `Doctor Not Found!` });
        return null;
    }
    return doctor;
}

// Add Users endpoint
app.get("/users", (req, res) => {
    res.send(users);
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
    const user = getUser(req, res);
    if (!user) { return; }
    return res.send(user);
});

// Create a new user
app.post("/users", (req, res) => {
    if (!req.body.name || !req.body.contact) {
        return res.status(400).send({ error: "Missing required fields 'name' and 'contact'" });
    }

    const newUser = {
        id: createUserId(),
        name: req.body.name,
        contact: req.body.contact,
    };

    users.push(newUser);
    res.status(201).send(newUser);
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
    const user = getUser(req, res);
    if (!user) { return; }
    if (!req.body.name || !req.body.contact) {
        return res.status(400).send({ error: "Missing required fields 'name' and 'contact'" });
    }

    user.name = req.body.name;
    user.contact = req.body.contact; // Update contact details

    return res.send(user);
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
    const user = getUser(req, res);
    if (!user) { return; }
    users.splice(users.indexOf(user), 1);
    return res.status(204).send();
});

// Add Comments endpoint
app.get("/comments", (req, res) => {
    res.send(comments);
});

app.post("/comments", (req, res) => {
    const { comment, doctorId, userId } = req.body;

    // Validation for required fields
    if (!comment || !doctorId || !userId) {
        return res.status(400).send({ error: "Missing required fields 'comment', 'doctorId', or 'userId'" });
    }

    // Check if the doctor exists
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    if (!doctor) {
        return res.status(404).send({ error: `Doctor with ID ${doctorId} not found` });
    }

    // Check if the user exists
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
        return res.status(404).send({ error: `User with ID ${userId} not found` });
    }

    const newComment = {
        id: createCommentId(),
        comment: comment,
        doctorId: parseInt(doctorId),
        userId: parseInt(userId),
    };

    comments.push(newComment);
    res.status(201).send(newComment);
});

app.get("/comments/:id", (req, res) => {
    const comment = getComment(req, res);
    if (!comment) { return; }
    return res.send(comment);
});

app.delete("/comments/:id", (req, res) => {
    const comment = getComment(req, res);
    if (!comment) { return; }
    comments.splice(comments.indexOf(comment), 1);
    return res.status(204).send();
});

function createCommentId() {
    const maxIdComment = comments.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
    return maxIdComment.id + 1;
}

// Function to generate unique user ID
function createUserId() {
    const maxIdUser = users.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
    return maxIdUser.id + 1;
}


function getUser(req, res) {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `ID must be a whole number: ${req.params.id}` });
        return null;
    }
    const user = users.find(g => g.id === idNumber);
    if (!user) {
        res.status(404).send({ error: `User Not Found!` });
        return null;
    }
    return user;
}


// Function to get a Comment by ID
function getComment(req, res) {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `ID must be a whole number: ${req.params.id}` });
        return null;
    }
    const comment = comments.find(g => g.id === idNumber); // Corrected: Use 'comments' instead of 'Comments'
    if (!comment) {
        res.status(404).send({ error: `Comment Not Found!` });
        return null;
    }
    return comment;
}

