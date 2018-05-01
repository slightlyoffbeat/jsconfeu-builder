const WHITE = 0xFFFFFFFF;
const BLACK = 0x000000FF;
const RED   = 0xFF0000FF;

function makeFrameset() {
    const frames = []
    const w = 44
    const h = 36
    const frameCount = 10;
    for(let i=0; i<frameCount; i++) {
        const f1 = []
        for(let x = 0; x<w*h; x++) {
            f1[x] = BLACK
        }
        frames.push(f1)
    }
    return {
        width:w,
        height:h,
        frames:frames
    }
}

function getWidth(fs) { return fs.width }
function getHeight(fs) { return fs.height }
function getColorAt(fs, x,y, t) {
    const n = y * getWidth(fs) + x
    return fs.frames[t][n]
}

function getPixelRGBA(fs, x,y, f) {
    const n = y * getWidth(fs) + x
    return fs.frames[f][n]
}
function setPixelRGBA(fs, x,y, f, c) {
    const n = y * getWidth(fs) + x
    fs.frames[f][n] = c
    return c
}
function getFrameCount(fs) { return fs.frames.length }

function performDiagonalLines(old,ctx) {
    for(let f=0; f<ctx.getFrameCount(); f++) {
        for (let y = 0; y < ctx.getHeight(); y++) {
            for (let x = 0; x < ctx.getWidth(); x++) {
                ctx.setPixelRGBA(x, y, f, Math.floor((x + y) / 2) % 2 === 0 ? WHITE : BLACK)
            }
        }
    }
}

function performVerticalLines(old,ctx) {
    const w = ctx.getWidth()
    for(let f=0; f<ctx.getFrameCount(); f++) {
        for (let y = 0; y < ctx.getHeight(); y++) {
            for (let x = 0; x < ctx.getWidth(); x++) {
                if (x % 5 === 0) {
                    ctx.setPixelRGBA((x + f)%w, y, f, RED)
                } else {
                    ctx.setPixelRGBA((x + f)%w, y, f, old.getPixelRGBA((x+f)%w, y, f))
                }
            }
        }
    }
}

function performHorizontalLines(old_ctx,new_ctx) {
    for(let f=0; f<new_ctx.getFrameCount(); f++) {
        for (let y = 0; y < new_ctx.getHeight(); y++) {
            for (let x = 0; x < new_ctx.getWidth(); x++) {
                const old_color = old_ctx.getPixelRGBA(x,y,f)
                const col = y%5===0?RED:old_color //make every 5th line be red
                new_ctx.setPixelRGBA(x, y, f, col)
            }
        }
    }
}

function makeContext(frameset) {
    return {
        getHeight: function() { return getHeight(frameset)},
        getWidth: function() { return getWidth(frameset)},
        setPixelRGBA: function(x,y,f,c) { return setPixelRGBA(frameset, x,y,f,c) },
        getPixelRGBA: function(x,y,f  ) { return getPixelRGBA(frameset, x,y,f) },
        getFrameCount: function() { return getFrameCount(frameset)},
    }
}

class ModuleStore {
    constructor() {
        this.queue = []
        fetch("http://localhost:39176/api/queue")
            .then((res)=>res.json())
            .then((out)=> {
            console.log("got the results",out)
                this.queue = out
        })
        this.library = {
            'diagonal-lines': {
                name: 'diagonal-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performDiagonalLines,
                tags:['lines','example']
            },
            'vertical-lines': {
                name: 'vertical-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performVerticalLines,
                tags:['lines']
            },
            'static-horizontal-lines': {
                name:'static-horizontal-lines',
                author:'jmarinacci@mozilla.com',
                fun: performHorizontalLines,
                tags:['lines','example']
            }
        }

        this.document = [
            {
                id:Math.random(),
                template: this.library['diagonal-lines'],
                current:null,
            },
            {
                id:Math.random(),
                template: this.library['vertical-lines'],
                current:null,
            }
        ]
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
    getLibraryModules() {
        return o2a(this.library)
    }
    findLibraryModules(query) {
        return new Promise((res,rej)=>{
            let mods = o2a(this.library)
            mods =  mods.filter((mod)=>{
                if(mod.name.indexOf(query)>=0) return true
                if(mod.author.indexOf(query)>=0) return true
                if(mod.tags.find(tag=>tag.indexOf(query)>=0)) return true
                return false
            })
            res(mods)
        })
    }
    getActiveModules() {
        return this.document
    }
    setActiveModules(list) {
        this.document = list
    }

    addActiveModule(mod) {
        this.document.push({
            id:Math.random(),
            template:mod,
            current:null
        })
        this.listeners['active'].forEach(cb=>cb(this.document))
    }

    removeActiveModule(mod) {
        const n = this.document.indexOf(mod)
        if(n >= 0) this.document.splice(n,1)
        this.listeners['active'].forEach(cb=>cb(this.document))
    }

    isRunning() {
        return this.running
    }
    start() {
        this.running = true
        const frameset = this.executeModules()

        this.currentFrame = 0
        this.interval_id = setInterval(()=>{
            this.listeners['changed'].forEach(cb => cb(this))
            this.currentFrame++
        },250)
    }
    stop() {
        this.running = false
        clearInterval(this.interval_id)
    }
    executeModules() {
        let frameset = makeFrameset()
        this.document.forEach((cur)=>{
            const fs2 = makeFrameset()
            cur.template.fun(makeContext(frameset), makeContext(fs2))
            cur.current = fs2
            frameset = fs2
        })
        return frameset
    }

    drawCanvas(module,canvas) {
        const frameset = module.current
        const ctx = canvas.getContext('2d')
        const frame = this.currentFrame % getFrameCount(frameset)
        const w = getWidth(frameset)
        const h = getHeight(frameset)
        const s = 5
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,w*s,h*s)
        for(let j=0;j<h;j++) {
            for(let i=0; i<w; i++) {
                let col = getColorAt(frameset, i,j,frame).toString(16)
                while(col.length < 8) {
                    col = "0"+col
                }
                const scol = '#'+col+''
                ctx.fillStyle = scol
                ctx.fillRect(i*s,j*s,s,s)
            }
        }
    }


    getQueue() {
        // this.queue = []
        console.log("the queue is", this.queue)
        return this.queue
    }
}


function o2a(obj) {
    return Object.keys(obj).map((key)=>obj[key])
}


export default new ModuleStore()