require("dotenv").config()
const app= require("./Src/app")
const connectToDb=require("./Src/config/database")

connectToDb()

const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on ${PORT}`);
});