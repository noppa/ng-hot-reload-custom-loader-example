# Example for a custom ng-hot-reload loader

This example works as a demo and possible solution for a [ng-hot-reload issue](https://github.com/noppa/ng-hot-reload/issues/24).

The app doesn't do much, it's just a simple counter, but serves as a proof of concept
demo of creating a custom Webpack loader that uses the [ng-hot-reload-core](https://www.npmjs.com/package/ng-hot-reload-core) package under the hood. This might be useful to you
if the default [ng-hot-reload-loader](https://www.npmjs.com/package/ng-hot-reload-loader)
package doesn't fit your app setup for one reason or another.

Hopefully, the takeaway of this demo is that it's pretty easy to create custom
loader of your own using the tools in the core package.

The actual hot loader code for this example is in [development/hot-loader.js](development/hot-loader.js). Note that this is just an example of one kind of loader that is built
for the setup described in [issue #24](https://github.com/noppa/ng-hot-reload/issues/24).
Your setup may vary and the loader needs to be modified accordingly.

# Running the demo app
```
git clone https://github.com/noppa/ng-hot-reload-custom-loader-example.git
cd ng-hot-reload-custom-loader-example
npm install
npm start
```
Open localhost:8080.  
Edit controller.js or SomeComponentTemplate.html to see results hot reloaded.

