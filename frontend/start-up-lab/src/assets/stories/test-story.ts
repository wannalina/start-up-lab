export const adventureStory = {
  name: 'adventure-story',
  start: {
    text: 'You find yourself at the entrance of a dark cave. What do you do?',
    image: 'assets/images/cave.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Enter the cave', next: 'insideCave', score: 1 },
      { text: 'Walk away', next: 'forest', score: 1 }
    ]
  },
  insideCave: {
    text: 'Inside the cave, you see a treasure chest. What do you do?',
    image: 'assets/images/treasure.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Open the chest', next: 'trap', score: 1 },
      { text: 'Leave it alone', next: 'exitCave', score: 1 }
    ]
  },
  trap: {
    text: 'It was a trap! The chest explodes, and you barely escape. What do you do next?',
    image: 'assets/images/trap.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Run deeper into the cave', next: 'deepCave', score: 1 },
      { text: 'Try to find another exit', next: 'exitCave', score: 1 }
    ]
  },
  exitCave: {
    text: 'You find an exit and escape the cave safely. The end.',
    image: 'assets/images/exit.jpg',
    layout: 'default',
    choices: null
  },
  forest: {
    text: 'You walk away from the cave and find yourself in a dense forest. What do you do?',
    image: 'assets/images/forest.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Explore the forest', next: 'deepForest', score: 1 },
      { text: 'Set up camp', next: 'camp', score: 1 }
    ]
  },
  deepForest: {
    text: 'You venture deeper into the forest and encounter a wild animal. What do you do?',
    image: 'assets/images/wild-animal.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Run away', next: 'escapeForest', score: 1 },
      { text: 'Try to tame the animal', next: 'tameAnimal', score: 1 }
    ]
  },
  camp: {
    text: 'You set up camp and rest for the night. The end.',
    image: 'assets/images/camp.jpg',
    layout: 'default',
    choices: null
  },
  escapeForest: {
    text: 'You manage to escape the forest safely. The end.',
    image: 'assets/images/escape.jpg',
    layout: 'default',
    choices: null
  },
  tameAnimal: {
    text: 'You successfully tame the animal, and it becomes your companion. The end.',
    image: 'assets/images/tame-animal.jpg',
    layout: 'default',
    choices: null
  },
  deepCave: {
    text: 'You venture deeper into the cave and discover a hidden treasure. The end.',
    image: 'assets/images/hidden-treasure.jpg',
    layout: 'default',
    choices: null
  }
};