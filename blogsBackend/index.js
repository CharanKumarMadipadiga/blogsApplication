import express from "express"
import 'dotenv/config'
import {dbConnection, closeConnection} from './db/dbConnection.js'
import postRouter from './routes/post.route.js'
import userRouter from './routes/user.route.js'

const app = express()

app.use(express.json())

dbConnection()  //Database Connection

//routes
app.use('/', postRouter);
app.use('/user', userRouter)



app.listen(process.env.PORT, ()=> {
    console.log(`Server listening to port ${process.env.PORT}`)
})


process.on('SIGINT', () => {
    console.log('\nGracefully shutting down...');
    closeConnection();  // Close the database connection
    process.exit(0);
});