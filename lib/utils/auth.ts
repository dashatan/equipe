import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, isDemo?: boolean }
    
    if (decoded.isDemo) {
      return decoded.userId // Return demo user ID
    }
    
    await dbConnect()
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return null
    }
    
    return user._id.toString()
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function generateToken(userId: string, isDemo = false): string {
  return jwt.sign(
    { userId, isDemo },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}