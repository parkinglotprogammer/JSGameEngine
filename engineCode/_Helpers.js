class MyMath {
    static {
        MyMath.DegreesToRadians = Math.PI / 180;
        MyMath.RadiansToDegrees = 180 / Math.PI;
    }
    static Clamp(value,min,max){
        if(value < min)
            value = min;
        if(value > max)
            value = max;
        return value;
    } 
}