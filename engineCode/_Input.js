class Input {
    static {
        Input.keyMap = [];
        Input.priorKeyMap = [];
        Input.mousePosition = [0,0];
        Input.priorMousePosition = [0,0];
        Input.mouseDelta = [0,0];
        //Initialize all keys as not being held down previously.
        for (let i = 0; i < 256; i++)
            Input.priorKeyMap[String.fromCharCode(i)] = false;
        document.addEventListener('keydown', (event) => {
            Input.keyMap[event.key] = true;
        }, false);
        document.addEventListener('keyup', (event) => {
            Input.keyMap[event.key] = false;
        }, false);
        document.addEventListener('mousemove', (event) => {
            Input.mousePosition.x = event.x;
            Input.mousePosition.y = event.y;
        }, false);
    }
    static LateUpdate() {
        for (var key in Input.keyMap)
            Input.priorKeyMap[key] = Input.keyMap[key];
        //@todo: I dunno if the mouse delta functions should be in lateupdate,
        //or if I should make an early Update for them. We'll see when I start using it for mouselook!
        Input.mouseDelta[0] = Input.mousePosition[0] - Input.priorMousePosition[0];
        Input.mouseDelta[1] = Input.mousePosition[1] - Input.priorMousePosition[1];
        Input.priorMousePosition[0] = Input.mousePosition[0];
        Input.priorMousePosition[1] = Input.mousePosition[1];

    }
    static GetKeyDown(key) {
        return Input.keyMap[key] && Input.priorKeyMap[key] == false;
    }
    static GetKey(key) {
        return Input.keyMap[key];
    }
}