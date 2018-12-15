class BasicCameraMovement {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
    }
    update(entities) {
        let cam = entities.get_transform([...entities.get('camera').keys()][0])
        if (this.pokitOS.input.buttons.up) {
            cam.y++;
        }
        if (this.pokitOS.input.buttons.down) {
            cam.y--;
        }
        if (this.pokitOS.input.buttons.left) {
            cam.x++;
        }
        if (this.pokitOS.input.buttons.right) {
            cam.x--;
        }
        if (this.pokitOS.input.buttons.a) {
            cam.scale+= 0.1;
        }
        if (this.pokitOS.input.buttons.b) {
            cam.scale-= 0.1;
        }
    }
}

export class GameCart {
    constructor(pokitOS) {
        this.pokitOS = pokitOS;
        this.img = new Image();
    }
    async preload() {
        this.imgsrc = new URLSearchParams(window.location.search).get('img');
        console.log(this.imgsrc);
        this.img.src = this.imgsrc;
        this.pokitOS.baublebox.initializeSystem('basiccameramove', new BasicCameraMovement(this.pokitOS));
    }
    async start() {
        this.pokitOS.baublebox.makeEntity({x: 160, y: 160, width: this.img.width, height: this.img.height})
            ('img', this.img);
    }
}