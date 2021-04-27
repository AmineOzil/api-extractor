import { Project, Statement } from "ts-morph";
import * as readline from 'readline';

export class Route{
    path:string="";
    arguments=[];
    method:string;
    handlingFunction:string;   
    constructor(){}

}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter the path to your app.controller.js file : \r\n', (path) => {
    const project = new Project();
    project.addSourceFileAtPath(path);
    let instructions:Statement[]=project.getSourceFile(path).getStatements();
    let routes:Route[]=[];
  
    for(const statement of instructions){
        const regex = /router\.(get|put|delete|post)\('(.+)',(\w+)\)/gm;
        if(statement.getFullText().match(regex)){
            var route=new Route();
            var match = regex.exec(statement.getFullText());
            route.method=match[1];
            route.path=match[2];
            route.handlingFunction=match[3];
            const regexParams = /:(\w*)/gm;
            let params:string[]=[];
            match =regexParams.exec(route.path);
            while(match){
                params.push(match[1]);
                match =  regexParams.exec(route.path);
            }
            route.arguments=params;
            routes.push(route);
        }
    
    }
    console.log("\r\nTotal number of endpoints: "+routes.length);
    console.log("--------------------------------------------------------------------------");
    if(routes.length>0){
        routes.forEach(route => {
            let argsMessage:string="";
            if(route.arguments.length==0) argsMessage="No Arguments";
            else argsMessage="List of arguments: "+route.arguments;
            console.log(" Path :"+route.path+"\r\n  Method :"+route.method+"\r\n  Handling function :"+route.handlingFunction+"\r\n  "+argsMessage);
            console.log("--------------------------------------------------------------------------");
        });
    }
    
    
  rl.close();
});
