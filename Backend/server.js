require("dotenv").config()
const app= require("./Src/app")
const connectToDb=require("./Src/config/database")



connectToDb()



app.listen(3000, () => {
    console.log("Server is running on port 3000");
})