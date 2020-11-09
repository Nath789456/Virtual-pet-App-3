//Create variables here
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom, garden, washroom;
var currentTime;
var readState;


function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg1.png");
bedroom = loadImage("Bed Room.png");
garden = loadImage("Garden.png");
washroom = loadImage("Wash Room.png");
}

function setup() {
  //create canvas
  createCanvas(900,400);
  foodObj = new Food();


  database=firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  //creating and adding image to dog sprite 
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  //button to feed
  feed=createButton("Feed Romeo the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  //button to add food
  addFood=createButton("Add Food for Romeo");
  addFood.position(900,95);
  addFood.mousePressed(addFoods);

//read game state from database
  readState = database.ref('gameState');
    readState.on("value", function data(){
      gameState = data.val();
    });

}

function draw() {
  background(72,61,139);

  //text to display food stock
  textSize(25);
  fill("blue");
  text(foodStock, 200, 200);
  text("Press UP arrow key to feed milk to the dog", 250 ,250);

  foodObj.display();


  //text to display last fed
  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed"+lastFed%12, "PM", 350, 30);
  }else if(lastFed==0){
    text("Last Fed: 12AM", 350, 30);
  }else{
    text("Last Fed: "+lastFed + "AM", 350, 30);
    
//condition to add food or hide food
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog = addImage(sadDog);
  }
  }

  //condition to display different backgrounds
  currentTime = hour();
  if(currentTime == (lastfed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastfed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastfed+2) && currentTime<(lastfed+4)){
    update("Bathing");
    foodObj.bathroom();
  }else{
    update("Hungry");
    foodObj.display();
  }
  drawSprites();
}

//function to read stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to write values in database;
function writeStock(x){
	if(x<=0){
		x = 0;
	}else{
		x = x-1;
	}
}

//function to feed dog
function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add foods in databases
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//function to update gameStates in database
function update(state){
  database.ref('/').update({
    gameState:state
  });
}







