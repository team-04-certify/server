let env = process.env.NODE_ENV;

if (env === "development" || env === "test") {
  require("dotenv").config();
}

const app = require("../app");
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
