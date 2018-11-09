P-Slides boilerplate
====================

A boilerplate to create presentations with [P-Slides](https://github.com/MaxArt2501/p-slides)

## What's in here?

This boilerplate offers a development workflow to use P-Slides.

Put your presentation HTML skeletons in `src/presentations` and your slides/groups of slides in `src/slides`.

It adds extra functionalities to the presentation:
* Forward/backward buttons for navigation
* Progress bar
* Fullscreen toggle button
* Speaker mode toggle button (Alt-M also works)
* Background color matching with the current slide
* Routing with URL fragments
* Minor style additions

## Usage

This boilerplate uses [Gulp](https://gulpjs.com/) under the hood.

### `npm run build`

This executes Gulp's default task. It:
* copies everything inside the `static` directory into `public`;
* copies P-Slides modules and stylesheets into `public/vendors/p-slides`;
* compiles `.scss` files in the `src/styles` directory, generates sourcemaps and copies the result into `public/css`;
* copies `.js` files inside the `src/js` directory into `public/js`.

To run the presentation, just serve `public/` with the HTTP static server of your choice.

### `npm run serve`

This does all of the above, but also starts a BrowserSync server, which auto-injects newly-compiled stylesheets and
reloads the page whenever a `.js` or file inside `static` is modified.

### `npm run clean`

Deletes the `public` directory.
