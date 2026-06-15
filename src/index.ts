import { createApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 workshop-starter in ascolto su http://localhost:${PORT}`);
  console.log(`   GET http://localhost:${PORT}/api/health`);
});
