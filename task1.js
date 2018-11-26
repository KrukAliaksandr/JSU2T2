/* eslint-disable no-console */
/* eslint-disable indent */
// import { XMLHttpRequest as xml } from "xmlhttprequest";
const rp = require("request-promise-native");
const todo = require("yargs");
const fs = require("fs");

const uri = "https://randomuser.me/api";
const isResultAJsonOjbect = true;

todo.command("Request", "Create a get request to \"randomuser.me/api\" ", function (yargs) {
    return yargs.options({
        "users": {
            alias: "u",
            describe: "ammount of users to generate",
            demandOption: false,
            default: 1,
            number: true
        },
        "nationality": {
            alias: "n",
            describe: "specify nationality of generated users",
            demandOption: false,
            choices: ["AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IR", "NO", "NL", "NZ", "TR", "US"],
            default: "US"
        },
        "outputFormat": {
            alias: "f",
            describe: "output format of recieved data",
            demandOption: false,
            choices: ["JSON", "PrettyJSON", "CSV", "YAML", "XML"],
            default: "JSON"
        }
    });
},
    function (params) {
        processTheResults(params);

    }).help()
    .argv;

function processTheResults(args) {

    const parameters = {
        method: "GET",
        uri: `${uri}/?results=${(args.users > 0 && args.users <= 5000) ? (args.users) : (1)}&gender=${args.nationality}&format=${args.outputFormat}`,
        json: isResultAJsonOjbect
    };

    rp(parameters)
        .then(requestResult => {
            writeDataToFile(requestResult, args.outputFormat);
        }).catch(err => {
            console.log(err.message);
        });

}

function writeDataToFile(responseResult, FileFormat) {
    if (FileFormat === "JSON") {
        console.log(responseResult);
        const buffer = Buffer.from(JSON.stringify(responseResult.results, null, "\t"));
        const writeStream = fs.createWriteStream("UserInfo.json");
        writeStream.write((buffer));
        writeStream.end();
    }
    else {
        console.log(responseResult);
        const buffer = Buffer.from(responseResult);
        const data = buffer.toString("utf8");
        const writeStream = fs.createWriteStream(`UserInfo.${FileFormat.toLowerCase()}`);
        writeStream.write(data);
        writeStream.end() ;
    }
}
