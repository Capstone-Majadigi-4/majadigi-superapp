export const success = (data: any, message = 'OK', code = 200) => ({
  status: 'success',
  message,
  data,
  code,
});
