https://chatgpt.com/c/5a2e1ef1-97c0-43bd-8b58-5000664cbe55

## client=>build=>static

When you create a React application with create React app

you have this option of basically taking all of your code

and then creating a production-ready application,

which is just a bunch of static assets.

## npm run build is essential before deploying your React application to production.

## in client=>utils/axios=>base url

where I changed the base URL.

If you remember from the React course,

I used the server that is already running on Heroku.

In this case, since the static assets

will be on our own server,

we don't need to have the long URL.

I'm just going with API version one

and then rest is history.

## client/build has a specific router for the frontend

That pretty much takes all of the requests,

apart from the ones that are going to the API.

It takes those requests

and then it provides the actual page.

Now, if the asset for the page doesn't exist,

then of course we still go to not found middleware.

## always first check from networks on dev tool that what kind of req is being sent,and acc to the endpoint if that request,make changes on backend accordingly,to provide suitable data as response

## update profile
