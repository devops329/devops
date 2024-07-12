# Dependency Injection

🔑 **Key points**

- Dependency inversion uses abstraction to decouple your code.
- Dependency injection provides a framework for global dependency inversion.
- Dependency inversion enables test mocking.

---

📖 **Deeper dive reading**: [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)

---

Dependency injection is a programming pattern that seeks to abstract coupling of components to the highest level. The **dependency injection** pattern has its roots in an important design principle called **dependency inversion**.

The principle of dependency inversion states that high-level modules should not depend on low-level modules. In practice, that means that you should use abstractions to represent a component's dependencies. This allows for greater flexibility as the code is less coupled with the details of a particular implementation.

Consider the situation where you want to create a printer that adds some formatting to the content being printed. You could write the printer with the formatting hardcoded into the print function.

```js
class HardcodedPrinter {
  print(content) {
    content = content.toUpperCase();
    console.log(content);
  }
}
```

Then when you come up with other formatting styles you could just add them to a switch statement.

```js
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
```

Perhaps you are starting to see the problem with this approach. Every time you want to add a new formatting style, you need to modify the printer. The printer doesn't really care what the style things are printed in, but the code structure is forcing the styling details into the printer.

### Inverting the dependency

Instead you can extend the information that is already being passed to the print function in the form of a **style** enumeration to be an abstraction of the formatter. Now the printer code looks like the following and all of the unnecessary lower-level module dependencies are removed.

```js
class Printer {
  print(content, formatter) {
    content = formatter.format(content);
    console.log(content);
  }
}

class UppercaseFormatter {
  format(content) {
    return content.toUpperCase();
  }
}

class boldFormatter {
  format(content) {
    return `**${content}**`;
  }
}
```

## Mocking through dependency inversion

In the above example you would invoke your printer with a formatter as follows.

```js
const printer = new Printer();

const formatter = new UppercaseFormatter();

printer.print('Hello, World!', formatter);
```

Now you want to write a test to make sure your printer is actually using the correct format. Unfortunately the printer writes to the console and so it is difficult for you validate that the formatter ever got called. You can solve this by creating a mocked version of the formatter.

```js
class TestFormatter {
  format(content) {
    this.wasCalled = true;
    return content;
  }
}

const testFormatter = new TestFormatter();

printer.print('Hello, World!', testFormatter);
if (!testFormatter.wasCalled) throw new Error('trouble');
```

The use of dependency inversion makes it really easy to write tests. You could even improve this code by inverting the dependency on the output stream so that `console` is not hard coded into the printer.

```js
class Printer {
  print(content, formatter, writer) {
    content = formatter.format(content);
    writer.log(content);
  }
}

new Printer().print('Hello, World!', formatter, console);
```

The only question that remains is how you determine which dependencies are injected into the printer. In the examples above, you just allocated the dependencies before you made the call. However, what you really want is to abstract that coupling to a higher level so that you delay the decision until the last possible moment. This is where dependency injection comes in.

## Dependency injection

Dependency injection requires passing (or injecting) dependencies to a class, rather than having the class manage these dependencies itself. It can take many forms. You can create a `service locator` object that defines a global singleton or context parameter that resolves the concrete implementation for the desired object. You can also utilize a dependency injection framework that instruments the parameterization of the components to the top level of the application.

In order to make this work we need to change our printer to receive its configuration when the class is created instead of as parameters to the function. This generates the same result as before, but it moves the coupling to when the object is allocated instead of when its method is invoked.

```js
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
```

Now you can create a dependency injection context that allocates all of the necessary dependencies with the desired concrete implementations when the application is loaded.

```js
class Context {
  constructor() {
    this.formatter = new BoldFormatter();
    this.writer = console;
    this.printer = new Printer(this.formatter, this.writer);
  }
}
```

And you can simply use the context to do your printing.

```js
const ctx = new Context();
ctx.printer.print('Hello, World!');
```

If you want to use your code in testing then you just allocate a different context and nothing in the underlying application implementation needs to change.

```js
class TestContext {
  constructor() {
    this.formatter = new TestFormatter();
    this.writer = new TestWriter();
    this.printer = new Printer(this.formatter, this.writer);
  }
}
```

## Dependency injection frameworks

Most common languages have multiple open source dependency frameworks written that hide all the dependency injection details.

| Programming           | Dependency injection framework                    |
| --------------------- | ------------------------------------------------- |
| JavaScript/TypeScript | InversifyJS                                       |
| Python                | Flask-Injector, dependency_injector               |
| Java                  | Spring Framework, Google Guice                    |
| C#                    | Microsoft.Extensions.DependencyInjection, Autofac |
| Go                    | Wire, Dig                                         |
| C++                   | Boost.DI, Poco                                    |
| Swift                 | Swinject                                          |
| Scala                 | MacWire, Scaldi                                   |
| Dart                  | Injectable, get_it                                |
| Rust                  | shaku, solder                                     |

These frameworks commonly use formats such as XML to describe the objects that their context contains. Some frameworks even instrument the code so that the injection context is completely hidden.

All of this makes your code more modular and easier to test, but it comes at a cost. It can introduce complexity and increase the learning curve for developers. This often happens when the abstractions are, well abstract, and it becomes difficult to see what the code is doing. In order to actually follow what concrete implementation are being injected, you need to either carefully review all of the configuration files, or debug the code and examine the variables.

This can serve as a common warning that sometimes turning up the dial on a good idea can create new unintended complexities and problems.

## Dependency injection in JWT Pizza

We are not going to use dependency injection in JWT Pizza, but it is an important and commonly used construct both for application development in general and specifically when applied to testing.

💡 Having a deep understanding of dependency injection could be a useful skill for you in your career. You might consider writing your curiosity report on this subject.
