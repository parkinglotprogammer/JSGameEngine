class Camera {
    constructor(){
        this.fieldOfView = 90;
        this.nearClippingDist = .01;
        this.farClippingDist = 1000;
        this.projectionMatrix = [
            0,0,0,0,
            0,0,0,0,
            0,0,0,-1,
            0,0,0,0
        ];
        this.CalulateProjectionMatrix();
    }
    //needs to be called whenever aspect ratio or fov changes
    CalulateProjectionMatrix() {
        const rangeInv = 1.0 / (this.nearClippingDist - this.farClippingDist);
        this.projectionMatrix[5] = 1.0 / Math.tan(this.fieldOfView / 2.0 * MyMath.DegreesToRadians);
        this.projectionMatrix[0] = this.projectionMatrix[5] / aspectRatio;
        this.projectionMatrix[10] = (farClippingDist + nearClippingDist) * rangeInv;
        this.projectionMatrix[14] = 2 * farClippingDist * nearClippingDist * rangeInv;
    }
}

//PerspectiveProjectionMatrix();
function PerspectiveProjectionMatrix(outputMatrix, fieldOfView, aspectRatio, nearClippingDist, farClippingDist) {
    const perspectiveScale = 1.0 / Math.tan(fieldOfView / 2.0 * MyMath.DegreesToRadians);
    const rangeInv = 1.0 / (nearClippingDist - farClippingDist);
    for (let value of outputMatrix)
        value = 0;
    outputMatrix[0] = perspectiveScale / aspectRatio;
    outputMatrix[5] = perspectiveScale;
    outputMatrix[10] = (farClippingDist + nearClippingDist) * rangeInv;
    outputMatrix[11] = -1;
    outputMatrix[14] = 2 * farClippingDist * nearClippingDist * rangeInv;
}