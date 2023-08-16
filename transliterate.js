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
  /*  Questions
    - Vocalisation from Latin to Arabic , Arabic (mostly without vocalisation) to be represented back in Latin
    - Ligatures : 'la' varients to be included , Shamzi / Kamar "la" letter combination
    - Include "Long Vowels" are covered in IJMES
    - Mapping of multiple letter in MT to same Arabic alphabet 
    - Constructus status letters
    - Compatibility issues of UTF-8 to UTF-16
  */
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

    Various Standardisations : https://en.wikipedia.org/wiki/Romanization_of_Arabic
      DIN Standard for Arabic : 
        https://en.wikipedia.org/wiki/DIN_31635
      IJMES Standard for Arabic : 
        https://www.cambridge.org/core/journals/international-journal-of-middle-east-studies/information/author-resources/ijmes-translation-and-transliteration-guide
        https://www.cambridge.org/core/services/aop-file-manager/file/57d83390f6ea5a022234b400/TransChart.pdf
  
  Ligatures Transliteration for all 4 Languages
  "al-":"ال","-l-":"ال"
  alif : RULES
    ' ا ' ini : a , i , u  
    ' ا ' definite article ' ال ' is silent sometimes
    ' ا ' med / fin : ā , ī , ū for A P and only Persian & Arabic origin words in OT & MT 
    ' أ ' / ' ٵ ' ini : ʾa  , ʾu - hamza
    ' أ ' / ' ٵ ' med / fin : āʾ , ūʾ - hamza
    ' إ ' ini : ʾi - hamza
    ' إ ' med / fin : īʾ  - hamza
    ' آ ' : ā - maddah
    ' ٱ' , ' ﭐ ' , ' ﭑ' : ini / med / fin : silent  - waslah
    ' ٱ ' : ʔ "marker/connector/conjoiner" - waslah
  
  Long Vowel : vocalised text

    "ā":"ا َ", "Ā":"ا َ" or 'ـَـا' - NOT IN IJMES 
    "ā":"ىٰ َ", "Ā":"ىٰ َ" or 'ـَـىٰ' - NOT IN IJMES 
    "ī":"ي ِ", "Ī":"ي ِ" or 'ـِـي' - NOT IN IJMES 
    "y":"ىٖ ِ", "Y":"ىٖ ِ" or 'ـِـىٖ' - NOT IN IJMES 
    "ū":"وُ", "Ū":"وُ"  or 'ـُـو' - NOT IN IJMES

    "iyy":"ّيِ", "Iyy":"ّيِ"
    "ī":"ّيِ", "Ī":"ّيِ"  (final A P OT MT)
    "uvv":"ّوُ", "Uvv":"ّوُ"
    "ū":"ّوُ", "Ū":"ّوُ"  (final A P)
  
  Long Vowel : unvocalised text i.e. without short vowels such as fat·ḥah, ḍammah kasrah
    "ā":"ا","Ā":"ا"
    "ū":"و","Ū":"و"
    "ī":"ي","Ī":"ي"
  
  Doubled vowels 
    "ī":"ّيِ","Ī":"ّيِ" - fin : A P OT MT
    "ū":"ّوُ","Ū":"ّوُ" - fin : A P
  
  Constructed - "at":"ة" "a":"ة"
  Hamza semi consonant : ئ  ؤ  ء 
  Nunation rules : https://en.wikipedia.org/wiki/Nunation : '-n' for vowel 
    "an":" ً","An":" ً","un":" ٌ","Un":" ٌ","in":" ٍ","In":" ٍ" A P
  
  Diphthongs : 
    "ai":"یَ","Ai":"یَ","ay":"یَ","Ay":"یَ" A P 
    "ev":"وَ","Ev":"وَ","ey":"یَ","Ey":"یَ" OT MT 
  Additional Letters :  ڛ	ـڛ	ـڛـ	ڛـ sīn  |  ک	ـک	ـکـ	کـ kāf | ی	ـی	ـیـ	یـ yā’ 
   ʾIʿjām / ḥarakāt : nuqaṭ / rasm?
   Tone markers : Hārbāy - ◌࣪ / ◌࣭ | Ṭelā - ◌࣫ / ◌࣮ | Ṭāna - ◌࣬ / ◌࣯ ?

  Diacritics - https://de.wikipedia.org/wiki/Taschkīl or https://en.wikipedia.org/wiki/Arabic_diacritics
    " ً" : "an" - fathatan ,  " ٌ" : "un" - dammatan, " ٍ" : "in" - kasratan - Short vowel rules
    " ࣰ" :  "an" - fathatan open , "ࣱ" : "un" - dammatan open, "ࣲ" : "in" - kasratan open  - Long vowel rules 
    " َ" : "a" - fatha, " ُ" : "u" - damma, " ِ" : "i" - kasra 
    " ّ" : 'shaddah' - Shaddah/Shadda rules : double consonant
    " ٓ" : "" - maddah, "ۤ" : "" - madda
    " ْ" : "" - sukun, "◌ٰ" : "ā" superscript alif , "◌ٖ" : "ā" subscript alif - dagger - Vowel omissions
  */

  // TODO : Arabic Unicode EXACT APPEARING letter available in multiple PLANES and that needs to be included in MAPPING 

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "latin2arabic") {
    let latinToArabic;
    let vowels;
    const latinVowels = ['a','e','i','o','u','y','ā','ē','ī','ō','ū','A','E','I','O','U','Y','Ā','Ē','Ī','Ō','Ū'];

    const textVocalisation = ["\uFE70","\uFE71","\uFE72","\uFE74","\u08F0","\u08F1","\u08F2","\u064C","\u064D","\u064B"," ࣰ","ࣱ","ࣲ","\u064E","\u0618","\uFE76","\uFE77","\u064F","\u0619","\uFE78","\uFE79","\u0650","\uFE7A","\uFE7B","\u061A","◌ٰ","◌ٖ"];

    if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Arabic") {
      const ijmesArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"","P":"","t":"ت","T":"ت","th":"ث","Th":"ث","ch":"","Ch":"","j":"ج","J":"ج","ḥ":"ح","Ḥ":"ح","kh":"خ","Kh":"خ","d":"د","D":"د","dh":"ذ","Dh":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","zh":"","Zh":"","s":"س","S":"س","sh":"ش","Sh":"ش","ṣ":"ص","Ṣ":"ص","ḍ":"ض","Ḍ":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","gh":"غ","Gh":"غ","f":"ف","F":"ف","q":"ق","Q":"ق","k":"ك","K":"ك","g":"","G":"","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","w":"و","W":"و","y":"ي","Y":"ي","al":"ال","la":"ﻻ","la":"ﻼ"};
      const ijmesArabicVowels = {"ā":"ا","Ā":"ا","ā":"ای","Ā":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","iyy":"ّيِ","Iyy":"ّيِ","ī":"ّيِ","Ī":"ّيِ","uvv":"ّوُ","Uvv":"ّوُ","ū":"ّوُ","Ū":"ّوُ","au":"وَ","Au":"وَ","aw":"وَ","Aw":"وَ","ai":"یَ","Ai":"یَ","ay":"یَ","Ay":"یَ","a":"\u064E","A":"\u064E","u":"\u064F","U":"\u064F","i":"\u0650","I":"\u0650","in":"\uFE74","In":"\uFE74","un":"\uFE72","Un":"\uFE72","an":"\uFE70","An":"\uFE70","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesArabic;
      vowels = ijmesArabicVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Persian") {
      const ijmesPersian = {"0":"۰","1":"١","2":"٢","3":"٣","4":"۴","5":"۵","6":"۶","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"پ","P":"پ","t":"ت","T":"ت","s̲":"ث","S̲":"ث","j":"ج","J":"ج","ch":"چ","Ch":"چ","ḥ":"ح","Ḥ":"ح","kh":"خ","Kh":"خ","d":"د","D":"د","z̲":"ذ","Z̲":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","zh":"ژ","Zh":"ژ","s":"س","S":"س","sh":"ش","Sh":"ش","ṣ":"ص","Ṣ":"ص","ż":"ض","Ż":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","gh":"غ","Gh":"غ","f":"ف","F":"ف","q":"ق","Q":"ق","k":"ك","K":"ك","g":"ك","G":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","U":"و","U":"و","y":"ي","Y":"ي"};
      const ijmesPersianVowels = {"ā":"ا","Ā":"ا","ā":"ای","Ā":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","iyy":"ّيِ","Iyy":"ّيِ","ī":"ّيِ","Ī":"ّيِ","uvv":"ّوُ","Uvv":"ّوُ","ū":"ّوُ","Ū":"ّوُ","au":"وَ","Au":"وَ","aw":"وَ","Aw":"وَ","ai":"یَ","Ai":"یَ","ay":"یَ","Ay":"یَ","a":"\u064E","A":"\u064E","u":"\u064F","U":"\u064F","i":"\u0650","I":"\u0650","in":"\uFE74","In":"\uFE74","un":"\uFE72","Un":"\uFE72","an":"\uFE70","An":"\uFE70","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesPersian;
      vowels = ijmesPersianVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "OttomanTurkish") {
      const ijmesOttomanTurkish = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"پ","P":"پ","t":"ت","T":"ت","s̲":"ث","S̲":"ث","c":"ج","C":"ج","ç":"چ","Ç":"چ","ḥ":"ح","Ḥ":"ح","h":"خ","H":"خ","d":"د","D":"د","z̲":"ذ","Z̲":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","j":"ژ","J":"ژ","s":"س","S":"س","ş":"ش","Ş":"ش","ṣ":"ص","Ṣ":"ص","ż":"ض","Ż":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","g":"غ","G":"غ","ğ":"غ","Ğ":"غ","f":"ف","F":"ف","ḳ":"ق","Ḳ":"ق","k":"ك","K":"ك","ñ":"ك","Ñ":"ك","ğ":"ك","Ğ":"ك","y":"ك","Y":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","y":"ي","Y":"ي"};
      const ijmesOttomanTurkishVowels = {"ā":"ا","Ā":"ا","ā":"ای","Ā":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","iy":"ّيِ","Iy":"ّيِ","ī":"ّيِ","Ī":"ّيِ","uvv":"و-ُ","Uvv":"و-ُ","ev":"وَ","Ev":"وَ","ey":"یَ","Ey":"یَ","a":"\u064E","A":"\u064E","u":"\u064F","U":"\u064F","i":"\u0650","I":"\u0650","in":"\uFE74","In":"\uFE74","un":"\uFE72","Un":"\uFE72","an":"\uFE70","An":"\uFE70","e":" َ","E":" َ","ü":" ُ","Ü":" ُ","o":" ُ","O":" ُ","ö":" ُ","Ö":" ُ","ı":" ِ","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesOttomanTurkish;
      vowels = ijmesOttomanTurkishVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "ModernTurkish") {
      const ijmesModernTurkish = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","b":"ب","B":"ب","p":"پ","b":"ب","P":"پ","B":"ب","t":"ت","T":"ت","s":"ث","S":"ث","c":"ج","C":"ج","ç":"چ","Ç":"چ","ḥ":"ح","Ḥ":"ح","h":"خ","H":"خ","d":"د","D":"د","z":"ذ","Z":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","j":"ژ","J":"ژ","s":"س","S":"س","ş":"ش","Ş":"ش","s":"ص","S":"ص","z":"ض","Z":"ض","t":"ط","T":"ط","z":"ظ","Z":"ظ","ġ":"غ","ġ":"غ","ğ":"غ","Ğ":"غ","f":"ف","F":"ف","k":"ق","K":"ق","k":"ك","K":"ك","ñ":"ك","Ñ":"ك","ğ":"ك","Ğ":"ك","y":"ك","Y":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","y":"ي","Y":"ي","ʿ":"","ʾ":""};
      const ijmesModernTurkishVowels = {"ā":"ا","Ā":"ا","ā":"ای","Ā":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","iy":"ّيِ","Iy":"ّيِ","ī":"ّيِ","Ī":"ّيِ","uvv":"و-ُ","Uvv":"و-ُ","ev":"وَ","Ev":"وَ","ey":"یَ","Ey":"یَ","a":"\u064E","A":"\u064E","u":"\u064F","U":"\u064F","i":"\u0650","I":"\u0650","in":"\uFE74","In":"\uFE74","un":"\uFE72","Un":"\uFE72","an":"\uFE70","An":"\uFE70","e":" َ","E":" َ","ü":" ُ","Ü":" ُ","o":" ُ","O":" ُ","ö":" ُ","Ö":" ُ","ı":" ِ","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesModernTurkish;
      vowels = ijmesModernTurkishVowels;
    }
    /*  else if (localStorage.getItem("transliterateType") == "DIN") {
      const dinTransliterate = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","":"ة","ǧ":"ج","ṯ":"ث","t":"ت","b":"ب","ā":"آ","s":"س","z":"ز","r":"ر","ḏ":"ذ","d":"د","ḫ":"خ","ḥ":"ح","ẓ":"ظ","ṭ":"ط","ḍ":"ض","ṣ":"ص","š":"ش","k":"ك","q":"ق","f":"ف","ġ":"غ","ʿ":"ع","ī":"ے","y":"ي","w":"و","h":"ه","n":"ن","m":"م","l":"ل","ʾ":"ء","la":"ﻼ","Allāh":"ﷲ","salla":"ﷹ","qala":"ﷱ","akbar":"ﷳ","Mohammad":"ﷴ","salām":"ﷵ","rasūl":"ﷶ","alayhe":"ﷷ","wa-sallam":"ﷸ","Sallallahou Alayhe Wasallam":"ﷺ","Jallajalalouhou":"ﷻ","bism-i llāh-i r-raḥmān-i r-raḥīm":"﷽"};
      latinToArabic = dinTransliterate;
    } */

    let resultAr = "";
    let textLa = document.getElementById("textarea1").value.toLowerCase();
    for (let u = 0; u < textLa.length; u++) {
      if (textLa[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if ((textLa[u-2] == " " && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == " ") || (textLa[u-2] == " " && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == "\n") || (textLa[u-2] == "\n" && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == " ") || (textLa[u-2] == " " && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == undefined) || (textLa[u-2] == "\n" && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == undefined) || (textLa[u-2] == undefined && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == " ") || (textLa[u-2] == "\n" && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == "\n") || (textLa[u-2] == undefined && textLa[u] != "" && textLa[u+1] != "" && textLa[u+2] == undefined)) { // Isolate Double Character position 
        if (vowels[textLa[u] + textLa[u+1]] && latinVowels.indexOf(textLa[u] + textLa[u+1]) > -1) { // Vowel
          resultAr = resultAr.slice(0, -1) + vowels[textLa[u] + textLa[u+1]];
        } else if (latinToArabic[textLa[u] + textLa[u+1]]){
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]];
        }
      } else if (textLa[u-1] == " " && textLa[u] && textLa[u+1] && latinToArabic[textLa[u] + textLa[u+1]]) { // Initial Double Character position 
        resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]]; // TODO "al":"ال"
        u = u + 1;
      } else if (textLa[u-1] && latinToArabic[textLa[u-1]] && textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == " ") { // Final Double Character position 
        resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u-1]] + latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]]; // TODO OT & MT "ه" is NOT final
        u = u + 2;
      } else if (textLa[u] && textLa[u+1] && vowels[textLa[u] + textLa[u+1]] && latinVowels.indexOf(textLa[u] + textLa[u+1]) > -1) { // Vowel Double Character
        resultAr = resultAr.slice(0, -1) + vowels[textLa[u] + textLa[u+1]];
        u = u + 1;
      } else if (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && latinToArabic[textLa[u] + textLa[u+1]]) { // Medial Position Double Character
        resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]]; // TODO "l":"ال"
        u = u + 1;
      } else if (textLa[u] && textLa[u+1] && textLa[u+2] && vowels[textLa[u] + textLa[u+1] + textLa[u+2]] && latinVowels.indexOf(textLa[u] + textLa[u+1] + textLa[u+2]) > -1) { // Vowel Triple Character
        resultAr = resultAr.slice(0, -2) + vowels[textLa[u] + textLa[u+1] + textLa[u+2]];
        u = u + 2;
      } else if ((textLa[u-1] == " " && textLa[u] != "" && textLa[u+1] == " ") || (textLa[u-1] == " " && textLa[u] != "" && textLa[u+1] == "\n") || (textLa[u-1] == "\n" && textLa[u] != "" && textLa[u+1] == " ") || (textLa[u-1] == " " && textLa[u] != "" && textLa[u+1] == undefined) || (textLa[u-1] == "\n" && textLa[u] != "" && textLa[u+1] == undefined) || (textLa[u-1] == undefined && textLa[u] != "" && textLa[u+1] == " ") || (textLa[u-1] == "\n" && textLa[u] != "" && textLa[u+1] == "\n") || (textLa[u-1] == undefined && textLa[u] != "" && textLa[u+1] == undefined)) { // Isolate Single Character position 
        if (textLa[u] && vowels[textLa[u]] && latinVowels.indexOf(textLa[u]) > -1) { // Vowel
          resultAr = resultAr + vowels[textLa[u]];
        } else if (latinToArabic[textLa[u]]){
          resultAr = resultAr + latinToArabic[textLa[u]];
        }
      } else if (textLa[u-1] == " " && textLa[u] && latinToArabic[textLa[u]]) { // Initial Single Character position 
        resultAr = resultAr + latinToArabic[textLa[u]];
      } else if ((textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == " ") || (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == "\n") || (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == undefined)) { // Final Single Character position 
        resultAr = resultAr + latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]]; // TODO OT & MT "ه" is NOT final
        u = u + 1;
      } else if (textLa[u] && vowels[textLa[u]] && latinVowels.indexOf(textLa[u]) > -1) { // Vowel Character
        resultAr = resultAr + vowels[textLa[u]];
      } else if (textLa[u] && latinToArabic[textLa[u]]) { // Medial Position Single Character
        resultAr = resultAr + latinToArabic[textLa[u]];
      }
    }

    document.getElementById("textarea2").value = resultAr;
    document.getElementById("textarea2").innerHTML = resultAr;
  } else if (localStorage.getItem("direction") == "arabic2latin") {
    let arabicToLatin;
    let ligatures;
    let diacritics;
    let vowels;
    /* 
      const fixedligatures = fixedligatures.json; 
    */

    if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Arabic") {
      const ijmesArabic = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(",
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"j", "ـجـ":"j", "جـ":"j", "ج":"j", "ـث":"th", "ـثـ":"th", "ثـ":"th", "ث":"th", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"dh", "ذ":"dh", "ـد":"d", "د":"d", "ـخ":"kh", "ـخـ":"kh", "خـ":"kh", "خ":"kh", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ḍ", "ـضـ":"ḍ", "ضـ":"ḍ", "ض":"ḍ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"sh", "ـشـ":"sh", "شـ":"sh", "ش":"sh", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"gh", "ـغـ":"gh", "غـ":"gh", "غ":"gh", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"w", "و":"w", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ء": "ʾ", "ـة":"h", "ة":"h", "پ":"", "چ":"", "ژ":"", "گ":"", "ال":"al-"}; 
      // TODO  "ال":"al-" and  "ال":"-l-" 
      // TODO "ة" : "at", "ة":"h" , "ة":"a"
      arabicToLatin = ijmesArabic;
      const ijmesArabicVowels = {"ا":"a","ﴼ":"ā","ﴽ":"ā","ای":"ā","و":"ū","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ئِ":"ʾi","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"ā","ـىـ":"ā","ىـ":"ā","ى":"ā","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ﱝ":"","ﲐ":"","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesArabicVowels;
      diacritics = [];
      ligatures = {"ﻻ":"la","ﻼ":"la","لأ":"laʾ","لْأ":"laʾ","ﻶ":"lā","ﻸ":"laʾ","ﻹ":"laʾ","ﻺ":"laʾ"};
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Persian") {
      const ijmesPersian = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"j", "ـجـ":"j", "جـ":"j", "ج":"j", "ـث":"s̲", "ـثـ":"s̲", "ثـ":"s̲", "ث":"s̲", "ـت":"t", "ـتـ":"t", "تـ":"t", "ـپ":"p", "ـپـ": "p", "پـ": "p", "پ":"p","ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـژ":"zh","ژ":"zh", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"z̲", "ذ":"z̲", "ـد":"d", "د":"d", "ـخ":"kh", "ـخـ":"kh", "خـ":"kh", "خ":"kh", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـچ":"ch","ـچـ":"ch","چـ":"ch","چ":"ch", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ż", "ـضـ":"ż", "ضـ":"ż", "ض":"ż", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"sh", "ـشـ":"sh", "شـ":"sh", "ش":"sh", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", "ـڪ":"g", "ـکـ":"g", "كـ":"g", "ڪـ":"g", "ڪ":"g", "ك":"g", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"gh", "ـغـ":"gh", "غـ":"gh", "غ":"gh", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"u", "و":"u", "ـو":"v", "و":"v", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ء": "ʾ", "ـة":"h", "ة":"h", "ال":"al"};
      arabicToLatin = ijmesPersian;
      const ijmesPersianVowels = {"ا":"a","ا":"ā","ای":"ā","و":"ū","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"ā","ـىـ":"ā","ىـ":"ā","ى":"ā","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesPersianVowels;
      diacritics = [];
      ligatures = [];
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "OttomanTurkish") {
      const ijmesOttomanTurkish = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"c", "ـجـ":"c", "جـ":"c", "ج":"c", "ـث":"s̲", "ـثـ":"s̲", "ثـ":"s̲", "ث":"s̲", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـژ":"j","ژ":"j", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"z̲", "ذ":"z̲", "ـد":"d", "د":"d", "ـخ":"h", "ـخـ":"h", "خـ":"h", "خ":"h", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـچ":"ç","ـچـ":"ç","چـ":"ç","چ":"ç", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ż", "ـضـ":"ż", "ضـ":"ż", "ض":"ż", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"ş", "ـشـ":"ş", "شـ":"ş", "ش":"ş", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", "ـك":"ğ", "ـڪ":"ğ", "ـکـ":"ğ", "كـ":"ğ", "ڪـ":"ğ", "ڪ":"ğ", "ك":"ğ", "ـك":"y", "ـڪ":"y", "ـکـ":"y", "كـ":"y", "ڪـ":"y", "ڪ":"y", "ك":"y", "ـك":"ñ", "ـڪ":"ñ", "ـکـ":"ñ", "كـ":"ñ", "ڪـ":"ñ", "ڪ":"ñ", "ك":"ñ", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"ḳ", "ـقـ":"ḳ", "قـ":"ḳ", "ق":"ḳ", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"ğ", "ـغـ":"ğ", "غـ":"ğ", "غ":"ğ", "ـغ":"g", "ـغـ":"g", "غـ":"g", "غ":"g", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"v", "و":"v", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ء": "ʾ", "ـة":"h", "ة":"h", "ال":"al"};
      arabicToLatin = ijmesOttomanTurkish;
      const ijmesOttomanTurkishVowels = {"ا":"a","ا":"ā","ای":"ā","و":"ū","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"ā","ـىـ":"ā","ىـ":"ā","ى":"ā","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesOttomanTurkishVowels;
      diacritics = [];
      ligatures = [];
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "ModernTurkish") {
      const ijmesModernTurkish = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"c", "ـجـ":"c", "جـ":"c", "ج":"c", "ـث":"s", "ـثـ":"s", "ثـ":"s", "ث":"s", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـب":"p", "ـبـ":"p", "بـ":"p", "ب":"p", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـژ":"j","ژ":"j", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"z", "ذ":"z", "ـد":"d", "د":"d", "ـخ":"h", "ـخـ":"h", "خـ":"h", "خ":"h", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـچ":"ç","ـچـ":"ç","چـ":"ç","چ":"ç", "ـظ":"z", "ـظـ":"z", "ظـ":"z", "ظ":"z", "ـط":"t", "ـطـ":"t", "طـ":"t", "ط":"t", "ـض":"z", "ـضـ":"z", "ضـ":"z", "ض":"z", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"ş", "ـشـ":"ş", "شـ":"ş", "ش":"ş", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", "ـك":"ğ", "ـڪ":"ğ", "ـکـ":"ğ", "كـ":"ğ", "ڪـ":"ğ", "ڪ":"ğ", "ك":"ğ", "ـك":"y", "ـڪ":"y", "ـکـ":"y", "كـ":"y", "ڪـ":"y", "ڪ":"y", "ك":"y", "ـك":"n", "ـڪ":"n", "ـکـ":"n", "كـ":"n", "ڪـ":"n", "ڪ":"n", "ك":"n", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"k", "ـقـ":"k", "قـ":"k", "ق":"k", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"ğ", "ـغـ":"ğ", "غـ":"ğ", "غ":"ğ", "ـغ":"ġ", "ـغـ":"ġ", "غـ":"ġ", "غ":"ġ", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"v", "و":"v", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ـة":"h", "ة":"h", "ع":"", "ال":"al"};
      arabicToLatin = ijmesModernTurkish;
      const ijmesModernTurkishVowels = {"ا":"a","ا":"ā","ای":"ā","و":"ū","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"ā","ـىـ":"ā","ىـ":"ā","ى":"ā","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesModernTurkishVowels;
      diacritics = [];
      ligatures = [];
    }
    /*  else if (localStorage.getItem("transliterateType") == "DIN") {
      const dinTransliterate = { " ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", "۹":"9", "٩":"9", "۹":"9", "۹":"9", "۸":"8", "٨":"8", "۸":"8", "۸":"8", "۷":"7", "٧":"7", "۷":"7", "۷":"7", "٦":"6", "٦":"6", "۶":"6", "۶":"6", "٥":"5", "٥":"5", "۵":"5", "۵":"5", "٤":"4", "٤":"4", "۴":"4", "۴":"4", "۳":"3", "۳":"3", "٣":"3", "۳":"3", "۲":"2", "٢":"2", "۲":"2", "۲":"2", "۱":"1", "١":"1", "۱":"1", "۱":"1", "٠":"0", "۰":"0", "۰":"0", "۰":"0", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"ǧ", "ـجـ":"ǧ", "جـ":"ǧ", "ج":"ǧ", "ـث":"ṯ", "ـثـ":"ṯ", "ثـ":"ṯ", "ث":"ṯ", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـا":"ā", "ا":"ā", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"ḏ", "ذ":"ḏ", "ـد":"d", "د":"d", "ـخ":"ḫ", "ـخـ":"ḫ", "خـ":"ḫ", "خ":"ḫ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ḍ", "ـضـ":"ḍ", "ضـ":"ḍ", "ض":"ḍ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"š", "ـشـ":"š", "شـ":"š", "ش":"š", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"ġ", "ـغـ":"ġ", "غـ":"ġ", "غ":"ġ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـے":"ī", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"w", "و":"w", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ـئ":"ʾ", "ـئـ":"ʾ", "ئـ":"ʾ", "ئ":"ʾ", "ـؤ":"ʾ", "ؤ":"ʾ", "ـإ":"ʾ", "إ":"ʾ", "ـأ":"ʾ", "أ":"ʾ", "ء": "ʾ", "ـى":"ā", "ـىـ":"ā", "ىـ":"ā", "ى":"ā", "ـة":"ta", "ة":"ta", "ـآ":"ā", "آ":"ā", "۽":"", "۾":"", "ۿ":"" };
      arabicToLatin = dinTransliterate;

      const dinLigatures = {"ﻻ":"la", "ﻼ":"la", "ﷲ":"Allāh", "ﷰ":"salla", "ﷱ":"qala", "ﷳ":"akbar", "ﷴ":"Mohammad", "ﷵ":"salām", "ﷶ":"rasūl", "ﷷ":"alayhe", "ﷸ":"wa-sallam", "ﷹ":"salla", "ﷺ":"Sallallahou Alayhe Wasallam", "ﷻ":"Jallajalalouhou", "﷽":"bism-i llāh-i r-raḥmān-i r-raḥīm"};
      ligatures = dinLigatures;

      const dinDiacritics = {"\u0618":"", "\u0619":"", "\u061A":"", "\u0640":"", "\u064B":"", "\u064C":"", "\u064D":"", "\u064E":"", "\u064F":"", "\u0650":"", "\u0651":"", "\u0652":"", "\u0653":"", "\u0654":"", "\u0655":"", "\u0656":"", "\u0657": "", "\u0658":"", "\u0659":"", "\u065A": "", "\u065B":"", "\u065C":"", "\u065D": "\u065E", "\u065F":"", "\u0674":"", "\uFBB2":"", "\uFBB3":"", "\uFBB4":"", "\uFBB5":"", "\uFBB6":"", "\uFBB7":"", "\uFBB8":"", "\uFBB9":"", "\uFBBA":"", "\uFBBB":"", "\uFBBC":"", "\uFBBD":"", "\uFBBE":"", "\uFBBF":"", "\uFBC0":"", "\uFBC1":"", "\uFE70":"", "\uFE71":"", "\uFE72":"", "\uFE73":"", "\uFE74":"", "\uFE76":"", "\uFE77":"", "\uFE78":"", "\uFE78":"", "\uFE79":"", "\uFE7A":"", "\uFE7B":"", "\uFE7C":"", "\uFE7D":"", "\uFE7E":"", "\uFE7F":"", "\u06DF":"", "\u06E0":"", "\u06EA":"", "\u06EB":"", "\u06EC":""};
      diacritics = dinDiacritics;
    } */

    /* 
      Arabic Character : RULE

      "ا" INI "a" "i" "u" "∅" & MED/FIN "ā" "ī" "ū"
      أ/ٵ INI "ʾa" "ʾu" & MED/FIN "āʾ" "ūʾ"
      إ INI "ʾi"  & MED/FIN "īʾ"
      ٱ INI "∅" & "ʔ" RULE
      "و" = "ū", "و" = "∅", "i" = "ء"
      "ـے" = "ī", "ـي" = "y"  

      Language Specific Characters : RULE
      
      "تٰٜ" = "ḇ", "تٜ" = "ḇ", "ٻ" "ḇ", "ٻ" = "ḇ", "ـٻـ" = "ḇ", "ـٻ" = "ḇ" Ajami
      "ڵ" = "lj" "ي" = "j" "اٖى" = "i" "ە" = "ae" "ڄ" = "c" "ۆ" = "u"  "ۉ" = "o" "ںٛ" = "nj" Serbo-Croat 
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
      "ٿ" = "q" "س" = "l" "ي" = "y" "ڞ" = "c" Xiao'erjing additional - "an":" ً","An":" ً","un":" ٌ","Un":" ٌ","en":" ٍ","En":" ٍ","eng":" ٍْ" , "Eng":" ٍْ"
      "ئو" = "y" "ئو" = "ü" "ئی" = "í" "ئی" = "i" "ئە" = "ä" "ئا" = "a" "ھ" = "h" "ئ" = "y" "ئۇ" = "o" "ئۇ" = "ö" Yaña imlâ 
    */

    // TODO determine vocalised or unvocalised in text
    const textVocalisation = ["\uFE70","\uFE71","\uFE72","\uFE74","\u08F0","\u08F1","\u08F2","\u064C","\u064D","\u064B","\u08F0","\u08F1","\u08F2","\u064E","\u0618","\uFE76","\uFE77","\u064F","\u0619","\uFE78","\uFE79","\u0650","\uFE7A","\uFE7B","\u061A","◌ٰ","◌ٖ","\uFE7E","\u0652"]; 
    // Fatha, Kasra, Damma : Normal, Small, Isolated, Medial forms included above
    const shaddaForms = ["\uFC5E","\uFC60","\uFC61","\uFC62","\uFC63","\uFCF2","\uFCF3","\uFCF4","\uFC5F","\u0651","\uFE7D","\uFE7C"];
    
    let resultLa = "";
    let textAr = document.getElementById("textarea2").value;
    for (let u = 0 ; u < textAr.length ; u++ ) {
      // TODO 3 character vowels and long vowels : إِ followed by ي = ī
      // ءُ followed by و = ū or ئِ followed by ي = ī or أُ followed by و = ū 
      // ا َ followed by ءْ = ā
      if (textAr[u].indexOf("\n") > -1) {
        resultLa = resultLa + "\n";
      } else if (textAr[u] && diacritics[textAr[u]]) {
        console.log("1. Diacritic ", textAr[u], " : " , diacritics[textAr[u]] )
        resultLa = resultLa + diacritics[textAr[u]];
      } else if (textAr[u] && ligatures[textAr[u]]) {
        console.log("2. Ligature ", textAr[u], " : " , ligatures[textAr[u]] )
        resultLa = resultLa + ligatures[textAr[u]];
      } else if (textAr[u] && shaddaForms.indexOf(textAr[u]) > -1) {
        /* if (textVocalisation.indexOf(textAr[u-1]) > -1) {
          console.log("3. Shadda final ", textAr[u] , textAr[u-1] , textVocalisation.indexOf(textAr[u-1]))
          resultLa = resultLa + resultLa[resultLa.length - 1]; // TODO Shadda rules
        } else { */
          console.log("3. Shadda ", textAr[u])
          resultLa = resultLa.slice(0, -1) + resultLa[resultLa.length - 2] + resultLa[resultLa.length - 1]; // TODO Shadda rules
        //}
      } else if (((textAr[u-2] == " " && textAr[u-1] && textAr[u] != "" && textAr[u+2] == " ") || (textAr[u-2] == " " && textAr[u-1] && textAr[u] != "" && textAr[u+2] == "\n") || (textAr[u-2] == "\n" && textAr[u-1] && textAr[u] != "" && textAr[u+2] == " ") || (textAr[u-2] == " " && textAr[u-1] && textAr[u] != "" && textAr[u+2] == undefined) || (textAr[u-2] == "\n" && textAr[u-1] && textAr[u] != "" && textAr[u+2] == undefined) || (textAr[u-2] == undefined && textAr[u-1] && textAr[u] != "" && textAr[u+2] == " ") || (textAr[u-2] == "\n" && textAr[u-1] && textAr[u] != "" && textAr[u+2] == "\n") || (textAr[u-2] == undefined && textAr[u-1] && textAr[u] != "" != "" && textAr[u+2] == undefined)) && (arabicToLatin[textAr[u] + textAr[u-1]] || vowels[textAr[u] + textAr[u-1]])) { // Isolate double position 
        if (vowels[textAr[u] + textAr[u-1]]) {
          console.log("4. Isolate double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + vowels[textAr[u] + textAr[u-1]];  // Isolate double vowel position
        } else {
          console.log("4. Isolate double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + arabicToLatin[textAr[u] + textAr[u-1]];  // Isolate double consonant position
        }
      } else if (textAr[u+1] == " " && arabicToLatin[textAr[u] + textAr[u-1]]) { // Initial position with double character consonant
        console.log("5. Initial double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + arabicToLatin[textAr[u] + textAr[u-1]];
      } else if (textAr[u+1] == " " && vowels[textAr[u] + textAr[u-1]]) { // Initial position with double character vowel
        console.log("6. Initial double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + vowels[textAr[u] + textAr[u-1]]; 
      } else if (textAr[u] && arabicToLatin[textAr[u] + textAr[u-1]]) { // Medial Position with double character consonant
        console.log("7. Medial double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + arabicToLatin[textAr[u] + textAr[u-1]];
      } else if (textAr[u] && vowels[textAr[u] + textAr[u-1]]) { // Medial Position with double character vowel
        console.log("8. Medial double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + vowels[textAr[u] + textAr[u-1]];
      } else if ((textAr[u-1] == " " && textAr[u] && arabicToLatin[textAr[u] + textAr[u-1]]) || (textAr[u-1] == "\n" && textAr[u] && arabicToLatin[textAr[u] + textAr[u-1]]) || (textAr[u-1] == undefined && textAr[u] && arabicToLatin[textAr[u] + textAr[u-1]])) { // Final double character consonant position 
        console.log("9. Final double consonant ", textAr[u] , " : ", textAr[u-1], " : ", arabicToLatin[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + arabicToLatin[textAr[u] + textAr[u-1]]; // TODO OT & MT "ه" is NOT final and ة constructed rules
      } else if ((textAr[u-1] == " " && textAr[u] && vowels[textAr[u] + textAr[u-1]]) || (textAr[u-1] == "\n" && textAr[u] && vowels[textAr[u] + textAr[u-1]]) || (textAr[u-1] == undefined && textAr[u] && vowels[textAr[u] + textAr[u-1]])) { // Final double character vowel position 
        console.log("10. Final double vowel ", textAr[u] , " : ", textAr[u-1], " : ", vowels[textAr[u] + textAr[u-1]])
        resultLa = resultLa.slice(0, -1) + vowels[textAr[u] + textAr[u-1]];
      } else if (((textAr[u-1] == " " && textAr[u] != "" && textAr[u+1] == " ") || (textAr[u-1] == " " && textAr[u] != "" && textAr[u+1] == "\n") || (textAr[u-1] == "\n" && textAr[u] != "" && textAr[u+1] == " ") || (textAr[u-1] == " " && textAr[u] != "" && textAr[u+1] == undefined) || (textAr[u-1] == "\n" && textAr[u] != "" && textAr[u+1] == undefined) || (textAr[u-1] == undefined && textAr[u] != "" && textAr[u+1] == " ") || (textAr[u-1] == "\n" && textAr[u] != "" && textAr[u+1] == "\n") || (textAr[u-1] == undefined && textAr[u] != "" && textAr[u+1] == undefined)) && (arabicToLatin[textAr[u]] || vowels[textAr[u]])) { // Isolate position 
        if (vowels[textAr[u]]) {
          console.log("11. Isolate vowel ", textAr[u] , " : ", vowels[textAr[u]])
          resultLa = resultLa + vowels[textAr[u]];  // Isolate vowel position
        } else {
          console.log("11. Isolate consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
          resultLa = resultLa + arabicToLatin[textAr[u]];  // Isolate consonant position
        }
      } else if (textAr[u] && textAr[u+1] == " " && arabicToLatin[textAr[u]]) { // Initial consonant position 
        console.log("12. Initial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
        resultLa = resultLa + arabicToLatin[textAr[u]]; // TODO Capitalisation of Letter
      } else if (textAr[u] && textAr[u+1] == " " && vowels[textAr[u]]) { // Initial vowel position 
        console.log("13. Initial vowel ", textAr[u] , " : ", vowels[textAr[u]])
        resultLa = resultLa + vowels[textAr[u]]; // TODO Capitalisation of Letter
      } else if ((textAr[u-1] == " " && textAr[u] && arabicToLatin[textAr[u]]) || (textAr[u-1] == "\n" && textAr[u] && arabicToLatin[textAr[u]]) || (textAr[u-1] == undefined && textAr[u] && arabicToLatin[textAr[u]])) { // Final consonant position 
        if (textAr[u] == "ة") {
          console.log("14. Final consonant - constructus modus ", textAr[u])
          resultLa = resultLa.slice(0, -1) + "a"; // TODO ة constructed rules
        } else {
          console.log("14. Final consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
          resultLa = resultLa + arabicToLatin[textAr[u]]; // TODO OT & MT "ه" is NOT final
        }
      } else if ((textAr[u-1] == " " && textAr[u] && vowels[textAr[u]]) || (textAr[u-1] == "\n" && textAr[u] && vowels[textAr[u]]) || (textAr[u-1] == undefined && textAr[u] && vowels[textAr[u]])) { // Final vowel position 
        console.log("15. Final vowel ", textAr[u] , " : ", vowels[textAr[u]])
        resultLa = resultLa + vowels[textAr[u]];
      } else if (textAr[u] && arabicToLatin[textAr[u]]) { // Medial consonant Position
        console.log("16. Medial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
        resultLa = resultLa + arabicToLatin[textAr[u]];
        if (arabicToLatin[textAr[u]] == "l" && vowels[textAr[u-1]] == "a") {// al- 
          console.log("16. Medial consonant al- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1]])
          resultLa = resultLa + "-";
        } else if (arabicToLatin[textAr[u]] == "l" && textAr[u-1] == "ٱ") {// l- 
          console.log("16. Medial consonant l- ", textAr[u] , " : ", arabicToLatin[textAr[u]] , vowels[textAr[u-1]])
          resultLa = resultLa + "-";
        } else if (arabicToLatin[textAr[u]] == "w" && vowels[textAr[u-1]] == "u") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", arabicToLatin[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "ū";
        } 
      } else if (textAr[u] && vowels[textAr[u]]) { // Medial vowel Position
        console.log("17. Medial vowel ", textAr[u] , " : ", vowels[textAr[u]])
        if (vowels[textAr[u]] == "a" && vowels[textAr[u-1]] == "a") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ā";
        } else if (vowels[textAr[u]] == "a" && vowels[textAr[u-1]] == "ʾa") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "ʾā";
        } else if (vowels[textAr[u]] == "a" && shaddaForms.indexOf(textAr[u-1]) > -1) {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ā";
        } else if (vowels[textAr[u]] == "an" && vowels[textAr[u-1]] == "a") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ān";
        } else if (vowels[textAr[u]] == "i" && vowels[textAr[u-1]] == "i") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ī";
        } else if (vowels[textAr[u]] == "i" && vowels[textAr[u-1]] == "ʾi") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "ʾī";
        }  else if (vowels[textAr[u]] == "i" && textAr[u-1] == "ا") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "i";
        } else if (vowels[textAr[u]] == "in" && vowels[textAr[u-1]] == "i") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "īn";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "u") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ū";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "ʾu") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "ʾū";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "ا") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ū";
        } else if (vowels[textAr[u]] == "un" && vowels[textAr[u-1]] == "u") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ūn";
        } else {
          resultLa = resultLa + vowels[textAr[u]];
        }
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

function typeOfTransliterate(type) {
  if (type == 'IJMES') {
    localStorage.setItem("transliterateType", "IJMES");
    /*document.getElementById("clickIJMES").classList.add('currentEncoding');
    document.getElementById("clickDIN").classList.remove('currentEncoding'); */
    localStorage.setItem("languageType","Arabic");
    transliterate();
  } /* else if (type == 'DIN') {
    localStorage.setItem("transliterateType", "DIN");
    document.getElementById("clickDIN").classList.add('currentEncoding');
    document.getElementById("clickIJMES").classList.remove('currentEncoding');
    transliterate();
  } */ else if (localStorage.getItem("transliterateType") == "" || localStorage.getItem("transliterateType") == undefined || localStorage.getItem("transliterateType") == null) {
    localStorage.setItem("transliterateType", "IJMES");
    /* document.getElementById("clickDIN").classList.remove('currentEncoding');
    document.getElementById("clickIJMES").classList.add('currentEncoding'); */
    localStorage.setItem("languageType","Arabic");
    transliterate();
  }
}

function typeOfLanguage(type) {
  if (type == 'Arabic') {
    localStorage.setItem("languageType","Arabic");
    document.getElementById('defaultOpen').innerHTML = 'Arabic';
    transliterate();
  } else if (type == 'Persian') {
    localStorage.setItem("languageType","Persian");
    document.getElementById('defaultOpen').innerHTML = 'Persian';
    transliterate();
  } else if (type == 'OttomanTurkish') {
    localStorage.setItem("languageType","OttomanTurkish");
    document.getElementById('defaultOpen').innerHTML = 'Ottoman-Turkish';
    transliterate();
  } else if (type == 'ModernTurkish') {
    localStorage.setItem("languageType","ModernTurkish");
    document.getElementById('defaultOpen').innerHTML = 'Modern-Turkish';
    transliterate();
  }
}

function vocalised() {
  if (localStorage.getItem("vocalised") == 'NO' || localStorage.getItem("vocalised") == null || localStorage.getItem("vocalised") == undefined) {
    localStorage.setItem("vocalised","YES");
    document.getElementById("vocalised").classList.add('vocalised');
    document.getElementById("vocalised").classList.remove('nonvocalised');
    document.getElementById("vocalised").title = "Vocalised Text in Arabic";
  } else if (localStorage.getItem("vocalised") == 'YES') {
    localStorage.setItem("vocalised","NO");
    document.getElementById("vocalised").classList.add('nonvocalised');
    document.getElementById("vocalised").classList.remove('vocalised');
    document.getElementById("vocalised").title = "Non-vocalised Text in Arabic";
  }
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
  localStorage.setItem("transliterateType", "IJMES");
  localStorage.setItem("languageType","Arabic");
} else if (localStorage.getItem("direction") != "arabic2latin" && localStorage.getItem("direction") != "latin2arabic") {
  localStorage.clear();
}

if (localStorage.getItem("transliterateType") == "" || localStorage.getItem("transliterateType") == undefined || localStorage.getItem("transliterateType") == null || localStorage.getItem("transliterateType") == "IJMES") {
  localStorage.setItem("transliterateType", "IJMES");
  /* document.getElementById("clickIJMES").classList.add('currentEncoding');
  document.getElementById("clickDIN").classList.remove('currentEncoding'); */
  localStorage.setItem("languageType","Arabic");
} else {
  /* document.getElementById("clickDIN").classList.add('currentEncoding');
  document.getElementById("clickIJMES").classList.remove('currentEncoding'); */
}

if (screen.width >= 300 && screen.width <= 500) {
  document.getElementById("Arabic").classList.remove("arabicTabText");
  document.getElementById("Arabic").classList.add("arabicTabSmallScreen");
  document.getElementById("Latin").classList.remove("tabcontent");
  document.getElementById("Latin").classList.add("tabcontentSmallScreen");
  document.getElementById("swapIcon").classList.remove("exchange");
  document.getElementById("swapIcon").classList.add("exchangeSmallScreen");
} else {
  document.getElementById("swapIcon").classList.remove("exchangeSmallScreen");
  document.getElementById("swapIcon").classList.add("exchange");
}
