import Constants from './Constants'

class ModuleStore {
    constructor() {
        this.queue = {
            expanded: [],
            modules:[]
        }
        this.refreshQueue()
        this.listeners = {}
        this.running = false
    }
    on(type,cb) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(cb)
        return cb
    }
    off(type,cb) {
        this.listeners[type] = this.listeners[type].filter((c)=> c!==cb)
    }
    fire(type,obj) {
        this.listeners[type].forEach(cb=>cb(obj))
    }
    findAllModules = () => fetch(`${Constants.BASE_URL}/modules`).then(res => res.json())

    refreshQueue() {
        return fetch(`${Constants.BASE_URL}/queue`)
            .then((res)=>res.json())
            .then((queue)=> {
                console.log("got the remote queue",queue)
                this.queue = queue
                this.fire('queue',queue)
            })
    }

    getQueueModules = ()  => this.queue.expanded

    submitModule(module) {
        return fetch(`${Constants.BASE_URL}/publish`,{
            method:'POST',
            body: JSON.stringify(module),
            mode:'cors',
            headers: {
                'content-type':'application/json'
            }
        })
            .then(res => res.json())
            .then((res)=>{
                console.log('posted with the result',res)
                this.refreshQueue()
            })
    }
    addModuleToQueue = (m) => {
        this.queue.expanded.push(m)
        this.queue.modules = this.queue.expanded.map((m) => m._id)
        console.log("the new queue is", this.queue.modules.length)
        return this.updateQueue()
    }
    updateQueue = () => {
        return fetch(`${Constants.BASE_URL}/updatequeue`,{
            method:'POST',
            body: JSON.stringify(this.queue.modules),
            mode:'cors',
            headers: {
                'content-type':'application/json'
            }
        })
            .then(res => res.json())
            .then(res => this.refreshQueue())
    }
    deleteModuleFromQueue = (m,i) => {
        console.log("deleting the module at index",i)
        this.queue.expanded.splice(i,1)
        this.queue.modules.splice(i,1)
        console.log("the new queue is",this.queue.modules.length)
        return this.updateQueue()
    }
}


function o2a(obj) {
    return Object.keys(obj).map((key)=>obj[key])
}


export default new ModuleStore()