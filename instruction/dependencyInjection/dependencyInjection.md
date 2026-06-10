# Dependency Injection

🔑 **Key points**

- **Dependency inversion** uses abstraction to decouple your code.
- **Dependency injection** provides a pattern for implementing dependency inversion at scale.
- Dependency inversion enables effective **test mocking**.

---

📖 **Deeper dive reading**: [Inversion of Control Containers and the Dependency Injection pattern](https://martinfowler.com/articles/injection.html)

---

Dependency injection is a programming pattern that seeks to move the coupling of components to the highest possible level. The **dependency injection** pattern has its roots in an important design principle called **dependency inversion**.

The principle of dependency inversion states that high-level modules should not depend on low-level modules; both should depend on abstractions. In practice, this means you should use interfaces or abstract classes to represent a component's dependencies. This allows for greater flexibility, as the high-level code is no longer tied to the specific details of a particular implementation.

Consider a situation where you want to create a printer that adds formatting to the content being printed. You could write the printer with the formatting hard-coded into the print function.

```js
class HardcodedPrinter {
  print(content) {
    // The printer is tightly coupled to a specific formatter
    const formatter = new UppercaseFormatter();
    const formattedContent = formatter.format(content);
    console.log(formattedContent);
  }
}
```

If you wanted to support other formatting styles, you might be tempted to add them to a switch statement.

```js
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
```

The problem with this approach is that every time you want to add a new formatting style, you must modify the printer. The printer shouldn't be concerned with the specific details of how text is styled, yet the code structure forces those details into the printer class.

### Inverting the dependency

Instead, you can invert the dependency by passing the formatter as a parameter. You can also invert the dependency on the "writer" so that the output destination (console, file, network) is determined by the caller. Now, the printer code is "pure" and the unnecessary lower-level module dependencies are removed.

```js
class PurePrinter {
  // The printer now accepts its dependencies as arguments
  print(content, formatter, writer) {
    const formattedContent = formatter.format(content);
    writer.log(formattedContent);
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
```

## Mocking through dependency inversion

In the example above, you would invoke your printer as follows:

```js
const printer = new PurePrinter();
const formatter = new UppercaseFormatter();

printer.print('Hello, World!', formatter, console);
```

Now, imagine you want to write a test to ensure the printer correctly uses the formatter. Because the printer writes directly to the console, it is difficult to programmatically validate the output. You can solve this by creating a **mock** version of the writer.

```js
class TestWriter {
  constructor() {
    this.content = '';
    this.wasCalled = false;
  }

  log(content) {
    this.wasCalled = true;
    this.content += content;
  }
}

const formatter = new UppercaseFormatter();
const testWriter = new TestWriter();
const printer = new PurePrinter();

printer.print('Hello World!', formatter, testWriter);

if (testWriter.content !== 'HELLO WORLD!') {
  throw new Error('Printer did not format output correctly');
}
```

By inverting the dependency, the code becomes "testable" because we can swap out real implementations for test implementations.

## Dependency injection

While the previous example used **parameter injection**, dependency injection (DI) often refers to a more formal pattern where dependencies are provided to a class (usually via its constructor) rather than the class managing them itself.

In a complex application, you don't want to manually pass every dependency through every function call. Instead, you can use a `Context` or a `Container` to manage these objects.

```js
class Printer {
  constructor(formatter, writer) {
    this.formatter = formatter;
    this.writer = writer;
  }

  print(content) {
    const formatted = this.formatter.format(content);
    this.writer.log(formatted);
  }
}

// A simple manual DI context
class Context {
  constructor() {
    this.formatter = new BoldFormatter();
    this.writer = console;
    // The context handles the "wiring"
    this.printer = new Printer(this.formatter, this.writer);
  }
}

const ctx = new Context();
ctx.printer.print('Hello, World!');
```

This generates the same result as before, but it moves the coupling to the initialization phase. To change the behavior for a test, you simply provide a different context.

## Dependency injection frameworks

Most modern languages have mature dependency injection frameworks that automate the process of creating and "injecting" these objects.

| Language              | Dependency injection framework                    |
| --------------------- | ------------------------------------------------- |
| JavaScript/TypeScript | InversifyJS, NestJS, Awilix                       |
| Python                | Flask-Injector, dependency_injector               |
| Java                  | Spring Framework, Google Guice                    |
| C#                    | Microsoft.Extensions.DependencyInjection, Autofac |
| Go                    | Wire, Dig                                         |
| C++                   | Boost.DI, Poco                                    |
| Swift                 | Swinject                                          |
| Scala                 | MacWire, Scaldi                                   |
| Dart                  | Injectable, get_it                                |
| Rust                  | shaku, solder                                     |

These frameworks often use decorators, metadata, or configuration files (like XML or JSON) to describe how objects should be instantiated and connected.

## Abusing dependency injection

Dependency injection makes code modular and testable, but it comes with a cost: **complexity**. Abstractions are, by definition, abstract. This can make it difficult to follow the flow of execution. To understand which concrete implementation is being used, you may have to hunt through configuration files or use a debugger to inspect variables at runtime.

Over-engineering DI can actually decrease maintainability. If every single parameter and utility is injected through a complex framework, the code can become "boilerplate heavy."

```js
// Example of over-engineered DI "Abuse"
class Service {
  constructor(dependency) {
    this.dependency = dependency;
  }
  exec(param) {
    return this.dependency.exec(param);
  }
}

// When the DI container is too complex, it's hard to tell what 'serviceDependency' actually is.
const di = new Injector(config);
const service = new Service(di.get('serviceDependency'));
service.exec(di.get('serviceParam'));
```

It is also common to see tests that go too far. If every input, dependency, and response is mocked, you might end up with a test that only proves that the compiler works, without actually exercising the application logic.

Be careful not to treat DI as a solution for every problem. Use it where flexibility and testability are genuinely needed.

## Dependency injection in JWT Pizza

We are not going to use a formal dependency injection framework in JWT Pizza, but we will use the underlying principles of dependency inversion to make our code easier to test.

💡 Having a deep understanding of dependency injection is a valuable career skill. You might consider writing your curiosity report on how different frameworks handle "Lifetime Management" (Singleton vs. Transient objects).