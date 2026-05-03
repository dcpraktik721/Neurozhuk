const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  '11111111',
  '00000000',
  'password',
  'password1',
  'qwerty123',
  'qwertyui',
  'admin123',
  'admin1234',
  'letmein1',
  'iloveyou',
  'neurozhuk',
  'пassword',
  'пароль123',
  'йцукен123',
]);

export const MIN_PASSWORD_LENGTH = 8;

export function validatePasswordPolicy(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Пароль должен содержать минимум ${MIN_PASSWORD_LENGTH} символов.`;
  }

  const normalized = password.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(normalized)) {
    return 'Пароль слишком простой. Используйте более устойчивую комбинацию.';
  }

  if (/^(.)\1+$/.test(password)) {
    return 'Пароль слишком простой. Не используйте повтор одного символа.';
  }

  if (/^\d+$/.test(password)) {
    return 'Пароль слишком простой. Добавьте буквы.';
  }

  if (/^[\p{L}]+$/u.test(password)) {
    return 'Пароль слишком простой. Добавьте цифры.';
  }

  const hasLetter = /\p{L}/u.test(password);
  const hasNumber = /\d/.test(password);
  if (!hasLetter || !hasNumber) {
    return 'Пароль должен содержать буквы и цифры.';
  }

  return null;
}
