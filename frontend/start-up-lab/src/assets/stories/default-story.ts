export const defaultStory = {
  name: 'default-story',
  start: {
    text: 'Ready? Press Start',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Start', next: 'explore', score: null }
    ]
  },
  explore: {
    text: null,
    image: 'assets/images/village.jpg',
    layout: 'image-only',
    choices: null,
    next: 'select'
  },
  select: {
    text: 'Choose your character',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Crew Member', next: 'character', score: 1 },
      { text: 'Commander', next: 'character', score: 1 },
      { text: 'Tower Controller', next: 'character', score: 1 }
    ]
  },
  character: {
    text: 'You choose: Commander! Now you have to decide how to go on',
    image: 'assets/images/character.jpg',
    layout: 'image-left',
    choices: null,
    next: 'alien'
  },
  alien: {
    text: 'The alien is running towards you! What do you do?',
    image: 'assets/images/alien.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Consult others and decide how to act together', next: 'injured', score: 1 },
      { text: 'Give instructions to crew members on how to act', next: 'injured', score: 1 },
      { text: 'Take initiative and face it alone', next: 'injured', score: 1 }
    ]
  },
  injured: {
    text: 'You are running away from the alien, but your teammate falls and injures themselves. What do you do?',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Leave them and continue to escape', next: 'alienGroup', score: 1 },
      { text: 'Go back and help them, without thinking twice', next: 'alienGroup', score: 1 },
      { text: 'Plan the best way to help them and ask other people for help if necessary', next: 'alienGroup', score: 1 }
    ]
  },
  alienGroup: {
    text: 'The alien is coming towards you, and you found a stick on the ground. What do you do?',
    image: 'assets/images/alien-group.jpg',
    layout: 'image-left',
    choices: [
      { text: 'Use it by myself to hit each alien', next: 'end', score: 1 },
      { text: 'Roll it to trip multiple aliens at once', next: 'end', score: 1 },
      { text: 'Split the stick into pieces to make a weapon', next: 'end', score: 1 }
    ]
  },
  end: {
    text: 'You survived! The end.',
    image: 'assets/images/danger.jpg',
    layout: 'image-left',
    choices: null
  }
};