require("dotenv").config();

let express = require("express");
let app = express();
let CatchAsync = require("./utils/CatchAsync");
let ExpressError = require("./utils/ExpressError");
let mongoose = require("mongoose");
let Command = require("./models/command");

async function main() {
    await mongoose.connect(process.env.DB_URL);
}
  
main().then(() => console.log("connected to database")).catch(err => console.log(err));

function createCommands(){
    return [
        {name: "cd", desc: "The cd (change directory) command is used to navigate the directory tree structure."},
        {name: "rm", desc: "The rm (remove) command is used to delete files, directories or even symbolic links from your file system.", alter: ["rm -i", "rm -r", "rm -f"]},
        {name: "mv", desc: "The mv (move) command is used to move one or more directories or files from one location in the file system to another."},
        {name: "cp", desc: "Cp is a utility that lets you copy files or directories within the file system.", alter: ["cp -u", "cp -R", "cp -p"]},
        {name: "mkdir", desc: "The mkdir command is used to creating new directories in the file system."},
        {name: "pwd", desc: "The pwd (print working directory) command can be used to report the absolute path of the current working directory."},
        {name: "touch", desc: "The touch command allows you to create new empty files or update the time stamp on existing files or directories. If you use touch with files that already exist, then the command will just update their time stamps. If the files do not exist, then this command will simply create them.", alter: ["touch -c", "touch -a", "touch -m"]},
        {name: "cat", desc: "Cat is a very commonly used command that allows users to read concatenate or write file contents to the standard output.", alter: ["cat -n", "cat -T"]},
        {name: "less", desc: "The less command lets you display the contents of a file one page at a time. Less won’t read the entire file when it is being called; thus, it leads to way faster load times.", alter: ["less -N", "less -X"]},
        {name: "more", desc: "The more command can also be used for displaying the content of a file in the command line. In contrast to less, this command loads the entire file at once, which is why less seems faster.", alter: ["more -p", "more +100"]},
        {name: "grep", desc: "The grep (global regular expression) command is useful when you wish to search for a particular string in files.", alter: ["grep -v", "grep -r", "grep -i"]},
        {name: "curl", desc: "The curl command is used to download or upload data using protocols such as FTP, SFTP, HTTP and HTTPS."},
        {name: "which", desc: "The which command is used to identify and report the location of the provided executable."},
        {name: "top", desc: "The top command can help you monitor running processes and the resources (such as memory) they are currently using.", alter: ["top -u"]},
        {name: "history", desc: "The history command displays the history of the commands that you’ve recently run.", alter: ["history -5", "history -c"]},
        {name: "ls", desc: "The ls (list) command is used to list directories or files.", alter: ["ls- a", "ls -l"]}
    ]
}

app.get("/getcommands", async (req, res) => {
    try {
        let objects = await Command.find({});
        res.json(objects);
    } catch (error) {
        let msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 500);
    }
    
})

app.get("/getcommands/:id", async (req, res) => {
    try {
        let object = await Command.findById(req.params.id);
        res.json(object);
    } catch (error) {
        let msg = error.details.map((el) => el.message.join(","));
        throw new ExpressError(msg, 404);
    }
    
})

app.get("/searchcommands", async (req, res) => {
    try {
        let object = await Command.findOne({name: { $regex: req.query.name, $options: "i"}});
        res.json(object);
    } catch (error) {
        let msg = error.details.map((el) => el.message.join(","));
        throw new ExpressError(msg, 404);
    }
})

app.get("/example", async(req, res) => {
    let response = await fetch("http://localhost:3000/searchcommands?name=ls");
    let data = await response.json();
    console.log(data);
    res.send("okay");
})

/*
app.get("/list", async(req, res) => {
    let commands = createCommands();
    for(let command of commands){
        let data = new Command(command);
        await data.save();
    }

    console.log("all data has been added to database");
    res.send("data transfer confirmed");
})
*/

app.use((err, req, res, next) => {
    let {status = 500, message = "An error occured"} = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("listening on port : 3000");
})