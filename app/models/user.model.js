//const sql = require("./db.js");
import sql from "./db.js";

// constructor
const User = function(user) {
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.profile_id = user.profile_id;
  this.email = user.email;
  this.password = user.password;
  this.genre_id = user.genre_id;
  this.userImg = user.userImg;
  this.isBanned = user.isBanned;
};

User.create = (newUser, result) => {
  let reqSql = "INSERT INTO users (firstName, lastName, email, password, genre_id, isBanned ) VALUES ? ";
  let record = [[newUser.firstName, newUser.lastName, newUser.email, newUser.password, newUser.genre_id, newUser.isBanned]];
  sql.query(reqSql, [record] , (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.insertUserProfile = (userId, profileId, result) => {
  sql.query(`INSERT INTO user_profile (profile_id, user_id) VALUES ('${profileId}','${userId}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Inserted user profile: ", { user_id: userId, profile_id: profileId });
    result(null, { user_id: userId, profile_id: profileId });
  });
};

User.updateUserProfile = (userId, profileId, result) => {
  sql.query("UPDATE user_profile SET profile_id = ? WHERE user_id = ?",
      [profileId, userId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Inserted user profile: ", { user_id: userId, profile_id: profileId });
    result(null, { user_id: userId, profile_id: profileId });
  });
};

User.login = (userTmp, result) => {
  sql.query(`SELECT id, firstName, lastName, email, userImg, genre_id, up.profile_id FROM users JOIN user_profile up on up.user_id = users.id WHERE email = '${userTmp.email}' AND password = '${userTmp.password}' `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.getAllWithProfiles = result => {
  sql.query("select * from users u join user_profile up on u.id = up.user_id", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users with profiles: ", res.length, " users.");
    result(null, res);
  });
};

User.getPassword = (email, result) => {
  sql.query(`select password, profile_id from users u join user_profile up on u.id = up.user_id where u.email = '${email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAllUserProfiles = result => {
  sql.query("SELECT * FROM profile", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("UserProfiles: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET email = ?, firstName = ?, lastName = ?, userImg = ? WHERE id = ?",
    [user.email, user.firstName, user.lastName, user.userImg, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};


User.updateByIdFromAdmin = (id, user, result) => {
  sql.query(
      "UPDATE users SET email = ?, genre_id = ?, isBanned = ?, firstName = ?, lastName = ?, userImg = ? WHERE id = ?",
      [user.email, user.genre_id, user.isBanned, user.firstName, user.lastName, user.userImg, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found User with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated user: ", { id: id, ...user });
        result(null, { id: id, ...user });
      }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.deleteUserProfile = (userId, profileId, result) => {
  sql.query(`DELETE FROM user_profile WHERE user_id = '${userId}' and profile_id = '${profileId}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted userProfile with userid: ", userId);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

export default User;
