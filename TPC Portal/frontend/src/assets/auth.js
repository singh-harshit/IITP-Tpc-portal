class Auth {
  constructor() {
    this.authenticated = false
    this.authorizedID = ''
  }

  login(cb){
    this.authenticated = true
    this.authorizedID = "1701ME18"
    cb()
  }

  logout(cb){
    this.authenticated = false
    this.authorizedID = ''
    cb()
  }

  isAuthenticated(){
    return this.authenticated;
  }
  getAutharizedID(){
    return this.authorizedID;
  }
}

export default new Auth();
