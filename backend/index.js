require("dotenv").config();
const port = process.env.PORT || 3000;
const host = 'localhost';
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const cors = require('cors')
app.use(cors())
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get("/", (req, res) => {
    res.send(`Server running. Docs at <a href="http://${host}:${port}/docs">/docs</a>`);
});

let doctors = [
    { id: 1, name: "Jane Doe", speciality: "surgeon", description: "decent doctor" , rating: 3, contact: "janedoe@gmail.com" },
    { id: 2, name: "Joe Doe", speciality: "surgeon", description: "Best doctor" , rating: 5, contact: "+372 5823 7254" },
];
let users = [
    { id: 1, name: "User1", contact: "user1@example.com" },
    { id: 2, name: "User2", contact: "user2@example.com" }
];
let comments = [
    { id: 1, comment: "Great service", doctorId: 1, userId: 1 },
    { id: 2, comment: "Needs improvement", doctorId: 2, userId: 2 }
];

const { db, sync} = require("./db");

// Add Doctors endpoint
app.get("/doctors", (req, res) => {
    res.json(doctors);
});

// Get a doctor by ID
app.get("/doctors/:id", (req, res) => {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).send({ error: 'Doctor not found' });
    res.json(doctor);
});

// Create a new doctor
app.post("/doctors", (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }

    const newRating = parseFloat(req.body.rating);
    if (newRating < 0 || newRating > 5) {
        return res.status(400).send({ error: "Rating must be between 0 and 5" });
    }

    if (!req.body.speciality || req.body.speciality.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'speciality'" });
    }

    if (!req.body.description || req.body.description.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'description'" });
    }

    const newDoctor = {
        id: CreateId(doctors),
        name: req.body.name,
        speciality: req.body.speciality,
        description: req.body.description, // Fix: Adding the missing description field
        rating: isNaN(newRating) ? null : newRating,
        contact: req.body.contact || "",
    };

    doctors.push(newDoctor);
    res.status(201).send(newDoctor);
});


// Update a doctor by ID
app.put("/doctors/:id", (req, res) => {
    const doctor = getContent(doctors, req, res);
    if (!doctor) { return; }
    if (!req.body.name || !req.body.contact) {
        return res.status(400).send({ error: "Missing required fields 'name' and 'contact'" });
    }

    doctor.name = req.body.name;
    doctor.contact = req.body.contact; // Update contact details

    return res.send(doctor);
});

// Delete a doctor by ID
app.delete("/doctors/:id", (req, res) => {
    const doctor = getContent(doctors, req, res);
    if (!doctor) { return; }
    doctors.splice(doctors.indexOf(doctor), 1);
    return res.status(204).send();
});


app.listen(port, async() => {
    if(process.env.SYNC === "true") {
        await sync();
    }
    console.log(`DR. API up at: http://${host}:${port}`);
});

function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`;
}


// Add Users endpoint
app.get("/users", (req, res) => {
    res.send(users);
});

// Get a user by ID
app.get("/users/:id", (req, res) => {
    const user = getContent(users, req, res);
    if (!user) { return; }
    return res.send(user);
});

// Create a new user
app.post("/users", (req, res) => {
    if (!req.body.name || !req.body.contact) {
        return res.status(400).send({ error: "Missing required fields 'name' and 'contact'" });
    }

    const newUser = {
        id: CreateId(users),
        name: req.body.name,
        contact: req.body.contact,
    };

    users.push(newUser);
    res.status(201).send(newUser);
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
    const user = getContent(users, req, res);
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
    const user = getContent(users, req, res);
    if (!user) { return; }
    users.splice(users.indexOf(user), 1);
    return res.status(204).send();
});

// Add Comments endpoint
app.get("/comments", (req, res) => {
    const { doctorId } = req.query;

    // If doctorId is provided, filter comments by doctorId
    if (doctorId) {
        const filteredComments = comments.filter(comment => comment.doctorId === parseInt(doctorId));
        return res.send(filteredComments);
    }

    // If no doctorId is provided, return all comments
    res.send(comments);
});

// Existing POST endpoint for adding comments
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
        id: CreateId(comments),
        comment: comment,
        doctorId: parseInt(doctorId),
        userId: parseInt(userId),
    };

    comments.push(newComment);
    res.status(201).send(newComment);
});

// Existing GET endpoint for fetching a specific comment by ID
app.get("/comments/:id", (req, res) => {
    const comment = getContent(comments, req, res);
    if (!comment) { return; }
    return res.send(comment);
});

// Existing DELETE endpoint for removing a comment by ID
app.delete("/comments/:id", (req, res) => {
    const comment = getContent(comments, req, res);
    if (!comment) { return; }
    comments.splice(comments.indexOf(comment), 1);
    return res.status(204).send();
});



function CreateId(Table) {
    const MaxId = Table.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
    return MaxId.id + 1;
}


function getContent(ContentOrigin, req, res) {
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        res.status(400).send({ error: `ID must be a whole number: ${req.params.id}` });
        return null;
    }
    ContentOrigin = ContentOrigin.find(g => g.id === idNumber);
    if (!ContentOrigin) {
        res.status(404).send({ error: `User Not Found!` });
        return null;
    }
    return ContentOrigin;
}
