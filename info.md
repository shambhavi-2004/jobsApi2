## render

go to web services
buildcommand=>npm install

## postman documentation

ensure all global url is same in all reuests=>basically only put prod url and not base url in all requsest

this collection will be hosted on seperate url when hosten online=>if we wnat to host that doc on the same url as render one we're using we'll have to use swagger ui

we cant pass postman docs directly into swagger ui=>first we need to format data using apimatic

## apimatic

So this is the case where we'll add the proper URL.

We'll set up the proper authorization,

and all that cool stuff.

basic settings=>save
Server Configuration =>server=>https://jobs-api-1-b3q0.onrender.com/api/v1

authentication=>bearer token
endpoints =>onlty the jobs route have the authentication
jobs route=>job folder
auth route =>auth folder

then export api=>openapi yaml

## swagger ui

now let's test it out in their swagger ui editor

which is a nifty tool that we can use to test

out our API docs right in the browser.

## yamlJs

conevrts yaml file to something that swagger ui can understand

## require swaggeruijs as wellas yaml

## load the yaml file

## pass it on to swagger ui

## setting up docs using swagger ui

set up query params using swagger paramas=>common params
replace the query

we added the id param to this route
params with /jobs/{id}:
parameters: - in: path
name: id
schema:
type: string
required: true
description: The job ID

now we can testb the api

then set it up in our application

## how is node and express diff

Node.js and Express.js are related but serve different purposes in the JavaScript ecosystem, especially for server-side development. Here's a breakdown of their differences:

### Node.js

1. **Runtime Environment:**

   - Node.js is a runtime environment that allows you to run JavaScript on the server side. It uses the V8 engine from Google Chrome to execute JavaScript code.

2. **Built-in Modules:**

   - Node.js provides a range of built-in modules (like `http`, `fs`, `path`, etc.) that you can use to build server-side applications. These modules handle low-level operations like networking, file systems, and other core functionalities.

3. **Event-driven, Non-blocking I/O:**

   - Node.js uses an event-driven, non-blocking I/O model which makes it lightweight and efficient, especially for I/O-heavy tasks.

4. **Foundation:**
   - Node.js acts as the foundation upon which various frameworks, including Express.js, are built.

### Express.js

1. **Web Framework:**

   - Express.js is a web application framework built on top of Node.js. It simplifies the process of building web applications and APIs.

2. **Middleware:**

   - Express uses middleware functions to handle requests and responses. Middleware can be used for tasks like parsing request bodies, handling cookies, logging, authentication, etc.

3. **Routing:**

   - Express provides a robust routing mechanism to handle various HTTP requests (GET, POST, PUT, DELETE, etc.). It allows you to define routes for your application in a more organized and readable way.

4. **Abstraction:**
   - While Node.js provides low-level APIs, Express provides higher-level abstractions for common web development tasks, making it easier and faster to build web applications.

### Summary

- **Node.js**: A runtime environment that executes JavaScript on the server-side, providing basic functionalities through its built-in modules.
- **Express.js**: A framework built on top of Node.js that provides a higher-level abstraction for building web applications and APIs, offering features like middleware, routing, and more.

In essence, Node.js provides the core functionalities and environment, while Express.js leverages those functionalities to offer a more streamlined and efficient way to build web applications.
