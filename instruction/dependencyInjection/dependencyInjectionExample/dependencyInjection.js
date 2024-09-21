class TestWriter {
  constructor() {
    this.content = '';
  }

  log(content) {
    this.wasCalled = true;
    this.content += content;
  }
}

class TestFormatter {
  format(content) {
    this.wasCalled = true;
    return content;
  }
}

class UppercaseFormatter {
  format(content) {
    return content.toUpperCase();
  }
}

class BoldFormatter {
  format(content) {
    return `**${content}**`;
  }
}

class Printer {
  constructor(formatter, writer) {
    this.formatter = formatter;
    this.writer = writer;
  }
  print(content) {
    content = this.formatter.format(content);
    this.writer.log(content);
  }
}

const formatter = new BoldFormatter();
const printer = new Printer(formatter, console);

printer.print('Hello World!');

{
  const formatter = new UppercaseFormatter();
  const testWriter = new TestWriter();
  const printer = new Printer(formatter, testWriter);

  printer.print('Hello World!');
  if (testWriter.content !== 'HELLO WORLD!') {
    throw new Error('trouble');
  }
}

class Context {
  constructor() {
    this.formatter = new BoldFormatter();
    this.writer = console;
    this.printer = new Printer(this.formatter, this.writer);
  }
}

const ctx = new Context();
ctx.printer.print('Hello World!');

class TestContext {
  constructor() {
    this.formatter = new TestFormatter();
    this.writer = new TestWriter();
    this.printer = new Printer(this.formatter, this.writer);
  }
}
