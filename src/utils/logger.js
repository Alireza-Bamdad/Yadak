export const log = (message, data = null) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${message}`, data || '');
};
