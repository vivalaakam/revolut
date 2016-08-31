Architecture requirements:
* React, Redux, Redux-Saga, Webpack, Babel, CSS Modules
* Actions as [FSA](https://github.com/acdlite/flux-standard-action)
* Reducers should be colocated with actions by domain in the
  [ducks](https://github.com/erikras/ducks-modular-redux) manner

Project description:
* Every input field is required
* Birthdate field should be masked as DD.MM.YYYY and validated as real date
* Changing date should recalculate the astro sign and put it to the url
  placeholder (`http://r.revolut/astrosign/username`)
* Username should be validated as url-safe value
* Changing username should be optimistic update and the value should be set to
  the url placeholder (`http://r.revolut/astrosign/username`)
* Phone No should accept numbers only
* When both bithdate and username are set up app should start checking the url
  availability with the next steps:
  1. Get the request token with api `/:astrosign/:username`
  2. Get the availability checking progress with `/:astrosign/:username?token=:token`
     and display the progress indicator to the user
  3. When the progress hits 100 display the url availability status

Crappy test backend api:
https://github.com/morhetz/revolut-test
