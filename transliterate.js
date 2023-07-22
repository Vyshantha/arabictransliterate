function hide() {
  document.getElementById("tooltip1").classList.remove("block");
  document.getElementById("tooltip2").classList.remove("block");
}
function show1() {
  document.getElementById("tooltip1").classList.add("block");
  var self = this;
  setTimeout(function () {
    self.hide();
  }, 3000);
}
function show2() {
  document.getElementById("tooltip2").classList.add("block");
  var self = this;
  setTimeout(function () {
    self.hide();
  }, 3000);
}

function swapTransliteration() {
  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "latin2arabic") {
    localStorage.setItem("direction", "arabic2latin");
    document.getElementById("textarea1").readOnly = true;
    document.getElementById('textarea2').removeAttribute('readonly');
    document.getElementById("textarea2").focus();
    document.getElementById("Arabic").classList.add("currentTab");
    document.getElementById("Latin").classList.remove("currentTab");
  } else if (localStorage.getItem("direction") == "arabic2latin") {
    localStorage.setItem("direction", "latin2arabic");
    document.getElementById('textarea1').removeAttribute('readonly');
    document.getElementById("textarea2").readOnly = true;
    if (localStorage.getItem("encoding") == "Latin")
      document.getElementById("textarea1").focus();
    document.getElementById("Arabic").classList.remove("currentTab");
    document.getElementById("Latin").classList.add("currentTab");
  }
}

function clearFooter() {
  document.getElementsByClassName("footerOfPage")[0].style = "display:none";
}

function copyContent1() {
  navigator.clipboard.writeText(document.getElementById("textarea1").value);
}

function copyContent2() {
  navigator.clipboard.writeText(document.getElementById("textarea2").value);
}

