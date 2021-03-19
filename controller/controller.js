class Controller {
  static home (req, res) {
    console.log('masuk controller')
    res.json({message: 'masuk controller'})
  }
}


module.exports = Controller