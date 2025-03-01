# DevTinder APIs

##authRouter
-POST /signup
-POST /login
-POST /logout

##ProfileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

##connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:userId
-POST /request/review/rejected/:userId

##userRouter
-GET /user/connections
-Get /user/requests
-Get /user/feed - Gets you the profile of the other users on  Platform

Status: ignore, interested, accepeted, rejected
