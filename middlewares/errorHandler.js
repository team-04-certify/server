module.exports = (err, req, res, next) => {
  if(err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => {
          return {
              message: e.message
          }
      })
      res.status(400).json(errors)
  } else if(err.name === 'invalid email or password') {
    res.status(400).json({
      message: err.message
    })
  } else if(err.name === 'jwt is required') {
    res.status(401).json({
      message: err.message
    })
  } else if(err.name === 'invalid jwt') {
    res.status(401).json({
      message: err.message
    })
  } else {
    console.log(err)
      res.status(500).json(err)
  }
}