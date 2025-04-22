const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/database");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    institute,
    education_level,
    password,
    is_admin = false,
  } = req.body;

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
          "INSERT INTO user (name, email, institute, education_level, password,is_admin) VALUES (?, ?, ?, ?, ?,?)",
          [name, email, institute, education_level, hash, is_admin],
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

const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  db.query(
    `SELECT * FROM user WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }

      if (!result.length) {
        return res.status(401).send({
          msg: "Email or Password is incorrect",
        });
      }

      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(400).send({
              msg: bErr,
            });
          }

          if (bResult) {
            const token = jwt.sign(
              {
                email: result[0]["email"],
                is_admin: result[0]["is_admin"],
              },
              JWT_SECRET,
              { expiresIn: "1h" }
            );

            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: {
                name: result[0]["name"],
                email: result[0]["email"],
                is_admin: result[0]["is_admin"],
              },
            });
          } else {
            return res.status(401).send({
              msg: "Email or Password is incorrect!",
            });
          }
        }
      );
    }
  );
};

const getUser = (req, res) => {
  const authToken = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(authToken, JWT_SECRET);
  console.log("getUser started working");
  db.query(
    "SELECT * FROM user where email = ?",
    [decode.email],
    function (error, result, fields) {
      if (error) throw error;

      return res.status(200).send({
        success: true,
        data: result[0],
        message: "Fetch Successfully!",
      });
    }
  );
};

const getCounsellingUserInfo = (req, res) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(authToken, JWT_SECRET);

    db.query(
      "SELECT name, email FROM user WHERE email = ?",
      [decoded.email],
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Database error", error });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
          success: true,
          data: result[0], // Only name and email
          message: "Counselling user info fetched successfully",
        });
      }
    );
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

const createCounselingRequest = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract values from the request body
  const { name, email, topic, phone, counseling_date, counseling_time } =
    req.body;

  // Insert into the database
  db.query(
    "INSERT INTO counseling (name, email, topic, phone, counseling_date, counseling_time) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, topic, phone, counseling_date, counseling_time],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      return res.status(201).json({
        message: "Counseling request created successfully!",
      });
    }
  );
};

const getAllCounselingRequests = (req, res) => {
  // Query to fetch all counseling requests from the database, ordered by date and time (latest first)
  db.query(
    "SELECT * FROM counseling ORDER BY counseling_date DESC, counseling_time DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error retrieving counseling requests",
          error: err,
        });
      }

      // Return the retrieved counseling requests
      return res.status(200).json({
        success: true,
        data: result,
        message: "Counseling requests fetched successfully",
      });
    }
  );
};

const getAllUserData = (req, res) => {
  // Query to fetch all user data (name, email, institute, education_level)
  db.query(
    "SELECT name, email, institute, education_level FROM user",
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error retrieving user data",
          error: err,
        });
      }

      // Return the retrieved user data
      return res.status(200).json({
        success: true,
        data: result,
        message: "User data fetched successfully",
      });
    }
  );
};

  console.log("all the controllers loaded");

module.exports = {
  signup,
  login,
  getUser,
  getCounsellingUserInfo,
  createCounselingRequest,
  getAllCounselingRequests,
  getAllUserData,
};
