const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

// check if the name is already added, returns boolean
function doesNameExist(name) {
  return !!persons.find(person => person.name.toLowerCase() === name.toLowerCase());
}

// get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  const numberOfPeople = persons.length;
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${numberOfPeople} people.</p>
    <p>${date}</p>
  `);
});

// get a person by id
app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// delete a person by id
app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

// add a new person
app.post('/api/persons', (req, res) => {
  const personData = req.body;

  // check if the name is missing in the request
  if (!personData.name) {
    res.status(422).json({ error: 'the name is missing' });
    return;
  }

  // check if the number is missing in the request
  if (!personData.number) {
    res.status(422).json({ error: 'the number is missing' });
    return;
  }

  // check if the name is already in the list of persons
  if (doesNameExist(personData.name)) {
    res.status(422).json({ error: 'name must be unique' });
    return;
  }

  const newId = Math.floor(Math.random() * 1000000);
  const newPerson = {
    ...personData,
    id: newId,
  };

  persons.push(newPerson);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});