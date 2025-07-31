import bcrypt from "bcrypt";

const password = "admin123"; // your desired password
const saltRounds = 10;

const hashPassword = async () => {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
};

hashPassword();
