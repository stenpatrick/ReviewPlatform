require("dotenv").config();
const port = process.env.PORT || 3000;
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

const doctors = [
    { id: 1, name: "Jane Doe", rating: 3, comments: "" },
    { id: 2, name: "Joe Doe", rating: 5, comments: "" },
];

app.get("/doctors", (req, res) => {
    res.send(doctors.map(({ id, name, rating, comments }) => {
        return { id, name, rating, comments };
    }));
});

app.post("/doctors", (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).send({ error: "Missing required field 'name'" });
    }

    const newRating = parseFloat(req.body.rating);
    if (newRating < 0 || newRating > 5) {
        return res.status(400).send({ error: "Rating must be between 0 and 5" });
    }

    const newdoctor = {
        id: createId(),
        name: req.body.name,
        rating: isNaN(newRating) ? null : newRating,
        comments: req.body.comments || "" // Optional comments
    };

    doctors.push(newdoctor);
    res.status(201)
        .location(`${getBaseUrl(req)}/doctors/${newdoctor.id}`)
        .send(newdoctor);
});

app.get("/doctors/:id", (req, res) => {
    const doctor = getdoctor(req, res);
    if (!doctor) { return; }
    return res.send(doctor);
});

app.put("/doctors/:id", (req, res) => {
    const doctor = getdoctor(req, res);
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
    doctor.comments = req.body.comments || ""; // Update comments

    return res
        .location(`${getBaseUrl(req)}/doctors/${doctor.id}`)
        .send(doctor);
});

app.delete("/doctors/:id", (req, res) => {
    const doctor = getdoctor(req, res);
    if (!doctor) { return; }
    doctors.splice(doctors.indexOf(doctor), 1);
    return res.status(204).send();
});

app.listen(port, () => {
    require("./db")
    console.log(`API up at: http://${host}:${port}`);
});

function getBaseUrl(req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`;
}

function createId() {
    const maxIddoctor = doctors.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
    return maxIddoctor.id + 1;
}

function getdoctor(req, res) {
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
