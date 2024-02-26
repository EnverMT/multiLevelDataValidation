# Google Sheet multi level data validation

This code allow you to set data validation rules which depend on cell values. Depth of rule is not limited.

## How to use:

1. Copy content of `./build/*.js` folder to your Google Sheet App script.
2. Change file extension from `*.js` to `*.gs`
2. Edit `1.Code.gs` file to configure for you desire.


## How to contribute

### Requirements
- Install [NodeJS](https://nodejs.org/en)
- Install [Clasp](https://github.com/google/clasp) 
```npm install -g @google/clasp```
- Login to Clasp and give required permissions
```clasp login```
- Install Typescript https://github.com/google/clasp/blob/master/docs/typescript.md
```npm i -S @types/google-apps-script``` 

### Code

1. Fork and clone this repository
2. Configure your `scriptId` and `rootDir` in `.clasp.json` file. 
3. Install node modules `npm install --dev` 
4. After making changes compile `src/*.ts` files to folder `build/` with command
```tsc```
5. Push changes to your Google Sheet 
```clasp push```