# portfolio-web

This project contains everything I did to create this [portfolio site](http://chansh.ing/). Everything from the source code to the design files are open sourced and free to modify as you see fit.

## Documentation
This README contains what you need to get started. For more specifics on the project, visit the [docs](https://github.com/cnshing/portfolio-web/tree/main/docs) folder.

## Tech Stack
The following tools were used:
* [ZardUI](http://zardui.com/)
* [Three.JS](https://threejs.org/manual/#en/fundamentals)
* [GSAP](https://gsap.com/)
* [Angular](https://angular.dev/)
* [Vitest](https://vitest.dev/)
* [Github Actions](https://github.com/features/actions)
* [Cloudflare Pages](https://pages.cloudflare.com/)
* [ngx-markdown](https://www.npmjs.com/package/ngx-markdown)
* [ngx-lottie](https://www.npmjs.com/package/ngx-lottie)

## Development server

To start a local development server, run:

```bash
ng serve --ssl
```

Once the server is running, open your browser and navigate to `https://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

SSL must be enabled in order for any 3D related functionality to work.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

Testing is done with [Vitest](https://vitest.dev/) officially supported in Angular 21:

```bash
ng test
```
