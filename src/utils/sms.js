import Kavenegar from 'kavenegar';

const sendSms = (phone, message) => {
  const api = Kavenegar.KavenegarApi({
    apikey: process.env.KAVENEGAR_API_KEY
  });

  api.Send(
    {
      message: message,
      sender: "2000660110",  
      receptor: phone,      
    },
    (response) => {
      console.log(response);  
    },
    (error) => {
      console.log(error);  
    }
  );
};

export { sendSms };
