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
    return this.steps.reduce((result, step) => step(result), data);
  }
}

module.exports = Pipeline;
