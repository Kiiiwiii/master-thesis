## 0. Basic Information

* Tech-Stack
  * Frontend Framework: React / React-router with `Tsx`
  * UI Library: Ant Design
  * Frontend State Management Solution: Redux with `Thunk-redux`
    - may not neccessary due to the scope of the application
  * Important libraries
    * plotly.js
    * three.js
* Webpack configuration
  * use [react-app-rewired](https://github.com/timarney/react-app-rewired) to override the default settings
  * do **not** npm eject, configure it in `config-overrides.js`
* Environment configuration
  * [guide](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)

## 1. Application Structure

* `chart-components`: all chart relevant component
* `components`: all dumb components
* `containers`: smart components
* `store`: redux relevant
* style relevant:
  * use css-modules in each component for local style
  * use `custom-theme.less` to override the library style(antdesign)
  * use `variables.less` to define variables

## 2. How to run this app

* `npm start`
  * You also need to run backend(see the `README.md` in backend repository).

## 3. Some todos

* extend the visualization encoding system
  * `global > visualisation-mapping.tsx` 
  * find a reasonable way to extend it
* missing full control of all charts
  * right now, only `parallel-coordinates` & `scatter-plot-matrix` have two way interaction bindings:  `chart intercation` <> `Operation panel interaction`
  * other charts do not have it. It is not so easy to update the chart(for example: filter some data) while keep the last chart state(due to the react-plotly library, this feature is not offered). 
  * one walk-around can be hide the Operation panel. Like what I did for `scatter chart`

## Good LUCK