function transliterate() {
  if (document.getElementById("textarea1").value.indexOf("script>") > -1 || document.getElementById("textarea2").value.indexOf("script>") > -1) {
    document.getElementById("textarea1").value = "";
    document.getElementById("textarea2").value = "";
    document.getElementById("textarea1").innerHTML = "";
    document.getElementById("textarea2").innerHTML = "";
  }

  /*  
    Arabic Unicode Block : https://en.wikipedia.org/wiki/Arabic_script_in_Unicode
    Arabic : https://en.wikipedia.org/wiki/Arabic_alphabet
              https://en.wikipedia.org/wiki/Arabic_script
  */

  // Various Standardisations : https://en.wikipedia.org/wiki/Romanization_of_Arabic
  // Adhered Standard for Arabic : https://en.wikipedia.org/wiki/DIN_31635

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "latin2arabic") {
    const latinToArabic = {"0":"۰","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"," ":" ",".":"\u066B",",":"٬",";":";","?":"?","!":"!","\"":"\"","'":"'","(":"(",")":")",":":":","+":"+","=":"=","/":"/","-":"-","<":"<",">":">","*":"*","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","ǧ":"ج","ṯ":"ث","t":"ت","b":"ب","ā":"آ","s":"س","z":"ز","r":"ر","ḏ":"ذ","d":"د","ḫ":"خ","ḥ":"ح","ẓ":"ظ","ṭ":"ط","ḍ":"ض","ṣ":"ص","š":"ش","k":"ك","q":"ق","f":"ف","ġ":"غ","ʿ":"ع","ī":"ے","y":"ي","w":"و","h":"ه","n":"ن","m":"م","l":"ل","ʾ":"ء","":"ة","la":"ﻻ","Allāh":"ﷲ"};

    let resultAr = "";
    let textLa = document.getElementById("textarea1").value.toLowerCase();

    for (let u = 0; u < textLa.length; u++) {
      if (textLa[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if (latinToArabic[textLa[u]] != undefined && latinToArabic[textLa[u]] != null && textLa[u] != "") { // Default Single Character
        resultAr = resultAr + latinToArabic[textLa[u]];
      }
    }

    document.getElementById("textarea2").value = resultAr;
    document.getElementById("textarea2").innerHTML = resultAr;
  } else if (localStorage.getItem("direction") == "arabic2latin") {
    const arabicToLatin = { " ": " ", "।": ".", "॥": ".", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", "۹":"9", "٩":"9", "۹":"9", "۹":"9", "۸":"8", "٨":"8", "۸":"8", "۸":"8", "۷":"7", "٧":"7", "۷":"7", "۷":"7", "٦":"6", "٦":"6", "۶":"6", "۶":"6", "٥":"5", "٥":"5", "۵":"5", "۵":"5", "٤":"4", "٤":"4", "۴":"4", "۴":"4", "۳":"3", "۳":"3", "٣":"3", "۳":"3", "۲":"2", "٢":"2", "۲":"2", "۲":"2", "۱":"1", "١":"1", "۱":"1", "۱":"1", "٠":"0", "۰":"0", "۰":"0", "۰":"0", "ـج":"ǧ", "ـجـ":"ǧ", "جـ":"ǧ", "ج":"ǧ", "ـث":"ṯ", "ـثـ":"ṯ", "ثـ":"ṯ", "ث":"ṯ", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ ":"b", "بـ":"b", "ب":"b", "ـا":"ā", "ا":"ā", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"ḏ", "ذ":"ḏ", "ـد":"d", "د":"d", "ـخ":"ḫ", "ـخـ":"ḫ", "خـ":"ḫ", "خ":"ḫ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ḍ", "ـضـ":"ḍ", "ضـ":"ḍ", "ض":"ḍ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"š", "ـشـ":"š", "شـ":"š", "ش":"š", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"ġ", "ـغـ":"ġ", "غـ":"ġ", "غ":"ġ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـے":"ī", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"w", "و":"w", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ـئ":"ʾ", "ـئـ":"ʾ", "ئـ":"ʾ", "ئ":"ʾ", "ـؤ":"ʾ", "ؤ":"ʾ", "ـإ":"ʾ", "إ":"ʾ", "ـأ":"ʾ", "أ":"ʾ", "ء": "ʾ", "ـى":"ā", "ـىـ":"ā", "ىـ":"ā", "ى":"ā", "ـة":"", "ة":"", "ـآ":"ā", "آ":"ā", "ﻻ":"la", "ﻼ":"la", "ﷲ":"Allāh", "ﷰ":"salla", "ﷱ":"qala", "ﷳ":"akbar", "ﷴ":"Mohammad", "ﷵ":"salām", "ﷶ":"rasūl", "ﷷ":"alayhe", "ﷸ":"wa-sallam", "ﷹ":"salla", "ﷺ":"Sallallahou Alayhe Wasallam", "ﷻ":"Jallajalalouhou", "﷽":"bism-i llāh-i r-raḥmān-i r-raḥīm" };

    /* Arabic Character : RULE
      "ا" INI "a" "i" "u" "∅" & MED/FIN "ā" "ī" "ū"
       أ/ٵ INI "ʾa" "ʾu" & MED/FIN "āʾ" "ūʾ"
       إ INI "ʾi"  & MED/FIN "īʾ"
       ٱ INI "∅" & "ʔ" RULE
       "و" = "ū", "و" = "∅", "i" = "ء"
       "ـے" = "ī", "ـي" = "y"  */

    /* Language Specific Characters : RULE
       "تٰٜ" = "ḇ", "تٜ" = "ḇ", "ٻ" "ḇ", "ٻ" = "ḇ", "ـٻـ" = "ḇ", "ـٻ" = "ḇ" Ajami
       "ڵ" = "lj" "ي" = "j" "اٖى" = "i" "ە" = "e" "ڄ" = "c" "ۆ" = "u"  "ۉ" = "o" "ںٛ" = "nj" Serbo-Croat 
       "صٜ" = "T" "ڔ" = "r̠" "ڍ" = "k͟h" "ڊ" = "h̤" "ڣ" = "p" "ࢳ" = "ng" "ۻ" = "ḻ" "ݧ" = "ñ" "ڹ" = "ṇ" "ࢴ" = "g" Arwi
       "ࢮ" = "dź"  "ࢯ" = "c" Belarussian
       "ے" = "è" "ݔ" = "è" "ۏ" = "ò" "ڈ" = "ď" "ٹ" = "ť"  Baluchi
       "چ ژ ڞ ݣ ء" Berber
       "ڎ" = "c" "څ" = "c̣" "ݼ" = "ch" "ݳ" = "a" "ݴ" = "áa" "ݣ" = "ṅ" "ڞ" = "c̣h" "ݽ" = "ṣ" "ݷ" = "ỵ" "ݶ" = "íi" "ݹ" = "óo" "ݸ" = "o" "ݻ" = "ée" "ݺ" = "e" Burushaski 
       "ݣ" = "ñ" Chagatai
       "ڽ" = "ny" "ݢ" = "g" "ڤ" = "p" "ڠ" = "ng" "ى" = "e" "ى" = "a" "ۏ" = "v" Jawi
       "ۆ" = "o" "ێ" = "e" "ؠ" = "ya" "ۄ" = "ọ" "ؠ" = "ya" "ؠ" = "'" Kashmiri
        Kazakh
       "ځ" = "dz" "ځ" = "đ" "څ" = "c" "ݮ" = "ǰ" "ݯ" = "ç" "ڵ" = "ł" "ݰ" = "ṣ" "ݱ" = "ẓ̌" Khowar
        Krygyz
       "ې" = "e" "ۍ" = "y" "ئ" = "ạy" "ښ" = "ṣh" "ښ" = "k'h" "ښ" = "kh" "ګ" = "g" "ڼ" = "ṇ"  "ۀ" = "ə"  "ي" = "y" "ي" = "ī"  "ټ" = "ṭ"  "څ" = "ṡ"  "ځ" = "ż" "ډ" = "ḍ" "ړ" = "ṛ" "ږ" = "ẓ̌" "ږ" = "γ̌" "ږ" = "ǵ" "ږ" = "g" Pashto
       "ڮ" = "g" "ڤ" = "p" "ڠ" = "ng" "ڟ" = "th" "ڎ" = "dh" "ۑ" = "ny" Pegon
       "پ" = "p" "گ" = "g" "ژ" = "ž" "چ" = "č" Persian
       "ݪ" = "ḷ" "ݨ" = "ṇ" Shahmukhi
       "ٻ" = "ɓ" "ڄ" = "ʄ" "ڄ" = "jj" "ݙ" = "ɗ" "ݙ" = "dd" "ڳ" = "ɠ" "ڳ" = "gg" Saraiki
       "گ" = "g" "ڱ" = "ŋ" "ڳ" = "ɠ" "ڪ" = "g" "ک" = "kh" "ٿ" = "th" "ٽ" = "t" "ٻ" = "ɓ" "ڀ" = "bh" "پ" = "p" "ٺ" = "ʈh" "ڄ" = "ʄ" "چ" = "c" "ڇ" = "ch" "ڦ" = "ph" "ڻ" = "ɳ" "ڃ" = "ɲ" "ڍ" = "ɖh" "ڏ" = "ɗ" "ڌ" = "dh" "ڙ" = "ɽ" "ھ" = "h" "ڊ" = "ɖ"  Sindhu 
       "ڕ" = "r" "ڤ" = "v" "ڵ" = "ll" "ۆ" = "o" "ێ" = "ê" Sorani
       "ۋ" = "v" Iske imla
       "ﻻ" = "la" "ﯓ" = "ñ" "ﮒ" = "g" "ﮊ" = "j" "ﭖ" = "p" "ﭺ" = "ç" Ottoman Turkish
       "ھ" = "h" "ہ" = "ʼ" "ں" = "ṉ" "ڑ" = "ṛ" "ڈ" = "ḍ" "ٹ" = "ṭ" "ے" = "ai" "ے" = "e"  Urdu
       "ئۇ" = "u" "ئو" = "o" "ھ" = "h" "ئە" = "ä" "ئا" = "a" "ئې" = "e" "ۋ" = "v" "ۋ" = "w" "ئۈ" = "y" "ئۆ" = "ø" "ئى" = "i" Uyghur
       "ݒ" = "p" "ݖ" = "c" "گ" = "g" "ݝ" = "ŋ" "ݧ" = "ñ" Wolofal
       "ٿ" = "q" "س" = "l" "ي" = "y" "ڞ" = "c" Xiao'erjing
       "ئو" = "y" "ئو" = "ü" "ئی" = "í" "ئی" = "i" "ئە" = "ä" "ئا" = "a" "ھ" = "h" "ئ" = "y" "ئۇ" = "o" "ئۇ" = "ö" Yaña imlâ */

    let resultLa = "";
    let textAr = document.getElementById("textarea2").value;
    for (let u = 0 ; u < textAr.length ; u++ ) {
      if (textAr[u].indexOf("\n") > -1) {
        resultLa = resultLa + "\n";
      } else if (arabicToLatin[textAr[u]] != undefined && arabicToLatin[textAr[u]] != null && textAr[u] != "") {
        resultLa = resultLa + arabicToLatin[textAr[u]];
      }
    }
    document.getElementById("textarea1").value = resultLa;
    document.getElementById("textarea1").innerHTML = resultLa;
  }
}

function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
  /*
    let object = {};
    let reverse_obj = {};
    for (let key in object) {
        let value = object[key];
        reverse_obj[value] = key;
    }
    JSON.stringify(reverse_obj)
  */
}

