class AuthStore {
    constructor(){
        console.log('setting up the auth')
        this.listeners = []
    }

    start() {
        const store = this
        console.log('starting the auth flow')
        fetch('http://localhost:39176/api/github/login')
            .then((res)=>res.json())
            .then((res)=>{
            console.log("starting the login",res)
                const win = window.open(res.url,'_blank')
                window.addEventListener('message',function(msg) {
                    console.log("got an event from the external window",msg)
                    console.log("origin = ", msg.origin)
                    if(!msg.origin === 'http://localhost:39176') {
                        console.log("message is not from the expected origin. what do we do?")
                    }
                    console.log("data is",msg.data.payload)
                    console.log("hello user", msg.data.payload.id)
                    console.log("your access token is",msg.data.payload.accessToken)
                    store.setUserData(msg.data.payload)
                    //close the window
                    win.close()
                })
                win.focus()
        })
    }

    checkAuth() {
        let accesstoken = ""
        if(localStorage.getItem('access-token')) {
            accesstoken = localStorage.getItem('access-token')
        }
        console.log("fetching with the access token",accesstoken)
        return fetch(`http://localhost:39176/api/userinfo?accesstoken=${accesstoken}`)
            .then((res)=>res.json())
            .then((res)=>{
                console.log("result of user info is", res)
                return res.user
            })
    }
    setUserData(data) {
        localStorage.setItem('access-token',data.accessToken)
        setTimeout(()=>this.listeners.forEach((cb)=>cb()))
    }

    listenToLogin(cb) {
        this.listeners.push(cb)
    }
}


export default new AuthStore()