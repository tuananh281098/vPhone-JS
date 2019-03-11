const north   = require('./north.js');
const central = require('./central.js');
const south   = require('./south.js');

function inArray(needle,haystack){
    var count=haystack.length;
    for(var i=0;i<count;i++){
      if(haystack[i]===needle){return true;}
    }
    return false;
}
function getElement(array, value){
  let arrayValue = Object.values(array)
  let arrayKey   = Object.keys(array)
  for(var i = 0; i < arrayValue.length; i++){
    if(arrayKey[i]===value){return arrayValue[i];}
  }
  return null;
}
function importVariable(dialect){
  var onsets      = dialect.onsets
  var nuclei      = dialect.nuclei
  var offglides   = dialect.offglides
  var onglides    = dialect.onglides
  var onoffglides = dialect.onoffglides
  var codas       = dialect.codas
  var tones       = dialect.tones
  var tones_p     = dialect.tones_p
  var gi          = dialect.gi
  var qu          = dialect.qu
  return [onsets, nuclei, offglides, onglides, onoffglides, codas, tones, tones_p, gi, qu]
}
function trans (word, dialect, glottal, pham, cao, palatals, delimit) {
  var onsets, nuclei, offglides, onglides, onoffglides, codas, tones, tones_p, gi, qu
  ons = ''
  nuc = ''
  cod = ''
  ton = 0
  oOffset = 0
  cOffset = 0
  l = word.length

  if(dialect == 'n'){
    [onsets, nuclei, offglides, onglides, onoffglides, codas, tones, tones_p, gi, qu] = importVariable(north)
  }
  else if(dialect == 'c'){
    [onsets, nuclei, offglides, onglides, onoffglides, codas, tones, tones_p, gi, qu] = importVariable(central)
  }
  else{
    [onsets, nuclei, offglides, onglides, onoffglides, codas, tones, tones_p, gi, qu] = importVariable(south)
  }

  if (l > 0){
    if(getElement(onsets, word.slice(0,3)) != null) {
      ons = getElement(onsets, word.slice(0,3));
      oOffset = 3
    }
    else if (getElement(onsets, word.slice(0,2)) != null) {
      ons = getElement(onsets,word.slice(0,2));
      oOffset = 2
      //console.log('dung dunf');
    }
    else if (getElement(onsets, word[0]) != null) {
      ons = getElement(onsets, word[0]);
      oOffset = 1
    }
    //--------------------------------------------------------------------------
    if (getElement(codas, word.slice(l-2, l)) != null) {
      cod = getElement(codas, word.slice(l-2, l));
      cOffset = 2
    }
    else if (getElement(codas, word[l-1]) != null) {
      cod = getElement(codas, word[l-1]);
      cOffset = 1
    }
    //--------------------------------------------------------------------------
    if(word.slice(0,2) === 'gi' && word.slice(0,2) === cod && word.length === 3){
      nucl = 'i'
      ons = 'z'
    }
    else {
      nucl = word.slice(oOffset, l-cOffset)
    }
    // console.log('nucl' + nucl)
    //--------------------------------------------------------------------------
    if (getElement(nuclei, nucl) != null) {
      if (oOffset == 0) {
        if (glottal == 1) {
          if (getElement(onsets, word[0]) == null) {
              ons = 'ʔ' + getElement(nuclei, nucl)
          }
          else {
            nuc = getElement(nuclei, nucl)
          }
        }
        else{
          nuc = getElement(nuclei, nucl)
        }
      }
      else {
        nuc = getElement(nuclei, nucl)
      }
    }
    else if (getElement(onglides, nucl) != null && ons != 'kw') {
      nuc = onglides[nucl]
      if(ons){
        ons += 'w'
      }
      else{
        ons = 'w'
      }
    }
    else if(getElement(onglides, nucl) != null && ons == 'kw') {
      nuc = onglides[nucl]
    }
    else if (getElement(onoffglides, nucl) != null){
      cod = getElement(onoffglides, nucl)[l-1]// sua ntn
      nuc = getElement(onoffglides, nucl).slice(0, l-1)// sua ntn
      if (ons != 'kw'){
        if (ons) {
          ons += 'w'
        }
        else {
          ons = 'w'
        }
      }
    }
    else if (getElement(offglides, nucl) != null) {
      cod = getElement(offglides, nucl)[l-1]
      nuc = getElement(offglides, nucl).slice(0, l-1)
      //console.log('nuc ' + nuc);
    }
    else if (inArray('gi', word)){
      ons = gi + word[0]
      nuc = gi + word[1]
    }
    else if (inArray(word,'qu')){
      ons = qu + word.slice(0, -1)
      nuc = qu + word[-1]
    }
    else {//just run here
      return [null, null, null, null]
    }
    //--------------------------------------------------------------------------
    if (dialect == 'n'){
      if (nuc == 'a') {
        if (cod == 'k' && cOffset == 2) {
          nuc = 'ɛ'
        }
        if (cod == 'ɲ' && nuc == 'a') {
          nuc = 'ɛ'
        }
      }
      if (!inArray(nuc, ['i', 'e', 'ɛ'])){
        if (cod == 'ɲ'){
          cod = 'ŋ'
        }
      }
      else if (palatals != 1 && inArray(nuc, ['i', 'e', 'ɛ'])){
        if (cod == 'ɲ') {
          cod = 'ŋ'
        }
      }
      if (palatals == 1){
        if (cod == 'k' && inArray(nuc, ['i', 'e', 'ɛ'])){
          cod = 'c'
        }
      }
    }
    else{
      if (inArray(nuc, ['i', 'e'])){
        if (cod == 'k'){
          cod = 't'
        }
        if (cod == 'ŋ'){
          cod = 'n'
        }
      }

      else if (inArray(nuc,['iə', 'ɯə', 'uə', 'u', 'ɯ', 'ɤ', 'o', 'ɔ', 'ă', 'ɤ̆'])){
        if (cod == 't'){
          cod = 'k'
        }
        if (cod == 'n'){
         cod = 'ŋ'
        }
      }
    }
    //--------------------------------------------------------------------------
    if (dialect == 's'){
      if (inArray(cod,['m', 'p'])){
        if (nuc == 'iə'){
          nuc = 'i'
        }
        if (nuc == 'uə'){
          nuc = 'u'
        }
        if (nuc == 'ɯə'){
          nuc = 'ɯ'
        }
      }
    }
    //--------------------------------------------------------------------------
    var tonelist= [];
    for( var i = 0; i < l; i++){
      if(getElement(tones, word[i]) != null){
        tonelist[i] = getElement(tones, word[i])
      }
     // console.log('tonelist ' + tonelist)
    }
    //--------------------------------------------------------------------------
    if(tonelist.length > 0){
      ton = tonelist[tonelist.length - 1]
    }
    else{
      if(pham === 0 || cao === 0){
        if (dialect == 'c'){
          ton = '35'
        }
        else{
          ton = '33'
        }
      }
      else{
        ton = '1'
      }
    }
    //--------------------------------------------------------------------------
    if (cOffset != 0){
      if ((dialect == 'n' || dialect == 's') && ton == '21g' && inArray(cod, ['p', 't', 'k'])){
            ton = '21'
      }

      if (((dialect == 'n' && ton == '24') || (dialect == 'c' && ton == '13')) && inArray(cod, ['p', 't', 'k'])){
        ton = '45'
      }
      if (cao == 1){
        if (ton == '5' && inArray(cod, ['p', 't', 'k'])){
          ton = '5b'
        }
        if (ton == '6'  && inArray(cod, ['p', 't', 'k'])){
          ton = '6b'
        }
      }

      if (inArray(nuc, ['u', 'o', 'ɔ'])){
        if (cod == 'ŋ'){
          cod = 'ŋ͡m'
        }
        if (cod == 'k'){
          cod = 'k͡p'
        }
      }
    }
    return [ons, nuc, cod, ton];
  }
}
function convert (word, dialect, glottal, pham, cao, palatals, delimit) {
  ons = ''
  nuc = ''
  cod = ''
  ton = 0
  seq = ''

  var [ons, nuc, cod, ton] = trans(word, dialect, glottal, pham, cao, palatals)
  console.log('word ' + word)
    if(word.length > 0){
      if (ons == null && nuc == null && cod == null && ton == null) {
          seq = '[' + word + ']'
      }
      else {
        seq = delimit + [ons, nuc, cod, ton].join('') + delimit
       }
    }
  return seq
}
function main(text, dialect) {
  var glottal = 0;
  var pham = 0;
  var cao = 0;
  var palatals = 0;
  //var tokenize = 0;
  var output_ortho = 0;
  var delimit = '';
  var lines = [];
  var words = [];
  var temp = 0;
  var wordsCount = 0;
  for(var i = 0; i < text.length; i++){
    if(text[i] != '\n'){
      if(i==0){
        lines[temp] = text[i];
      }
      else{
        lines[temp] += text[i];
      }
    }
    else{
      temp+=1;
      lines[temp] = '';
    }
  }
  for(var i = 0; i < lines.length; i++){
    let k = 0;
    let line = lines[i].trim();
    line = line.replace(/\s+/g, ' ');
    //console.log('do dai: ' + line.length);
    while( k < line.length){
      if(line[k] != ' '){
        if(k == 0 || line[k - 1] == ' '){
          words[wordsCount] = line[k];
        }
        else{
          words[wordsCount] += line[k];
        }
      }
      else{
        wordsCount++;
      }
      k++;
    }
    wordsCount++;
  }
  var compound = ''
  var ortho = '';
  for(var j = 0; j < words.length; j++){
    if(words[j].length != null){
      word = words[j].trim();
      ortho += word;
      word = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"@]/g,"").toLowerCase()
      //console.log(word.length);
      if(word.length > 0){
        seq = convert(word, dialect, glottal, pham, cao, palatals, delimit).trim()
        if(words.length >= 2){
          ortho += ' '
        }
        if(j < words.length-1){
          seq = seq + ' '
        }
        compound = compound + seq
      }
    }
  }
  if(ortho != ''){
    ortho = ortho.trim()
    //if (output_ortho) {
      console.log(ortho)
    //}
    console.log(compound)
  }
}

main('they said:" chúng tôi vd# vv @ % !@$%^!@#$%^&*() ! @ # $ % ^ & * ( ) [ ] # muốn      dcvd có 1 sản phẩm    hoàn chỉnh  về âm vị"    ', 's');
