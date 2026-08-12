import express from 'express';
import process from 'process';
import path from 'path';

import productValidationRules from './validators/productValidator.js';
import categoryValidationRules from './validators/categoryValidator.js';
import productRouter from './routers/productRouter.js';
import categoryRouter from './routers/categoryRouter.js';

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
	res.render('index');
})

app.use('/products', productRouter);
app.use('/categories', categoryRouter);


app.use((req, res) => {
	res.status(500).render('error', { status: 500, message: 'Internal Server Error', details: 'An unexpected error occurred.' });
});


app.listen(PORT, async () => {
	console.log(`App is running in port ${PORT}`);
});