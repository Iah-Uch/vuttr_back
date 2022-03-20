/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import Express from 'express'
import Cors from 'cors'
import Helmet from 'helmet'
import RateLimit from 'express-rate-limit'
import Morgan from 'morgan'
import Mongoose from 'mongoose'
import Tool from './routes/tool'
import 'dotenv/config'


const app = Express()
const mongoUri = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
Mongoose.connect(`${mongoUri}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 .then(() => console.log('Connected to MongoDB...'))
.catch((err)=> console.log(`Could not connect to MongoDB...${err}`))

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limits each IP to 100 requests in an interval (windowMs)
  standardHeaders: true, // Returns rate limit info
  legacyHeaders: false // Disables the `X-RateLimit-*` headers
})

// Middlewares
app.use(Cors())
app.use(Helmet())
app.use(Morgan('tiny'))
app.use(Express.json())
app.use(limiter)

app.use('/tools', Tool)

const port =  process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))