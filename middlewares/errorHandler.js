module.exports = (err, req, res, next) => {
  let errors = null
  switch(err.name){
    case 'CustomError':
      res.status(err.code).json(err)
      break

    case 'SequelizeUniqueConstraintError':
      errors = err.errors.map(e => {
        return {
            message: e.message
        }
      })
      res.status(400).json(errors)
      break
    case 'SequelizeValidationError':
      errors = err.errors.map(e => {
        return {
            message: e.message
        }
      })
      res.status(400).json(errors)
      
      break
    case 'invalid email or password':
      res.status(400).json({
        message: err.message
      })
      break
    
    case 'jwt is required':
      res.status(401).json({
        message: err.message
      })
      break

    case 'invalid jwt':
      res.status(401).json({
        message: err.message
      })
      break
    case 'JsonWebTokenError': 
      res.status(401).json(err)
    default:
      res.status(500).json(err)
  }
  
}