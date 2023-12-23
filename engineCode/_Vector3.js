class Vector3 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.array = [x,y,z,w];
    }
    get x() {
        return this.array[0];
    }
    set x(val) {
        this.array[0] = val;
    }
    get y() {
        return this.array[1];
    }
    set y(val) {
        this.array[1] = val;
    }
    get z() {
        return this.array[2];
    }
    set z(val) {
        this.array[2] = val;
    }
    get w() {
        return this.array[2];
    }
    set w(val) {
        this.array[3] = val;
    }
    static {
        Vector3.Zero = Object.freeze(new Vector3());
        Vector3.One = Object.freeze(new Vector3(1, 1, 1));
        Vector3.Up = Object.freeze(new Vector3(0, 1, 0));
        Vector3.Down = Object.freeze(new Vector3(0, -1, 0));
        Vector3.Left = Object.freeze(new Vector3(-1, 0, 0));
        Vector3.Right = Object.freeze(new Vector3(1, 0, 0));
        Vector3.Forward = Object.freeze(new Vector3(0, 0, 1));
        Vector3.Backward = Object.freeze(new Vector3(0, 0, -1));
    }
    Add(otherVec) {
        return new Vector3(
            this.array[0] + otherVec.array[0],
            this.array[1] + otherVec.array[1],
            this.array[2] + otherVec.array[2]
        );
    }
    MutateAdd(otherVec) {
        this.array[0] += otherVec.array[0];
        this.array[0] += otherVec.array[1];
        this.array[2] += otherVec.array[2];
    }
    Subtract(otherVec) {
        return new Vector3(
            this.array[0] - otherVec.array[0],
            this.array[1] - otherVec.array[1],
            this.array[2] - otherVec.array[2]
        );
    }
    MutateSubtract(otherVec) {
        this.array[0] -= otherVec.array[0];
        this.array[1] -= otherVec.array[1];
        this.array[2] -= otherVec.array[2];
    }
    Multiply(number) {
        return new Vector3(
            this.array[0] * number,
            this.array[1] * number,
            this.array[2] * number
        );
    }
    MutateMultiply(number) {
        this.array[0] *= number;
        this.array[1] *= number;
        this.array[2] *= number;
    }
    Divide(number) {
        return new Vector3(
            this.array[0] / number,
            this.array[1] / number,
            this.array[2] / number
        );
    }
    MutateDivide(number) {
        this.array[0] /= number;
        this.array[1] /= number;
        this.array[2] /= number;
    }
    Dot(otherVec) {
        return this.array[0] * otherVec.array[0] + this.array[1] * otherVec.array[1] + this.array[2] * otherVec.array[2];
    }
    Cross(otherVec) {
        return new Vector3(
            this.array[1] * otherVec.array[2] - this.array[2] * otherVec.array[1],
            this.array[2] * otherVec.array[0] - this.array[0] * otherVec.array[2],
            this.array[0] * otherVec.array[1] - this.array[1] * otherVec.array[0]
        );
    }
    SquareMagnitude() {
        return this.array[0] * this.array[0] + this.array[1] * this.array[1] + this.array[2] * this.array[2];
    }
    Magnitude() {
        return Math.sqrt(this.SquareMagnitude());
    }
    SquareDistance(otherVec) {
        return (this.array[0] - otherVec.array[0]) * (this.array[0] - otherVec.array[0]) +
            (this.array[1] - otherVec.array[1]) * (this.array[1] - otherVec.array[1]) +
            (this.array[2] - otherVec.array[2]) * (this.array[2] - otherVec.array[2]);
    }
    Distance(otherVec) {
        return Math.sqrt(this.SquareDistance(otherVec));
    }
    MutateNormalize() {
        let magnitude = this.Magnitude();
        this.array[0] /= magnitude;
        this.array[1] /= magnitude;
        this.array[2] /= magnitude;
    }
    Normalize() {
        let magnitude = this.Magnitude();
        return new Vector3(
            this.array[0] / magnitude,
            this.array[1] / magnitude,
            this.array[2] / magnitude
        );

    }
    SetFromVector(otherVector) {
        this.array[0] = otherVector.x;
        this.array[1] = otherVector.y;
        this.array[2] = otherVector.z;
    }
    GetCopy(){
        return new Vector3(this.array[0],this.array[1],this.array[2],this.array[3]);
    }
    Invert() {
        this.array[0] = -this.array[0];
        this.array[1] = -this.array[1];
        this.array[2] = -this.array[2];
        this.array[3] = -this.array[3];
        return this;
    }
    static Dot(firstVector, secondVector) {
        return firstVector.x * secondVector.x + firstVector.y * secondVector.y + firstVector.z * secondVector.z;
    }
    static Cross(firstVec, secondVec) {
        return new Vector3(
            firstVec.y * secondVec.z - firstVec.z * secondVec.y,
            firstVec.z * secondVec.x - firstVec.x * secondVec.z,
            firstVec.x * secondVec.y - firstVec.y * secondVec.x
        );
    }
    static SquareDistance(firstVec, secondVec) {
        return firstVec.SquareDistance(secondVec);
    }
    static Distance(firstVec, secondVec) {
        return Math.sqrt(firstVec.SquareDistance(secondVec));
    }
    static CalculateNormal(A, B, C) {
        const AB = B.Subtract(A).Normalize();
        const AC = C.Subtract(A).Normalize();
        return Vector3.Cross(AB,AC);//
    }
}