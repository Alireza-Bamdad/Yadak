// src/utils/sms.js
import 'dotenv/config';
import melipayamakPkg from 'melipayamak';


const Melipayamak = melipayamakPkg.default || melipayamakPkg;

const USER   = process.env.MELIPAYAMAK_USER;
const PASS   = process.env.MELIPAYAMAK_PASS;
const SENDER = process.env.MELIPAYAMAK_SENDER;

if (!USER || !PASS || !SENDER) {
  throw new Error('MELIPAYAMAK_USER/PASS/SENDER را در .env تنظیم کن');
}

const api = new Melipayamak(USER, PASS);
const sms = api.sms();

const to98 = (p) => {
  let d = String(p).replace(/\D/g, '');
  if (d.startsWith('0098')) d = d.slice(4);
  if (d.startsWith('98'))   d = d.slice(2);
  if (d.startsWith('0'))    d = d.slice(1);
  return '98' + d;
};

export const sendSms = (to, text) => sms.send(to98(to), SENDER, text);

export const sendOtpSms = (to, code, minutes = 2) =>
  sendSms(to, `کد تایید شما: ${code}\nاعتبار تا ${minutes} دقیقه`);

