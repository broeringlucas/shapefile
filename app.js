const express = require('express')
const app = express()
const shapefileReader = require('./routes/shapefileRoute');

app.use(express.json());

app.use('/shapefile', shapefileReader);

app.use((err, req, res, next) => {
	console.log(err.stack);
	console.log(err.name);
	console.log(err.code);

	res.status(500).json({
		message: 'There is a error'
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));