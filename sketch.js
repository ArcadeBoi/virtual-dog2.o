//Create variables here
var dog, happyDog, database, foodS = 0, foodStock, milkBottle,feedMilk;
var feed, addFood;
var fedTime,lastFed=0 ;
var foodObj;




function preload()
{
  //load images here
  happyDog = loadImage("dogImg1.png");
  hungryDog = loadImage("dogImg.png");
  milkBottle = loadImage("Milk.png");
}

function setup() {
  createCanvas(800, 600);
  database = firebase.database();
  dog = createSprite(750,300,20,20);
  dog.addImage(hungryDog); 
  dog.scale = 0.1;
  feedMilk = createSprite(700,300,20,20);
  feedMilk.addImage(milkBottle);
  feedMilk.scale =0.07;
  feedMilk.visible=false;
  

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed=data.val();
  });
 
  foodObj = new Food();
  
  feed=createButton("Feed the Dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
  
  background("lime");
  fill(255,255,254);
  textSize(15);
  var lastFedTime="";

  if(lastFed == 0)
  {
    lastFedTime ="12 AM";
  }
  else if(lastFed == 12)
  {
    lastFedTime ="12 PM";
  }
  else if(lastFed > 12)
  {
    lastFedTime = lastFed%12 + " PM";
  }
  else
  {
    lastFedTime = lastFed + " AM";
  }
  text("Last Feed :"+ lastFedTime ,250,30);

  foodObj.getFoodStock();
  foodObj.display();
  drawSprites();
  //add styles here
  text("Food Remaining:  "+ foodS,400,30);
  

}

function readStock(data){
  foodS = data.val();
}

function feedDog(){

  if(foodS>0)
  {
    feedMilk.visible=true;
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
    FeedTime:hour()
  })
  dog.addImage(happyDog);
  }
  else
  {
    dog.addImage(hungryDog);
    feedMilk.visible=false;
  }
}
function addFoods(){
  if(foodS<50)
  {
  foodObj.updateFoodStock(foodObj.getFoodStock()+1);
  dog.addImage(hungryDog);
  }
  feedMilk.visible=false;
}

