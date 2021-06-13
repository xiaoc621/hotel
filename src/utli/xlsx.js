import fs from 'file-saver'
import XLSX from 'xlsx'

export function xlsx(json,fields,filename = '.xlsx') {
    json.forEach((item) => {
        for(let i in item){
            if(fields.hasOwnProperty(i)){
                 item[fields[i]] = item[i]
            }
            delete item[i]
        }
    });
    let sheetName = filename
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.json_to_sheet(json,{header:Object.values(fields)})
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    const defaultCellStyle = {
        font:{name:"Verdana",sz:13,color:"FF00FF88"},
        fill:{fgColor:{gbr:"FFFFAA00"}}
    };
    let wopts = {
        bookType:"xlsx",
        bookSST:false,
        type:"binary",
        cellStyles:true,
        defaultCellStyle:defaultCellStyle,
        showGridLines:false
    };
    let wbout = XLSX.write(wb,wopts)
    let blob = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
    fs.saveAs(blob,filename + ".xlsx")
}

const s2ab = (s) => {
    var buf;
    if(typeof ArrayBuffer !== "undefined"){
       buf = new ArrayBuffer(s.length);
       var view = new Uint8Array(buf);
       for(var i=0; i != s.length;++i) view[i] = s.charCodeAt(i) & 0xff;
           return buf
    } else {
        buf = new Array(s.length);
        for(var i=0; i != s.length;++i) buf[i] = s.charCodeAt(i) & 0xff;
           return buf
    }
}
    
