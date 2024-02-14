var express = require('express');
var router = express.Router();
var pool = require('../config/db')

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/submit',function(req,res){
  console.log(req.body);
  const { username, first_name, last_name, pwd, email, gender, dob, phone, confirmpwd } = req.body;
  if(pwd !== confirmpwd){
  res.status(400).json({error :'passwords not matching'})
  return;
  }
  const usernameCheckQuery = 'SELECT * FROM jobseeker WHERE username = $1';
  pool.query(usernameCheckQuery, [username], (usernameCheckError, usernameCheckResult) => {
    if (usernameCheckError) {
      console.error('Error checking username existence', usernameCheckError);
      res.status(500).send('Registration Failed');
      return;
    }

    if (usernameCheckResult.rows.length > 0) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    const emailCheckQuery = 'SELECT * FROM jobseeker WHERE email = $1';
    pool.query(emailCheckQuery, [email], (emailCheckError, emailCheckResult) => {
      if (emailCheckError) {
        console.error('Error checking email existence', emailCheckError);
        res.status(500).send('Registration Failed');
        return;
      }

      if (emailCheckResult.rows.length > 0) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
  const insertQuery = 'INSERT INTO jobseeker (username,first_name,last_name,password,email,gender,date_of_birth,phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)'; 
  const insertValues = [username, first_name, last_name, pwd, email,gender, dob, phone];
  pool.query(insertQuery, insertValues,(insertError,insertResult) => {
    if(insertError){
      console.error('Error inserting data',insertError);
      res.status(500).send('Registration Failed');
    }else{
      console.log('Data inserted succesfully');
      res.status(200).send('Registration Succesfull');
    }
  });
});
});
});
router.get('/login', (req, res) => {
  res.render('login', { title: 'Express' });
});


module.exports = router;
