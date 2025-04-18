const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/database");

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, institute, education_level, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE LOWER(email) = LOWER(?)",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ message: err });

      if (result.length > 0) {
        return res.status(409).json({ message: "This user already exists" });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: err });

        db.query(
          "INSERT INTO user (name, email, institute, education_level, password) VALUES (?, ?, ?, ?, ?)",
          [name, email, institute, education_level, hash],
          (err, result) => {
            if (err) return res.status(500).json({ message: err });

            return res
              .status(201)
              .json({ message: "User has been registered" });
          }
        );
      });
    }
  );
};

module.exports = {
  signup,
};
