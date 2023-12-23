class Game {
    static {
        Game.targetFrameRate = 60;
        Game.targetFrameTime = 1000 / Game.targetFrameRate;
        Game.lastTime = 0;
        Game.quit = false;
        Game.updateInterval;
        Game.deltaTime;
    }
    static SetTargetFrameRate(targetFrameRate) {
        if (Game.quit)
            return;
        Game.targetFrameRate = targetFrameRate;
        Game.targetFrameTime = 1000 / targetFrameRate;
        clearInterval(Game.updateInterval);
        Game.updateInterval = setInterval(Game.GameUpdate, Game.targetFrameTime);
    }
    static Start() {
        Game.updateInterval = setInterval(Game.Update, Game.targetFrameTime);
        requestAnimationFrame(Game.GraphicsUpdate);
        Start();
    }
    static GraphicsUpdate() {
        GraphicsUpdate();
        Graphics.Render();
        if (!Game.quit)
            requestAnimationFrame(Game.GraphicsUpdate);
    }
    static Update() {
        // Calculate elapsed time since the last frame
        const thisTime = performance.now();

        Game.deltaTime = (thisTime - Game.lastTime) / 1000;
        Game.lastTime = thisTime;
        Update(Game.deltaTime);
        Input.LateUpdate();

    }
    static Quit() {
        Game.quit = true;
        Quit();
        clearInterval(Game.updateInterval);
    }
}