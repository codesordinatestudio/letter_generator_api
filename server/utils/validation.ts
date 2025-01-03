import bcryptjs from 'bcryptjs';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { jwtVerify, SignJWT } from 'jose';

dotenv.config();

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || '5555sec';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const generateRandomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, JWT_SECRET).toString();
};

export const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, JWT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const hashPassword = (password: string) => {
  return bcryptjs.hashSync(password, saltRounds);
};

export const verifyPassword = (password: string, hash: string) => {
  return bcryptjs.compareSync(password, hash);
};

export const generateJWT = async (payload: any) => {
  return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(encodedSecret);
};

export const verifyJWT = async (token: string) => {
  return await jwtVerify(token, encodedSecret);
};