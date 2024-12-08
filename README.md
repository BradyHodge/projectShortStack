# Overview

Do you hate typing long URLs? Are you running out of space in your twitter bio? Fear no more!

Project Short Stack is a URL shortening service hosted at [sho.rtstack.cc](https://www.typescripttutorial.net/). You can create a super clean link to (almost) anywhere on the vast internet, for free! You can even set custom "Trusted Domains" to get rid of those pesky warring messages while redirecting.

[Software Demo Video](null)

# Development Environment

This project is written in Typescript and uses Node.js as the engine. REST routes are handled by Express.js and the web frontend is static html (with some fancy CSS animations) served using a GET request.

# Useful Websites

- [Typescript Tutorial](https://www.typescripttutorial.net/)
- [Express JS](https://expressjs.com/en/guide/routing.html)

# Future Work

- Fix bug where unchecking the trusted domains box doesn't remove it from the whitelist
- Implement a database for persistent storage (instead of making a fake one in RAM)
- Add user login to save preferences and custom URLs

<hr>

### Notice:
- Links on Short Stack may be removed at any time for any reason (including no reason at all)
- Absolutely no user data is collected by this service