# UI Testing

To get Playwright to run I followed the instructions in [cs260](https://learn.cs260.click/page/webServices/uiTesting/uiTesting_md). I did have to change the created file so use ES modules instead of Common modules. This was a simple change from the `required` syntax to the `import` syntax.

```js
const { defineConfig, devices } = require('@playwright/test');
import { defineConfig, devices } from '@playwright/test';
```

I also modified the config file to drop out the extra browsers and to specify the webServer to work with Vite on startup.

```js
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
```

I then deleted the examples and modified the simple `example.spec.js` to be the following.

```js

```

Because I didn't install any browsers on startup I had to do that before the tests would run.

Press `Shift+Command+P` to open the Command Palette in VSCode, type 'Playwright' and select 'Install Playwright Browsers'.

I only selected Chromium.

I then went to the VS Code test extension and ran the tests.
