import bcrypt from "bcryptjs"

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  return hashedPassword
}

export function comparePassword(password: string, hashed: string) {
  return bcrypt.compareSync(password, hashed)
}
