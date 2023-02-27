export const AuthConfig = {
  // Secret used to sign JWTs
  JWT_SECRET: "KaXn9T8SgXXr7XX5kcuF3gY7u8A9MADbGJ9sfW4gH28PMI01LC54ISYqohc6Cgv",
  // Invalidate JWTs older than 24h
  JWT_EXPIRY: "24h",
  // Number of rounds to hash passwords, used by bcrypt
  SALT_ROUNDS: 10,
};
