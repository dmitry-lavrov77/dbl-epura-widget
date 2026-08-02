import  JSZip from 'jszip';

import opentype from 'opentype.js'

import _ from 'lodash';




//obj.node = parser.parseFromString(obj.xml, "application/xml"); 
      //
      //<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      //<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="0" uniqueCount="0"><si><t>01-08-2022 00:00:00</t></si><si><t>01-10-2021 00:00:00</t></si><si><t>01-10-2020 00:00:00</t></si></sst>
      //

      function getTextWidth(text, font) {

        const el = document.createElement('div');
        el.style = 'width: 1in;'
        document.body.appendChild(el);
        const pi = el.offsetWidth;
        document.body.removeChild(el);
      
        let DPI = pi*window.devicePixelRatio;
      
        
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
      
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      
        
      
        return {width:metrics.width, height:(actualHeight*1.5+1.5)* DPI / 72};
      }
      


      const mx = (getTextWidth('12345678', '11pt Calibri').height>20)?getTextWidth('12345678', '11pt Calibri').height:20;

       

const shared_strings_sample = {

    path: 'xl/sharedStrings.xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"></sst>`

}      


const content_types_sample = {
  
    path:'[Content_Types].xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="png" ContentType="image/png"/><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>
        `

}

const dot_rels_sample = {

   path:'_rels/.rels',
   
   xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
       <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>
   
   `


}


const app_sample = {

    path:'docProps/app.xml',
    
    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Листы</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Лист1</vt:lpstr></vt:vector></TitlesOfParts><Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0300</AppVersion></Properties>
    `
 
 
 }


 const core_sample = {

    path:'docProps/core.xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
         <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>Дмитрий Лавров</dc:creator><cp:lastModifiedBy>Дмитрий Лавров</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2025-02-19T06:47:22Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2025-02-19T06:47:49Z</dcterms:modified></cp:coreProperties>
    
    `

 }
 
 const workbook_xml_rels_sample = {

    path:'xl/_rels/workbook.xml.rels',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>    
    `
 }


/*const theme_sample = {

    path:'xl/theme/theme1.xml',

    xml:`
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Тема Office"><a:themeElements><a:clrScheme name="Стандартная"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Стандартная"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/>
<a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/>
<a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/>
<a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/>
<a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/>
<a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/>
<a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/>
<a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/>
<a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Стандартная"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0">
<a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>
<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>    
    `


}*/


const sheet_sel_sample = {

    path:'xl/worksheets/sheet1.xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{049C0D98-EF69-4E23-A941-E704C23F8B97}"><dimension ref="A1"/><sheetViews><sheetView  showGridLines="0" tabSelected="1" workbookViewId="0"><selection activeCell="E5" sqref="E5"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/><sheetData/><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>
    
    `

}


const sheet_sample = {

  path:'xl/worksheets/sheet1.xml',

  xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{049C0D98-EF69-4E23-A941-E704C23F8B97}"><dimension ref="A1"/><sheetViews><sheetView   showGridLines="0" workbookViewId="0"><selection activeCell="E5" sqref="E5"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/><sheetData/><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>
  
  `


}


const sheets_rels_sample = {

    path:'xl/worksheets/_rels/sheet1.xml.rels',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>
    `


}




const styles_sample = {

    path:'xl/styles.xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac x16r2 xr" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:x16r2="http://schemas.microsoft.com/office/spreadsheetml/2015/02/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"><fonts count="1" x14ac:knownFonts="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><charset val="204"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs><cellStyles count="1"><cellStyle name="Обычный" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/><extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"><x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext><ext uri="{9260A510-F301-46a8-8635-F512D64BE5F5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:timelineStyles defaultTimelineStyle="TimeSlicerStyleLight1"/></ext></extLst></styleSheet>
    `


}

const workbook_sample = {

    path:'xl/workbook.xml',

    xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15 xr xr6 xr10 xr2" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6" xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"><fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="28429"/><workbookPr defaultThemeVersion="166925"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice Requires="x15"><x15ac:absPath url="C:\\yyyyyyy" xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac"/></mc:Choice></mc:AlternateContent><xr:revisionPtr revIDLastSave="0" documentId="8_{95FCAB08-E4C9-4414-8AD6-DC0BEC036445}" xr6:coauthVersionLast="47" xr6:coauthVersionMax="47" xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}"/><bookViews><workbookView xWindow="-120" yWindow="-120" windowWidth="29040" windowHeight="15840" firstSheet="1" activeTab="1"/></bookViews><sheets><sheet name="Лист1" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029"/><extLst><ext uri="{140A7094-0E35-4892-8432-C4D2E57EDEB5}" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><x15:workbookPr chartTrackingRefBase="1"/></ext></extLst></workbook>
 `


}
 

const add_node = (obj, parser) => {

    obj.node = parser.parseFromString(obj.xml, "application/xml");  

}


const serilalizeXML = (obj) =>{

 let sss = new XMLSerializer().serializeToString(obj.node);
 
 obj.xml = sss.replaceAll('xmlns=""', '');

 return obj.xml

} 


const rgbToHex = (r, g, b) => {
  // Convert each RGB component to its hexadecimal string representation
  const toHex = (c) => {
    const hex = parseFloat(c).toString(16);
    // Add a leading zero if the hexadecimal value is a single digit
    return hex.length === 1 ? '0' + hex : hex;
  };

  // Concatenate the hexadecimal values and prepend with '#'
  return  toHex(r) + toHex(g) + toHex(b);
};


function loadFontAsync(path) {
  return new Promise((resolve, reject) => {
    // Node version
    if (typeof window === 'undefined') {
      const fs = require('fs');
      fs.readFile(path, (err, buffer) => {
        if (err) reject(err);
        else resolve(opentype.parse(buffer));
      });
    } else {
      // Browser version
      fetch(path)
        .then(res => res.arrayBuffer())
        .then(buf => resolve(opentype.parse(buf)))
        .catch(reject);
    }
  });
}

const renderText = async (node, idd, vbx, vby,emu, vbx0, vby0) =>{

  let color = node.getAttribute('fill');
 

  if (!color) color = "000000"
  
  else {
    
    if (color.indexOf('rgb')!==-1) {

      let pp = color.split('rgb(')[1];
      pp = pp.split(')')[0]
      pp = pp.split(',')

      color = rgbToHex(pp[0], pp[1], pp[2]).toUpperCase();


    }
    else {color = color.slice(1)}

  }  


  let pres='<xdr:sp macro="" textlink="">'
  pres+='<xdr:nvSpPr>'
  pres+='<xdr:cNvPr id="'+idd+'" name="Полигон">'
  pres+='</xdr:cNvPr>'
  pres+='<xdr:cNvSpPr>'
  pres+='<a:spLocks noAdjustHandles="1" noChangeArrowheads="1" noChangeAspect="1" noChangeShapeType="1" noEditPoints="1"  noRot="1" noMove="1" noResize="1">'
  pres+='</a:spLocks>'
  pres+='</xdr:cNvSpPr>'
  pres+='</xdr:nvSpPr>'
  pres+='<xdr:spPr>'
  pres+='<a:xfrm>'
  pres+='<a:off x="'+emu.x+'" y="'+emu.y+'"/>'
  pres+=`<a:ext cx="`+emu.cx+`" cy="`+emu.cy+`"/>`
  pres+='</a:xfrm>'
  pres+='<a:custGeom>'
  pres+='<a:pathLst>'


  let font = await loadFontAsync('/fonts/times.ttf');

//let font = await opentype.parse(buffer, options);
 
  let bb = node.getBBox()

  let path = '';

  let rrrr = node.style.fontSize;

  if (rrrr==='') rrrr = node.getAttribute('font-size');

 


  if (!node.styleFontSize) path = font.getPath(node.textContent, bb.x-vbx0, bb.y-vby0+bb.height/2, parseFloat(rrrr));
 
  else path = font.getPath(node.textContent, bb.x - vbx0, bb.y-vby0+bb.height/2, parseFloat(node.style.fontSize));

  
  
  const  rotatePoint = (x, y, centerX, centerY, angle) => {
    const translatedX = x - centerX;
    const translatedY = y - centerY;
    const rotatedX = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
    const rotatedY = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
    return { x: rotatedX + centerX, y: rotatedY + centerY };
}
  
  
  
 
  
  if (node.getAttribute('transform')!==null) {

    let rr = node.getAttribute('transform');

  

    rr = rr.split('rotate(')[1]

    rr = rr.split(')')[0];

  
    if ( rr.split(',').length!==3) {
  
  
      rr = rr.split(' ')

      let tt = rr[1].split(',');

      rr = [rr[0], tt[0], tt[1]]

    } else rr = rr.split(',');



    if (rr.length===3) {
      
      
      path.commands = path.commands.map(command => {
   
     if (command.x !== undefined && command.y !== undefined) {
       
      
        const rotatedCoords = rotatePoint(command.x, command.y, parseFloat(rr[1])-vbx0, parseFloat(rr[2])-vby0-bb.height/2, 2*Math.PI*parseFloat(rr[0])/360);
        
        let new_command = command;

        new_command.x = rotatedCoords.x

        new_command.y = rotatedCoords.y
        
        return new_command;
     }


    return command; 
   });


    path.commands = path.commands.map(command => {
   
    if (command.x1 !== undefined && command.y1 !== undefined) {
       
      
        const rotatedCoords = rotatePoint(command.x1, command.y1, parseFloat(rr[1])-vbx0, parseFloat(rr[2])-vby0-bb.height/2, 2*Math.PI*parseFloat(rr[0])/360);
        
        let new_command = command;

        new_command.x1 = rotatedCoords.x

        new_command.y1 = rotatedCoords.y
      
        
        return new_command;
     }
    return command; 
   });

  }



    
    



  
}






  pres+='<a:path w="'+vbx+'" h="'+vby+'">';


   for (let j=0;j<path.commands.length;j++) {

    
    if (path.commands[j].type==='M') pres+= '<a:moveTo><a:pt x="'+Math.round(path.commands[j].x)+'" y="'+Math.round(path.commands[j].y)+'"/></a:moveTo>'
    
    if (path.commands[j].type==='L') pres+= '<a:lnTo><a:pt x="'+Math.round(path.commands[j].x)+'" y="'+Math.round(path.commands[j].y)+'"/></a:lnTo>'
    
    if (path.commands[j].type==='C')  pres+= '<a:cubicBezTo><a:pt x="'+Math.round(path.commands[j].x2)+'" y="'+Math.round(path.commands[j].y2)+'"/><a:pt x="'+Math.round(path.commands[j].x1)+'" y="'+Math.round(path.commands[j].y1)+'"/><a:pt x="'+Math.round(path.commands[j].x)+'" y="'+Math.round(path.commands[j].y)+'"/></a:cubicBezTo>' 
    
    if (path.commands[j].type==='Q')  pres+= '<a:quadBezTo><a:pt x="'+Math.round(path.commands[j].x1)+'" y="'+Math.round(path.commands[j].y1)+'"/><a:pt x="'+Math.round(path.commands[j].x)+'" y="'+Math.round(path.commands[j].y)+'"/></a:quadBezTo>' 

   }

   pres+= '<a:close/></a:path>'

   pres+= '</a:pathLst>'
   pres+= '</a:custGeom>'

   pres+= '<a:solidFill><a:srgbClr val="'+color+'"/></a:solidFill></xdr:spPr></xdr:sp>'

   return pres;


}




