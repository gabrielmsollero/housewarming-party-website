const env = import.meta.env;

export const config = {
  whatsapp: env.PUBLIC_WHATSAPP,
  pix: {
    key: env.PUBLIC_PIX_KEY,
    name: env.PUBLIC_PIX_NAME,
    city: env.PUBLIC_PIX_CITY,
  },
  stripe: { anyAmount: env.PUBLIC_STRIPE_ANY_AMOUNT },
};
