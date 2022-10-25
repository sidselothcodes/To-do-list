//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/toDoListDB');
}

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
})

const item3 = new Item({
  name: "<-- Hit this to delete an item and refresh the page."
})

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

const day = date.getDate();

Item.find({}, function(err, foundItems){
// If the to do list is empty then it would show some default items on how to use the list, else will just add the items.
  if (foundItems.length === 0){
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully saved the items to the dB.");
      }
      res.render("/");
    })
  }else{
      res.render("list", {listTitle: day, newListItems: foundItems});
  }
})
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save();
  res.redirect("/")

});


app.post("/delete", function(req, res){
  const checkItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkItemId, function(err){
    if(!err){
      console.log("Successfully deleted checked item.");
    }
  });
});



app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
