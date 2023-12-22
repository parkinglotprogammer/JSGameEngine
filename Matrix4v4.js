function CreateMatrix4v4() {
    return [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1];
}
function SetAsIdentityMatrix(matrix) {
    // for (let i = 0; i < 16; i++)
    //     matrix[i] = 0;
    matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1;
    matrix[1] = matrix[2] = matrix[3] = matrix[4] =
        matrix[6] = matrix[7] = matrix[8] = matrix[9] =
        matrix[11] = matrix[12] = matrix[13] = matrix[14] = 0;
}
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
    // return [
    //     f / aspectRatio, 0, 0, 0,
    //     0, f, 0, 0,
    //     0, 0, (farClippingDist + nearClippingDist) * rangeInv, -1,
    //     0, 0, 2 * farClippingDist * nearClippingDist * rangeInv, 0
    // ];
}

function TranslateMatrix(matrix, x = 0, y = 0, z = 0) {
    matrix[12] += x;
    matrix[13] += y;
    matrix[14] += z;
    // matrix[12] += matrix[0] * x + matrix[4] * y + matrix[8] * z;
    // matrix[13] += matrix[1] * x + matrix[5] * y + matrix[9] * z;
    // matrix[14] += matrix[2] * x + matrix[6] * y + matrix[10] * z;
    // matrix[15] += matrix[3] * x + matrix[7] * y + matrix[11] * z;
}
function ScaleMatrix(matrix, x = 1, y = 1, z = 1) {
    matrix[0] *= x;
    matrix[5] *= x;
    matrix[10] *= x;
}
function RotateMatrixX(matrix, angle) {
    angle *= MyMath.DegreesToRadians;
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    const temp1 = matrix[1];
    const temp2 = matrix[5];
    const temp3 = matrix[9];
    const temp4 = matrix[13];
    matrix[1] = temp1 * cosAngle - matrix[2] * sinAngle;
    matrix[5] = temp2 * cosAngle - matrix[6] * sinAngle;
    matrix[9] = temp3 * cosAngle - matrix[10] * sinAngle;
    matrix[13] = temp4 * cosAngle - matrix[14] * sinAngle;
    matrix[2] = temp1 * sinAngle + matrix[2] * cosAngle;
    matrix[6] = temp2 * sinAngle + matrix[6] * cosAngle;
    matrix[10] = temp3 * sinAngle + matrix[10] * cosAngle;
    matrix[14] = temp4 * sinAngle + matrix[14] * cosAngle;
}
function RotateMatrixY(matrix, angle) {
    angle *= MyMath.DegreesToRadians;
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    const temp0 = matrix[0];
    const temp1 = matrix[4];
    const temp2 = matrix[8];
    const temp3 = matrix[12];
    matrix[0] = temp0 * cosAngle + matrix[2] * sinAngle;
    matrix[4] = temp1 * cosAngle + matrix[6] * sinAngle;
    matrix[8] = temp2 * cosAngle + matrix[10] * sinAngle;
    matrix[12] = temp3 * cosAngle + matrix[14] * sinAngle;
    matrix[2] = -temp0 * sinAngle + matrix[2] * cosAngle;
    matrix[6] = -temp1 * sinAngle + matrix[6] * cosAngle;
    matrix[10] = -temp2 * sinAngle + matrix[10] * cosAngle;
    matrix[14] = -temp3 * sinAngle + matrix[14] * cosAngle;
}
function RotateMatrixZ(matrix, angle) {
    angle *= MyMath.DegreesToRadians;
    const sinAngle = Math.sin(angle);
    const cosAngle = Math.cos(angle);
    const temp0 = matrix[0];
    const temp1 = matrix[4];
    const temp2 = matrix[8];
    const temp3 = matrix[12];
    matrix[0] = temp0 * cosAngle - matrix[1] * sinAngle;
    matrix[4] = temp1 * cosAngle - matrix[5] * sinAngle;
    matrix[8] = temp2 * cosAngle - matrix[9] * sinAngle;
    matrix[12] = temp3 * cosAngle - matrix[13] * sinAngle;
    matrix[1] = temp0 * sinAngle + matrix[1] * cosAngle;
    matrix[5] = temp1 * sinAngle + matrix[5] * cosAngle;
    matrix[9] = temp2 * sinAngle + matrix[9] * cosAngle;
    matrix[13] = temp3 * sinAngle + matrix[13] * cosAngle;
}
function RotateMatrix(matrix, x = 0, y = 0, z = 0) {
    if (x != 0) RotateMatrixX(matrix, x);
    if (y != 0) RotateMatrixY(matrix, y);
    if (z != 0) RotateMatrixZ(matrix, z);
}

function MultiplyMatrices(result, a, b) {
    for (let i = 0; i < 4; ++i) {
        let a0 = a[i];
        let a1 = a[i + 4];
        let a2 = a[i + 8];
        let a3 = a[i + 12];
        result[i] = a0 * b[0] + a1 * b[1] + a2 * b[2] + a3 * b[3];
        result[i + 4] = a0 * b[4] + a1 * b[5] + a2 * b[6] + a3 * b[7];
        result[i + 8] = a0 * b[8] + a1 * b[9] + a2 * b[10] + a3 * b[11];
        result[i + 12] = a0 * b[12] + a1 * b[13] + a2 * b[14] + a3 * b[15];
    }
}