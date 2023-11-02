export const corsOptions = {
  origin: [process.env.FRONT_END_URL],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Access-Control-Allow-Headers', 'Authorization', 'Accept'],
}
