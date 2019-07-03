## Doggy Dialogue

Doggy Dialogue is a forum for dog lovers to post questions and reply to all matters regarding dogs. Users can sign up for a user name and password and once logged in, can make posts in various forums as well as reply to other users posts.

Link to client repo: https://github.com/navin1551/doggy-dialogue-app

Link to API repo: https://github.com/navin1551/doggy-dialogue-server

Link to live app: https://doggy-dialogue-app.now.sh/

## Motivation

I was inspired to create an app that allows dog lovers to have a community where they can ask and answer all questions about dogs. As a dog lover and owner myself I've found that I always have some question come up regarding training, feeding or just general dog stuff and felt motivated to create a forum all about dogs. 

Technologies implemented: HTML, CSS, JavaScript, React.js, Node.js, Express.js, PostgreSQL, JWT auth flows, Mocha/Chai testing, API, Git, GitHub


# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/navin1551/express-boilerplate.git`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
