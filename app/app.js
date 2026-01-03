import t from "../titan/titan.js";




t.post("/register").action("register");
t.get("/").reply("Let's go!");

t.start(3000, "Titan Running!");
