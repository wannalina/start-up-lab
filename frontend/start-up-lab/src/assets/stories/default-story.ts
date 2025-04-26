export const defaultStory = {
  name: 'default-story',
  start: {
    text: 'Ready? Press Start',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Start', next: 'explore', scores: null }
    ]
  },
  explore: {
    text: null,
    image: '../assets/pictures/default-story-theme.png',
    layout: 'image-only',
    choices: null,
    next: 'select'
  },
  select: {
    text: 'Choose your character',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Crew Member', next: 'character', scores: { Collaborator: 3 } },
      { text: 'Commander', next: 'character', scores: { Leader: 3 } },
      { text: 'Tower Controller', next: 'character', scores: { Analyst: 3 } }
    ]
  },
  character: {
    text: 'You chose your role! Now you have to decide how to go on.',
    image: '../assets/pictures/default-story-character.png',
    layout: 'image-left',
    choices: null,
    next: 'alien'
  },
  alien: {
    text: 'The alien is running towards you! What do you do?',
    image: '../assets/pictures/default-story-alien.png',
    layout: 'image-left',
    choices: [
      { text: 'Consult others and decide how to act together', next: 'injured', scores: { Collaborator: 2 } },
      { text: 'Give instructions to crew members on how to act', next: 'injured', scores: { Leader: 2 } },
      { text: 'Take initiative and face it alone', next: 'injured', scores: { Leader: 1, Analyst: 2 } }
    ]
  },
  injured: {
    text: 'You are running away from the alien, but your teammate falls and injures themselves. What do you do?',
    image: null,
    layout: 'default',
    choices: [
      { text: 'Leave them and continue to escape', next: 'alienGroup', scores: { Analyst: 1 } },
      { text: 'Go back and help them, without thinking twice', next: 'alienGroup', scores: { Collaborator: 1, Leader: 2 } },
      { text: 'Plan the best way to help them and ask other people for help if necessary', next: 'alienGroup', scores: { Analyst: 2, Collaborator: 2 } }
    ]
  },
  alienGroup: {
    text: 'The alien is coming towards you, and you found a stick on the ground. What do you do?',
    image: '../assets/pictures/default-story-alien-stick.png',
    layout: 'image-left',
    choices: [
      { text: 'Use it by myself to hit each alien', next: 'end', scores: { Leader: 1 } },
      { text: 'Roll it to trip multiple aliens at once', next: 'end', scores: { Analyst: 1 } },
      { text: 'Split the stick into pieces to make a weapon', next: 'end', scores: { Collaborator: 1 } }
    ]
  },
  end: {
    text: 'Congratulations, you survived. Good luck with your interview!',
    image: '../assets/pictures/default-story-end.png',
    layout: 'image-left',
    choices: null
  }
};