const renderPolygon = (node, idd, vbx, vby, emu, vbx0, vby0) =>{

  let color = node.getAttribute('fill');

  //if (color==='none') return ''
 

  if (!color) color = "000000"
  
  else {
    
    if (color.indexOf('rgb')!==-1) {

      let pp = color.split('rgb(')[1];
      pp = pp.split(')')[0]
      pp = pp.split(',')

      color = rgbToHex(pp[0], pp[1], pp[2]).toUpperCase();



    }
    else {color = color.slice(1)}

  }  
  //color = "000000"


  let pres='<xdr:sp macro="" textlink="">'
  pres+='<xdr:nvSpPr>'
  pres+='<xdr:cNvPr id="'+idd+'" name="Полигон">'
  pres+='</xdr:cNvPr>'
  pres+='<xdr:cNvSpPr>'
  pres+='<a:spLocks noAdjustHandles="1" noChangeArrowheads="1" noChangeAspect="1" noChangeShapeType="1" noEditPoints="1" noMove="1" noRot="1" noResize="1">'
  pres+='</a:spLocks>'
  pres+='</xdr:cNvSpPr>'
  pres+='</xdr:nvSpPr>'
  pres+='<xdr:spPr>'
  pres+='<a:xfrm>'
  pres+='<a:off x="'+emu.x+'" y="'+emu.y+'"/>'
  pres+=`<a:ext cx="`+emu.cx+`" cy="`+emu.cy+`"/>`
  pres+='</a:xfrm>'
  pres+='<a:custGeom>'
  pres+='<a:pathLst>'
  pres+='<a:path w="'+vbx+'" h="'+vby+'">';

    

  pres+= '<a:moveTo><a:pt x="'+Math.round(node.points[0].x - vbx0)+'" y="'+Math.round(node.points[0].y -vby0)+'"/></a:moveTo>'

  for (let j=1;j<node.points.length;j++) {

   pres+= '<a:lnTo><a:pt x="'+Math.round(node.points[j].x - vbx0)+'" y="'+Math.round(node.points[j].y - vby0)+'"/></a:lnTo>'

  }

  pres+= '<a:close/></a:path>'

  

  pres+= '</a:pathLst>'
  pres+= '</a:custGeom>'

  if (color!=='one') pres+= '<a:solidFill><a:srgbClr val="'+color+'"/></a:solidFill></xdr:spPr></xdr:sp>'
  
  else pres+= '<a:noFill/></xdr:spPr></xdr:sp>'

  return pres;


}



const renderImage = (node, idd, vbx, vby, emu, vbx0, vby0) =>{


  let pres=`
   
  
  <xdr:pic>
      <xdr:nvPicPr>
        <xdr:cNvPr id="${idd}" name="Picture 1"/>
        <xdr:cNvPicPr>
          <a:picLocks noChangeAspect="1"/>
        </xdr:cNvPicPr>
      </xdr:nvPicPr>
      <xdr:blipFill>
        <a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId700003"/>
        <a:stretch>
          <a:fillRect/>
        </a:stretch>
      </xdr:blipFill>
      <xdr:spPr>
        <a:xfrm>
          <a:off x="${emu.x}" y="${emu.y}"/>
          <a:ext cx="${emu.cx}" cy="${emu.cy}"/>
        </a:xfrm>
        <a:prstGeom prst="rect">
          <a:avLst/>
        </a:prstGeom>
      </xdr:spPr>
    </xdr:pic>
  `
  

   //'xl/drawings/drawing'+(sheet_no+1).toString()+'.xml',

   //this.file_contents  = 'hello';
   
   
   ///zip.file('xl/media/image111.png', 'hello');
  


   return pres;


}


const renderLine = (node, idd, vbx, vby, emu, vbx0, vby0) =>{

  

    let color = node.getAttribute('stroke');
   
    if (color==='none') return ''
 

    if (!color) color = "000000"
  
    else {
    
    if (color.indexOf('rgb')!==-1) {

      let pp = color.split('rgb(')[1];
      pp = pp.split(')')[0]
      pp = pp.split(',')

      color = rgbToHex(pp[0], pp[1], pp[2]).toUpperCase();



    }
    else {color = color.slice(1)}

  }  
  
  
    let pres='<xdr:sp macro="" textlink="">'
    pres+='<xdr:nvSpPr>'
    pres+='<xdr:cNvPr id="'+idd+'" name="Полигон">'
    pres+='</xdr:cNvPr>'
    pres+='<xdr:cNvSpPr>'
    pres+='<a:spLocks noAdjustHandles="1" noChangeArrowheads="1" noChangeAspect="1" noChangeShapeType="1" noEditPoints="1" noMove="1" noRot="1" noResize="1">'
    pres+='</a:spLocks>'
    pres+='</xdr:cNvSpPr>'
    pres+='</xdr:nvSpPr>'
    pres+='<xdr:spPr>'
    pres+='<a:xfrm>'
    pres+='<a:off x="'+emu.x+'" y="'+emu.y+'"/>'
    pres+=`<a:ext cx="`+emu.cx+`" cy="`+emu.cy+`"/>`
    pres+='</a:xfrm>'
    pres+='<a:custGeom>'
    pres+='<a:pathLst>'
    pres+='<a:path w="'+vbx+'" h="'+vby+'">';
    pres+= '<a:moveTo><a:pt x="'+Math.round(parseFloat(node.getAttribute('x1'))-vbx0)+'" y="'+Math.round(parseFloat(node.getAttribute('y1'))- vby0)+'"/></a:moveTo>'
  
    
    let x2 = Math.round(parseFloat(node.getAttribute('x2'))) - vbx0;


    let y2 = Math.round(parseFloat(node.getAttribute('y2'))) - vby0;
    


    if (node.getAttribute('x1') === node.getAttribute('x2')&&node.getAttribute('y1') === node.getAttribute('y2') ){


      x2++;

      y2++;


    }


   
    //for (let j=1;j<node.points.length;j++) {
  
     pres+= '<a:lnTo><a:pt x="'+x2+'" y="'+y2+'"/></a:lnTo>'
  
    //}
  
      
    pres+= '</a:path>'
  
    pres+= '</a:pathLst>'
    
    pres+= '</a:custGeom>'
  
    pres+= '<a:noFill/><a:ln><a:solidFill><a:srgbClr val="'+color+'"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>'
  
  
    return pres; 

}



