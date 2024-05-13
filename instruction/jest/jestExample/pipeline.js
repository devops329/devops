class Pipeline {
  constructor() {
    this.steps = [];
  }

  add(step) {
    this.steps.push(step);
    return this;
  }

  remove(step) {
    this.steps = this.steps.filter((s) => s !== step);
    return this;
  }

  run(data) {
    this.steps.forEach((step) => step(data));
  }
}

module.exports = Pipeline;
