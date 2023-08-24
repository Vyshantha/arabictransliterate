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

var vocalisedText = "";

  /*  
    - Vocalisation from Latin to Arabic , Arabic (mostly without vocalisation) to be represented back in Latin
    - Ligatures : 'la' varients to be included , Shamzi / Kamar "la" letter combination
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

  // TODO : manage incorrect spaces between words and to create new new-line

  // TODO : Arabic tāʾ marbūṭa is rendered a not ah. In Persian it is ih. In Arabic iḍāfa constructions, it is rendered at: for example, thawrat 14 Tammūz. The Persian izafat is rendered -i: for example, vilāyat-i faqīh."

  /* VALIDATION
    Show 2-forms : ukatību ukātibu uktibu uktiba āktatibu āktabtu āktubu adab
    Mālaqa  , li-Umarāʾ , allāh 
    katābtu maktabatun mayyah
    thumā raḥimān sūʾa ẓaninn zursharīfān 
    shadda mimā fahīm fahāma al-tarjama 
    ainfijār āl-ilhāmu 

    U+0644 + U+0627 != U+FEFB (lam + alef != la ligature) 
  */

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "latin2arabic") {
    let latinToArabic;
    let vowels;
    const latinVowels = ['a','e','i','o','u','y','ā','ē','ī','ō','ū','A','E','I','O','U','Y','Ā','Ē','Ī','Ō','Ū'];

    const textVocalisation = ["\uFE70","\uFE71","\uFE72","\uFE74","\u08F0","\u08F1","\u08F2","\u064C","\u064D","\u064B"," ࣰ","ࣱ","ࣲ","\u064E","\u0618","\uFE76","\uFE77","\u064F","\u0619","\uFE78","\uFE79","\u0650","\uFE7A","\uFE7B","\u061A","◌ٰ","◌ٖ"];
    const shaddaForms = ["\uFC5E","\uFC60","\uFC61","\uFC62","\uFC63","\uFCF2","\uFCF3","\uFCF4","\uFC5F","\u0651","\uFE7D","\uFE7C"];

    const nonjoining = ["ء","ا","آ","د","ذ","ر","ز","و"];

    if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Arabic") {
      const ijmesArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","-":"","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"","P":"","t":"ت","T":"ت","th":"ث","Th":"ث","ch":"","Ch":"","j":"ج","J":"ج","ḥ":"ح","Ḥ":"ح","kh":"خ","Kh":"خ","d":"د","D":"د","dh":"ذ","Dh":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","s":"س","S":"س","sh":"ش","Sh":"ش","ṣ":"ص","Ṣ":"ص","ḍ":"ض","Ḍ":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","gh":"غ","Gh":"غ","f":"ف","F":"ف","q":"ق","Q":"ق","k":"ك","K":"ك","g":"","G":"","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","w":"و","W":"و","y":"ي","Y":"ي","la":"ﻻ","la":"ﻼ"};
      const ijmesArabicVowels = {"a":"ا","A":"ا","i":"ا","I":"ا","u":"ا","U":"ا","ā":"ا","Ā":"ا","āʾ":"ئ","ay":"ای","Ay":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","ʾī":"ئي","ʾĪ":"ئي","iyy":"ّيِ","Iyy":"ّيِ","uvv":"ّوُ","Uvv":"ّوُ","au":"وَ","Au":"وَ","aw":"وَ","Aw":"وَ","ai":"یَ","Ai":"یَ","ay":"یَ","Ay":"یَ","ʾu":"أُ","ʾa":"أَ","ʾā":"آ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};

      // Vocalised Vowels - "a":"\u064E","A":"\u064E","u":"\u064F","U":"\u064F","i":"\u0650","I":"\u0650"
      // Nunation - "in":"\uFE74","In":"\uFE74","un":"\uFE72","Un":"\uFE72","an":"\uFE70","An":"\uFE70"
      // "ū":"ّوُ","Ū":"ّوُ"
      // ā = a + "̄":"ا"

      latinToArabic = ijmesArabic;
      vowels = ijmesArabicVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Persian") {
      const ijmesPersian = {"0":"۰","1":"١","2":"٢","3":"٣","4":"۴","5":"۵","6":"۶","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","-":"","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"پ","P":"پ","t":"ت","T":"ت","s̲":"ث","S̲":"ث","j":"ج","J":"ج","ch":"چ","Ch":"چ","ḥ":"ح","Ḥ":"ح","kh":"خ","Kh":"خ","d":"د","D":"د","z̲":"ذ","Z̲":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","zh":"ژ","Zh":"ژ","s":"س","S":"س","sh":"ش","Sh":"ش","ṣ":"ص","Ṣ":"ص","ż":"ض","Ż":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","gh":"غ","Gh":"غ","f":"ف","F":"ف","q":"ق","Q":"ق","k":"ك","K":"ك","g":"ك","G":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","U":"و","U":"و","y":"ي","Y":"ي"};
      const ijmesPersianVowels = {"a":"ا","A":"ا","i":"ا","I":"ا","u":"ا","U":"ا","ā":"ا","Ā":"ا","āʾ":"ئ","ay":"ای","Ay":"ای","ū":"و","Ū":"و","ī":"ی","Ī":"ی","ʾī":"ئي","ʾĪ":"ئي","iyy":"ّيِ","Iyy":"ّيِ","uvv":"ّوُ","Uvv":"ّوُ","au":"وَ","Au":"وَ","aw":"وَ","Aw":"وَ","ai":"یَ","Ai":"یَ","ay":"یَ","Ay":"یَ","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾī":"ئي","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesPersian;
      vowels = ijmesPersianVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "OttomanTurkish") {
      const ijmesOttomanTurkish = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","-":"","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","ʾ":"ء","b":"ب","B":"ب","p":"پ","P":"پ","t":"ت","T":"ت","s̲":"ث","S̲":"ث","c":"ج","C":"ج","ç":"چ","Ç":"چ","ḥ":"ح","Ḥ":"ح","h":"خ","H":"خ","d":"د","D":"د","z̲":"ذ","Z̲":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","j":"ژ","J":"ژ","s":"س","S":"س","ş":"ش","Ş":"ش","ṣ":"ص","Ṣ":"ص","ż":"ض","Ż":"ض","ṭ":"ط","Ṭ":"ط","ẓ":"ظ","Ẓ":"ظ","ʿ":"ع","g":"غ","G":"غ","ğ":"غ","Ğ":"غ","f":"ف","F":"ف","ḳ":"ق","Ḳ":"ق","k":"ك","K":"ك","ñ":"ك","Ñ":"ك","ğ":"ك","Ğ":"ك","y":"ك","Y":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","y":"ي","Y":"ي"};
      const ijmesOttomanTurkishVowels = {"a":"ا","A":"ا","i":"ا","I":"ا","u":"ا","U":"ا","ā":"ا","Ā":"ا","āʾ":"ئ","ay":"ای","Ay":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","ʾī":"ئي","ʾĪ":"ئي","iy":"ّيِ","Iy":"ّيِ","uvv":"و-ُ","Uvv":"و-ُ","ev":"وَ","Ev":"وَ","ey":"یَ","Ey":"یَ","e":" َ","E":" َ","ü":" ُ","Ü":" ُ","o":" ُ","O":" ُ","ö":" ُ","Ö":" ُ","ı":" ِ","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
      latinToArabic = ijmesOttomanTurkish;
      vowels = ijmesOttomanTurkishVowels;
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "ModernTurkish") {
      const ijmesModernTurkish = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
      ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","-":"","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","b":"ب","B":"ب","p":"پ","b":"ب","P":"پ","B":"ب","t":"ت","T":"ت","s":"ث","S":"ث","c":"ج","C":"ج","ç":"چ","Ç":"چ","ḥ":"ح","Ḥ":"ح","h":"خ","H":"خ","d":"د","D":"د","z":"ذ","Z":"ذ","r":"ر","R":"ر","z":"ز","Z":"ز","j":"ژ","J":"ژ","s":"س","S":"س","ş":"ش","Ş":"ش","s":"ص","S":"ص","z":"ض","Z":"ض","t":"ط","T":"ط","z":"ظ","Z":"ظ","ġ":"غ","ġ":"غ","ğ":"غ","Ğ":"غ","f":"ف","F":"ف","k":"ق","K":"ق","k":"ك","K":"ك","ñ":"ك","Ñ":"ك","ğ":"ك","Ğ":"ك","y":"ك","Y":"ك","g":"گ","G":"گ","l":"ل","L":"ل","m":"م","M":"م","n":"ن","N":"ن","h":"ه","H":"ه","v":"و","V":"و","y":"ي","Y":"ي","ʿ":"","ʾ":""};
      const ijmesModernTurkishVowels = {"a":"ا","A":"ا","i":"ا","I":"ا","u":"ا","U":"ا","ā":"ا","Ā":"ا","āʾ":"ئ","ay":"ای","Ay":"ای","ū":"و","Ū":"و","ī":"ي","Ī":"ي","ʾī":"ئي","ʾĪ":"ئي","iy":"ّيِ","Iy":"ّيِ","uvv":"و-ُ","Uvv":"و-ُ","ev":"وَ","Ev":"وَ","ey":"یَ","Ey":"یَ","e":" َ","E":" َ","ü":" ُ","Ü":" ُ","o":" ُ","O":" ُ","ö":" ُ","Ö":" ُ","ı":" ِ","ʾu":"أُ","ʾa":"أَ","ʾi":"إِ","ʾū":"ئُ","ʾu":"ؤُ","aʾ":"أْ","iʾ":"ئْ","uʾ":"ؤْ"};
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
      if (textLa[u] && (textLa[u].indexOf("\n") > -1 || textLa[u] == "\n" || textLa[u] == "\u000A")) { // New Lines
        resultAr = resultAr + "\n";
      } else if ((textLa[u-2] == " " && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == " " && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == "\n") || (textLa[u-2] == "\n" && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == " " && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined) || (textLa[u-2] == "\n" && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined) || (textLa[u-2] == undefined && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == "\n" && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == "\n") || (textLa[u-2] == undefined && latinToArabic[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined)) { // Isolate Double consonant position 
        console.log("1. Isolate double consonant ", textLa[u], textLa[u+1], latinToArabic[textLa[u] + textLa[u+1]])
        if ((textLa[u] == "a" || textLa[u] == "i" || textLa[u] == "u") && textLa[u+1] == "n") { // Kasratan, Dammatan, Fathatan
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-1]]) > -1 || nonjoining.indexOf(vowels[textLa[u-1]]) > -1) ?  resultAr + "ن" : resultAr + "ـن";
          u = u + 1;
        } else  if (latinToArabic[textLa[u] + textLa[u+1]]) {
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]];
          u = u + 1;
        }
      } else if ((textLa[u-2] == " " && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == " " && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == "\n") || (textLa[u-2] == "\n" && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == " " && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined) || (textLa[u-2] == "\n" && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined) || (textLa[u-2] == undefined && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == " ") || (textLa[u-2] == "\n" && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == "\n") || (textLa[u-2] == undefined && vowels[textLa[u] + textLa[u+1]] && textLa[u+2] == undefined)) { // Isolate Double vowel position 
        console.log("1. Isolate double vowel ",  textLa[u], textLa[u+1], vowels[textLa[u] + textLa[u+1]])
        resultAr = resultAr.slice(0, -1) + vowels[textLa[u] + textLa[u+1]];
      } else if ((textLa[u-1] == " " || textLa[u-1] == undefined || textLa[u-1] == "") && latinToArabic[textLa[u] + textLa[u+1]]) { // Initial Double Character position 
        console.log("2. Initial double consonant ", latinToArabic[textLa[u] + textLa[u+1]])
        resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]]; 
        u = u + 1;
      } else if (textLa[u-1] != " " && textLa[u-1] && latinToArabic[textLa[u-1]] && textLa[u] && textLa[u] != " " && latinToArabic[textLa[u]] && textLa[u+1] == " ") { // Final Double Character position 
        if (textLa[u-1] == textLa[u] && textLa[u] != " ") {
          console.log("3. Final shadda ") 
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u]] + "ّ";
          u = u + 2;
        } else if (latinToArabic[textLa[u]] && textLa[u] == "n" && latinToArabic[textLa[u+1]]) {
          console.log("3. Final double consonant ", latinToArabic[textLa[u-1]], latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]])
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u-1]] + latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]];
          u = u + 1;  // final 'n'
        } else if (latinToArabic[textLa[u]] && textLa[u] != " " && latinToArabic[textLa[u+1]]) {
          console.log("3. Final double consonant ", latinToArabic[textLa[u-1]], latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]])
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u-1]] + latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]];
          u = u + 2;
        }
      } else if (textLa[u] && textLa[u+1] && vowels[textLa[u] + textLa[u+1]] && latinVowels.indexOf(textLa[u] + textLa[u+1]) > -1) { // Vowel Double Character
        console.log("4. Final double vowel ", vowels[textLa[u] + textLa[u+1]])
        resultAr = resultAr.slice(0, -1) + vowels[textLa[u] + textLa[u+1]];
        u = u + 1;
      } else if (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && latinToArabic[textLa[u] + textLa[u+1]]) { // Medial Position Double Character
        if (textLa[u] + textLa[u+1] == "la") {
          console.log("5. Medial double consonant 'la' ", latinToArabic[textLa[u] + textLa[u+1]])
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-1]]) > -1 || nonjoining.indexOf(vowels[textLa[u-1]]) > -1) ? resultAr.slice(0, -1) + "ﻻ" : resultAr.slice(0, -1) + "ﻼ"; // TODO "l":"ال"
        } else if ((textLa[u] + textLa[u+1]) == (textLa[u-2] + textLa[u-1])) {
          console.log("5. Medial double consonant shadda ", latinToArabic[textLa[u] + textLa[u+1]])
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u] + textLa[u+1]] + "ّ";
        } else {
          console.log("5. Medial double consonant ", latinToArabic[textLa[u] + textLa[u+1]])
          resultAr = resultAr + latinToArabic[textLa[u] + textLa[u+1]];
        }
        u = u + 1;
      } else if (textLa[u] && vowels[textLa[u]] && textLa[u-1] && vowels[textLa[u-1] + textLa[u]]) { // Medial Position vowels Character
        console.log("5. Medial double vowels ", vowels[textLa[u-1] + textLa[u]])
        resultAr = resultAr.slice(0, -1) + vowels[textLa[u-1] + textLa[u]];
        //u = u + 1;
      } else if (textLa[u] && textLa[u+1] && textLa[u+2] && vowels[textLa[u] + textLa[u+1] + textLa[u+2]] && latinVowels.indexOf(textLa[u] + textLa[u+1] + textLa[u+2]) > -1) { // Vowel Triple Character
        console.log("6. Medial triple vowel ", vowels[textLa[u] + textLa[u+1] + textLa[u+2]])
        resultAr = resultAr.slice(0, -2) + vowels[textLa[u] + textLa[u+1] + textLa[u+2]];
        u = u + 2;
      } else if ((textLa[u-1] == " " && latinToArabic[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == " " && latinToArabic[textLa[u]] && textLa[u+1] == "\n") || (textLa[u-1] == "\n" && latinToArabic[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == " " && latinToArabic[textLa[u]] && textLa[u+1] == undefined) || (textLa[u-1] == "\n" && latinToArabic[textLa[u]] && textLa[u+1] == undefined) || (textLa[u-1] == undefined && latinToArabic[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == "\n" && latinToArabic[textLa[u]] && textLa[u+1] == "\n") || (textLa[u-1] == undefined && latinToArabic[textLa[u]] && textLa[u+1] == undefined)) { // Isolate Single consonant position 
        console.log("7. Isolate consonant ", latinToArabic[textLa[u]])
        resultAr = resultAr + latinToArabic[textLa[u]];
      } else if ((textLa[u-1] == " " && vowels[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == " " && vowels[textLa[u]] && textLa[u+1] == "\n") || (textLa[u-1] == "\n" && vowels[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == " " && vowels[textLa[u]] && textLa[u+1] == undefined) || (textLa[u-1] == "\n" && vowels[textLa[u]] && textLa[u+1] == undefined) || (textLa[u-1] == undefined && vowels[textLa[u]] && textLa[u+1] == " ") || (textLa[u-1] == "\n" && vowels[textLa[u]] && textLa[u+1] == "\n") || (textLa[u-1] == undefined && vowels[textLa[u]] && textLa[u+1] == undefined)) { // Isolate Single vowel position 
        console.log("7. Isolate vowel ", vowels[textLa[u]])
        resultAr = resultAr + vowels[textLa[u]];
      } else if ((textLa[u-1] == " " || textLa[u-1] == undefined || textLa[u-1] == "") && textLa[u] && textLa[u] != " " && latinToArabic[textLa[u]]) { // Initial Consonant Character position 
        console.log("8. Initial consonant ", latinToArabic[textLa[u]])
        if (textLa[u] == "l" && textLa[u+1] == "-") {
          console.log("8. Initial consonant l- ", latinToArabic[textLa[u]])
          resultAr = resultAr + "ال";
        } else {
          resultAr = resultAr + latinToArabic[textLa[u]];
        }
      } else if ((textLa[u-1] == " " || textLa[u-1] == undefined || textLa[u-1] == "") && textLa[u] && textLa[u] != " " && vowels[textLa[u]]) { // Initial Vowel Character position 
        console.log("8. Initial vowel ", vowels[textLa[u]])
        resultAr = resultAr + vowels[textLa[u]];
      } else if ((textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == " ") || (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == "\n") || (textLa[u] && latinToArabic[textLa[u]] && textLa[u+1] && textLa[u+1] == undefined)) { // Final Consonant Character position 
        if (textLa[u-1] == "a" && latinToArabic[textLa[u]] == "ت") {
          console.log("8. Final consonant ta-marbuta 'at' ", latinToArabic[textLa[u]])
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-1]]) > -1 || nonjoining.indexOf(vowels[textLa[u-1]]) > -1) ? resultAr + "ة" : resultAr + "ـة"; 
          u = u + 1;
        } else if (latinToArabic[textLa[u]] == "ت") {
          console.log("8. Final consonant ta-marbuta 't' ", latinToArabic[textLa[u]])
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-1]]) > -1 || nonjoining.indexOf(vowels[textLa[u-1]]) > -1) ? resultAr + "ة" : resultAr + "ـة"; 
        } else if (latinToArabic[textLa[u]] && latinToArabic[textLa[u+1]]) {
          console.log("8. Final consonant ", latinToArabic[textLa[u]], latinToArabic[textLa[u+1]])
          resultAr = resultAr + latinToArabic[textLa[u]] + latinToArabic[textLa[u+1]]; // TODO OT & MT "ه" is NOT final
        }
      } else if (textLa[u-1] && textLa[u] && textLa[u] != " " && textLa[u+1] != " " && vowels[textLa[u]] && latinVowels.indexOf(textLa[u]) > -1) { // Medial Position Vowel Character
        if ((textLa[u] == "a" || textLa[u] == "u") && textLa[u+1] == "n" && (textLa[u+2] == "" || textLa[u+2] == " " || textLa[u+2] == "\n" || textLa[u+2] == undefined)) { // final nunation position
          console.log("9. Final nunation ", textLa[u], textLa[u+1])
          resultAr = resultAr;
          u = u + 1;
        } else if (textLa[u] != "a" && textLa[u] != "i" && textLa[u] != "u" && textLa[u+1] != " " && textLa[u-1] != "ʾ") { // long-vowel in medial position
          console.log("9. Medial long vowel ", vowels[textLa[u]])
          resultAr = resultAr + vowels[textLa[u]];
        } else if (textLa[u] != "a" && textLa[u] != "i" && textLa[u] != "u" && textLa[u+1] != " " && textLa[u-1] == "ʾ") { // long-vowel in medial position
          console.log("9. Medial long vowel with hamza ", vowels[textLa[u]])
          resultAr = resultAr + vowels[textLa[u-1] + textLa[u]];
        } else if (textLa[u] == "a" && textLa[u-1] == "-") {
          console.log("9. Medial 'la-' after vowel ", vowels[textLa[u]], textLa[u-1])
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-1]]) > -1 || nonjoining.indexOf(vowels[textLa[u-1]]) > -1 || textLa[u-1] == "-") ? resultAr.slice(0, -1) + "ﻻ" : resultAr.slice(0, -1) + "ﻼ";
        } else if (textLa[u] == "a" && textLa[u+1] == "l" && textLa[u+1] == "-" && textLa[u+2] != "ā") {
          console.log("9. Medial 'al' vowel ", vowels[textLa[u]])
          resultAr = resultAr + vowels[textLa[u]];
        }
      } else if (textLa[u-1] && textLa[u] && textLa[u] != " " && latinToArabic[textLa[u]]) { // Medial Position Consonant Character
        if (textLa[u-1] == "-" && textLa[u] == "l") {
          console.log("9. Medial consonant -l- ", latinToArabic[textLa[u]])
          resultAr = resultAr + "ال";
        } else if (textLa[u-1] == textLa[u] && textLa[u] != " ") {
          console.log("3. Medial consonant shadda ") 
          resultAr = resultAr.slice(0, -1) + latinToArabic[textLa[u]] + "ّ";
        } else if (textLa[u] != " ") {
          console.log("9. Medial consonant ", latinToArabic[textLa[u]])
          resultAr = resultAr + latinToArabic[textLa[u]];
        }
      } else if ((textLa[u] && vowels[textLa[u]] && textLa[u+1] && textLa[u+1] == " ") || (textLa[u] && vowels[textLa[u]] && textLa[u+1] && textLa[u+1] == "\n") || (textLa[u] && vowels[textLa[u]] && textLa[u+1] && textLa[u+1] == undefined)) {
        if (textLa[u] == "ī") {
          console.log("10. final ī ", vowels[textLa[u]])
          resultAr = resultAr + vowels[textLa[u]];
        } else if (textLa[u-1] == "y" && textLa[u] == "a") {  // ta marbuta case
          console.log("10. final ta marbuta ", vowels[textLa[u]])
          resultAr = (nonjoining.indexOf(latinToArabic[textLa[u-2]]) > -1) ? resultAr + "ة" : resultAr + "ـة"; 
        } else if (textLa[u] == "ā") {
          console.log("10. final vowel ā ")
          resultAr = resultAr + "ی"; // TODO lā = لا ?
        } else if (textLa[u] != "a" && textLa[u] != "i" && textLa[u] != "u") {
          console.log("10. final vowel ", vowels[textLa[u]])
          resultAr = resultAr + vowels[textLa[u]];
        }
      } else if (latinToArabic[textLa[u]]) {
        console.log("10. Others ", latinToArabic[textLa[u]])
        resultAr = resultAr + latinToArabic[textLa[u]];
      }
    }

    document.getElementById("textarea2").value = resultAr;
    document.getElementById("textarea2").innerHTML = resultAr;
  } else if (localStorage.getItem("direction") == "arabic2latin") {
  
    /* CORRECTIONS
      ﺍِﻧﻔِﺠَﺎﺭ

      رَحِماً  زُرْشَرِيفَاً
        
      لِلْكَرَمْ

      كَذّبَ التَرْجَمة مـَييـَه
    
    */

    // Arabic Unicode EXACT APPEARING letter available in multiple PLANES and that needs to be included in MAPPING 

    let arabicToLatin;
    let ligatures;
    let diacritics;
    let vowels;
    /* 
      const fixedligatures = fixedligatures.json; 
    */

    if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Arabic") {
      const ijmesArabic = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(",
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ﺞ":"j", "ﺠ":"j", "ﺟ":"j", "ﺝ":"j", "ـج":"j", "ـجـ":"j", "جـ":"j", "ج":"j", "ﺚ":"th", "ﺜ":"th", "ﺛ":"th", "ﺙ":"th", "ـث":"th", "ـثـ":"th", "ثـ":"th", "ث":"th", "ﺖ":"t", "ﺘ":"t", "ﺗ":"t", "ﺕ":"t", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ﺐ":"b", "ﺒ":"b", "ﺑ":"b", "ﺏ":"b", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ﺲ":"s", "ﺴ":"s", "ﺳ":"s", "ﺱ":"s", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ﺰ":"z", "ﺯ":"z", "ـز":"z", "ز":"z", "ﺮ":"r", "ﺭ":"r", "ـر":"r", "ر":"r", "ﺬ":"dh", "ﺫ":"dh", "ـذ":"dh", "ذ":"dh", "ﺪ":"d", "ﺩ":"d", "ـد":"d", "د":"d", "ﺦ":"kh", "ﺨ":"kh", "ﺧ":"kh", "ﺥ":"kh", "ـخ":"kh", "ـخـ":"kh", "خـ":"kh", "خ":"kh", "ﺢ":"ḥ", "ﺤ":"ḥ", "ﺣ":"ḥ", "ﺡ":"ḥ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ﻆ":"ẓ", "ﻈ":"ẓ", "ﻇ":"ẓ", "ﻅ":"ẓ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ﻂ":"ṭ", "ﻄ":"ṭ", "ﻃ":"ṭ", "ﻁ":"ṭ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ﺾ":"ḍ", "ﻀ":"ḍ", "ﺿ":"ḍ", "ﺽ":"ḍ", "ـض":"ḍ", "ـضـ":"ḍ", "ضـ":"ḍ", "ض":"ḍ", "ﺺ":"ṣ", "ﺼ":"ṣ", "ﺻ":"ṣ", "ﺹ":"ṣ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ﺶ":"sh", "ﺸ":"sh", "ﺷ":"sh", "ﺵ":"sh", "ـش":"sh", "ـشـ":"sh", "شـ":"sh", "ش":"sh", "ﻚ":"k", "ﻜ":"k", "ﻛ":"k", "ﻙ":"k", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ﻖ":"q", "ﻘ":"q", "ﻗ":"q", "ﻕ":"q", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ﻒ":"f", "ﻔ":"f", "ﻓ":"f", "ﻑ":"f", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ﻎ":"gh", "ﻐ":"gh", "ﻏ":"gh", "ﻍ":"gh", "ـغ":"gh", "ـغـ":"gh", "غـ":"gh", "غ":"gh", "ﻊ":"ʿ", "ﻌ":"ʿ", "ﻋ":"ʿ", "ﻉ":"ʿ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ﻱ":"y", "ﻴ":"y", "ﻳ":"y", "ﻱ":"y", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ﮮ":"ī", "ﮯ":"ī", "ے":"ī", "ﻮ":"w", "ﻭ":"w", "ـو":"w", "و":"w", "ﻪ":"h", "ﻬ":"h", "ﻫ":"h", "ﻩ":"h", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ﻦ":"n", "ﻨ":"n", "ﻧ":"n", "ﻥ":"n", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ﻢ":"m", "ﻤ":"m", "ﻣ":"m", "ﻡ":"m", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ﻞ":"l", "ﻠ":"l", "ﻟ":"l", "ﻝ":"l", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ﺀ": "ʾ", "ء": "ʾ", "ﺔ":"t", "ﺓ":"a", "ـة":"t", "ة":"a", "پ":"", "ﭖ":"", "چ":"", "ﭺ":"", "ژ":"", "ﮊ":"", "گ":"", "ﮒ":"", "ال":"al-"}; 
      // TODO  "ال":"al-" and  "ال":"-l-" 
      // TODO "ة" : "at", "ة":"h" , "ة":"a"
      arabicToLatin = ijmesArabic;
      const ijmesArabicVowels = {"ا":"a","ﺎ":"a","ﺍ":"a","ﴼ":"ā","ﴽ":"ā","ای":"ā","ﻭ":"u","و":"ū","ﻱ":"ī","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"u","أَ":"a","إِ":"i","ئُ":"ū","ئِ":"i","ـئ":"i","ـئـ":"i","ئـ":"i","ئ":"i","ـؤ":"u","ؤ":"u","ـإ":"i","إ":"i","ٵ":"a","ـأ":"a","أ":"a","ـآ":"ā","آ":"ā","ـى":"y","ـىـ":"y","ىـ":"ā","ى":"y","ؤُ":"u","أْ":"a","ئْ":"i","ؤْ":"u","ﱝ":"","ﲐ":"","ٔ":"ʾ","ٕ":"ʾ"}; // TODO Reading Flow only then required "أُ":"ʾu","أَ":"ʾa","إِ":"ʾi"
      vowels = ijmesArabicVowels;
      diacritics = [];
      ligatures = {"ﻻ":"la","ﻼ":"la","لأ":"laʾ","لْأ":"laʾ","ﻶ":"lā","ﻸ":"laʾ","ﻹ":"laʾ","ﻺ":"laʾ"};
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "Persian") {
      const ijmesPersian = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ﺞ":"j", "ﺠ":"j", "ﺟ":"j", "ﺝ":"j", "ـج":"j", "ـجـ":"j", "جـ":"j", "ج":"j", "ﺚ":"s̲", "ﺜ":"s̲", "ﺛ":"s̲", "ﺙ":"s̲", "ـث":"s̲", "ـثـ":"s̲", "ثـ":"s̲", "ث":"s̲", "ﺖ":"t", "ﺘ":"t", "ﺗ":"t", "ﺕ":"t", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t",  "ﭗ":"p", "ﭙ": "p", "ﭘ": "p", "ﭖ":"p", "ـپ":"p", "ـپـ": "p", "پـ": "p", "پ":"p", "ﺐ":"b", "ﺒ":"b", "ﺑ":"b", "ﺏ":"b", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ﺲ":"s", "ﺴ":"s", "ﺳ":"s", "ﺱ":"s", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ﮋ":"zh", "ﮊ":"zh", "ـژ":"zh", "ژ":"zh", "ﺰ":"z", "ﺯ":"z", "ـز":"z", "ز":"z", "ﺮ":"r", "ﺭ":"r", "ـر":"r", "ر":"r", "ﺬ":"z̲", "ﺫ":"z̲", "ـذ":"z̲", "ذ":"z̲", "ﺪ":"d", "ﺩ":"d", "ـد":"d", "د":"d", "ﺦ":"kh", "ﺨ":"kh", "ﺧ":"kh", "ﺥ":"kh", "ـخ":"kh", "ـخـ":"kh", "خـ":"kh", "خ":"kh", "ﺢ":"ḥ", "ﺤ":"ḥ", "ﺣ":"ḥ", "ﺡ":"ḥ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ﭻ":"ch", "ﭽ":"ch", "ﭼ":"ch", "ﭺ":"ch", "ـچ":"ch", "ـچـ":"ch", "چـ":"ch", "چ":"ch", "ﻆ":"ẓ", "ﻈ":"ẓ", "ﻇ":"ẓ", "ﻅ":"ẓ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ﻂ":"ṭ", "ﻄ":"ṭ", "ﻃ":"ṭ", "ﻁ":"ṭ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ﺾ":"ż", "ﻀ":"ż", "ﺿ":"ż", "ﺽ":"ż", "ـض":"ż", "ـضـ":"ż", "ضـ":"ż", "ض":"ż", 
      "ﺺ":"ṣ", "ﺼ":"ṣ", "ﺻ":"ṣ", "ﺹ":"ṣ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ﺶ":"sh", "ﺸ":"sh", "ﺷ":"sh", "ﺵ":"sh", "ـش":"sh", "ـشـ":"sh", "شـ":"sh", "ش":"sh", "ﮓ":"g", "ﮕ":"g", "ﮔ": "g", "ﮒ":"g", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", "ﻚ":"g", "ﻜ":"g", "ﻛ":"g", "ﻙ":"g", "ـڪ":"g", "ـکـ":"g", "كـ":"g", "ڪـ":"g", "ڪ":"g", "ك":"g", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ﻖ":"q", "ﻘ":"q", "ﻗ":"q", "ﻕ":"q", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ﻒ":"f", "ﻔ":"f", "ﻓ":"f", "ﻑ":"f", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ﻎ":"gh", "ﻐ":"gh", "ﻏ":"gh", "ﻍ":"gh", "ـغ":"gh", "ـغـ":"gh", "غـ":"gh", "غ":"gh", "ﻊ":"ʿ", "ﻌ":"ʿ", "ﻋ":"ʿ", "ﻉ":"ʿ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ﻱ":"y", "ﻴ":"y", "ﻳ":"y", "ﻱ":"y", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ﮮ":"ī", "ﮯ":"ī", "ے":"ī", "ﻮ":"u", "ﻭ":"u", "ـو":"u", "و":"u", "ﻮ":"v", "ﻭ":"v", "ـو":"v", "و":"v", "ﻪ":"h", "ﻬ":"h", "ﻫ":"h", "ﻩ":"h", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ﻦ":"n", "ﻨ":"n", "ﻧ":"n", "ﻥ":"n", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ﻢ":"m", "ﻤ":"m", "ﻣ":"m", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ﻞ":"l", "ﻠ":"l", "ﻟ":"l", "ﻝ":"l", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ﺀ": "ʾ", "ء": "ʾ", "ﺔ":"ih", "ﺓ":"a", "ـة":"ih", "ة":"a", "ال":"al-"};
      arabicToLatin = ijmesPersian;
      const ijmesPersianVowels = {"ا":"a","ا":"ā","ای":"ā","ﻭ":"u","و":"ū","ﻱ":"ī","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"y","ـىـ":"y","ىـ":"y","ى":"y","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesPersianVowels;
      diacritics = [];
      ligatures = [];
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "OttomanTurkish") {
      const ijmesOttomanTurkish = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", 
      "ﺞ":"c", "ﺠ":"c", "ﺟ":"c", "ﺝ":"c", "ـج":"c", "ـجـ":"c", "جـ":"c", "ج":"c", "ﺚ":"s̲", "ﺜ":"s̲", "ﺛ":"s̲", "ﺙ":"s̲", "ـث":"s̲", "ـثـ":"s̲", "ثـ":"s̲", "ث":"s̲", "ﺖ":"t", "ﺘ":"t", "ﺗ":"t", "ﺕ":"t", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ﭗ":"p", "ﭙ": "p", "ﭘ": "p", "ﭖ":"p", "ـپ":"p", "ـپـ": "p", "پـ": "p", "پ":"p", "ﺐ":"b", "ﺒ":"b", "ﺑ":"b", "ﺏ":"b", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ﺲ":"s", "ﺴ":"s", "ﺳ":"s", "ﺱ":"s", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ﮋ":"j", "ﮊ":"j", "ـژ":"j", "ژ":"j", "ﺰ":"z", "ﺯ":"z", "ـز":"z", "ز":"z", "ﺮ":"r", "ﺭ":"r", "ـر":"r", "ر":"r", "ﺬ":"z̲", "ﺫ":"z̲", "ـذ":"z̲", "ذ":"z̲", "ﺪ":"d", "ﺩ":"d", "ـد":"d", "د":"d", "ﺦ":"h", "ﺨ":"h", "ﺧ":"h", "ﺥ":"h", "ـخ":"h", "ـخـ":"h", "خـ":"h", "خ":"h", "ﺢ":"ḥ", "ﺤ":"ḥ", "ﺣ":"ḥ", "ﺡ":"ḥ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ﭻ":"ç", "ﭽ":"ç", "ﭼ":"ç", "ﭺ":"ç", "ـچ":"ç", "ـچـ":"ç","چـ":"ç", "چ":"ç", "ﻆ":"ẓ", "ﻈ":"ẓ", "ﻇ":"ẓ", "ﻅ":"ẓ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ﻂ":"ṭ", "ﻄ":"ṭ", "ﻃ":"ṭ", "ﻁ":"ṭ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ﺾ":"ż", "ﻀ":"ż", "ﺿ":"ż", "ﺽ":"ż", "ـض":"ż", "ـضـ":"ż", "ضـ":"ż", "ض":"ż", "ﺺ":"ṣ", "ﺼ":"ṣ", "ﺻ":"ṣ", "ﺹ":"ṣ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ﺶ":"ş", "ﺸ":"ş", "ﺷ":"ş", "ﺵ":"ş", "ـش":"ş", "ـشـ":"ş", "شـ":"ş", "ش":"ş", 
      "ﮓ":"g", "ﮕ":"g", "ﮔ": "g", "ﮒ":"g", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", "ﻚ":"ğ", "ﻜ":"ğ", "ﻛ":"ğ", "ﻙ":"ğ", "ـك":"ğ", "ـڪ":"ğ", "ـکـ":"ğ", "كـ":"ğ", "ڪـ":"ğ", "ڪ":"ğ", "ك":"ğ", "ﻚ":"y", "ﻜ":"y", "ﻛ":"y", "ﻙ":"y", "ـك":"y", "ـڪ":"y", "ـکـ":"y", "كـ":"y", "ڪـ":"y", "ڪ":"y", "ك":"y", "ﻚ":"ñ", "ﻜ":"ñ", "ﻛ":"ñ", "ﻙ":"ñ", "ـك":"ñ", "ـڪ":"ñ", "ـکـ":"ñ", "كـ":"ñ", "ڪـ":"ñ", "ڪ":"ñ", "ك":"ñ",  "ﻚ":"k", "ﻜ":"k", "ﻛ":"k", "ﻙ":"k", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ﻖ":"ḳ", "ﻘ":"ḳ", "ﻗ":"ḳ", "ﻕ":"ḳ", "ـق":"ḳ", "ـقـ":"ḳ", "قـ":"ḳ", "ق":"ḳ", "ﻒ":"f", "ﻔ":"f", "ﻓ":"f", "ﻑ":"f", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ﻎ":"ğ", "ﻐ":"ğ", "ﻏ":"ğ", "ﻍ":"ğ", "ـغ":"ğ", "ـغـ":"ğ", "غـ":"ğ", "غ":"ğ", "ﻎ":"g", "ﻐ":"g", "ﻏ":"g", "ﻍ":"g", "ـغ":"g", "ـغـ":"g", "غـ":"g", "غ":"g", "ﻊ":"ʿ", "ﻌ":"ʿ", "ﻋ":"ʿ", "ﻉ":"ʿ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ﻱ":"y", "ﻴ":"y", "ﻳ":"y", "ﻱ":"y", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ﮮ":"ī", "ﮯ":"ī", "ے":"ī", "ﻮ":"v", "ﻭ":"v", "ـو":"v", "و":"v", "ﻪ":"h", "ﻬ":"h", "ﻫ":"h", "ﻩ":"h", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ﻦ":"n", "ﻨ":"n", "ﻧ":"n", "ﻥ":"n", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ﻢ":"m", "ﻤ":"m", "ﻣ":"m", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ﻞ":"l", "ﻠ":"l", "ﻟ":"l", "ﻝ":"l", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "ﺀ": "ʾ","ء": "ʾ", "ﺔ":"t", "ﺓ":"a", "ـة":"t", "ة":"a", "ال":"al-", 
      "\u066B":".", "٬":"," };
      arabicToLatin = ijmesOttomanTurkish;
      const ijmesOttomanTurkishVowels = {"ا":"a","ا":"ā","ای":"ā","ﻭ":"ū","و":"ū","ﻱ":"ī","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"y","ـىـ":"y","ىـ":"y","ى":"y","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesOttomanTurkishVowels;
      diacritics = [];
      ligatures = [];
    } else if (localStorage.getItem("transliterateType") == "IJMES" && localStorage.getItem("languageType") == "ModernTurkish") {
      const ijmesModernTurkish = {" ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", 
      "٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", 
      "ﺞ":"c", "ﺠ":"c", "ﺟ":"c", "ﺝ":"c", "ـج":"c", "ـجـ":"c", "جـ":"c", "ج":"c", "ﺚ":"s", "ﺜ":"s", "ﺛ":"s", "ﺙ":"s", "ـث":"s", "ـثـ":"s", "ثـ":"s", "ث":"s", "ﺖ":"t", "ﺘ":"t", "ﺗ":"t", "ﺕ":"t", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ﭗ":"p", "ﭙ": "p", "ﭘ": "p", "ﭖ":"p", "ـپ":"p", "ـپـ": "p", "پـ": "p", "پ":"p", "ﺐ":"b", "ﺒ":"b", "ﺑ":"b", "ﺏ":"b", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ﺐ":"p", "ﺒ":"p", "ﺑ":"p", "ﺏ":"p", "ـب":"p", "ـبـ":"p", "بـ":"p", "ب":"p", "ﺲ":"s", "ﺴ":"s", "ﺳ":"s", "ﺱ":"s", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ﮋ":"j", "ﮊ":"j", "ـژ":"j", "ژ":"j", "ﺰ":"z", "ﺯ":"z", "ـز":"z", "ز":"z", "ﺮ":"r", "ﺭ":"r", "ـر":"r", "ر":"r", "ﺬ":"z", "ﺫ":"z", "ـذ":"z", "ذ":"z", "ﺪ":"d", "ﺩ":"d", "ـد":"d", "د":"d", "ﺦ":"h", "ﺨ":"h", "ﺧ":"h", "ﺥ":"h", "ـخ":"h", "ـخـ":"h", "خـ":"h", "خ":"h", "ﺢ":"ḥ", "ﺤ":"ḥ", "ﺣ":"ḥ", "ﺡ":"ḥ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ﭻ":"ç", "ﭽ":"ç", "ﭼ":"ç", "ﭺ":"ç", "ـچ":"ç", "ـچـ":"ç", "چـ":"ç", "چ":"ç", "ﻆ":"z", "ﻈ":"z", "ﻇ":"z", "ﻅ":"z", "ـظ":"z", "ـظـ":"z", "ظـ":"z", "ظ":"z", "ﻂ":"t", "ﻄ":"t", "ﻃ":"t", "ﻁ":"t", "ـط":"t", "ـطـ":"t", "طـ":"t", "ط":"t", "ﺾ":"z", "ﻀ":"z", "ﺿ":"z", "ﺽ":"z", "ـض":"z", "ـضـ":"z", "ضـ":"z", "ض":"z", "ﺺ":"ṣ", "ﺼ":"ṣ", "ﺻ":"ṣ", "ﺹ":"ṣ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ﺶ":"ş", "ﺸ":"ş", "ﺷ":"ş", "ﺵ":"ş", "ـش":"ş", "ـشـ":"ş", "شـ":"ş", "ش":"ş", "ﮓ":"g", "ﮕ":"g", "ﮔ": "g", "ﮒ":"g", "ـگ":"g", "ـگـ":"g", "گـ": "g", "گ":"g", 
      "ﻚ":"ğ", "ﻜ":"ğ", "ﻛ":"ğ", "ﻙ":"ğ", "ـك":"ğ", "ـڪ":"ğ", "ـکـ":"ğ", "كـ":"ğ", "ڪـ":"ğ", "ڪ":"ğ", "ك":"ğ", "ﻚ":"y", "ﻜ":"y", "ﻛ":"y", "ﻙ":"y", "ـك":"y", "ـڪ":"y", "ـکـ":"y", "كـ":"y", "ڪـ":"y", "ڪ":"y", "ك":"y", "ﻚ":"n", "ﻜ":"n", "ﻛ":"n", "ﻙ":"n", "ـك":"n", "ـڪ":"n", "ـکـ":"n", "كـ":"n", "ڪـ":"n", "ڪ":"n", "ك":"n", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ﻖ":"k", "ﻘ":"k", "ﻗ":"k", "ﻕ":"k", "ـق":"k", "ـقـ":"k", "قـ":"k", "ق":"k", "ﻒ":"f", "ﻔ":"f", "ﻓ":"f", "ﻑ":"f", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ﻎ":"ğ", "ﻐ":"ğ", "ﻏ":"ğ", "ﻍ":"ğ", "ـغ":"ğ", "ـغـ":"ğ", "غـ":"ğ", "غ":"ğ", "ﻎ":"g", "ﻐ":"g", "ﻏ":"g", "ﻍ":"g", "ـغ":"ġ", "ـغـ":"ġ", "غـ":"ġ", "غ":"ġ", "ﻱ":"y", "ﻴ":"y", "ﻳ":"y", "ﻱ":"y", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ﮮ":"ī", "ﮯ":"ī", "ے":"ī", "ﻮ":"v", "ﻭ":"v", "ـو":"v", "و":"v", "ﻪ":"h", "ﻬ":"h", "ﻫ":"h", "ﻩ":"h", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ﻦ":"n", "ﻨ":"n", "ﻧ":"n", "ﻥ":"n", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ﻢ":"m", "ﻤ":"m", "ﻣ":"m", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ﻞ":"l", "ﻠ":"l", "ﻟ":"l", "ﻝ":"l", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ﺔ":"t", "ﺓ":"a", "ـة":"t", "ة":"a", "ﻉ":"", "ع":"", "ال":"al-"};
      arabicToLatin = ijmesModernTurkish;
      const ijmesModernTurkishVowels = {"ا":"a","ا":"ā","ای":"ā","ﻭ":"ū","و":"ū","ﻱ":"ī","ي":"ī","ّيِ":"iyy","ّيِ":"ī","ّوُ":"uvv","ّوُ":"ū","وَ":"au","وَ":"aw","یَ":"ai","یَ":"ay","\u064E":"a","\u0618":"a","\uFE76":"a","\uFE77":"a","\u064F":"u","\u0619":"u","\uFE78":"u","\uFE79":"u","\u0650":"i","\u061A":"i","\uFE7A":"i","\uFE7B":"i","ا َ":"ā","ا ُ":"ū","ا ِ":"ī","\uFE74":"in","\u08F2":"in","\u064D":"in","\uFE72":"un","\u08F1":"un","\u064C":"un","\uFE70":"an","\uFE71":"an","\u08F0":"an","\u064B":"an","أُ":"ʾu","أَ":"ʾa","إِ":"ʾi","ئُ":"ʾū","ـئ":"ʾi","ـئـ":"ʾi","ئـ":"ʾi","ئ":"ʾi","ـؤ":"ʾu","ؤ":"ʾu","ـإ":"ʾi","إ":"ʾi","ـأ":"ʾa","أ":"ʾa","ـآ":"ā","آ":"ā","ـى":"y","ـىـ":"y","ىـ":"y","ى":"y","ؤُ":"ʾu","أْ":"aʾ","ئْ":"iʾ","ؤْ":"uʾ","ٔ":"ʾ","ٕ":"ʾ"};
      vowels = ijmesModernTurkishVowels;
      diacritics = [];
      ligatures = [];
    }
    /*  else if (localStorage.getItem("transliterateType") == "DIN") {
      const dinTransliterate = { " ": " ", ",": ",", ";": ";", "?": "?", "!": "!", "\"": "\"", "'": "'", "(": "(", ")": ")", ":": ":", "+": "+", "=": "=", "/": "/", "-": "-", "<": "<", ">": ">", "*": "*", "|": "|", "\\": "\\", "﷼": "€", "{": "{", "}": "}", "[": "[", "]": "]", "_": "_", "%": "%", "@": "@", "ˆ": "ˆ", "`": "`", "´": "´", "˜": "˜", "·": "·", "˙": "˙", "¯": "¯", "¨": "¨", "˚": "˚", "˝": "˝", "ˇ": "ˇ", "¸": "¸", "˛": "˛", "˘": "˘", "’": "’", "،":",", "؍":"/", "؎":"§", "؏":"", "؛":";", "؞":":", "؟":"?", "٭":"*", "۔":".", "۝":"", "۞":"", "۩":"", "۽":"", "﴾":")", "﴿":"(", "۹":"9", "٩":"9", "۹":"9", "۹":"9", "۸":"8", "٨":"8", "۸":"8", "۸":"8", "۷":"7", "٧":"7", "۷":"7", "۷":"7", "٦":"6", "٦":"6", "۶":"6", "۶":"6", "٥":"5", "٥":"5", "۵":"5", "۵":"5", "٤":"4", "٤":"4", "۴":"4", "۴":"4", "۳":"3", "۳":"3", "٣":"3", "۳":"3", "۲":"2", "٢":"2", "۲":"2", "۲":"2", "۱":"1", "١":"1", "۱":"1", "۱":"1", "٠":"0", "۰":"0", "۰":"0", "۰":"0", "٪":"%", "؆": "∛", "؇":"∜", "؉":"‰", "؊":"‱", "ـج":"ǧ", "ـجـ":"ǧ", "جـ":"ǧ", "ج":"ǧ", "ـث":"ṯ", "ـثـ":"ṯ", "ثـ":"ṯ", "ث":"ṯ", "ـت":"t", "ـتـ":"t", "تـ":"t", "ت":"t", "ـب":"b", "ـبـ":"b", "بـ":"b", "ب":"b", "ـا":"ā", "ا":"ā", "ـس":"s", "ـسـ":"s", "سـ":"s", "س":"s", "ـز":"z", "ز":"z", "ـر":"r", "ر":"r", "ـذ":"ḏ", "ذ":"ḏ", "ـد":"d", "د":"d", "ـخ":"ḫ", "ـخـ":"ḫ", "خـ":"ḫ", "خ":"ḫ", "ـح":"ḥ", "ـحـ":"ḥ", "حـ":"ḥ", "ح":"ḥ", "ـظ":"ẓ", "ـظـ":"ẓ", "ظـ":"ẓ", "ظ":"ẓ", "ـط":"ṭ", "ـطـ":"ṭ", "طـ":"ṭ", "ط":"ṭ", "ـض":"ḍ", "ـضـ":"ḍ", "ضـ":"ḍ", "ض":"ḍ", "ـص":"ṣ", "ـصـ":"ṣ", "صـ":"ṣ", "ص":"ṣ", "ـش":"š", "ـشـ":"š", "شـ":"š", "ش":"š", "ـك":"k", "ـڪ":"k", "ـکـ":"k", "كـ":"k", "ڪـ":"k", "ڪ":"k", "ك":"k", "ـق":"q", "ـقـ":"q", "قـ":"q", "ق":"q", "ـف":"f", "ـفـ":"f", "فـ":"f", "ف":"f", "ـغ":"ġ", "ـغـ":"ġ", "غـ":"ġ", "غ":"ġ", "ـع":"ʿ", "ـعـ":"ʿ", "عـ":"ʿ", "ع":"ʿ", "ـے":"ī", "ـي":"y", "ـيـ":"y", "يـ":"y", "ي":"y", "ے":"ī", "ـو":"w", "و":"w", "ـه":"h", "ـهـ":"h", "هـ":"h", "ه":"h", "ـن":"n", "ـنـ":"n", "نـ":"n", "ن":"n", "ـم":"m", "ـمـ":"m", "مـ":"m", "م":"m", "ـل":"l", "ـلـ":"l", "لـ":"l", "ل":"l", "\u066B":".", "٬":",", "ـئ":"ʾ", "ـئـ":"ʾ", "ئـ":"ʾ", "ئ":"ʾ", "ـؤ":"ʾ", "ؤ":"ʾ", "ـإ":"ʾ", "إ":"ʾ", "ـأ":"ʾ", "أ":"ʾ", "ء": "ʾ", "ـى":"y", "ـىـ":"y", "ىـ":"y", "ى":"y", "ـة":"ta", "ة":"ta", "ـآ":"ā", "آ":"ā", "۽":"", "۾":"", "ۿ":"" };
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
      if (textAr[u].indexOf("\n") > -1) {
        resultLa = resultLa + "\n";
      } else if (textAr[u] && diacritics[textAr[u]]) {
        console.log("1. Diacritic ", textAr[u], " : " , diacritics[textAr[u]] )
        resultLa = resultLa + diacritics[textAr[u]];
      } else if (textAr[u] && ligatures[textAr[u]]) {
        console.log("2. Ligature ", textAr[u], " : " , ligatures[textAr[u]] )
        resultLa = resultLa + ligatures[textAr[u]];
      } else if (textAr[u] && shaddaForms.indexOf(textAr[u]) > -1) { // Shadda rules
          /* if (vowels[textAr[u-1]] == "a" && !arabicToLatin[textAr[u-1]]) {
            console.log("3. Shadda - a long ", textAr[u], vowels[textAr[u-1]])
            resultLa = resultLa.slice(0, -1) + "ā"; 
          } else if (vowels[textAr[u-1]] == "i" && !arabicToLatin[textAr[u-1]]) {
            console.log("3. Shadda - i long ", textAr[u], vowels[textAr[u-1]])
            resultLa = resultLa.slice(0, -1) + "ī"; 
          } else if (vowels[textAr[u-1]] == "u" && !arabicToLatin[textAr[u-1]]) {
            console.log("3. Shadda - u long ", textAr[u], vowels[textAr[u-1]])
            resultLa = resultLa.slice(0, -1) + "ū"; 
          } else */
          if (textVocalisation.indexOf(textAr[u-1]) > -1 && !arabicToLatin[textAr[u-1]] && vowels[textAr[u-1]] != "a" && vowels[textAr[u-1]] != "i" && vowels[textAr[u-1]] != "u") {
            console.log("3. Shadda - vocalised ", textAr[u], textVocalisation.indexOf(textAr[u-1]))
            resultLa = resultLa + resultLa[resultLa.length - 1];
          } else if (arabicToLatin[textAr[u-1]] && arabicToLatin[textAr[u-1]].length == 2) {
            console.log("3. Shadda 2-consonant - ", textAr[u], arabicToLatin[textAr[u-1] + textAr[u-2]])
            resultLa = resultLa + resultLa[resultLa.length - 2] + resultLa[resultLa.length - 1]; 
          } else if (arabicToLatin[textAr[u-1]] && arabicToLatin[textAr[u-1]].length == 1) {
            console.log("3. Shadda 1-consonant - ", textAr[u], arabicToLatin[textAr[u-1]])
            resultLa = resultLa + resultLa[resultLa.length - 1]; 
          } else {
            console.log("3. Shadda - ", textAr[u], arabicToLatin[textAr[u-1]])
            resultLa = resultLa.slice(0, -1) + resultLa[resultLa.length - 2] + resultLa[resultLa.length - 1]; 
          }
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
      } else if (textAr[u] && textAr[u-1] == " " && arabicToLatin[textAr[u]]) { // Initial consonant position 
        console.log("12. Initial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
        resultLa = resultLa + arabicToLatin[textAr[u]]; // TODO Capitalisation of Letter
      } else if (textAr[u] && textAr[u-1] == " " && vowels[textAr[u]]) { // Initial vowel position 
        console.log("13. Initial vowel ", textAr[u] , " : ", vowels[textAr[u]])
        resultLa = resultLa + vowels[textAr[u]]; // TODO Capitalisation of Letter
      } else if ((textAr[u-1] == " " && textAr[u] && arabicToLatin[textAr[u]]) || (textAr[u-1] == "\n" && textAr[u] && arabicToLatin[textAr[u]]) || (textAr[u-1] == undefined && textAr[u] && arabicToLatin[textAr[u]])) { // Final consonant position 
        if (textAr[u] == "ـة" || textAr[u] == "ﺔ" || textAr[u] == "ﺓ" || textAr[u] == "ة") {
          console.log("14. Final consonant - constructus modus ", textAr[u])
          resultLa = resultLa + "a"; 
        } else {
          console.log("14. Final consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
          resultLa = resultLa + arabicToLatin[textAr[u]]; // TODO OT & MT "ه" is NOT final
        }
      } else if ((textAr[u-1] == " " && textAr[u] && vowels[textAr[u]]) || (textAr[u-1] == "\n" && textAr[u] && vowels[textAr[u]]) || (textAr[u-1] == undefined && textAr[u] && vowels[textAr[u]])) { // Final vowel position 
        console.log("15. Final vowel ", textAr[u] , " : ", vowels[textAr[u]])
        resultLa = resultLa + vowels[textAr[u]];
      } else if (textAr[u] && arabicToLatin[textAr[u]]) { // Medial consonant Position
        console.log("16. Medial consonant ", textAr[u] , " : ", arabicToLatin[textAr[u]])
        if ((textAr[u] == "ﺓ" || textAr[u] == "ة") && textAr[u+1] != " " && textAr[u+1] != "\n" && textAr[u+1] != undefined) {
          console.log("16. Medial consonant - constructus modus ", textAr[u])
          resultLa = resultLa + "t"; 
        } else if ((textAr[u] == "ﺓ" || textAr[u] == "ة") && vowels[textAr[u-1]] != "a") {
          console.log("16. Medial consonant - constructus modus ", textAr[u])
          resultLa = resultLa + "a"; 
        } else if ((textAr[u] == "ﺓ" || textAr[u] == "ة") && vowels[textAr[u-1]] == "a") {
          console.log("16. Medial consonant - constructus modus ", textAr[u])
          resultLa = resultLa.slice(0, -1) + "ā"; 
        } else if (arabicToLatin[textAr[u]] == "y" && vowels[textAr[u-1]] == "i") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ī";
        } else {
          resultLa = resultLa + arabicToLatin[textAr[u]];
        }
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

        // TODO 3 character vowels and long vowels : إِ followed by ي = ī
        // ءُ followed by و = ū or ئِ followed by ي = ī or أُ followed by و = ū 
        // ا َ followed by ءْ = ā

        if (vowels[textAr[u]] == "a" && vowels[textAr[u-1]] == "a" && (textAr[u-1] + textAr[u]) != "أَ" && (textAr[u-1] + textAr[u]) != "ﺍَ") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ā";
        } else if (vowels[textAr[u]] == "a" && vowels[textAr[u-1]] == "a" && ((textAr[u-1] + textAr[u]) == "ﺍَ" || (textAr[u-1] + textAr[u]) == "أَ")) {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa;
        } else if (vowels[textAr[u]] == "a" && vowels[textAr[u-1]] == "ʾa") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "a"; // TODO Reading Flow only then ʾā 
        } else if (vowels[textAr[u]] == "a" && shaddaForms.indexOf(textAr[u-1]) > -1) {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ā";
        } else if (vowels[textAr[u]] == "an" && vowels[textAr[u-1]] == "a") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ān";
        } else if (vowels[textAr[u]] == "ā" && vowels[textAr[u-1]] == "a") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ā";
        } else if (vowels[textAr[u]] == "i" && vowels[textAr[u-1]] == "i") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ī";
        } else if (vowels[textAr[u]] == "i" && vowels[textAr[u-1]] == "ʾi") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "ʾī";
        } else if (vowels[textAr[u]] == "i" && textAr[u-1] == "ا") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "i";
        } else if (vowels[textAr[u]] == "in" && vowels[textAr[u-1]] == "i") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "īn";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "u") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "ū";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "a") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -1) + "u";
        } else if (vowels[textAr[u]] == "u" && vowels[textAr[u-1]] == "ʾa") {
          console.log("17. Medial vowel long ", textAr[u] , " : ", vowels[textAr[u]], " : ", vowels[textAr[u-1]])
          resultLa = resultLa.slice(0, -2) + "u";
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
    document.getElementById("arabicTab").innerText = "الْعَرَبِيَّة";
    document.getElementById("textarea2").value = vocalisedText;
  } else if (localStorage.getItem("vocalised") == 'YES') {
    localStorage.setItem("vocalised","NO");
    document.getElementById("vocalised").classList.add('nonvocalised');
    document.getElementById("vocalised").classList.remove('vocalised');
    document.getElementById("vocalised").title = "Non-vocalised Text in Arabic";
    document.getElementById("arabicTab").innerText = "العربية";
    vocalisedText = document.getElementById("textarea2").value;
    document.getElementById("textarea2").value = document.getElementById("textarea2").value.replaceAll("\uFE70","").replaceAll("\uFE71","").replaceAll("\uFE72","").replaceAll("\uFE74","").replaceAll("\u08F0","").replaceAll("\u08F1","").replaceAll("\u08F2","").replaceAll("\u064C","").replaceAll("\u064D","").replaceAll("\u064B","").replaceAll("\u08F0","").replaceAll("\u08F1","").replaceAll("\u08F2","").replaceAll("\u064E","").replaceAll("\u0618","").replaceAll("\uFE76","").replaceAll("\uFE77","").replaceAll("\u064F","").replaceAll("\u0619","").replaceAll("\uFE78","").replaceAll("\uFE79","").replaceAll("\u0650","").replaceAll("\uFE7A","").replaceAll("\uFE7B","").replaceAll("\u061A","").replaceAll("\uFE7E","").replaceAll("\u0652","");
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
  document.getElementById("dropdownIcon").classList.remove("dropdown");
  document.getElementById("dropdownIcon").classList.add("dropdownSmall");
  document.getElementById("arabicFontsIcons").classList.remove("arabicFonts");
  document.getElementById("arabicFontsIcons").classList.add("arabicFontsSmall");
} else {
  document.getElementById("swapIcon").classList.remove("exchangeSmallScreen");
  document.getElementById("swapIcon").classList.add("exchange");
  document.getElementById("dropdownIcon").classList.add("dropdown");
  document.getElementById("dropdownIcon").classList.remove("dropdownSmall");
  document.getElementById("arabicFontsIcons").classList.add("arabicFonts");
  document.getElementById("arabicFontsIcons").classList.remove("arabicFontsSmall");
}
