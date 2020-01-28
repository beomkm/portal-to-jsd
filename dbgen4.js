/**
 * Created by user on 2016-12-05.
 */


const DAY_TIME = { "월":0, "화":100, "수":200, "목":300, "금":400, "토":500 };
const AB_TIME = { "A":0, "B":1 };

const depDict = {};
const divDict = {};


function doOnLoad()
{
    $("#fileInput").change(doOpenFile);
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function doOpenFile() {
    const reader = new FileReader();
    reader.onload = function(e) {
        var data = reader.result;
        var output = processData(data);
        download("output.jsd", output);
        //console.log("res = " + reader.result);
    }
    reader.onerror = function(evt) {
        console.log(evt.target.error.code);
    }
    reader.readAsText(this.files[0]);
}

function processData(data)
{
    const xmlDoc = $.parseXML(data);
    const xmlData = xmlDoc.documentElement.children;

    const COLS = [
        'CORS_CD',
        'CORS_NM',
        'CLS_NO',
        'REQ_DEPT_NM',
        'LECT_RM',
        'CREDIT',
        'DESIGN_CREDIT',
        'DEPT_NM',
        'PROF_NM',
        'CLS_CNT'];

    console.log(xmlData[1].children[1].children.length);
    const xmlSbjList = xmlData[1].children[1].children;
    let output = "var SUBJECT_DATA = [\r\n";

    for (let i=0; i<xmlSbjList.length; i++) {
        const subject = xmlSbjList[i].children;
        // console.log(xmlSbjList[i].children["REQ_DEPT_NM"] == undefined);
        // break;
        let obj = {};
        output += "[";
        for (let j=0; j<COLS.length; j++) {
            if (subject.hasOwnProperty(COLS[j])) {
                obj[COLS[j]] = subject[COLS[j]].innerHTML;
            }
            else {
                obj[COLS[j]] = "";
            }
        }

        for(let j=0; j<COLS.length; j++) {
            output += "\"" + packSpace(obj[COLS[j]]) + "\",";
        }

        let str = subject.hasOwnProperty('LECT_TM') ? subject['LECT_TM'].innerHTML : "";
        // delete obj["sch"];
        output += "["
        let unit = str.split(",");
        for (let j=0; j<unit.length; j++) {
            if (unit[j].length == 8) {
                let startStr = unit[j].substr(1,3);
                let endStr = unit[j].substr(5,3);
                let startTime = DAY_TIME[unit[j].charAt(0)] + 2*(parseInt(startStr.substr(0,2))-1) + AB_TIME[startStr.charAt(2)];
                let endTime = DAY_TIME[unit[j].charAt(0)] + 2*(parseInt(endStr.substr(0,2))-1) + AB_TIME[endStr.charAt(2)];

                for(let k=startTime; k<=endTime; k++) {
                    output += k + ",";
                }
            }
            else if(unit[j].length == 4) {
                let startStr = unit[j].substr(1,3);
                let startTime = DAY_TIME[unit[j].charAt(0)] + 2*(parseInt(startStr.substr(0,2))-1) + AB_TIME[startStr.charAt(2)];
                output += startTime + ",";
            }
            else {
                console.log(subject['CORS_NM'].innerHTML);
            }
        }
        output += "]";
        output += "],\r\n";
    }
    output += "];";

    return output;
    // var output = "var SUBJECT_DATA = [\r\n";
    // for(var i=0; i<xmlData.length; i++) {
    //     var subject = xmlData[i];
    //     var obj = {};
    //     output += "[";
    //     for(var j=0; j<subject.children.length; j++) {
    //         if(subject.children[j].tagName == "dvi") continue;
    //         if(subject.children[j].tagName == "pfi") continue;
    //         obj[subject.children[j].tagName] = subject.children[j].innerHTML;
    //     }
 
    //     var cols = ["cod", "ttk", "cls", "dvi", "pla", "crd", "dsg", "dep", "pfn", "cap", "elr", "eng"];
    //     for(var j=0; j<cols.length; j++) {
    //         if(obj.hasOwnProperty(cols[j])) {
    //             output += "\"" + packSpace(obj[cols[j]]) + "\",";
    //         }
    //         else {
    //             output += "\"\",";
    //         }
    //     }
}

function packSpace(str)
{
    var len = str.length;
    var i;
    for(i=len-1; i>=0; --i) {
        if(str[i] != ' ') break;
    }
    return str.substr(0, i+1);
}