const renderPolyline = (node, idd, vbx, vby, emu, vbx0, vby0) =>{




    let color = node.getAttribute('stroke');
   
    if (color==='none') return ''
 

  if (!color) color = "000000"
  
  else {
    
    if (color.indexOf('rgb')!==-1) {

      let pp = color.split('rgb(')[1];
      pp = pp.split(')')[0]
      pp = pp.split(',')

      color = rgbToHex(pp[0], pp[1], pp[2]).toUpperCase();

     

    }
    else {color = color.slice(1)}

  }  
  
    let pres='<xdr:sp macro="" textlink="">'
    pres+='<xdr:nvSpPr>'
    pres+='<xdr:cNvPr id="'+idd+'" name="Полигон">'
    pres+='</xdr:cNvPr>'
    pres+='<xdr:cNvSpPr>'
    pres+='<a:spLocks noAdjustHandles="1" noChangeArrowheads="1" noChangeAspect="1" noChangeShapeType="1" noEditPoints="1" noMove="1" noRot="1" noResize="1">'
    pres+='</a:spLocks>'
    pres+='</xdr:cNvSpPr>'
    pres+='</xdr:nvSpPr>'
    pres+='<xdr:spPr>'
    pres+='<a:xfrm>'
    pres+='<a:off x="'+emu.x+'" y="'+emu.y+'"/>'
    pres+=`<a:ext cx="`+emu.cx+`" cy="`+emu.cy+`"/>`
    pres+='</a:xfrm>'
    pres+='<a:custGeom>'
    pres+='<a:pathLst>'
    pres+='<a:path w="'+vbx+'" h="'+vby+'">';
    pres+= '<a:moveTo><a:pt x="'+Math.round(node.points[0].x -vbx0)+'" y="'+Math.round(node.points[0].y - vby0)+'"/></a:moveTo>'
  
    for (let j=1;j<node.points.length;j++) {
  
     pres+= '<a:lnTo><a:pt x="'+Math.round(node.points[j].x -vbx0)+'" y="'+Math.round(node.points[j].y - vby0)+'"/></a:lnTo>'
  
    }
  
    
  
    pres+= '</a:path>'
  
    pres+= '</a:pathLst>'
    
    pres+= '</a:custGeom>'
  
    pres+= '<a:noFill/><a:ln><a:solidFill><a:srgbClr val="'+color+'"/></a:solidFill></a:ln></xdr:spPr></xdr:sp>'
  
  
    return pres; 
  
  }
  

const renderSVG = async (node,  vbx, vby, emu, idd, vbx0, vby0, picc) =>{



   // picc = null;

    let res = '';
  
    let list = node.querySelectorAll('polyline, polygon, line, text, img')
  
    idd++;
  
    for (let i =0; i<list.length;i++) {
  
      if (list[i].tagName === 'polyline') res +=renderPolyline(list[i], idd, vbx, vby, emu, vbx0, vby0);

      if (list[i].tagName === 'polygon') res +=renderPolygon(list[i], idd, vbx, vby, emu, vbx0, vby0);

      if (list[i].tagName === 'line') res +=renderLine(list[i], idd, vbx, vby, emu, vbx0, vby0);

      if (list[i].tagName === 'text') res += await renderText(list[i], idd, vbx, vby, emu, vbx0, vby0);

      if (list[i].tagName ==='IMG') {res += renderImage(list[i], idd, vbx, vby, emu, vbx0, vby0); picc.src = list[i].src} 
     
      idd++;
  
    }
  
   // list = node.querySelectorAll('text');
  
   // for (let i =0; i<list.length;i++) {
  
     
  
     // idd++
  
    //}  
  
  
   // list = node.querySelectorAll('polygon');
  
  
   // for (let i =0; i<list.length;i++) {
  
   //  res += renderPolygon(list[i], idd, vbx, vby, emu)  
  
   //  idd++
    
   // } 
   

   //     list = node.querySelectorAll('line');
  
  
   // for (let i =0; i<list.length;i++) {
  
   //  res += renderLine(list[i], idd, vbx, vby, emu)  
  
   //  idd++
    
   // } 




    return {idd:idd, res:res};
  
  
  }
  
  const renderPreface_svg = (cellxmin, cellymin, cellxmax, cellymax, coll_off_min, coll_off_max, row_off_min, row_off_max, emu, idd) =>{


    let cellxmin2 = (64*parseFloat(cellxmin)*9525+parseFloat(coll_off_min)).toString();
    let cellymin2 = (23*parseFloat(cellymin)*9525+parseFloat(row_off_min)).toString();
    
    let cellxmax2 = ((64*parseFloat(cellxmax)*9525+parseFloat(coll_off_max)) - parseFloat(cellxmin2)).toString();
    let cellymax2 =( (23*parseFloat(cellymax)*9525+parseFloat(row_off_max)) - parseFloat(cellymin2)).toString();

    
   
   
    

    let preface =`<xdr:twoCellAnchor>
    <xdr:from>
    <xdr:col>`+cellxmin+`</xdr:col>  
    <xdr:colOff>`+coll_off_min+`</xdr:colOff>
    <xdr:row>`+cellymin+`</xdr:row>
    <xdr:rowOff>`+row_off_min+`</xdr:rowOff>
    </xdr:from>
    <xdr:to>
    <xdr:col>`+cellxmax+`</xdr:col>
    <xdr:colOff>`+coll_off_max+`</xdr:colOff>
    <xdr:row>`+cellymax+`</xdr:row>
    <xdr:rowOff>`+row_off_max+`</xdr:rowOff>
    </xdr:to>
    <xdr:grpSp>
    <xdr:nvGrpSpPr><xdr:cNvPr id="`+idd+`" name="GROUP `+idd.toString()+`"><a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
    <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{83198DB6-0B67-A554-3F96-4F701AFEB850}"/>
    </a:ext></a:extLst></xdr:cNvPr><xdr:cNvGrpSpPr><a:grpSpLocks noSelect="0" noUngrp="1"></a:grpSpLocks></xdr:cNvGrpSpPr></xdr:nvGrpSpPr>
    <xdr:grpSpPr>
    <a:xfrm><a:off x="`+cellxmin2+`" y="`+cellymin2+`"/><a:ext cx="`+cellxmax2+`" cy="`+cellymax2+`"/><a:chOff x="`+cellxmin2+`" y="`+cellymin2+`"/>
    <a:chExt cx="`+cellxmax2+`" cy="`+cellymax2+`"/></a:xfrm>
    </xdr:grpSpPr>`
  
     return preface;
    
     //<a:off x="`+coll_off_min+`" y="`+row_off_min+`"/><a:ext cx="5332666" cy="1724025"/>
     //<a:chOff x="`+coll_off_min+`" y="`+row_off_min+`"/><a:chExt cx="5942361" cy="1724025"/>
  
  }


  const renderEnding_svg = () => {

    return `</xdr:grpSp><xdr:clientData/></xdr:twoCellAnchor>` 
  
  
  }

  const renderEnding = () => {

    return `</xdr:wsDr>` 
  
  
  }

  
  const renderPreface = () =>{


    let preface = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">`
  
    return preface;
    

  }
  


export class ExcelMaker {


    async flush  () {
       
      this.zip.file(this.content_types.path, serilalizeXML(this.content_types));

      this.zip.file(this.dot_rels.path, serilalizeXML(this.dot_rels));

      this.zip.file(this.workbook_xml_rels.path, serilalizeXML(this.workbook_xml_rels));


      for (let i =0; i<this.charts.length;i++) this.zip.file(this.charts[i].path, serilalizeXML(this.charts[i]));

      for (let i =0; i<this.sheets.length;i++) this.zip.file(this.sheets[i].path, serilalizeXML(this.sheets[i]));

      for (let i =0; i<this.sheets_rels.length;i++) this.zip.file(this.sheets_rels[i].path, serilalizeXML(this.sheets_rels[i]));
 
      for (let i =0; i<this.drawings.length;i++) if (this.drawings[i]) {
         
       
        this.zip.file(this.drawings[i].path, serilalizeXML(this.drawings[i]));
      }

      for (let i =0; i<this.drawings_rels.length;i++) if (this.drawings_rels[i]) {
  
        this.zip.file(this.drawings_rels[i].path, serilalizeXML(this.drawings_rels[i]));
      }

      if (this.shared_strings_vals.length) this.zip.file(this.shared_strings.path, serilalizeXML(this.shared_strings));


      //if (this.pics_cnt){


      



      //}

      //if (this.file_contents) {



        // zip.file('xl/media/image111.png', this.file_contents);

      //}


      this.zip.file(this.styles.path, serilalizeXML(this.styles));
   
      this.zip.file(this.workbook.path, serilalizeXML(this.workbook));

      const excelBlob = await this.zip.generateAsync({type : "blob",  mimeType: "application/vnd.oasis.opendocument.spreadsheet"});

      const url = URL.createObjectURL(excelBlob);
 
      const a = document.createElement('a');
 
      a.href = url;
 
      a.download = this.filename+'.xlsx';
 
      document.body.appendChild(a);
 
      a.click();
 
      document.body.removeChild(a);

    }


    /*column_name(num) {

      let nn = num;

      if (nn>=0&&nn<26) return String.fromCharCode("A".charCodeAt(0)+nn); 

      this.column_name(Math.floor(nn/26)) + this.column_name(nn % 26 +1);

      
      
    }*/

     column_name(index) {

       let label = '';
       let num = index;
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label;
    num = Math.floor(num / 26) - 1;
  }
  return label;


    }



    fix_rows (sheet_no) {

     // return
     

      let sd = this.sheets[1].node.querySelector("sheetData")

     

      

      let cols = this.sheets[1].node.createElement('cols', '')

      sd.before(cols);

      for (let i=0;i<this.colss[0].length;i++){
   
         let col = this.sheets[1].node.createElement('col', '')
         col.setAttribute('min', (i+1).toString())
         col.setAttribute('max', (i+1).toString())
         col.setAttribute('width', (8.57*parseFloat(this.colss[0][i].width)/64).toString())
         col.setAttribute('customWidth', "1")
         cols.appendChild(col);

      }



      //return

      /*if (!sd) {
        
        sd = this.sheets[sheet_no].node.createElement("sheetData", '');

        this.sheets[sheet_no].node.appendChild(sd);
      
      }*/

      for (let i =0; i<this.rowss[0].length;i++) {

         if (this.rowss[0][i].height===20) {continue;}


          let row = sd.querySelector('row[r="'+(i+1).toString()+'"]')
          
          if (!row) {

             row = this.sheets[1].node.createElement('row', '')

             row.setAttribute('r', (i+1).toString())

             sd.appendChild(row);
        
          }

       
           row.setAttribute('ht',(15*(parseFloat(this.rowss[0][i].height))/20).toString())

           row.setAttribute('customHeight',"1");

          


      }


      let new_rows  = Array.from(sd.children);

      new_rows.sort((a, b) => {return parseFloat(a.getAttribute("r")) - parseFloat(b.getAttribute("r"))})

       while (sd.firstChild) {
          sd.removeChild(sd.lastChild);
       }

       for (let i =0; i<new_rows.length;i++) sd.appendChild(new_rows[i]);

      

     



    }




