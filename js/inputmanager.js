const rightbuttons = new Set(['a', 'b', 'y', 'x']);

const validbuttons = new Set(['a', 'b', 'x', 'y', 'start', 'select', 'up', 'down', 'left', 'right'])

const buttons_reset_vals = {
    'up': false,
    'down': false,
    'right': false,
    'left': false,
    'a': false,
    'b': false,
    'x': false,
    'y': false,
    'start': false,
    'select': false
};

const keymap = {
    'KeyW': 'up',
    'KeyA': 'left',
    'KeyS': 'down',
    'KeyD': 'right',
    'Enter': 'start',
    'ShiftRight': 'start',
    'ShiftLeft': 'start',
    'KeyJ': 'b',
    'KeyK': 'a',
    'KeyU': 'y',
    'KeyI': 'x'
}

export class InputManager {
    constructor () {
        this.buttons = {
            'up': false,
            'down': false,
            'right': false,
            'left': false,
            'a': false,
            'b': false,
            'x': false,
            'y': false,
            'start': false,
            'select': false
        };
        this.current_touches = new Map();
        this.current_keys = new Set();
        this.debug_callback = null;
        this.cust_keymap = keymap;
    }

    setup_touch() {
        ['touchstart', 'touchmove'].map((a) => 
            document.addEventListener(a, make_handle_touchpresent(this)));
        ['touchend', 'touchcancel'].map((a) => 
            document.addEventListener(a, make_handle_touchstopped(this)));
    }

    setup_keyboard() {
        document.addEventListener('keydown', make_handle_keydown(this));
        document.addEventListener('keyup', make_handle_keyup(this));
    }

    full_setup() {
        this.setup_touch();
        this.setup_keyboard();
    }

    detect_buttons_pressed() {
        this.reset_buttons()
        let buttons = this.buttons;
        let cust_keymap = this.cust_keymap;
        this.current_touches.forEach(function (a) {
            if (validbuttons.has(a.target.name)) {
                buttons[a.target.name] = true;
                if (rightbuttons.has(a.target.name)) {
                    buttons[append_with_current(a).current.name] = true;
                }
            }
        } );
        this.current_keys.forEach(function (a) {
            buttons[cust_keymap[a]] = true;
        });
        if (this.debug_callback) {
            this.debug_callback()
        }
    }

    reset_buttons(){
        for (let proppa in this.buttons) {
            this.buttons[proppa] = false;
        }
    }

}

function make_handle_touchpresent(inputmanager) {
        return function(ev) {
            console.time('handletouchpressed');
        map_touchlist(function (t) {
            inputmanager.current_touches.set(t.identifier, t)
        },
            ev.changedTouches)
        inputmanager.detect_buttons_pressed();
            console.timeEnd('handletouchpressed');
        }
}
function make_handle_touchstopped(inputmanager) { 
    return function(ev) {
        map_touchlist(function (t) {
           inputmanager.current_touches.delete(t.identifier);
        }, ev.changedTouches);
        inputmanager.detect_buttons_pressed();

    }
}
function make_handle_keydown(inputmanager) {
    return function(ev) {
        inputmanager.current_keys.add(ev.code);
        inputmanager.detect_buttons_pressed();
    }
}

function make_handle_keyup(inputmanager) {
    return function(ev) {
        inputmanager.current_keys.delete(ev.code);
        inputmanager.detect_buttons_pressed();
    }
}


function append_with_current(touch) {
    if (!touch.current) {
        let elem = document.elementFromPoint(touch.clientX, touch.clientY);
        touch.current = elem;
    }
    return touch;
}

async function map_touchlist(fn, touchlist) {
    for (let i = 0; i < touchlist.length; i++) {
        fn(touchlist.item(i));
    }
}

async function doasync(cb) {
    return cb();
}