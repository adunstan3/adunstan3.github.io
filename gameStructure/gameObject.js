class GameObject {
  constructor(_tag, drawOrder) {
    let tag;
    this.tag = _tag;
    this.drawOrder = drawOrder;

    let deleteMe;
    this.deleteMe = false;
    //console.log("Hello my tag is: "+this.tag);
  }

  tick() {
    //updates the object
  }

  draw() {
    //draws the object
  }

  getTag() {
    return this.tag;
  }

  delete() {
    this.deleteMe = true;
  }

  isDeleteable() {
    return this.deleteMe;
  }

}

 class ObjectHandler {
   constructor() {
     let objectList;
     this.objectList = [];
     let tempObject;
   }


   tick() {
     //Loop backwards for safe deleting then delete or tick each object
     for (var i = this.objectList.length - 1; i >= 0; i--) {
       if (this.objectList[i].isDeleteable()) {
         this.objectList.splice(i, 1);
       } else {
         this.objectList[i].tick();
       }
     }
   }

   draw() {
     // TODO more complex draw method that draws each layer one at a time
     for (this.tempObject of this.objectList) {
       this.tempObject.draw();
     }
   }

   addObject(newObject) {
     for (var i = 0; i < this.objectList.length; i++) {
       if (newObject.drawOrder < this.objectList[i].drawOrder) {
         this.objectList.splice(i, 0, newObject);
         return;
       }
     }

     //If the object should be drawn last
     this.objectList.push(newObject);
   }

   /*
   removeObject(tag){
     this.objectList = this.objectList.filter(function(value, index, arr){
        return value.getTag() != tag;
    });
   }
   */

   find(tag) {
     this.findReturn = [];
     for (this.tempObject of this.objectList) {
       //console.log(this.tempObject.getTag());
       if (this.tempObject.getTag() == tag) {
         this.findReturn.push(this.tempObject);
       }
     }
     return this.findReturn;
   }
 }
