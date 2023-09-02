import express from "express"
import colors from "colors";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import connectDB from "./config/db.config.js"
import { APP_PORT } from "./constants/index.js"
import clientRoutes from "./routes/client.js"
import generalRoutes from "./routes/general.js"
import managementRoutes from "./routes/management.js"
import salesRoutes from "./routes/sales.js"

const PORT = APP_PORT || 8000
connectDB()

//CONFIGURATION
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(cors())

//ROUTES
app.use("/client", clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('sales', salesRoutes)



app.listen(PORT, () => console.log(`Server started on port ${PORT}`.cyan.underline)
)


