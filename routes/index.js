var express = require('express');
var router = express.Router();
var pool = require('../config/db');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   if(req.session.user) {
//    res.render('index', { title: 'Express', user: req.session.user  }); //if logged in render home page with userdetails
//   }else{
//   res.render('index', { title: 'Express' });
//   } 
// });

/*postjob*/
router.get('/postjob', async function(req, res, next) {

  res.render('postjob', { title: 'Express' });
});

//search

router.get('/search', async function(req, res, next){

  try {
    console.log(req.session.user);
    if (req.session.user) {
       // If the user is logged in, fetch data from the database
      const fetchDataQuery = 'SELECT * FROM joblist';
      const fetchDataResult = await pool.query(fetchDataQuery);

      const userJobs = fetchDataResult.rows;
      console.log(userJobs);

      //fetch data related to logged in user
      const userId = req.session.user.username;
      console.log(userId)


      const userJobsQuery = 'SELECT * FROM joblist WHERE id =$1';
      const userJobsResult = await pool.query(userJobsQuery,[userId]);

      const usersJobs = userJobsResult.rows
      console.log(usersJobs);

      res.render('search', { title: 'Express', user: req.session.user, usersJobs , userJobs });
    } else {
      // If not logged in, render the home page without user details
      res.render('search', { title: 'Express' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});



router.post('/postjob', async function(req, res) {
  try {
    const userId = req.session.user.username; // Access username from the session
    const userQuery = 'SELECT * FROM jobseeker WHERE username = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const { job, location, datee, stime, etime, wno, story, wage, ph1, ph2 } = req.body;
      const insertQuery = 'INSERT INTO joblist(id,job,location,date,start_time,end_time,no_of_workers,description,wage,phone,alter_phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
      const insertValues = [userId, job, location, datee, stime, etime, wno, story, wage, ph1, ph2];
      
      pool.query(insertQuery, insertValues, (insertError, insertResult) => {
        if (insertError) {
          console.error('Error inserting data', insertError);
          res.status(500).send('Posting Failed');
        } else {
          console.log('Data inserted successfully');
          res.status(200).send('Posted Successfully');
        }
      });
    }
  } catch (error) {
    console.error('Error during post job:', error);
    res.status(500).send('Internal server error');
  }
});

//profile
router.get('/profile', async function(req, res, next) {

  res.render('profile', { title: 'Express' });
});

//display jobs

router.get('/', async function(req, res, next) {
  
  try {
    console.log(req.session.user);
    if (req.session.user) {
       // If the user is logged in, fetch data from the database
      const fetchDataQuery = 'SELECT * FROM joblist';
      const fetchDataResult = await pool.query(fetchDataQuery);

      const userJobs = fetchDataResult.rows;
      console.log(userJobs);

      //fetch data related to logged in user
      const userId = req.session.user.username;
      console.log(userId)


      const userJobsQuery = 'SELECT * FROM joblist WHERE id =$1';
      const userJobsResult = await pool.query(userJobsQuery,[userId]);

      const usersJobs = userJobsResult.rows
      console.log(usersJobs);

      res.render('index', { title: 'Express', user: req.session.user, usersJobs , userJobs });
    } else {
      // If not logged in, render the home page without user details
      res.render('index', { title: 'Express' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});

// Other routes...




/*logout route*/
router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).send('Internal server error');
    } else {
      res.redirect('/login');
    }
    console.log("hi")
  });
});


/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login',async function(req,res, next){
  console.log(req.body)
  const { username, pwd} = req.body;
try{
    const result =await pool.query('SELECT * FROM jobseeker WHERE username = $1 AND password= $2; ',[username, pwd]);
    console.log(result.rows);
    if(result.rowCount>0) {
      req.session.user = result.rows[0];//session starting
      console.log("user",req.session.user)
      res.status(200).redirect('/');
    }
    else{
      res.status(400).json({error: "Invalid username or password"});
    }
  }catch (error){
    console.error('Error during login:',error);
    res.status(500).send('Internal server error');
  }
});

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Express' });
}); 

module.exports = router;
