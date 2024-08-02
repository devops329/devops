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
  print(content, formatter) {
    content = formatter.format(content);
    console.log(content);
  }
}

class PurePrinter {
  print(content, formatter, writer) {
    content = formatter.format(content);
    writer.log(content);
  }
}

class HardcodedPrinter {
  print(content) {
    const formatter = new UppercaseFormatter();
    const formattedContent = formatter.format(content);
    console.log(formattedContent);
  }
}

class SwitchedPrinter {
  print(content, style) {
    let formattedContent = content;
    switch (style) {
      case 'uppercase':
        formattedContent = new UppercaseFormatter().format(content);
        break;
      case 'bold':
        formattedContent = new BoldFormatter().format(content);
        break;
    }
    console.log(formattedContent);
  }
}

new HardcodedPrinter().print('Hello, World!');

new SwitchedPrinter().print('Hello, World!', 'bold');

const formatter = new UppercaseFormatter();
const printer = new Printer();

printer.print('Hello, World!', formatter);

const testFormatter = new TestFormatter();

printer.print('Hello, World!', testFormatter);
if (!testFormatter.wasCalled) throw new Error('trouble');

new PurePrinter().print('Hello, World!', formatter, console);
