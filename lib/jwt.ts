import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';

  return jwt.sign(
    { userId, role } as Record<string, unknown>,
    secret
  );
};

export const verifyToken = (token: string): { userId: string; role: string } | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded: unknown = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded && 'role' in decoded) {
      const decodedObj = decoded as Record<string, unknown>;
      return {
        userId: String(decodedObj.userId),
        role: String(decodedObj.role)
      };
    }

    return null;
  } catch {
    return null;
  }
};
