// make common query element
const $ = (selector) => document.querySelector(selector);
const animalsGrid = $("#grid");
const dinoCompare = $("#dino-compare");
const compareBtn = $("#btn");

// Create Dino Constructor
function Dino({ species, weight, height, diet, where, when, fact, image }) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
  this.image = image;
}

// Create Human Object
function Human({ name, weight, height, diet }) {
  this.species = name;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.fact = "";
  this.image = "/human.png";
}

// Use IIFE to get human data from form
function getDinoArray(dinos) {
  const newDinos = Array();
  dinos.forEach((dino) => {
    const newDino = new Dino(dino);
    newDinos.push(newDino);
  });
  return newDinos;
}

function getDataAnimalsFromJson() {
  fetch("./data/dino.json")
    .then((response) => response.json())
    .then((data) => {
      const humanDinoArray = getHumanDinoArray(getDinoArray(data["Dinos"]));
      compareBtn.addEventListener("click", () => GenerateTiles(humanDinoArray));
    });
}

// Create Dino Compare Method 1
function compareWeight(otherDino) {
  const human = getHumanInformation();
  if (human.weight > otherDino.weight) {
    return `${human.species} is heavier than ${otherDino.species}.`;
  } else if (human.weight < otherDino.weight) {
    return `${human.species} is lighter than ${otherDino.species}.`;
  } else {
    return `${human.species} and ${otherDino.species} have the same weight.`;
  }
}

// Create Dino Compare Method 2
function compareHeight(otherDino) {
  const human = getHumanInformation();
  if (human.height > otherDino.height) {
    return `${human.species} is taller than ${otherDino.species}.`;
  } else if (human.height < otherDino.height) {
    return `${human.species} is shorter than ${otherDino.species}.`;
  } else {
    return `${human.species} and ${otherDino.species} are of the same height.`;
  }
}

// Create Dino Compare Method 3
function compareDiet(otherDino) {
  const human = getHumanInformation();
  if (human.diet === otherDino.diet) {
    return `${human.species} and ${otherDino.species} have the same diet: ${human.diet}.`;
  } else {
    return `${human.species} has a ${human.diet} diet while ${otherDino.species} has a ${otherDino.diet} diet.`;
  }
}

// Get human information
function getHumanInformation() {
  const name = $("#name").value;
  const weight = $("#weight").value;
  const convertFeetToInChes = Number($("#feet").value) * 12;
  const height = Number($("#inches").value) + convertFeetToInChes;
  const diet = $("#diet").value;

  return new Human({ name, weight, height, diet });
}

// Capital letter
function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

// Shuffle dino array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Create array of Dino and Human objects
function getHumanDinoArray(dinos) {
  const shuffledDinos = shuffle(dinos);

  return shuffledDinos
    .slice(0, 4)
    .concat(getHumanInformation())
    .concat(shuffledDinos.slice(4, 8));
}

// Generate Tiles for each Dino in Array
function GenerateTiles(animals) {
  const whereFact = (dinosaur) =>
    `${capitalizeFirstLetter(dinosaur.species)} lived in ${dinosaur.where}.`;
  const whenFact = (dinosaur) => `lived during ${dinosaur.when} period.`;

  function createAnimal(animal) {
    const animalElement = document.createElement("div");
    animalElement.classList.add("grid-item");
    animalElement.innerHTML = `
    <h3>${animal.species}</h3>
    <img src="../images/${animal.image}">
    `;
    if (animal instanceof Dino) {
      const compareAnimal = [
        animal.fact,
        compareWeight(animal),
        compareHeight(animal),
        compareDiet(animal),
        whereFact(animal),
        whenFact(animal),
      ];
      animalElement.innerHTML += `<p class="gird-item-title">${compareAnimal}</p>`;
    }
    // Add tiles to DOM
    animalsGrid.appendChild(animalElement);
  }
  animals.forEach(createAnimal);
  function onCompare() {
    // Remove form from screen
    dinoCompare.style.display = "none";
    animalsGrid.style.display = "flex";
  }
  onCompare();
}

// On button click, prepare and display infographic
getDataAnimalsFromJson();
