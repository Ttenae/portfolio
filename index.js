const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());


let profile = {
  name: "Tesfaye Tilahun",
  bio: "I am a web developer.",
  age: 20,
  email: "tesfaye@example.com",
  city: "Addis Ababa"
};


app.get("/profile", (req, res) => {
  res.json(profile);
});


app.put("/profile", (req, res) => {
  const { name, bio, age, email, city } = req.body;

  if (name) profile.name = name;
  if (bio) profile.bio = bio;
  if (age) profile.age = age;
  if (email) profile.email = email;
  if (city) profile.city = city;

  res.json({
    message: "Profile updated successfully!",
    profile
  });
});


app.delete("/profile", (req, res) => {
  profile = {
    name: "",
    bio: "",
    age: null,
    email: "",
    city: ""
  };

  res.json({
    message: "Profile cleared!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});