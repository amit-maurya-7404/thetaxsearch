import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_HASH || "admin123"

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function verifyAdminPassword(password: string): boolean {
  // In production, compare with stored hash
  return password === ADMIN_PASSWORD
}

export async function validateAdminAuth(authHeader?: string): Promise<boolean> {
  if (!authHeader) return false

  try {
    const token = authHeader.replace("Bearer ", "")
    const decoded = verifyToken(token)
    return !!decoded
  } catch {
    return false
  }
}
