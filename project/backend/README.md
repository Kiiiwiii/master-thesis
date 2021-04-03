## 0. Background Information

* Data preprocessing: Ifc convert
* Server: Node/Express in `typescript`
* Database: MongoDB

## 1. Application Structure

* `dist`: compiled files
* `files`: the place to store the files which are uploaded by users.
* `public`: host static files
  * `ifc-Convert`:  for data preprocessing
  * `user-study-only`: walk around to get obj&mtl&images for building variant.
* `src`
  * `database`: for database connection, schema and so on.
  * `route-middleware`: for backend routing with express
* `server.ts`entrance file

## 2. How to run this app?

* use git clone to pull this project
* run the following command to
    * install dependencies
    `npm install`
    * install mongodb
    * set environment variables
    `cp example.json config.json`
    * run mongodb
    `mongod --dbpath ~/mongodb-data`
    * use ts to compile first
    `npm run watch-ts`
    * start the server
    `npm run watch-node`

## 3. Todo

* **DO NOT USE** the ifcConvert, it is really painful.
  * try to ask users to provide or upload the obj & mtl files 
    * provide a link in the csv file, like what I did now
    * or upload all the obj & mtl files

* Route protection

## * Hint

* be care of CORS issue between frontend & backend

##GOOD LUCK