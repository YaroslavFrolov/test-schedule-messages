## **Start application**

- install and start redis-db on your local machine (on port 6379) as systemd servive
- clone repo
- go to backend-nestjs folder, execute `yarn install` and `yarn dev`
- go to frontend-nextjs folder, execute `yarn install` and `yarn dev`
- open browser on [http://localhost:3000](http://localhost:3000) and you are ready

<br />

## **Tradeoffs**

- I realize all corner cases related to setting specific time for some event in future. User may setup wrong time/timezone settings on his OS, user may change his current location, go to Japan, and so on. Handling all these cases needs additional time and requirements to implement correctly. More over it closely related to user profile and hence authentication/autorization features.

- I understand that frontend part needs some more abstractions like react-hook-form, zod, some fetching-library, animations, better structure of folders and so on. But all these need additional time.

- The same is regarding "dockerize" the project.. need additional time to implement it..))

<br/>

## **Task description**

Build a simple full-stack application using Next.js for the frontend and Nest.js for the backend. The application should allow users to schedule messages to be printed at a specified time in the future. Even if the user refreshes the page, the scheduled messages should still be displayed.

- Backend should be implemented via nestjs.
- Frontend should be implemented via nextjs.
- DB should be implemented via redis.

**Up to 5 hours to implement**
