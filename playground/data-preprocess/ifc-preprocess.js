"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var path = require("path");
function convertIfc2ObjAndXml(source, objDestination, xmlDestination) {
    return new Promise(function (resolve, reject) {
        var convertCmd = __dirname + '/IfcConvert-Ifc4';
        var convert2Obj = [source, objDestination];
        var convert2Xml = [source, xmlDestination];
        child_process_1.execFile(convertCmd, convert2Obj, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
        child_process_1.execFile(convertCmd, convert2Xml, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    });
}
// TODO, check the whether the destination already exists
convertIfc2ObjAndXml(path.resolve(__dirname + "/../data/Tausendpfund_4storeys.ifc"), path.resolve(__dirname + "/../data/example.obj"), path.resolve(__dirname + "/../data/example.xml"));