excelColumnNameToNumber(columnName) {
  let result = 0;
  // Ensure the input is uppercase for consistent ASCII calculations
  columnName = columnName.toUpperCase(); 

  for (let i = 0; i < columnName.length; i++) {
    // Get the character's value (A=1, B=2, ..., Z=26)
    const charValue = columnName.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    
    // Multiply the current result by 26 and add the current character's value
    result = result * 26 + charValue;
  }

  return result;
} 



    add_numbers (sheet_no, cells, strs) {


      

     
      let sd = this.sheets[sheet_no].node.querySelector("sheetData")

      if (!sd) {
        
        sd = this.sheets[sheet_no].node.createElement("sheetData", '');

        this.sheets[sheet_no].node.appendChild(sd);
      
      }


      for (let i =0; i<strs.length; i++) {

        

      let row = sd.querySelector('row[r="'+(cells[i].y).toString()+'"]')
          
      if (!row) {

        row = this.sheets[sheet_no].node.createElement('row', '')

        row.setAttribute('r', (cells[i].y).toString())

        sd.appendChild(row);

      }
      
      let c = this.sheets[sheet_no].node.createElement('c', '');

      
      let cs = row.querySelectorAll('c');

      
      let done = false;

      if (cs.length===0) {done=true;  row.appendChild(c);}
      else 
      for (let k =0; k<cs.length;k++) {

        let yy = ''
      
        let ppp = cs[k].getAttribute('r');

        for (let rr=0;rr<ppp.length;rr++) {if (ppp[rr]<'A'||ppp[rr]>'Z') break;yy+=ppp[rr]}

        let ll = this.excelColumnNameToNumber(yy);
       
        if (ll>cells[i].x+1) {cs[k].before(c); done = true; break;}

      }
      
      
      if (!done) row.appendChild(c);

      c.setAttribute('r', this.column_name(cells[i].x+1)+(cells[i].y).toString())

      
      if (strs[i].trim()==='') c.remove();

      else c.innerHTML = "<v>"+strs[i]+"</v>";

      
      
      //c.innerHTML = "<v>"+strs[i]+"</v>";

      }
    
    }


   add_multi(sheet_no = 1, multi = []) {

     let sd = this.sheets[sheet_no].node.querySelector("sheetData");
     
     
     let mc = this.sheets[sheet_no].node.createElement("mergeCells", '');

     mc.setAttribute('count', (multi.length).toString());

     sd.after(mc);

     for (let i =0; i<multi.length;i++) {

        
        let mcc = this.sheets[sheet_no].node.createElement("mergeCell", '');


        mcc.setAttribute('ref', this.column_name(multi[i].x0)+(multi[i].y0+1).toString()+':'+this.column_name(multi[i].x)+(multi[i].y+1).toString());

       mc.appendChild(mcc);
      }



   } 

   add_strings (sheet_no, cells, strs, colors=[], fonts=[], bgcolors=[], styles=[], borders=[], alignments=[], valignments=[]) {


     
     

      //let styles = this.styles.node;
      // _fills = this.styles.node.querySelector("fills");

     //if (sheet_no!==1) return;


      let sst = this.shared_strings.node.querySelector("sst");


      let sd = this.sheets[sheet_no].node.querySelector("sheetData")

      if (!sd) {
        
        sd = this.sheets[sheet_no].node.createElement("sheetData", '');

        this.sheets[sheet_no].node.appendChild(sd);
      
      }


        let ufonts = [];

          let ufonts_sze = [];

          let ufonts_nme = [];

          for (let k =0; k<fonts.length;k++) {

             if (ufonts.indexOf(fonts[k])===-1) {
                
                ufonts.push(fonts[k]);
                
                let pp = fonts[k].indexOf(' ')

                ufonts_sze.push(fonts[k].slice(0, pp));
                
                ufonts_nme.push(fonts[k].slice(pp));
                

             }  


          } 

          let fff = this.styles.node.querySelector("fonts");

          let cnt2 = fff.getAttribute('count');

          fff.setAttribute('count', (parseFloat(cnt2)+1).toString());

          for (let k =0; k<ufonts.length;k++) {

             let ff0 = this.styles.node.createElement('font', '');

             let sz0 = this.styles.node.createElement('sz', '');

             let cl0 = this.styles.node.createElement('color', '');

             let nm0 = this.styles.node.createElement('name', '');

             let fm0 = this.styles.node.createElement('family', '');

             let cs0 = this.styles.node.createElement('charset', '');

             let sc0 = this.styles.node.createElement('scheme', '');


             fff.appendChild(ff0);

             ff0.appendChild(sz0);

             ff0.appendChild(cl0);

             ff0.appendChild(nm0);

             ff0.appendChild(fm0);

             ff0.appendChild(cs0);

             ff0.appendChild(sc0);
        
             sz0.setAttribute('val', ufonts_sze[k]);

             cl0.setAttribute('theme', '1');

             nm0.setAttribute('val', ufonts_nme[k].trim());

             fm0.setAttribute('val', "2");

             cs0.setAttribute('val', "204");

             sc0.setAttribute('val', "minor");


          }

         






      for (let i=0;i<strs.length;i++) {

        let flll = -1;

        if ((bgcolors[i]&&bgcolors[i]!=='#FFFFFF')||(borders[i]&&borders[i]==='full')||
      
         (alignments[i]&&alignments[i]!=='left')||(valignments[i]&&valignments[i]!=='center')
      
      
      ) {

         
          
        let has_bgval = -1;   
         
         
        if (bgcolors[i]&&bgcolors[i]!=='#FFFFFF') {


         let bgval = bgcolors[i].split('#')[1];

         

          let fl = this.styles.node.createElement('fill', '');

          let pf = this.styles.node.createElement('patternFill', '');

          let bg = this.styles.node.createElement('bgColor', '');

          let fg = this.styles.node.createElement('fgColor', '');

          let fills = this.styles.node.querySelector("fills"); 

          let cnt = fills.getAttribute('count');

          fills.setAttribute('count', (parseFloat(cnt)+1).toString());

          fills.appendChild(fl);

          fl.appendChild(pf);

          pf.setAttribute('patternType', 'solid');

          bg.setAttribute('rgb', bgval);

          fg.setAttribute('rgb', bgval);

          pf.appendChild(fg);
         
          pf.appendChild(bg);

          has_bgval = cnt;
        
         }
       
          let has_border = -1;

          if (borders[i]&&borders[i]==='full') {


             let bs = this.styles.node.querySelector("borders");
          
             let bcnt = bs.getAttribute('count');

             bs.setAttribute('count', (parseFloat(bcnt)+1).toString());

             let border = this.styles.node.createElement('border', '');

             let left = this.styles.node.createElement('left', '');

             left.setAttribute('style', 'thin');

             let right = this.styles.node.createElement('right', '');

             right.setAttribute('style', 'thin');

             let top = this.styles.node.createElement('top', '');

             top.setAttribute('style', 'thin');

             let bottom = this.styles.node.createElement('bottom', '');

             bottom.setAttribute('style', 'thin');

             let color1 = this.styles.node.createElement('color', '');

             color1.setAttribute('auto', '1');

             let color2 = this.styles.node.createElement('color', '');

             color2.setAttribute('auto', '1');

             let color3 = this.styles.node.createElement('color', '');

             color3.setAttribute('auto', '1');
             
             let color4 = this.styles.node.createElement('color', '');

             color4.setAttribute('auto', '1');

             border.appendChild(left);
             border.appendChild(color1);
             border.appendChild(right);
             border.appendChild(color2);
             border.appendChild(top);
             border.appendChild(color3);
             border.appendChild(bottom);
             border.appendChild(color4);

             bs.appendChild(border)

             has_border = bcnt;
             

              // <left style="thin"><color auto="1"/></left><right style="thin"><color auto="1"/></right><top style="thin"><color auto="1"/></top><bottom style="thin"><color auto="1"/></bottom><diagonal/></border>
      


          }



        



          //<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><charset val="204"/><scheme val="minor"/>



         




          let cellXfs = this.styles.node.querySelector("cellXfs");
          
          let cnt1 = cellXfs.getAttribute('count');

          cellXfs.setAttribute('count', (parseFloat(cnt1)+1).toString());
          
          //<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>

          let xf = this.styles.node.createElement('xf', '');

          cellXfs.appendChild(xf)

          xf.setAttribute('numFmtId', '0');

          
          let inn = ufonts.indexOf(fonts[i])

          if (inn!==-1) xf.setAttribute('fontId', '0');
          else xf.setAttribute('fontId', (inn+1).toString());
          
          





          if (has_bgval === -1 ) xf.setAttribute('fillId', '0');
          else xf.setAttribute('fillId', has_bgval.toString());


          if (has_border === -1 ) xf.setAttribute('borderId', '0');
          else xf.setAttribute('borderId', has_border.toString());

          

          xf.setAttribute('xfId', cnt1.toString());

          let rr = null;


          if (alignments[i]&&alignments[i]!=='left') {

            rr = this.styles.node.createElement('alignment', '');

            rr.setAttribute('horizontal', alignments[i]);
          
            //xf.appendChild(rr); 


          }

          if (valignments[i]&&valignments[i]!=='center') {

            if (rr === null) rr = this.styles.node.createElement('alignment', '');

            rr.setAttribute('vertical', valignments[i]);
          
           // xf.appendChild(rr); 


          }

          if (rr) xf.appendChild(rr);

          


          flll = cnt1;

          

          //<fill><patternFill patternType="solid"><fgColor theme="0" tint="-4.9989318521683403E-2"/><bgColor indexed="64"/></patternFill></fill>

          //<fill><patternFill patternType="gray125"/></fill>


        }

          
          
          let ind = this.shared_strings_vals.indexOf(strs[i])
        
          this.shared_strings_vals.push(strs[i]);

          ind = this.shared_strings_vals.length-1;
          
          let si = this.shared_strings.node.createElement('si', '');

          let r =  this.shared_strings.node.createElement('r', '');

          let rPr =  this.shared_strings.node.createElement('rPr', '');

          let color =  this.shared_strings.node.createElement('color', '');

          let sz =  this.shared_strings.node.createElement('sz', '');

          let rFont =  this.shared_strings.node.createElement('rFont', '');

          let family =  this.shared_strings.node.createElement('family', '');

          let charset =  this.shared_strings.node.createElement('charset', '');

          if (styles[i]&&styles[i].includes('bold')) {

            let b = this.shared_strings.node.createElement('b', '');

            rPr.appendChild(b);


          }
          

           if (styles[i]&&styles[i].includes('italic')) {

            let b = this.shared_strings.node.createElement('i', '');

            rPr.appendChild(b);


          }



          



          //<rFont val="Calibri"/>

          r.appendChild(rPr);
          
          rPr.appendChild(color);

          rPr.appendChild(sz);

          rPr.appendChild(rFont);

          rPr.appendChild(family);

          rPr.appendChild(charset);

          sz.setAttribute('val', "11");

          rFont.setAttribute('val', "Calibri");

          family.setAttribute('val', "2");

          charset.setAttribute('val', "204");




          color.setAttribute('rgb', "000000");

          

          
          
          if (colors&&colors[i]&&colors[i][0]==='#') {
            
            let cc = colors[i].split('#');

          
           

            if (cc[1]) color.setAttribute('rgb', cc[1]);

        
          } 
         
       
          if (fonts&&fonts[i]) {

     
            
            let cc = fonts[i].split(' ');

            if (cc[0]) sz.setAttribute('val', parseFloat(cc[0]).toString());

            if (cc[1]) {
            
              let hh ='';

              for (let j=1;j<cc.length;j++) {

                hh+=cc[j];

                if (j!==cc.length-1) hh+=' '


              }
             
              rFont.setAttribute('val', hh);

             //rFont.setAttribute('val', Calibri');
            
            }

           

        
          } 
       
          

          
          let t = this.shared_strings.node.createElement('t', '');

          r.appendChild(t)

          t.innerHTML = strs[i];

          //<r><rPr><color rgb="FFFF0000"/></rPr><t>df</t></r>

          //si.appendChild(t);

          //if (cells[i].true_text) 
           si.appendChild(r);
          //else si.appendChild(t);

          sst.appendChild(si);
      /*  }*/

          let row = sd.querySelector('row[r="'+(cells[i].y).toString()+'"]')
          
          if (!row) {

            row = this.sheets[sheet_no].node.createElement('row', '')

            row.setAttribute('r', (cells[i].y).toString())

            sd.appendChild(row);

          }
          
          let c = this.sheets[sheet_no].node.createElement('c', '');

          row.appendChild(c);

          c.setAttribute('r', this.column_name(cells[i].x-1)+(cells[i].y).toString())

          c.setAttribute('t', 's')

          if (flll !== -1) c.setAttribute('s', flll.toString())

          c.innerHTML = "<v>"+ind.toString()+"</v>";

        }
   

    }


    /*
    
    
    let diag = {


    ser_names:["01.08.2023 0:00",	 "01-08-2022 00:00:00",	"01-10-2021 00:00:00",	"01-10-2020 00:00:00"],

    base_points:["115", "156.34", "216", "266", "315.5"],

    series:[

      ["-77", "-110", "-147", "-114", "7"],

      ["-79", "-112", "-147", "-115", "6"],

      ["-82", "-113", "-143", "-115", "5"],

      ["-87", "-117", "-145", "-116", "2"]

    ]



  }
    
    
    */


    base64ToBlob(base64String, contentType) {
    // 1. Decode the Base64 string into a binary string
    const byteCharacters = atob(base64String.split(',')[1]);

    // 2. Create an ArrayBuffer and a Uint8Array to hold the binary data
    const byteArrays = [];

    // Slice the string into chunks to prevent issues with large images
    const sliceSize = 1024;
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    // 3. Combine the Uint8Arrays into a Blob
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}




    async add_pic (sheet_no, pic_no, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, pic) {

      


      this.pics_cnt++;
      
       
      let tmp_node = document.createElement('div');

      let iwidth = 0;

      let iheight =0;

      if (pic.svg[0]==='d') {

          let img = document.createElement('img');

          img.src = pic.svg;

          tmp_node.appendChild(img);

           await img.decode();

           iheight = img.height

           iwidth = img.width;
         
      } else {

         if (pic.svg==='') tmp_node.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"></svg>'

         else tmp_node.innerHTML=pic.svg;

      }
      
      

      

      let svg_node = (pic.svg[0]!=='d')?tmp_node.querySelector('svg'):tmp_node;

      let sss = (pic.svg[0]!=='d')?svg_node.getAttribute('viewBox').split(' '):[0, 0, iwidth, iheight];

      

      
      

     
      //return;

      let vbx = Math.round(sss[2]);

      let vby = Math.round(sss[3]);


      tmp_node.style = "position:absolute;left:"+sss[0]+";top:"+sss[1]+";width:"+sss[2]+";height:"+sss[3]+";opacity:0;";

      document.body.appendChild(tmp_node);
      

      //if (this.pic.container!==-1) {


  





     // }


      
      let emu = {

            x:0,
            y:0,
            cx:0,
            cy:0
    
    
          }

   
    
          emu.x =  Math.round(9525*(pic.left));
    
          emu.y =  Math.round(9525*(pic.top));
          
          emu.cx =  Math.round(9525*(pic.width));
    
          emu.cy =  Math.round(9525*(pic.height));
     
     
        let res = renderPreface();

         
        
        res+=renderPreface_svg(x_left, y_top+1, x_right, y_bottom+1, 9525*x_left_off, 9525*x_right_off, 9525*y_top_off, 9525*y_bottom_off, emu, this.idd);

      

        this.idd++;

        let picc = {}

        let tmp = await renderSVG(svg_node, vbx, vby,  emu, this.idd, parseFloat(sss[0]), parseFloat(sss[1]), picc);

        if (picc.src) { 
          const imageBlob = this.base64ToBlob(picc.src, 'image/png');
 
        
          this.zip.file('xl/media/image111.png', imageBlob, {binary: true});
        
        } 

       


        



        


        this.idd = tmp.idd+1;

        res+=tmp.res;

        

        res+=renderEnding_svg()
        res+=renderEnding();

      

       
       
       
     //drawing  

        
       

        if (pic_no===0) {
        this.drawings[sheet_no] = {

          path:'xl/drawings/drawing'+(sheet_no+1).toString()+'.xml',

          xml:res


        }

        add_node(this.drawings[sheet_no], this.parser)



        this.drawings_rels[sheet_no] = {

          path:'xl/drawings/_rels/drawing'+(sheet_no+1).toString()+'.xml.rels',

          xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`



        } 



       // add_node(this.drawings[sheet_no], this.parser)

        add_node(this.drawings_rels[sheet_no], this.parser)

       }  else {
        
        
           let node = this.drawings[sheet_no].node.querySelector("wsDr");


           let tmp = this.parser.parseFromString(res, "application/xml");  

           ;


           
           //return doc.children[0]

           //let tmp = document.createElementNS("",'div');

           //tmp.innerHTML = res;

           node.appendChild(tmp.querySelector("wsDr").firstChild);
          
           

          
        }

        

        if (pic_no===0) {

         let ctype_node = this.content_types.node;

         let ts = ctype_node.querySelector('Types');

         let  tt= ctype_node.createElement('Override', '');

         tt.setAttribute('PartName', "/xl/drawings/drawing"+(sheet_no+1).toString()+".xml");

         tt.setAttribute('ContentType', "application/vnd.openxmlformats-officedocument.drawing+xml");

         ts.appendChild(tt);


         let sheets_rels_node = this.sheets_rels[sheet_no].node;

        ts = sheets_rels_node.querySelector('Relationships');

        tt= sheets_rels_node.createElement('Relationship', '');

        tt.setAttribute('Id', "rId"+this.pics_cnt.toString());

        tt.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing");
        

        tt.setAttribute('Target', "../drawings/drawing"+(sheet_no+1).toString()+".xml");

        ts.appendChild(tt);

       


       

         let sheet_node = this.sheets[sheet_no].node;

         ts = sheet_node.querySelector('worksheet');

      

         tt= sheet_node.createElement('drawing', '');

         tt.setAttribute('r:id', "rId"+this.pics_cnt.toString());

       

         ts.appendChild(tt);
       }
      
       tmp_node.remove();

    }

    


    add_diag (sheet_no, diag_no, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, diag, inside=false) {

      let ser_cells = [];

      this.idd++;

      this.pics_idd++;

     
     
     
     for(let i=0;i<diag.ser_names.length;i++) ser_cells.push({x:this.diag_left+3+i, y:2});

     // for(let i=0;i<diag.ser_names.length;i++) ser_cells.push({x:this.diag_left+3+i*2, y:2});

 

        this.add_strings(0, ser_cells,diag.ser_names);



      

      //!!! for(let i=0;i<diag.base_points.length;i++) ser_cells.push({x:this.diag_left, y:3+i});
      
      for(let i=0;i<diag.ppoints.length;i++) {

     
        ser_cells = [];

        let pts = [];

        for(let j=0;j<diag.ppoints[i].length;j++) {

           ser_cells.push({x:this.diag_left+i*2, y:3+j});

          
           pts.push(diag.ppoints[i][j].x)

        }
        this.add_numbers(0,ser_cells,pts);
        
      }


      
   

      for (let j=0;j<diag.ppoints.length;j++) {


        ser_cells = [];

        let pts = [];

        for(let i=0;i<diag.ppoints[j].length;i++) {
          
          ser_cells.push({x:this.diag_left+j*2+1, y:3+i});
  
          pts.push(diag.ppoints[j][i].y)

        } 
        this.add_numbers(0,ser_cells,pts);

      
      }
   
      

      let chart_txt = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                          <c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c16r2="http://schemas.microsoft.com/office/drawing/2015/06/chart"><c:date1904 val="0"/><c:lang val="ru-RU"/><c:roundedCorners val="0"/><mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
                          <mc:Choice Requires="c14" xmlns:c14="http://schemas.microsoft.com/office/drawing/2007/8/2/chart"><c14:style val="102"/></mc:Choice><mc:Fallback><c:style val="2"/></mc:Fallback></mc:AlternateContent><c:chart>
                          <c:plotArea><c:layout><c:manualLayout><c:layoutTarget val="inner"/><c:xMode val="edge"/><c:yMode val="edge"/><c:x val="${diag.frac_left.toString()}"/><c:y val="${diag.frac_top.toString()}"/><c:w val="${(diag.frac_width).toString()}"/><c:h val="${diag.frac_height.toString()}"/></c:manualLayout></c:layout><c:scatterChart><c:scatterStyle val="lineMarker"/><c:varyColors val="0"/>
         
                          `


                
                  

      let del = '' 

      for (let i =0; i<diag.series.length;i++){



        if (diag.ser_names[i]==='K1'||diag.ser_names[i]==='K2'){

            
          del= del + `<c:legendEntry><c:idx val="${i}"/><c:delete val="1"/></c:legendEntry>`


        }


       // del = '<c:legendEntry><c:idx val="0"/><c:delete val="1"/></c:legendEntry>'



        let linestyle = 'solid';

        if (diag.linestyles[i]==='dash') linestyle = 'dash';

        else if (diag.linestyles[i]!=='') linestyle = 'dashDot';


        let marker = (diag.linestyles[i]!=='marker')?`<c:marker><c:symbol val="none"/></c:marker>`:
        //`<c:marker><c:symbol val="circle"/></c:marker>`

        `<c:marker><c:symbol val="circle"/><c:spPr><a:solidFill><a:srgbClr val="`+diag.colors[i]+`"/></a:solidFill></c:spPr></c:marker>`

        let line = (diag.linestyles[i]!=='marker')?`<a:solidFill><a:srgbClr val="`+diag.colors[i]+`"/></a:solidFill>`:`<a:noFill/>`


        chart_txt+=

        `<c:ser><c:idx val="`+i+`"/><c:order val="`+i+`"/><c:tx><c:strRef><c:f>Лист0!$`+this.column_name(this.diag_left+i+2)+`$2</c:f></c:strRef>
        </c:tx><c:spPr><a:ln w="19050" cap="rnd">${line}<a:prstDash val="`+linestyle+`"/><a:round/></a:ln><a:effectLst/>
        </c:spPr>${marker}`+
        
        //`<c:marker><c:symbol val="circle"/><c:size val="5"/><c:spPr><a:solidFill><a:srgbClr val="`+diag.colors[i]+`"/></a:solidFill></c:marker>`+
        //<a:ln w="9525"><a:solidFill><a:schemeClr val="accent1"/></a:solidFill></a:ln><a:effectLst/></c:spPr></c:marker>
        `<c:xVal><c:numRef><c:f>Лист0!$`+this.column_name(this.diag_left+2*i+1)+`$3:$`+this.column_name(this.diag_left+2*i+1)+`$`+(diag.ppoints[i].length+3).toString()+`</c:f><c:numCache></c:numCache></c:numRef></c:xVal><c:yVal><c:numRef>
        <c:f>Лист0!$`+this.column_name(this.diag_left+2*i+2)+`$3:$`+this.column_name(this.diag_left+2*i+2)+`$`+(diag.ppoints[i].length+3).toString()+`</c:f>
        <c:numCache></c:numCache></c:numRef></c:yVal><c:smooth val="0"/><c:extLst>
        <c:ext uri="{C3380CC4-5D6E-409C-BE32-E72D297353CC}" xmlns:c16="http://schemas.microsoft.com/office/drawing/2014/chart">
        <c16:uniqueId val="{00000006-8E0D-48A0-A669-753FD8A3E7DA}"/></c:ext></c:extLst></c:ser>`


      }

      let lg = '';

  

      if (diag.lgend.show) {

         let ps = 'l';
         
         if (diag.lgend.pos==='right') ps = 'r'

         if (diag.lgend.pos==='top') ps = 't'

         if (diag.lgend.pos==='bottom') ps = 'b'


         lg = `<c:legend><c:legendPos val="${ps}"/>${del}<c:overlay val="0"/></c:legend>`



           /*<c:legendEntry><c:idx val="0"/><c:delete val="1"/></c:legendEntry>*/ 

      }

      let orientation = "minMax";
      
      let ymax = diag.yaxmax;
      
      let ymin = diag.yaxmin;
      
      if (parseFloat(diag.yaxmin)>parseFloat(diag.yaxmax)) {
      
        orientation = "maxMin"
       
        ymax = diag.yaxmin;
       
        ymin = diag.yaxmax;
      
      
      }  else console.log('NOT REVERSE')  

      let lbl = 'none'


   

      if (diag.axis_y_visibility) {

    
       
        lbl = 'low'     


      }

      let xorient = 'minMax'

       let xmax = diag.xaxmax;
      
       let xmin = diag.xaxmin;

      if (parseFloat(diag.xaxmin)>parseFloat(diag.xaxmax)) {

          xorient = 'maxMin'

           xmax = diag.xaxmin;
       
        xmin = diag.xaxmax;

      }



      chart_txt+=`<c:dLbls><c:showLegendKey val="0"/><c:showVal val="0"/><c:showCatName val="0"/>
                  <c:showSerName val="0"/><c:showPercent val="0"/><c:showBubbleSize val="0"/>
                  </c:dLbls><c:axId val="158087439"/><c:axId val="158098479"/></c:scatterChart><c:valAx><c:axId val="158087439"/>
                  <c:scaling><c:orientation val="`+xorient+`"/><c:min val="`+xmin+`"/><c:max val="`+xmax+`"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:majorGridlines><c:spPr>
                  <a:ln w="9525"><a:noFill/></a:ln><a:effectLst/></c:spPr></c:majorGridlines>
                  <c:numFmt formatCode="General" sourceLinked="1"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/>
                  <c:tickLblPos val="none"/><c:spPr><a:noFill/><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill>
                  <a:schemeClr val="tx1"><a:lumMod val="25000"/><a:lumOff val="75000"/></a:schemeClr></a:solidFill><a:round/>
                  </a:ln><a:effectLst/></c:spPr><c:txPr>
                  <a:bodyPr rot="-60000000" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>
                  <a:lstStyle/><a:p><a:pPr><a:defRPr sz="900" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0"><a:solidFill>
                  <a:schemeClr val="tx1"><a:lumMod val="65000"/><a:lumOff val="35000"/></a:schemeClr></a:solidFill><a:latin typeface="+mn-lt"/>
                  <a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:pPr><a:endParaRPr lang="ru-RU"/></a:p></c:txPr><c:crossAx val="158098479"/><c:crosses val="autoZero"/><c:crossBetween val="midCat"/></c:valAx><c:valAx><c:axId val="158098479"/><c:scaling><c:orientation val="`+orientation+`"/><c:min val="`+ymin+`"/><c:max val="`+ymax+`"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines><c:spPr><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:noFill/></a:ln></c:spPr></c:majorGridlines><c:numFmt formatCode="General" sourceLinked="1"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="${lbl}"/><c:spPr><a:noFill/><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="25000"/><a:lumOff val="75000"/></a:schemeClr></a:solidFill><a:round/></a:ln><a:effectLst/></c:spPr><c:txPr><a:bodyPr rot="-60000000" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/><a:lstStyle/><a:p><a:pPr><a:defRPr sz="900" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="65000"/><a:lumOff val="35000"/></a:schemeClr></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:pPr><a:endParaRPr lang="ru-RU"/></a:p></c:txPr><c:crossAx val="158087439"/><c:crosses val="autoZero"/><c:crossBetween val="midCat"/></c:valAx><c:spPr><a:noFill/><a:ln><a:noFill/></a:ln><a:effectLst/></c:spPr></c:plotArea>
                  <c:plotVisOnly val="1"/><c:dispBlanksAs val="span"/><c:extLst><c:ext uri="{56B9EC1D-385E-4148-901F-78D8002777C0}" xmlns:c16r3="http://schemas.microsoft.com/office/drawing/2017/03/chart"><c16r3:dataDisplayOptions16><c16r3:dispNaAsBlank val="1"/></c16r3:dataDisplayOptions16></c:ext></c:extLst><c:showDLblsOverMax val="0"/>${lg}</c:chart><c:spPr><a:noFill/><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="15000"/><a:lumOff val="85000"/></a:schemeClr></a:solidFill><a:round/></a:ln><a:effectLst/></c:spPr><c:txPr><a:bodyPr/><a:lstStyle/><a:p><a:pPr><a:defRPr/></a:pPr><a:endParaRPr lang="ru-RU"/></a:p></c:txPr><c:printSettings><c:headerFooter/><c:pageMargins b="0.75" l="0.7" r="0.7" t="0.75" header="0.3" footer="0.3"/><c:pageSetup/></c:printSettings></c:chartSpace>
      
      `
      

      let chart_node = {

        path:'xl/charts/chart'+(this.charts.length+1).toString()+'.xml',

        xml:chart_txt


      } 

      let chart_rel ={

        path:'xl/charts/_rels/chart'+(this.charts.length+1).toString()+'.xml.rels',

        xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
              <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`


      }


      let ctype_node =  this.content_types.node;

      let ts = ctype_node.querySelector('Types');

      let  tt= ctype_node.createElement('Override', '');

      tt.setAttribute('PartName', "/xl/charts/chart"+(this.charts.length+1).toString()+".xml");

      tt.setAttribute('ContentType', "application/vnd.openxmlformats-officedocument.drawingml.chart+xml");

      ts.appendChild(tt);

      if (this.drawings_rels[sheet_no]===null) {

        
        
        this.drawings_rels[sheet_no] = {

         path:'xl/drawings/_rels/drawing'+(sheet_no+1).toString()+'.xml.rels',

         xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
         <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`



       } 

       add_node(this.drawings_rels[sheet_no], this.parser);

       

       let ts = this.drawings_rels[sheet_no].node.querySelector('Relationships');

      

       let  tt= this.drawings_rels[sheet_no].node.createElement('Relationship', '');

       tt.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart");

       tt.setAttribute('Id', "rId"+this.pics_idd.toString());

       tt.setAttribute('Target', "../charts/chart"+(this.charts.length+1).toString()+".xml");

       ts.appendChild(tt);


       //<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>

      } else {


        let ts = this.drawings_rels[sheet_no].node.querySelector('Relationships');


       

 
        let  tt= this.drawings_rels[sheet_no].node.createElement('Relationship', '');
 
        tt.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart");
 
        tt.setAttribute('Id', "rId"+this.pics_idd.toString());
 
        tt.setAttribute('Target', "../charts/chart"+(this.charts.length+1).toString()+".xml");
 
        ts.appendChild(tt);


         if (this.drawings[1].xml.indexOf('rId700003')!==-1) {


          let  tt= this.drawings_rels[sheet_no].node.createElement('Relationship', '');
 
          tt.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image");
 
          tt.setAttribute('Id', "rId700003");
 
          tt.setAttribute('Target', "../media/image111.png");

    
 
          ts.appendChild(tt);

        }



      }



      if (this.drawings[sheet_no]===null) {


        let drawing = {


        path:'xl/drawings/drawing'+(sheet_no+1).toString()+'.xml',

          
         xml:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
         <xdr:twoCellAnchor><xdr:from><xdr:col>1</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>1</xdr:row>
         <xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>10</xdr:col><xdr:colOff>0</xdr:colOff>
         <xdr:row>8</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to>
         <xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="`+this.idd.toString()+`" name="Диаграмма 1">
         <a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
         <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{76ED6813-16EC-B184-A9BD-7C20DBD01544}"/></a:ext>
         </a:extLst></xdr:cNvPr><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm>
         <a:off x="0" y="0"/><a:ext cx="10000" cy="10000"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
         <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
         r:id="rId`+this.pics_idd.toString()+`"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor></xdr:wsDr>
        `
      

      
      
        }

        add_node(drawing, this.parser);

        this.drawings[sheet_no] = drawing;


        let ctype_node = this.content_types.node;

        let ts = ctype_node.querySelector('Types');

        let  tt= ctype_node.createElement('Override', '');

        tt.setAttribute('PartName', "/xl/drawings/drawing"+(sheet_no+1).toString()+".xml");

        tt.setAttribute('ContentType', "application/vnd.openxmlformats-officedocument.drawing+xml");

        ts.appendChild(tt);

      } else {

      

        let node = this.drawings[sheet_no].node.querySelector("wsDr");


      


        if (inside) {



   


          let tmp = this.drawings[sheet_no].node.querySelectorAll("grpSp");

          node = tmp[tmp.length-1];


        }
      


        let xml = `<xdr:from><xdr:col>10</xdr:col><xdr:colOff>533400</xdr:colOff><xdr:row>14</xdr:row>
         <xdr:rowOff>57150</xdr:rowOff></xdr:from><xdr:to><xdr:col>18</xdr:col><xdr:colOff>228600</xdr:colOff>
         <xdr:row>28</xdr:row><xdr:rowOff>133350</xdr:rowOff></xdr:to>

              


         <xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="`+this.idd.toString()+`" name="Диаграмма 1">
         <a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
         <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{76ED6813-16EC-B184-A9BD-7C20DBD01544}"/></a:ext>
         </a:extLst></xdr:cNvPr><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm>
         <a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
         <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
         r:id="rId`+this.pics_idd.toString()+`"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/>`;


         let xml1 ='';

         let xml2 ='';

         if (inside) {


      


          //emu.cx =  64*9525*(x_right-x_left);
    
          //emu.cy =  mx*9525*(y_bottom-y_top+1);


          const mx = (getTextWidth('12345678', '11pt Calibri').height>20)?getTextWidth('12345678', '11pt Calibri').height:20;

       

          /*let ecx =  Math.round(9525*(diag.width-46));
    
          let ecy =  Math.round(9525*(diag.height-25));

          let ecx0 =  Math.round(9525*(diag.left+41));
    
          let ecy0 =  Math.round(9525*(diag.top+5));

*/
           let ecx =  Math.round(9525*(diag.width));
    
          let ecy =  Math.round(9525*(diag.height));

          let ecx0 =  Math.round(9525*(diag.left));
    
          let ecy0 =  Math.round(9525*(diag.top));







          xml = `<xdr:nvGraphicFramePr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"  ><xdr:cNvPr   id="`+this.idd.toString()+`" name="Диаграмма 1"><a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
          <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{76ED6813-16EC-B184-A9BD-7C20DBD01544}"/></a:ext>
          </a:extLst></xdr:cNvPr><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr>`;

          xml1 = `<xdr:xfrm xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ><a:off x="`+ecx0.toString()+`" y="`+ecy0.toString()+`"/><a:ext cx="`+ecx.toString()+`" cy="`+ecy.toString()+`"/></xdr:xfrm>`;
          
          xml2 =`<a:graphic xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
          <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
          r:id="rId`+this.pics_idd.toString()+`"/></a:graphicData></a:graphic>`;


        // }





         let tmp =`<xdr:cNvPr id="`+this.idd.toString()+`" name="Диаграмма 1">
          <a:extLst><a:ext uri="{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}">
          <a16:creationId xmlns:a16="http://schemas.microsoft.com/office/drawing/2014/main" id="{76ED6813-16EC-B184-A9BD-7C20DBD01544}"/></a:ext>
          </a:extLst></xdr:cNvPr><xdr:cNvGraphicFramePr/>`
          
          //let ttt = document.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing',tmp);

 

         //dbl

         let tmp1 = `<a:off x="`+ecx0.toString()+`" y="`+ecy0.toString()+`"/><a:ext cx="`+ecx.toString()+`" cy="`+ecy.toString()+`"/>`

         let tmp2 =`<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
          <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId`+this.pics_idd.toString()+`"/></a:graphicData>`

          //ndnd = document.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'xdr:nvGraphicFramePr')

         //ndnd.innerHTML = tmp;

         // ndnd1 = document.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'xdr:xfrm')

         //ndnd1.innerHTML = tmp1;

          //ndnd2 = document.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing', 'a:graphic')

         //ndnd2.innerHTML = tmp2;



         } 

         let ppp = new DOMParser().parseFromString(xml,'text/xml');
    
    
         let rr = (!inside)?this.drawings[sheet_no].node.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','xdr:twoCellAnchor')
         :this.drawings[sheet_no].node.createElementNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','xdr:graphicFrame');

         if (inside) {

    
          
          rr.setAttributeNS('http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing','macro',"");

          rr.innerHTML = xml;
          rr.innerHTML+=xml1;
          rr.innerHTML+=xml2;
          //+xml2;

          //rr.innerHTML+=xml1;

          //rr.innerHTML+=xml2

          //rr.appendChild(ndnd)

          //rr.appendChild(ndnd1)

          //rr.appendChild(ndnd2)

          //ppp.firstChild.setAttribute('xmlns','http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing' )

    //ppp.firstChild.setAttribute('xmlns:a','http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing' )
         //let xx = new XMLSerializer().serializeToString()

        

          //rr.appendChild(ppp.firstChild)

          //rr.appendChild(ppp.firstChild.nextSibling)

          //rr.appendChild(ppp.firstChild.nextSibling.nextSibling)
          


         }

         

         //rr.innerHTML = xml;
         
         node.appendChild(rr);





      }




     let shtsht = this.sheets[sheet_no];

     let ws = shtsht.node.querySelector("worksheet");

     if (!ws.querySelector("drawing")) {

      let nd = shtsht.node.createElement("drawing", "");

      nd.setAttribute('r:id', "rId1");

      ws.appendChild(nd);

     }

     shtsht = this.sheets_rels[sheet_no];

     ws = shtsht.node.querySelector("Relationships");

     if (!ws.firstChild) {

      let nd = shtsht.node.createElement("Relationship", "");

      nd.setAttribute('Id', "rId1");


      nd.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing");

      nd.setAttribute('Target', "../drawings/drawing"+(sheet_no+1).toString()+".xml");
      
      ws.appendChild(nd);
     
     }




      add_node(chart_rel,this.parser);

      add_node(chart_node,this.parser);
      
      this.charts.push(chart_node);

      this.charts_rels.push(chart_rel);


     





      this.diag_left+=diag.ser_names.length+5;

    }



    async add_group (sheet_no, pic_no, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, pic, diag) {
    
      
   
      

      if (pic) await this.add_pic(sheet_no, pic_no, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, pic);

      if (diag) this.add_diag(sheet_no, 0, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, diag, true); 

     // (sheet_no, diag_no, x_left, x_left_off, y_top, y_top_off, x_right, x_right_off, y_bottom, y_bottom_off, diag, inside=false)


                
    
    }



    base64ToFile(base64String, filename, mimeType) {
    // Split the string to get just the encoded data and the mime type if provided in the string
     const arr = base64String.split(',');
     const mime = arr[0].match(/:(.*?);/)?.[1] || mimeType;
     const bstr = atob(arr[arr.length - 1]); // Decode base64 to binary string
     let n = bstr.length;
     const uint8Array = new Uint8Array(n);

    // Convert binary string to array of unsigned 8-bit integers
     while (n--) {
         uint8Array[n] = bstr.charCodeAt(n);
     }

    // Create a Blob or File object
     const blob = new Blob([uint8Array], { type: mime });
     const file = new File([blob], filename, { type: mime });

     return file;
   }




    async add_sheet(sheet) {

    
      let shts = this.workbook.node.querySelector('sheets');

      let  sht= this.workbook.node.createElement('sheet', '');
    
      sht.setAttribute('name', (sheet.title)?sheet.title:"Лист"+(this.sheets.length).toString());

      sht.setAttribute('sheetId', (this.sheets.length+1).toString());

      sht.setAttribute('r:id', "rId"+(200+this.sheets.length+1).toString());

     
      
     

      shts.appendChild(sht);

     
      let wrss = this.workbook_xml_rels.node.querySelector('Relationships');

      let  wrs = this.workbook_xml_rels.node.createElement('Relationship', '');

      wrs.setAttribute('Id', "rId"+(200+this.sheets.length+1).toString());

      wrs.setAttribute('Type', "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet");

      wrs.setAttribute('Target', "worksheets/sheet"+(this.sheets.length+1).toString()+".xml");

      wrss.appendChild(wrs);


      let new_sheet = {path:'', xml:''};
      
      new_sheet.path = 'xl/worksheets/sheet'+(this.sheets.length+1).toString()+'.xml';

      new_sheet.xml = (sheet.selected)?
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2" xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{049C0D98-EF69-4E23-A941-E704C23F8B97}"><dimension ref="A1"/><sheetViews><sheetView  showGridLines="0" tabSelected="1" workbookViewId="0"><selection activeCell="E5" sqref="E5"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/><sheetData/><pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>
  
      `:_.cloneDeep(sheet_sample).xml;


      
     

      let ctype_node =  this.content_types.node;

      let ts = ctype_node.querySelector('Types');

      let  tt= ctype_node.createElement('Override', '');

      tt.setAttribute('PartName', "/xl/worksheets/sheet"+(this.sheets.length+1).toString()+".xml");

      tt.setAttribute('ContentType', "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml");

      ts.appendChild(tt);

  


      add_node(new_sheet, this.parser);

      
      let sheets_rel = _.cloneDeep(sheets_rels_sample)

      sheets_rel.path = 'xl/worksheets/_rels/sheet'+(this.sheets.length+1).toString()+'.xml.rels',

      add_node(sheets_rel, this.parser)

      this.sheets_rels.push(sheets_rel);

      this.sheets.push(new_sheet);

      this.rowss.push(sheet.rows);

      this.colss.push(sheet.cols);

   
       
 
      if (sheet.pics){


        for (let i = this.drawings.length;i<this.sheets.length+1;i++) this.drawings[i] = null;

         

        for (let i = this.drawings_rels.length;i<this.sheets.length+1;i++) this.drawings_rels[i] = null;
            

       
         for (let i=0; i<sheet.pics.length;i++) {

            

           await this.add_pic(this.sheets.length-1,i,sheet.pics[i].x_left, sheet.pics[i].x_left_off, sheet.pics[i].y_top, sheet.pics[i].y_top_off, sheet.pics[i].x_right, sheet.pics[i].x_right_off, sheet.pics[i].y_bottom, sheet.pics[i].y_bottom_off,sheet.pics[i].svg); 
         }

      }

      if (sheet.diags){

        for (let i = this.drawings.length;i<this.sheets.length+1;i++) this.drawings[i] = null;

        for (let i = this.drawings_rels.length;i<this.sheets.length+1;i++) this.drawings_rels[i] = null;

        for (let i=0; i<sheet.diags.length;i++) {

       
        
          this.add_diag(this.sheets.length-1,i,0, 0, 10, 0, 10, 0,  20, 0,sheet.diags[i]); 
        }

      }

      if (sheet.texts) {

       
       for (let i=0;i<sheet.texts.length;i++) {

        this.add_strings (this.sheets.length-1, [{x:sheet.texts[i].x, y:sheet.texts[i].y}], [sheet.texts[i].txt]);


       } 
       
      }

       if (sheet.groups) {

        for (let i = this.drawings.length;i<this.sheets.length+1;i++) this.drawings[i] = null;

        for (let i = this.drawings_rels.length;i<this.sheets.length+1;i++) this.drawings_rels[i] = null;


        for (let i=0; i<sheet.groups.length;i++) {

             

            
             await this.add_group(this.sheets.length-1, i ,sheet.groups[i].x_left, 
              sheet.groups[i].x_left_off, sheet.groups[i].y_top, sheet.groups[i].y_top_off, 
              sheet.groups[i].x_right, sheet.groups[i].x_right_off, sheet.groups[i].y_bottom, 
              sheet.groups[i].y_bottom_off,
              sheet.groups[i].pic, sheet.groups[i].diag); 
       
        }

       }


        

      


  }




    async load (eo){

     
      for (let i = 0; i<eo.sheets.length;i++) {

  
        await this.add_sheet(eo.sheets[i]); 

      }

    }



    constructor (filename='bingxlsxout') {
        
        this.idd = 1000;

        this.zip = new JSZip();
        
        this.parser = new DOMParser();

        this.filename = filename;

        this.shared_strings_vals = [];

        this.diag_left = 0;

        this.charts = [];

        this.charts_rels = [];

        
        this.zip.file(app_sample.path, app_sample.xml);

        this.zip.file(core_sample.path, core_sample.xml);

        /*this.zip.file(theme_sample.path, theme_sample.xml);*/


        this.pics_cnt = 0;

        this.pics_idd = 700;

        this.file_contents = null;




        this.shared_strings = _.cloneDeep(shared_strings_sample);

        add_node(this.shared_strings, this.parser);


        this.content_types = _.cloneDeep(content_types_sample);
        
        add_node(this.content_types, this.parser);

        
        this.dot_rels = _.cloneDeep(dot_rels_sample);

        add_node(this.dot_rels, this.parser);

        
        this.workbook_xml_rels = _.cloneDeep(workbook_xml_rels_sample);

        add_node(this.workbook_xml_rels, this.parser);

        
        this.sheets = [_.cloneDeep(sheet_sample)];

        this.rowss = [];

        this.colss = [];

        add_node(this.sheets[0], this.parser);


        this.sheets_rels = [_.cloneDeep(sheets_rels_sample)]

        add_node(this.sheets_rels[0], this.parser)
        
        
        this.drawings = [null];

        this.drawings_rels = [null];
                
        
        this.styles = _.cloneDeep(styles_sample);

        add_node(this.styles, this.parser);
        
        
        this.workbook = _.cloneDeep(workbook_sample);  

        add_node(this.workbook, this.parser);

        this.workbook.node.querySelector('sheets').firstChild.setAttribute('name', 'Лист0');

        this.workbook.node.querySelector('sheets').firstChild.setAttribute('state', "veryHidden");

        

    }



} 