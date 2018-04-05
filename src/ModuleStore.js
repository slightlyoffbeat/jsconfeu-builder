const WHITE = 0xFFFFFFFF;
const BLACK = 0x000000FF;
const RED   = 0xFF0000FF;

function makeFrameset() {
    const frames = []
    const w = 50
    const h = 30
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
        this.library = {
            'diagonal-lines': {
                name: 'diagonal-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performDiagonalLines,
            },
            'vertical-lines': {
                name: 'vertical-lines',
                author: 'jmarinacci@mozilla.com',
                fun: performVerticalLines
            },
        }

        this.document = [
            {
                template: this.library['diagonal-lines'],
                current:null,
            },
            {
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
    of(type,cb) {
        this.listeners[type] = this.listeners[type].filter((c)=> c!==cb)
    }
    getLibraryModules() {
        return o2a(this.library)
    }
    getActiveModules() {
        return this.document
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
}


function o2a(obj) {
    return Object.keys(obj).map((key)=>obj[key])
}


export default new ModuleStore()