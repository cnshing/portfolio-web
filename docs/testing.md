# Testing

In general, most of the code is not tested, with the exception of many of the various services and/or directives used in the application. Many of the components did not need testing because they were already being tested in [ZardUI](http://zardui.com/).

## CI/CD

Every new commit will run and publish the results of `ng test` through GitHub Actions. Additionally, code coverage reports are [generated](https://github.com/davelosert/vitest-coverage-report-action) per pull request.

## Code Coverage

The [code coverage](https://angular.dev/guide/testing/code-coverage) is output to `coverage/portfolio-web`.

## Testing Libraries

The project follows the standard Angular testing [basics](https://angular.dev/guide/testing/components-basics) for the most part, with the exception of moving to [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/) for some of the component testing.
