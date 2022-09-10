class Player 
{
    constructor(width, height, color, x, y) 
    {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
    }

    newPos()
    {
        this.x += this.speedX;
        this.y += this.speedY;    
    }
}