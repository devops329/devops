class Cow {
  constructor() {
    this.name = 'joe';
  }

  rename(newName) {
    this.name = newName;
  }

  speak() {
    console.log(`Moo, my name is ${this.name}`);
  }
}

const cow = new Cow();
module.exports = cow;
