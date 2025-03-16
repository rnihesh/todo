const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req, res) {
  const newUserAuthor = req.body;
  const userInDb = await UserAuthor.findOne({ email: newUserAuthor.email });

  if (userInDb !== null) {
    res.status(200).send({ message: "User already exists", payload: userInDb });
  } else {
    let newUser = new UserAuthor(newUserAuthor);
    let newUserorAuthorDoc = await newUser.save();
    res.status(201).send({ message: "User created", payload: newUserorAuthorDoc });
  }
}

module.exports = createUserOrAuthor;
