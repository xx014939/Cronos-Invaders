class GameObject
{
    constructor(width, height, color, x, y, type)
    {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y;
        this.type = type;
        this.speedX = 0;
        this.speedY = 0;
    }

    move()
    {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    crashWith(gameObject)
    {
        // Define current coordinates of obstacle
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);

        // If player object is not in contact with obstacle set to false
        let crash = !((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)); // Default
        
        return crash;
    }

}