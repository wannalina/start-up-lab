export const defaultStory = {
    start: {
      text: 'Ready? Press Start',
      image: null,
      layout: 'default',
      choices: [
        { text: 'Start', next: 'explore' }
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
      layout: 'image-left',
      choices: [
        { text: 'Crew Member', next: 'character' },
        { text: 'Commander', next: 'character' },
        { text: 'Tower Controller', next: 'character' }
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
        { text: 'Consult others and decide how to act together', next: 'injured' },
        { text: 'Give instructions to crew members on how to act', next: 'injured' },
        { text: 'Take initiative and face it alone', next: 'injured' }
      ]
    },
    injured: {
      text: 'You are running away from the alien, but your teammate falls and injures themselves. What do you do?',
      image: null,
      layout: 'default',
      choices: [
        { text: 'Leave them and continue to escape', next: 'alienGroup' },
        { text: 'Go back and help them, without thinking twice', next: 'alienGroup' },
        { text: 'Plan the best way to help them and ask other people for help if necessary', next: 'alienGroup' }
      ]
    },
    alienGroup: {
      text: 'The alien is coming towards you, and you found a stick on the ground. What do you do?',
      image: 'assets/images/alien-group.jpg',
      layout: 'image-left',
      choices: [
        { text: 'Use it by myself to hit each alien', next: 'end' },
        { text: 'Roll it to trip multiple aliens at once', next: 'end' },
        { text: 'Split the stick into pieces to make a weapon', next: 'end' }
      ]
    },
    end: {
      text: 'You survived! The end.',
      image: 'assets/images/danger.jpg',
      layout: 'default',
      choices: null
    }
  };