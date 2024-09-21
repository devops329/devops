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

Consider the situation where you want to create a printer that adds some formatting to the content being printed. You could write the printer with the formatting hard-coded into the print function.

```js
class HardcodedPrinter {
  print(content) {
    const formatter = new UppercaseFormatter();
    const formattedContent = formatter.format(content);
    console.log(formattedContent);
  }
}
```

Then when you come up with other formatting styles you could just add them to a switch statement.

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

Perhaps you are starting to see the problem with this approach. Every time you want to add a new formatting style, you need to modify the printer. The printer doesn't really care what the style things are printed in, but the code structure is forcing the styling details into the printer.

### Inverting the dependency

Instead, you can extend the information that is already being passed to the print function in the form of a **style** enumeration to be an abstraction of the formatter. You can also invert the dependency on the writer so that where the printer writes to is determined by the caller. Now the printer code looks like the following and all the unnecessary lower-level module dependencies are removed.

```js
class PurePrinter {
  print(content, formatter, writer) {
    content = formatter.format(content);
    writer.log(content);
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

In the above example you would invoke your printer with a formatter as follows.

```js
const printer = new Printer();

const formatter = new UppercaseFormatter();

printer.print('Hello, World!', formatter, console);
```

Now you want to write a test to make sure your printer is actually using the correct format. Unfortunately the printer writes to the console and so it is difficult for you validate that the formatter ever got called. You can solve this by creating a mocked version of the writer.

```js
class TestWriter {
  constructor() {
    this.content = '';
  }

  log(content) {
    this.wasCalled = true;
    this.content += content;
  }
}

const formatter = new UppercaseFormatter();
const testWriter = new TestWriter();
const printer = new Printer(formatter, testWriter);

printer.print('Hello World!');
if (testWriter.content !== 'HELLO WORLD!') {
  throw new Error('trouble');
}
```

The only question that remains is how you determine which dependencies are injected into the printer. In the examples above, you just allocated the dependencies before you made the call. However, what you really want is to abstract that coupling to a higher level so that you delay the decision until the last possible moment. This is where dependency injection comes in.

## Dependency injection

Dependency injection requires passing (or injecting) dependencies to a class, rather than having the class manage these dependencies itself. This can take many forms. You can create a `service locator` object that defines a global singleton or you can provide a context parameter that resolves the concrete implementation for the desired object. You can also utilize a dependency injection framework that instruments the parameterization of the components to the top level of the application.

In order to demonstrate this pattern, we create a dependency injection context that allocates all the necessary application dependencies with the desired concrete implementations when the application is loaded.

```js
class Context {
  constructor() {
    this.formatter = new BoldFormatter();
    this.writer = console;
    this.printer = new Printer(this.formatter, this.writer);
  }
}

const ctx = new Context();
```

When then need to change our printer to use the global context instead of as parameters to the function. This generates the same result as before, but it moves the coupling to when the object is allocated instead of when its method is invoked.

```js
class Printer {
  print(content) {
    content = ctx.formatter.format(content);
    ctx.writer.log(content);
  }
}
```

Now the dependencies are completely inverted and abstracted away from the execution of your code.

```js
const ctx = new Context();
const printer = new Printer();
printer.print('Hello, World!');
```

This makes mocking out functionality easier. You just allocate a different context and nothing in the underlying application implementation needs to change.

```js
class TestContext {
  constructor() {
    this.formatter = new TestFormatter();
    this.writer = new TestWriter();
    this.printer = new TestPrinter(this.formatter, this.writer);
  }
}
```

## Dependency injection frameworks

Most common languages have multiple open source dependency frameworks written that hide all the dependency injection details.

| Language              | Dependency injection framework                    |
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

## Abusing dependency injection

Dependency injection makes your code more modular and easier to test, but it comes at a cost. It can introduce complexity and increase the learning curve for developers. This often happens because abstractions are by definition _abstract_, and it becomes difficult to see what the code is doing. In order to actually follow what concrete implementations are being injected, you need to either carefully review all the configuration files, or debug the code and examine the variables. This is an example of how testing can actually decrease the maintainability of your code and become a source for failures instead of helping to prevent them.

```js
class Service {
  constructor(dependency) {
    this.dependency = dependency;
  }
  exec(param) {
    return this.dependency.exec(param);
}

class Injector {
  constructor(config, ctx) {
    this.bindings = config.loadBindings(ctx);
    this.inject();
  }
  get(identifier, ...params) {
    const implementation = this.bindings.get(identifier, params);
    if (!implementation) {
      throw new Error(`Identifier ${identifier} not bound`);
    }
    return implementation;
  }
}

const di = new Injector(config, ctx);

const service = new Service(di.get('serviceDependency'));
service.exec(di.get('serviceParam', 'a', 9));
```

It is also common to see testing code that has gone too far with dependency injection. The inputs are injected with a mocked out implementation, the results from dependencies are injected with a hard coded responses, and the response from the test target is hard coded. This results in a test that only tests that the compiler works with no actual significant exercise of the application itself. We saw this in the code above where the **service** is a simple pass through between injected parameters and injected dependencies.

Sometimes turning up the dial on a good idea can create new unintended complexities and problems. Be careful with extremes or treating a single tool as a solution for every problem.

## Dependency injection in JWT Pizza

We are not going to use dependency injection in JWT Pizza, but it is an important and commonly used construct both for application development in general and specifically when applied to testing.

💡 Having a deep understanding of dependency injection could be a useful skill for you in your career. You might consider writing your curiosity report on this subject.
