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
    content = content.toUpperCase();
    console.log(content);
  }
}

class SwitchedPrinter {
  print(content, style) {
    switch (style) {
      case 'uppercase':
        content = content.toUpperCase();
        console.log(content);
        break;
      case 'bold':
        content = `**${content}**`;
        console.log(content);
        break;
      default:
        console.log(content);
    }
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