function openTab(evt, localeName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(localeName).style.display = "block";
  evt.currentTarget.className += " active";
  localStorage.setItem("encoding", localeName);
  transliterate();
}

function loadNaskh() {
  document.getElementById("Arabic").classList.remove("textNastaliq");
  document.getElementById("Arabic").classList.remove("textKufi");
  document.getElementById("Arabic").classList.add("textNaskh");
  document.getElementById("textarea2").style.fontFamily = "Noto Naskh Arabic";
}

function loadKufi() {
  document.getElementById("Arabic").classList.remove("textNastaliq");
  document.getElementById("Arabic").classList.remove("textNaskh");
  document.getElementById("Arabic").classList.add("textKufi");
  document.getElementById("textarea2").style.fontFamily = "Noto Kufi Arabic";
}

function loadNastaliq() {
  document.getElementById("Arabic").classList.remove("textKufi");
  document.getElementById("Arabic").classList.remove("textNaskh");
  document.getElementById("Arabic").classList.add("textNastaliq");
  document.getElementById("textarea2").style.fontFamily = "Noto Nastaliq Urdu";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
document.getElementById("textarea1").focus();
if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "arabic2latin") {
  localStorage.setItem("direction", "latin2arabic");
  localStorage.setItem("encoding", "Latin");
}

if (screen.width >= 300 && screen.width <= 500) {
  document.getElementById("Arabic").classList.remove("arabicTabText");
  document.getElementById("Arabic").classList.add("arabicTabSmallScreen");
  document.getElementById("Latin").classList.remove("tabcontent");
  document.getElementById("Latin").classList.add("tabcontentSmallScreen");
}
