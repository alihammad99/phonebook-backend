const express = require("express");
const moment = require("moment-timezone");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3001;

app.listen(port, () => console.log("Listening to port: " + port));

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (req, res) => {
  console.log(data);
  res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = data.find((person) => person.id === Number(id));
  if (person) {
    console.log(person);
    return res.json(person);
  }
  res.send(404).end();
});

app.get("/info", (req, res) => {
  const currentDate = moment()
    .tz("Europe/Paris")
    .format("ddd MMM DD YYYY HH:mm:ss");

  res.send(
    `<h2>Phonebook has info for ${data.length} people</h2><br/><h2>${currentDate} GMT+0200 (Eastern Europe Standard Time)</h2>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = data.find((person) => person.id === Number(id));
  console.log(person);
  if (person) {
    data = data.filter((item) => item.id != person.id);
    return res.send(200).end();
  }
  res.send(404).end();
});

app.post("/api/persons", (req, res) => {
  const { body } = req;
  const id = Math.floor(Math.random() * 500);
  const { name, number } = body;

  if (name && number) {
    if (data.find((item) => item.name == name)) {
      res.statusMessage = "name is already in use";
      return res.send(400).end();
    }
    data.push({ id, name, number });
    console.log(data.find((item) => item.id == id));
    return res.send(200).end();
  }
  res.statusMessage = "The details are incorrect";
  res.send(404).end();
});
