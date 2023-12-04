# nextjs-firebase-discord-authentication

A quick example and explanation on how to authenticate your NextJS app using Firebase and NextJS

## Introduction

There are not many guides on how to use Firebase's `signInWithCustomToken` functionality to login with your own custom Auth Provider, such as Discord. With this repo, I wanted to show a quick working example of how to do so. Before you begin you must have:

-   A basic understanding of NextJS 14
-   A basic understanding on Firebase 10
-   A basic understanding on how Firebase functions work

While I also included a NextJS example, I'm going to walk you through the entire setup process. (To an extent)
If you are here for only the Discord part and understand basic authentication already, scroll down to `Adding the Discord Auth`

# Setting up Basic Authentication

s

## Setup Firebase

-   If you dont have a Firebase project, head over to https://firebase.google.com to make one
-   You'll also need to create a Webapp in your project too (Dont use FIrebase hosting since you will need some SSR)

## Add Firebase SDK to NextJS

-   Create your NextJS App (If you havent already)
-   Do `yarn add firebase react-firebase-hooks` to your NextJS App
-   Create a `firebase.tsx` file somewhere in your app, I like `utils/firebase.tsx`
-   Paste in the initializeApp code
-   Export `initializeApp`, `getFirestore`, and `getAuth`

## Configure Basic Authentication

Let's now just get Google Auth to work, as well as a basic secure page

-   Enable Google Authentication in https://firebase.google.com
-   Create a simple Login with Google button where ever you want to login
-   Create an admin page where you must be logged in to
-   Import your provider and `signInWithPopup`, it should look like below

````
<button
    onClick={async () => {
          const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        router.push("/admin");
    }}
>
    Login with Google
</button>```
````

## Configure the session checks

You're going to want to have a Context/Provider to store your user data for easier access and will check to see if the user is logged in and is where they are suppose to access.

-   Create a new Auth Provider, wrap `onAuthStateChanged` in a `useEffect` that updates the user's data (Look at mine in `/providers` as an exampple)
-   In your root level `layout.tsx`, wrap your entire app with `<AuthContextProvider>`
-   Note: Make sure you keep the `isUserLoading` boolean for authenticated pages. You want to make sure the user is loaded before the page is rendered

## Create a logout button

-   In the `/admin` page, simply make a button that calls the `signOut` method on click

```
<button
    onClick={async () => {
        signOut(auth);
        router.push("/");
    }}
>
    Logout
</button>
```

# Adding the Discord Auth

Adding Custom Providers to Firebase is not that difficult once you have an understanding how OAuth2 works and how Firebase uses it.
In simple terms, here are the steps that must be completed for us to login with Discord, or any other OAuth2 provider

1. Generate the login URL. (This is just the URL we go to that logs the user in)
2. Once logged in, we are redirected to our provided `redirect_uri` (A `code` URL param is also appended to the uri)
3. The provided `redirect_uri` is an API route that grabs the code, and then converts that code into a token
4. That token is then coverted into something that is readable to `signInWithCustomToken` using a custom cloud function
5. Once the function converts the token again, we are redirected to a login page that signs us in using `signInWithCustomToken`

Before we begin, we need to first setup Discord

## Add a Discord app

-   Head over to the Discord dev portal to add your app https://discord.com/developers/applications
-   Under the OAuth2 tab copy the Client ID, Client Secret, and Redirect URI to your .env file
-   The Redirect URI must match the API endpoint we are going to create later. Also, you must add this URI to `Redirects` in the Discord Portal

````NEXT_PUBLIC_DISCORD_CLIENTID=123456
NEXT_PUBLIC_DISCORD_CLIENT_SECRET=123456
NEXT_PUBLIC_DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback```
````

## Create Cloud Function

I tried to do this without needing a Cloud Function, but I didnt want any security risks. The Clound Function itself is very simple, it just passes a token into it, and it returns another token. I know we are skipping a step, but we need to add this function first since the Callback API depends on it. If you dont know how Cloud Functions work, I wont be going over it with you, but the code is in this repo for review

-   Enable functions in Firebase, and create a new function from the one in this repo
-   Go to https://firebase.google.com and make a Realtime Database, grab the URL and paste it in the function
-   Generate your service key and rename it then place it in the root, or change the path - https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk
-   Deploy the function (take note of the function's region)

## Create the Callback API

-   Create the `/api/auth/callback/route.tsx` file
-   In that file pass in the `code` URL param into POST `https://discord.com/api/oauth2/token` (Just use my `exchangeCodeForToken` util function)
-   Pass this token into the createToken cloud function that we created above
-   Redirect to a client page such as `/login` and pass the `access_token` result from `createToken` as a URL query

## Create the Login page

-   Create the `/login` page, this is where we will grab the `access_token` to pass into `signInWithCustomToken`, then redirect to the `/admin` page if a user session is found

That's it, you're logged in!
