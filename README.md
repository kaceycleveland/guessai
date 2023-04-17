


<p align="center">
<img width="434" height="375" src="/public/guessai.png">
</p>

# GuessAI

**Supabase AI Themed Hackathon 2023** :partying_face:

## TLDR

### Checklist
Link to hosted demo: [https://guessai.vercel.app/](https://guessai.vercel.app/)
Only team member is me @kaceycleveland
My `Supabase` usage:
- I used a database for all my data storage.
- I used a `Supabase` edge function to make calls and pull data for words and clues from OpenAI's API.
- I used a database as the primary "time tracker" by querying for `CURRENT_DATE` against the database in javascript via an RPC call.
- I used multiple other RPC calls to get other data such as the countdown timer in the top nav to get the `INTERVAL` until the next game/word.
- I used Supabase Authentication in a experimental NextJS 13 app with the example given in the documentation.
  - It is awesome that you have some documentation on this! I think a lot of people are still catching up to support the `app` directory.

IMPORTANT
I sent test admin credentials in the submission to Supabase if you would like to see that.


See below for more complete reflections/thoughts (and probably typos because not all of this was proof-read)!


-------------------------------------

GuessAI is an AI powered word guessing game. You get a given amount of guesses per clue and a certain amount of clues as well to guess a word. GuessAI is "AI powered" in the sense that the main functionality of the game is sourced from AI. The OpenAI API is prompted to generate new words and clues to go with those words so every clue and word you see is generated via AI!

I did this side project in about the span of a week for Supabase's AI themed hackathon; I was already experimenting with AI to a certain degree so this was a great opportunity to put some of those experimentations to use! In retrospect, I probably would not have done something to this caliber as a solo developer :upside_down_face:. While it was rewarding, it took all of my allocated video game time for the past week to finish! None the less, I am happy with the turn out and will keep iterating on it.

See the section below for a high level technical walkthrough of how guessing works and AI is utilized to generate new words and clues.

## Gameplay 

### Using Supabase :computer:
I have heard of Supabase prior to this hackathon but this is my first time using it. I have wanted to use Firebase for some projects but I have yet to get the chance to try it out but in the future, I would like to give some feedback to the Supabase team once I get a chance to touch some other platforms that have a similar product offering!

My initial impressions of Supabase are overall positive! I will list out some of my notes below (while also detailing my usage in the project):

My usage:
- I used the database for all my data storage.
- I used the database as the primary "time tracker" by querying for `CURRENT_DATE` against the database in javascript via an RPC call.
- I used multiple other RPC calls to get other data such as the countdown timer in the top nav to get the `INTERVAL` until the next game/word.
- I used Supabase Authentication in a experimental NextJS 13 app.
  - It is awesome that you have some documentation on this! I think a lot of people are still catching up to support the `app` directory.

Pros:
- The time spent to get started was pretty minimal; I was creating tables and pulling the data pretty quickly into my application.
- The UI in the application dashboard is very intuitive; I never really had issues trying to find things I was trying to do.
- The JS Client is sorta magic; The TypeScript type inference on the JS client worked pretty well.
- The query builder on the JS Client was great.
- The CLI to generate the database types is amazing as well. It reminds me of `Prisma` without needing to adhere to a new schema.
- Documentation for the JS client and also the AI powered search/suggestions were great!

Cons/things I personally found confusing:
- The JS Client sometimes seemed to have the wrong type or gave an error in the `data` field.
  - This was super rare; overall it was super accurate.
- When I query for some joined data, there was a lot of TypeScript type narrowing required to get the types in a consumable form.
  - I ended up writing a utility function to narrow a lot of these which was SUPER helpful: [Type Narrowing Util](lib/utils/narrow-items.ts)
- Authentication and permissions seemed great for my project at first but I found it easier to create an admin `Supabase` client and checking for permissions myself.
  - I could potentially improve on this I think; I do not really utilize policies as much as I should in this project as it stands. Would love to learn more about how to incorporate it more.

### Using AI :robot:

I utilized AI in a couple different ways:
- Images and favicon are generated via AI.
- OpenAI API is used under the covers to generate words and clues which is the core of the application/game!


### How OpenAI is queried under the covers

See the prompts used [here](app/(admin)/words/prompts.ts)

1. The prompts linked above are sent in order to OpenAI API from a `Supabase` edge function.
2. Between prompts, cleaning is done on the returned results.
   - Sometimes clues would give away the answer by using the word; I filter these out.
   - Sometimes numbering or bullet points were used; I filter those off the beginning.
   - Words need to have punctuation and casing removed.
3. Data is returned in a endpoint to be shown to an admin user for validation.
4. The admin user can save the word and then assign the word to a day.

Steps 3 and 4 can be automated in the future; the results I have seen so far from the OpenAI API have been consistently pretty good. I will eventually use a cron job setup in `Supabase` (cool you have examples of this too!) to do this and assign generated words to the next day.


### How guessing works under the covers

On intial page load, there is some querying to `Supabase` but ultimately not too much. Mostly it is just to get the first clue of the current day and show it to the user. No `game` is created until a user makes a guess or requests for a new clue. This is intentional as I don't want a new game entry created in the database everytime someone visits the site! Once they take an action, a game is created and a reference is created and stored as a cookie. At this point, the user can continue playing anonymously but no progress is saved. The user can optionally log in and it will "claim" the anonymous game and the user can continue and this will now give the logged in user ownership over that game and clear out the cookie as well.



### Plans going forward

- I want to utilize policies for security more then I do currently instead of using a `Supabase` admin client.
- The admin panel needs to be built out more; the main functionality is all there but adding pagination will be a must going forward for one.
- Add pagination to the admin page, games page, etc.
- Allow viewing of previous games from the games page at a url like `/game/[id]`.
- Potentially allow for playing previous day games.
- Aggregate collective user data to get statistics per `word` on how the average guesser does.
- Use `Supabase` realtime services to send data to users letting them know when other users finish guessing.
  - Maybe even add a "phone a friend" option with this?!
- Flesh out user authentication. It is super simple and email verification is disabled. Also add some providers.
- Automating the generation of words from OpenAI API and assigning them to the next day.
- Better messaging on "what to do" on the homepage with tooltips.
- Better API checks. Overall a lot is in place but the UI safe guards more so then the API currently.
- Cron job to clear out old anonymous game instances.