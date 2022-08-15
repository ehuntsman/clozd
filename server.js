const express = require('express');
const app = express();
const port = 8080;
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded());

/**
 * GET /companies
 * Fetches all companies in the database
 */
app.get('/companies', (req, res) => {
	const sql = `
		SELECT * FROM companies;
	`;
	const params = [];
  db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.json({
			message: 'success',
			data: rows
		});
	});
});

app.patch('/companies/edit/:id', (req, res) => {
  const params = [req.body.name, req.params.id];
  console.log(params, "params")
	const sql = `
		UPDATE companies
    SET name = ?
    WHERE id = ?
	`;
	db.run(sql, params, err => {
		if (err) {
			return console.error(err.message);
    }
    res.json({
			message: 'success'
		});
  });
});

// This isn't returning a JSON and after lots of trial and error I couldn't get it to work with sqlite. If I had more time I'd fix this to return a json object
app.get('/companies/:id', (req, res) => {
	const sql = `
    SELECT 
      e.id,
      d.name as 'department',
      e.name,
      e.title,
      e.avatar,
      e.country,
      c.name as 'company',
      c.segment,
      c.region,
      c.industry,
      c.id as 'company_id'
    FROM employees e
    LEFT JOIN departments d
      ON e.department_id = d.id
    LEFT JOIN companies c
      ON d.company_id = c.id
    WHERE c.id = ${req.params.id}
    ORDER BY d.name
	`;
	const params = [];

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		
		res.json({
			message: 'success',
			data: rows
		});
	});
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});