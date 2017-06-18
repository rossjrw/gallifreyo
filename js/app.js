//DEPENDENCIES: AngularJS, jQuery

/* global $ */
/* jshint maxerr:600 */

// Eventual plans:
// - on a per-sentence level, render each word on the line of an inwards-traversing spiral such that longer sentences are more feasible
// - Pluricentric Sherman's

(function(){
  var gallifreyo = angular
    .module('gallifreyo',[])
    .controller('HostController',HostController)
    .service('ShermanStorage',ShermanStorage);

  //      __  __           __  ______            __             ____         
  //     / / / /___  _____/ /_/ ____/___  ____  / /__________  / / /__  _____
  //    / /_/ / __ \/ ___/ __/ /   / __ \/ __ \/ __/ ___/ __ \/ / / _ \/ ___/
  //   / __  / /_/ (__  ) /_/ /___/ /_/ / / / / /_/ /  / /_/ / / /  __/ /    
  //  /_/ /_/\____/____/\__/\____/\____/_/ /_/\__/_/   \____/_/_/\___/_/     
  // does pretty much everything
  HostController.$inject = ['$scope','$rootScope','$window','ShermanStorage'];
  function HostController($scope,$rootScope,$window,ShermanStorage){
    //insert code here
    var host = this;
    
    $scope.ShermanStorage = ShermanStorage;
    
    host.text = "Insert text here";
    // the text - this should NOT be in settings
    
    $scope.langs = {
      model: "Sherman's Gallifreyan",
      availableOptions: [
        "Sherman's Gallifreyan",
        "Test Option"
      ]
    };
    //$scope.lang = 0;
    // 0 is Sherman's
    
    host.structure ="Simple";
    // dropdown from simple/spiral/size-scaled/auto
    
    host.instant = true;
    // toggles instant translation
    
    host.scaling = true;
    // toggles sentence size scaling
    
    host.watermark = false;
    // toggles watermark, false means yes
    
    host.width = 1024;
    // size of the final PNG
    
    host.debug = true; // change this to false when it's finished
    // enables debug messages in console
    
    host.fore = "#000000";
    host.back = "#FFFFFF";
    
    host.button = "Translate";
    
    host.settings = {
      s: {
        b: 0.9,
        a: 1,
      },
      p: {
        b: 1.2,
        a: 1,
      },
      d: {
        b: -0.4,
        a: 2,
      },
      f: {
        b: 0,
        a: 0.75,
      },
      v: {
        b: 2,
        a: 1,
        r: 0.1,
      },
      word: {
        b: 1.2,
        a: 1,
      },
      buffer: {
        letter: 0.5,
        word: 0.5,
        sentence: 0.5,
      },
    };
    
    // we will now reconfigure host.settings for easy ng-repeat access
    // our model is as such: we will have categories for each variable.
    
    // format will be host.settings.CATEGORY.VALUE.VALUE.etc
    
    function report(){
      // this is for debugging. r stands for "report"
      if(host.debug === true){
        console.log(JSON.parse(JSON.stringify(arguments)));
      }
    }
    
    window.onResize = function(event){
      host.generate();
    };
    
    host.change = function(){
      // this is called when the user changes the input.
      if(host.instant === true){
        host.generate();
      }
      // TODO: scrub certain characters from input based on consts defined above
    };
    
    var reset = function(){
      // this is used to reset values used in host.generate
      // it should be called before generation
      
      // first thing to do is clear everything that's been drawn
      /*$('#drawing').empty();*/
    };
    
    var tempArray; // this may be important I honestly have no clue at this point
    
    var paragraph = {};
    
    host.generate = function(){
      // this is the main function that is initiated whenever the user types or when Generate is clicked.
      
      // clear all the old shit away
      reset();
      
      var input = host.text;
      // the first thing we need to do is detect errors in the input
      // errors: input contains any characters that are not A-Z, . or space
      if(!/^[a-zA-Z0-9\.\s]+$/.test(input) && input.length > 0){
        // input is bad
        /*alert("Please only use alphanumeric characters!");*/
        // meh we can just ignore them or something // we now have a backup character lol
      }
      if(input.length === 0){
        // input is empty!
        // we don't really need to do anything though, it's not a crime
      }
      
      // now we split up the input into sentences
      // sentences should have a . at the end of them
      paragraph.sentences = input.split(".");
      
      // standardise the sentences so we can process them
      for(let s = 0; s < paragraph.sentences.length; s++){
        paragraph.sentences[s] = paragraph.sentences[s].trim();
        paragraph.sentences[s] = paragraph.sentences[s].toUpperCase();
        // if the sentence is empty then it should be removed
        if(paragraph.sentences[s].length < 1){
          paragraph.sentences.splice(s,1);
          s--;
          continue;
          // when we drop the empty sentence it tries to re-process the previous sentence
          // this obviously throws an error. continue forces it to go back to the for statement
        }
        // now we need to process the paragraph.sentences array into an object.
        // make a tempArray to copy the data then immediately delete it
        // it's messy but it works. this also splits them up into words
        tempArray = paragraph.sentences[s].split(" ");
        paragraph.sentences[s] = {words: tempArray};
        tempArray = [];
        for(let w = 0; w < paragraph.sentences[s].words.length; w++){
          // now we split each word into letters using the same process as before
          tempArray = paragraph.sentences[s].words[w].split("");
          paragraph.sentences[s].words[w] = {letters: tempArray};
          tempArray = [];
          // this is great and all but now we need to take into account the double letters and vowels
          for(let l = 0; l < paragraph.sentences[s].words[w].letters.length; l++){
            if(["CH","SH","TH","NG","QU","WH","PH","GH"].indexOf(paragraph.sentences[s].words[w].letters[l]+paragraph.sentences[s].words[w].letters[l+1]) !== -1){
              paragraph.sentences[s].words[w].letters[l] = paragraph.sentences[s].words[w].letters[l]+paragraph.sentences[s].words[w].letters[l+1];
              paragraph.sentences[s].words[w].letters.splice(l+1,1);
              l--;
              continue;
            }
            // now we need to find vowels
            // for now I'm going to concat the vowel to the end of the letter and then to check I'll just read the last letter
            // BUT that won't work for QU. Fucking QU
            // You know what? Fuck QU. I'm gonna assign something else to QU. Q# will do the job.
            if(paragraph.sentences[s].words[w].letters[l] == "QU"){
              paragraph.sentences[s].words[w].letters[l] = "Q#";
            }
            // there we go. Fuck QU.
            // we got as far as we did before we changed the data structure so I deleted all the old stuff and I feel awful about it
            // anyway, vowels
            // we have some complex rules to perform here
            // I really really doubt I'm ever going to use the double vowel syntax because a) I hate it b) it's awful
            // I should eventually include an option for it, but for now, no
            // So we should append l+1 to l IF:
            //  - next is a vowel
            //  - current is not a vowel (does not end in one)
            //  - ...is that it? possibly, review later
            if(["A","E","I","O","U"].indexOf(paragraph.sentences[s].words[w].letters[l].charAt(paragraph.sentences[s].words[w].letters[l].length - 1)) == -1
              && ["A","E","I","O","U"].indexOf(paragraph.sentences[s].words[w].letters[l+1]) !== -1){
              paragraph.sentences[s].words[w].letters[l] = paragraph.sentences[s].words[w].letters[l]+paragraph.sentences[s].words[w].letters[l+1];
              paragraph.sentences[s].words[w].letters.splice(l+1,1);
              l--;
              continue;
            }
          }
          for(let l = 0; l < paragraph.sentences[s].words[w].letters.length; l++){
            tempArray[l*2] = paragraph.sentences[s].words[w].letters[l];
            tempArray[(l*2)+1] = "BUFFER";
          }
          // I hereby decree that, including buffers, a word shalt have no less than 4 characters
          // therefore, if the length of the letters is 2, add 2 buffers
          if(tempArray.length == 2){
            tempArray.push("BUFFER");
            tempArray.push("BUFFER");
          }
          paragraph.sentences[s].words[w].letters = tempArray;
          tempArray = [];
        }
        //for(let w = 0; w < paragraph.sentences[s].words.length; w++){
        //  tempArray[w*2] = paragraph.sentences[s].words[w];
        //  tempArray[(w*2)+1] = "BUFFER";
        //}
        //tempArray = [];
      }
      console.log("Current input",paragraph);
      // now we have a list of sentences, each of which is a list of words, each of which is a list of letters
      // gcse english A*
      // now we get to the fun part......
      // the output will be a large circle, we will call this the paragraph
      // we're going to start assuming that the paragraph has 1 sentence for now
      renderParagraph(paragraph);
    };
    
    var renderParagraph = function(para){
      // for each sentence, render it
      for(let s = 0; s < para.sentences.length; s++){
        renderSentence(para.sentences[s],s);
      }
      
      // the final thing we need to do is load the paragraph into the frame
      // at the time of writing, we can only render words, so we'll render that
      host.paragraph = paragraph;
      
      sortOutTheFuckingBoundingBox();
    };
    
    function renderSentence(sentence,s_){
      // VERY IMPORTANT! If there is 1 word, nothing is rendered. we will need to add an exception for this.
      
      // for each word, render it
      
      var rx = 0;
      var ry = 0;
      var sentenceRadius = 50; // change this when we do size-scaled (for which the switch statement may have to be called in the loop)
      
      // first thing we need to do is shuffle in a bunch of buffer sentences
      // sentence.words[w].letters = "buffer" then detect where typeof is string not array. we can use .isArray() for that
      /*tempArray = [];
      for(let w = 0; w < sentence.words.length; w++){
        tempArray[w*2] = {letters: sentence.words[w].letters};
        tempArray[(w*2)+1] = {letters: "BUFFER"};
      }
      sentence.words = tempArray;
      tempArray = [];*/
      
      var angles = [];
      for(let w = 0; w < sentence.words.length; w++){
        angles.push(getRelativeWordAngle(sentence.words[w],s_,w)); // we don't need to do this as all words are the same
        // EXCEPT THAT THEY'RE NOT. SIZE-SCALED BOOOOOOIIIIII
      }
      var relativeAngleSum = angles.reduce((a, b) => a + b, 0);
      for(let a = 0; a < angles.length; a++){
        angles[a] = angles[a] * 2 * Math.PI / relativeAngleSum;
      }
      for(let w = 0; w < sentence.words.length; w++){
        var B;
        if(w === 0){
          B = 0;
        } else {
          B = angles[w-1]/2 + angles[w]/2 + B;
        }
        // B is the angular distance from k_alpha to k_0
        //renderWord(sentence.words[w],s_,w,wordRadius); this gets called in switchStructure
        // output is in word.letters[l].d and word.letters[l].path
        // having said that, this isn't even relevant because ngRepeat
        switchStructure(w,sentenceRadius,angles[w],B);
      }
      // in order to support spiral-rendering later, we will need to draw a path and then render circles at distances along that
      // for the pre-spiral case, a circle is good enough, however it would be wise to use instead a broken arc with an end at the first and last sentence
      // we would also be able to modify this path for the sentence-scaling case - a smaller "circle" with an off-centre centre to accommodate larger and smaller circles however as yet I have no clue how to calculate this. we may even need to remove the arc completely for this method
      console.log(host.structure);
      function switchStructure(w,sentenceRadius,angleSubtended,B){
        var N = angleSubtended / 2;
        switch(host.structure){
          default:
          case "Simple":
            var wordRadius = sentence.words.length > 2 ? (sentenceRadius*Math.cos(Math.PI/2-N))/(host.settings.word.b*Math.cos(Math.PI/2-N)+1) : sentenceRadius;
            // we somehow need to work out exactly where the location of each letter is
            // x = (-R+br)cosB = (-sentenceRadius + host.settings.word.b) * Math.cos(B)
            // y = (-R+br)sinB = (-sentenceRadius + host.settings.word.b) * Math.sin(B)
            console.log(B);
            sentence.words[w].transform = "translate(" + (-sentenceRadius + host.settings.word.b*wordRadius) * Math.cos(B) + "," + (-sentenceRadius + host.settings.word.b*wordRadius) * Math.sin(B) + ")";
            break;
          case "Size-Scaled":
            break;
          case "Spiral":
            break;
          case "Automatic":
            host.structure = "Simple";
            switchStructure();
            break;
        }
        if(/*Array.isArray(sentence.words[w].letters)*/ true){
          renderWord(sentence.words[w],s_,w,wordRadius);
        }
      }
      // after the switch statement, if there is more than one word, draw a circle around the sentence. otherwise, leave it.
    }
    
    function getRelativeWordAngle(word,s_,w){
      // this should output the relative angles subtended by each word in the sentence
      // for the spiral case, this should just be 1..0.5..1..0.5... etc
      // for size-scaled the angles may vary
      // we may be able to amalgamate the rendering for simple and size-scaled
      // unlike getRelativeLetterAngle, we shouldn't have to process and format each word because they're pretty much fucking identical
      // what do we need to differentiate between?
      // a buffer has a flat angle of 0.5
      // a word will have an angle of 1 IF it's simple. if not, then it depends on something. for now, that can be the number of letters
      // this function won't be called for spirals so we hopefully don't need to worry about that
      if(Array.isArray(word.letters)){
        // this is a valid word
        if(host.structure == "Size-Scaled"){
          word.relativeAngle = word.letters.length;
        } else {
          word.relativeAngle = 1;
        }
      } else {
        // this is a buffer
        word.relativeAngle = host.settings.buffer.word;
      }
      paragraph.sentences[s_].words[w] = word;
      return word.relativeAngle;
    }
    
    function renderWord(word,s_,w_,radius){
      // for each letter, render it
      var rx = 0;
      var ry = 0;
      var angles = [];
      for(let l = 0; l < word.letters.length; l++){
        angles.push(getRelativeLetterAngle(word.letters[l],s_,w_,l));
      }
      var relativeAngleSum = angles.reduce((a, b) => a + b, 0);
      for(let a = 0; a < angles.length; a++){
        angles[a] = angles[a] * 2 * Math.PI / relativeAngleSum;
      }
      // we also need to pass down the absolute angle for a vowel
      var vAngle = host.settings.v.a * 2 * Math.PI / relativeAngleSum;
      for(let l = 0; l < word.letters.length; l++){
        // B is the sum of all previous letter angles and their buffers
        var B;
        if(l === 0){
          B = 0;
        } else if(l >= 1){
          B = angles[l-1]/2 + /*angles[l-1] +*/ angles[l]/2 + B;
        }
        //report("("+l+") Rendering letter "+word.letters[l][0].value+" with subtension "+angles[l]+" at angle "+B.toDeg());
        renderLetter(word.letters[l],s_,w_,l,angles[l],vAngle,radius);
        
        word.letters[l].d = word.letters[l][0].path;
        word.letters[l].transform = ["rotate(",B.toDeg(),",",0,",",radius,")"].join("");
      }
      // we need to return something so that renderSentence gets something to play with
    }
    
    function getRelativeLetterAngle(letter,s_,w_,l_){
      // letter: the letter being processed
      // s_: index of sentences
      // w_: index of words
      // l_: index of letters
      // angleSubtended: angle subtended by this letter - we need to calculate this, and then return it
      // wordRadius: the radius of the word-circle
      
      // render the letter
      // a letter consists of two components, the value (1-2 chars) and the vowel (which may not be there). also the value may be a vowel
      // add the split letter to the tempArray
      if(["A","E","I","O","U"].indexOf(letter.charAt(letter.length - 1)) != -1){
        // if the last character is a vowel
        tempArray[0] = letter.slice(0,-1);
        tempArray[1] = letter.charAt(letter.length - 1);
      } else {
        tempArray[0] = letter;
      }
      // nab the data for the letter
      for(let l = 0; l < tempArray.length; l++){
        // a lone vowel will have undefined as the first value for some reason
        if(!tempArray[l]){ // apparently "=== undefined" breaks it??
          tempArray.splice(l,1);
          l--;
          continue;
          // this scrubs the undefined, leaving the vowel as the first value
        }
        // console.log(ShermanStorage.getLetter("A").block);
        // if there is a second character it is always a vowel
        tempArray[l] = ShermanStorage.getLetter(tempArray[l]);
        switchBlock(l);
      }
      function switchBlock(l){
        switch(tempArray[l].block){
          case "s":
            tempArray[l].b = host.settings.s.b;
            tempArray[l].full = false;
            tempArray[l].relativeAngle = host.settings.s.a;
            //tempArray[l].buffer = host.settings.buffer.letter * host.settings.s.a;
            break;
          case "p":
            tempArray[l].b = host.settings.p.b;
            tempArray[l].full = true;
            tempArray[l].relativeAngle = host.settings.p.a;
            //tempArray[l].buffer = host.settings.buffer.letter * host.settings.s.a;
            break;
          case "d":
            tempArray[l].b = host.settings.d.b;
            tempArray[l].full = false;
            tempArray[l].relativeAngle = host.settings.d.a;
            //tempArray[l].buffer = host.settings.buffer.letter * host.settings.s.a;
            break;
          case "f":
            tempArray[l].b = host.settings.f.b;
            tempArray[l].full = true;
            tempArray[l].relativeAngle = host.settings.f.a;
            //tempArray[l].buffer = host.settings.buffer.letter * host.settings.s.a;
            break;
          case "v":
            // vowels???
            if(l === 0){
              // the vowel is the only character in this letter and needs to be rendered on the word-circle
              tempArray[l].on = true;
              tempArray[l].b = host.settings.v.b;
              tempArray[l].relativeAngle = 1; // might not even need this
              tempArray[l].buffer = host.settings.buffer.letter * host.settings.v.a;
            } else {
              // the vowel is a secondary character and needs to be rendered on the letter-circle
              tempArray[l].on = false;
              tempArray[l].b = host.settings.v.b;
            }
            break;
          case "buffer":
            tempArray[l].relativeAngle = host.settings.buffer.letter;
            break;
          default:
            // this happens if the character isn't in the alphabet
            tempArray[l].block = "s";
            tempArray[l].dots = 1;
            tempArray[l].lines = 0;
            switchBlock(l);
        }
      }
      // HERE we split up the function for the angle getting thing. yeah I know it's a fucking mess
      // if we don't touch tempArray between functions it might even be preserved
      // actually it won't be
      // we need to save and load
      // UGH
      paragraph.sentences[s_].words[w_].letters[l_] = tempArray;
      tempArray = [];
      return paragraph.sentences[s_].words[w_].letters[l_][0].relativeAngle;
    }
    
    function renderLetter(letter,s_,w_,l_,angleSubtended,angleSubtendedByVowel,wordRadius){
      tempArray = paragraph.sentences[s_].words[w_].letters[l_];
      // we know A and b so now we can work out r
      // var r = (wordRadius*Math.cos(90-(angleSubtended/2)))/(b*Math.cos(90-(angleSubtended/2))+1);
      // for this we only need tempArray[0]
      // obviously this does not apply to vowels
      tempArray[0].path = null;
      path = [];
      path.push("M k3x k3y");
      if(tempArray[0].block != "v" && tempArray[0].block !== "buffer"){
        // 0,0 is our relative starting point for k_0 so we need to move from there to leftmost part of the word-circle curve
        if(tempArray[0].full === false){
          // if the letter is unfull, render to where it crosses the line (k_1)
          path.push("A R R 0 0 1 k1x k1y");
          // next we render from k_1 to k_2 via the curve of the letter itself.
          if(tempArray[0].block == "s"){ // because otherwise it goes bad
            path.push("A r r 0 1 0 k2x k2y");
          } else {
            path.push("A r r 0 0 0 k2x k2y");
          }
          // then we go via the word circle to k_4
          path.push("A R R 0 0 1 k4x k4y");
          // that seems too easy. I wonder what errors this will throw
        } else {
          // if the letter is full, render to k_4 (come back after!)
          path.push("A R R 0 0 1 k4x k4y");
          // full letters are p and f
          path.push("M r0x r0y"); // move to r_0 - this will need to be calculated beforehand
          path.push("m -r 0"); // move by unit radius
          path.push("a r r 0 1 1 2r 0"); // diameter arc (calculate 2r)
          path.push("a r r 0 1 1 -2r 0"); // diameter arc episode 2 attack of the beziers (calculate 2r)
          path.push("M k4x k4y"); // back to k_4 because this letter is done (except vowels, lines and dots)
        }
        if(tempArray.length == 2){
          // this is where letters that go onto the vowel go
          // we shouldn't need to differentiate between full and unfull, but if we do, we can do that later
          // an important feature of vowels are the extensors, but we're doing all that later on anyway
          // first we need to find the location of the vowel. this should be pretty easy
          // we'll call that vx and vy
          path.push("M vx vy");
          // next we need to draw the circle, using the full technique
          path.push("m -w 0"); // we're using w for the vowel radius
          path.push("a w w 0 1 1 2w 0"); // diameter arc
          path.push("a w w 0 1 1 -2w 0"); // diameter arc episode 2
          path.push("M k4x k4y"); // back to k_4, again, I guess
        }
      } else if(tempArray[0].block == "buffer"){
        // it's buffer time!
        // in this experiment we'll be rendering the buffer as if it were a normal letter.
        // we'll be commenting out the original buffer curve as well as the k5 calculations.
        // the buffer should just be a single woosh.
        path.push("A R R 0 0 1 k4x k4y"); // that should be it.
        // now we just need to implement the functionality.
      } else { // the letter is a vowel
        path.push("A R R 0 0 1 k4x k4y"); // woosh
        // vowels need a radius. when attached to a letter their radius is 0.1 of the letter or something
        // but what about when they're on their own?
        // we could have a super fancy system in place that gets the average of all the other vowels in the word
        // the vowels don't even need to exist for us to do that, we just need an average r
        // so we need to iterate through the list of letters and get the average value of r
        // issue is, we're already iterating through the letters and to do it again would be insanely inefficient
        // let's do second-vowels first just to get the framework in place
        // the thing is, radius sizes shouldn't even vary that much, only a bit
        // actually, I think I want vowels to be of a standard size
        // it would seem that w is probably fine to stay how it it, but we'll see about that
        // anyway, pure vowels only need to be rendered onto the word-circle, so at k0
        path.push("M vx vy"); // ignore vx and vy for this one
        // next we need to draw the circle, using the full technique
        path.push("m -w 0"); // we're using w for the vowel radius
        path.push("a w w 0 1 1 2w 0"); // diameter arc
        path.push("a w w 0 1 1 -2w 0"); // diameter arc episode 2
        path.push("M k4x k4y"); // back to k_4, again, I guess
      }
      // each letter should also be responsible for rendering the buffer that immediately succeeds it
      // the end of the buffer is equal to k3 of the next letter
      // so from k4_0 to k3_1
      // having said that, different letters do have different coordinate systems, so there's no point even trying to link the two
      // just take the buffer angle and do it
      //path.push("A R R 0 0 1 k5x k5y"); // k5 is the location of the end of the buffer
      if(host.debug && tempArray[0].block !== "buffer"){
        // if we're in debug mode, draw a line from k1 to R0
        path.push("M k3x k3y L Rx Ry M k4x k4y L Rx Ry");
      }
      
      path = path.join(" ");
      
      var N;
      if(tempArray[0].block == "buffer"){
        N = angleSubtended / 2;
      } else {
        N = angleSubtended / 2;
      }
      
      var k0x = 0;
      path = path.replace(/k0x/g,k0x);
      var k0y = 0;
      path = path.replace(/k0y/g,k0y);
      
      var r = (wordRadius*Math.cos(Math.PI/2-N))/(tempArray[0].b*Math.cos(Math.PI/2-N)+1);
      var w = (wordRadius*Math.cos(Math.PI/2-angleSubtendedByVowel/2))/4;
      // I want w to be one quarter of r for a standard letter, where b = 0. the standard letter is the v block.
      
      var r0x = k0x + 0;
      path = path.replace(/r0x/g,r0x);
      var r0y = k0x + tempArray[0].b*r;
      path = path.replace(/r0y/g,r0y);
      
      var vx = r0x + 0;
      path = path.replace(/vx/g,vx);
      var vy;
      /*if(tempArray[0].block == "v"){
        if(tempArray.length == 2){
          vy = k0y + (tempArray[1].vert * r);
        } else {
          vy = k0y + (tempArray[0].vert * r);
        }
      } else {
        if(tempArray.length == 2){
          vy = r0y + (tempArray[1].vert * r);
        } else {
          vy = r0y + (tempArray[0].vert * r);
        }  
      }*/
      // the location of vy varies based on both the block of the primary and the value of the vowel.
      // the most sensible way to do this would be using case
      // when vert is -1, just outside word-circle for all blocks
      // when vert is 0, middle of l:C for s,p; on w:C for d,f,v
      // when vert is 1, on l:C for s,p,d,f; just inside w:C for v
      
      switch(tempArray[tempArray.length-1].vert){
        case -1:
          vy = k0y - 2*w;
          break;
        case 0:
          switch(tempArray[0].block){
            case "s":
            case "p":
              vy = r0y;
              break;
            case "d":
            case "f":
            case "v":
              vy = k0y;
              break;
            default:
          }
          break;
        case 1:
          switch(tempArray[0].block){
            case "s":
            case "p":
            case "d":
            case "f":
              vy = r0y + r;
              break;
            case "v":
              vy = k0y + 2*w;
              break;
            default:
          }
          break;
        default:
          vy = k0y; // this shouldn't happen, but just in case
      }
      
      path = path.replace(/vy/g,vy);
      
      path = path.replace(/2r/g,2*r);
      path = path.replace(/r/g,r);
      
      path = path.replace(/2w/g,2*w);
      path = path.replace(/w/g,w);
      
      var Rx = 0;
      path = path.replace(/Rx/g,Rx);
      var Ry = wordRadius;
      path = path.replace(/Ry/g,Ry);
      path = path.replace(/R/g,wordRadius);
      
      var k1x = intersection(Rx,Ry,wordRadius,r0x,r0y,r)[1];
      path = path.replace(/k1x/g,k1x);
      var k1y = intersection(Rx,Ry,wordRadius,r0x,r0y,r)[3];
      path = path.replace(/k1y/g,k1y);
      
      var k2x = intersection(Rx,Ry,wordRadius,r0x,r0y,r)[0];
      path = path.replace(/k2x/g,k2x);
      var k2y = intersection(Rx,Ry,wordRadius,r0x,r0y,r)[2];
      path = path.replace(/k2y/g,k2y);
      
      var k3x = Rx + (k0x - Rx)*Math.cos(-N) - (k0y - Ry)*Math.sin(-N);
      path = path.replace(/k3x/g,k3x);
      var k3y = Ry + (k0x - Rx)*Math.sin(-N) + (k0y - Ry)*Math.cos(-N);
      path = path.replace(/k3y/g,k3y);
      
      var k4x = Rx + (k0x - Rx)*Math.cos(N) - (k0y - Ry)*Math.sin(N);
      path = path.replace(/k4x/g,k4x);
      var k4y = Ry + (k0x - Rx)*Math.sin(N) + (k0y - Ry)*Math.cos(N);
      path = path.replace(/k4y/g,k4y);
      
      //var k5x = Rx + (k4x - Rx)*Math.cos(buff) - (k4y - Ry)*Math.sin(buff);
      //path = path.replace(/k5x/g,k5x);
      //var k5y = Ry + (k4x - Rx)*Math.sin(buff) + (k4y - Ry)*Math.cos(buff);
      //path = path.replace(/k5y/g,k5y);
      
      // WAIT
      // the letter only knows R in terms of word-circle coordinates
      // we'd need a way to convert it to letter-circle coordinates
      // UUUUUUUGGGGGGGGGGGGGGGGGHHHHHHHHHHHHHHHH
      // we could potentially pass the coordinates of the word down from renderLetter and them compare them to the make-believe coords we have
      // make a ratio or something and them compare the shit out of it
      // what we'd need to do is pass r_0, r and K_alpha from the word's perspective and compare them to R_0, R and k_0 from the letter's perspective
      // when rendering letters, the current letter is always k_alpha because priority and all that jazz
      // l:k_0 is always at 0,0
      // that doesn't help us though because letters can be rotated. we need l:k_0 of the FIRST letter, which is l:k_alpha
      // this comparision does what exactly? how does it help us?
      // we can calculate l:R_0 and w:r_0 from this by adding the radius to the y-value
      // (because k_alpha for either is directly below the center)
      // so we have w:k_ay + w:r = w:r_0
      //            l:k_ay + l:R = l:R_0
      // we also know that there is some formula connecting w:k_ay -> l:k_ay and w:r -> l:R and w:r_0 -> l:R_0
      // it may even be the same formula for each correlation.
      // this shouldn't depend on angles because the radii would be the same for any angle. should just depend on sizes
      // so the question is, how do we work out this relationship?
      // easy - the value of l:R is abitrary, so we set it to w:r
      
      var placeholders = ["r0x","r0y","r","k0x","k0y","k1x","k1y","k2x","k2y","k3x","k3y","k4x","k4y","w","vy","vx"];
      if(host.debug){
        tempArray[0].attributes = [];
        for(let p = 0; p < placeholders.length; p++){
          tempArray[0].attributes[placeholders[p]] = eval(placeholders[p]); // jshint ignore:line because apparently eval is evil
        }
      }
      
      // bundle path into tempArray
      tempArray[0].path = path;
      // woah tempArray I bet you were NOT expecting that
      
      //console.log(tempArray);
      
      
      // now we should make a series of <path> elements for the svg of the letter
      // we should use an independent size scale (with no line width) then scale and thickify it during the final render
      // so each entry in tempArray is now an object with the properties of the letter
      // we need to add a new property, path, which is the data of the path for the object
      // the path will include variable that we don't know yet, such as R and r.
      // we need to eventually include a method for replacing the placeholders we use (in the path text) with the variables.
      // stroke-width is easy as it's an entirely different property, however radius and coordinates may be more tricky.
      // boom! "".replace(search_text,replace_text) is what we need. easy
      // we can process replacements wherever they are convenient. renderLetter is a useful but low power function so can't do that
      
      
      
      
      
      // we have to push tempArray somewhere now - what actually is it?
      // it's a list of all characters in the letter and their properties
      // it would probably be best to swap it out with the relevant entry in paragraph.sentences[s].words[w].letters
      // but this function is pretty deeply nested...
      // we'd need to replace the function parameters with just the values of the loop, which imo defeats the purpose of having separate functions
      // BUT it looks pretty so it'll do
      // kind of annoying though because "letter.length" looks so much nicer than "paragraph.sentences[s].words[w].letters[l].length"
      // wait a sec, we don't need to do that
      // just pass the  loop number down through the parameters as well and we're good to go
      // we now have s_, w_ and l_ being passed down
      // so now we just have to feed tempArray into paragraph.sentences[s].words[w].letters[l]
      paragraph.sentences[s_].words[w_].letters[l_] = tempArray;
      tempArray = [];
    }
    
    // generate svg of the default text
    host.generate();
    
    report("Default",paragraph);
    
    // This function calculates the points of intersection of two circles given their coordinates and radii
    function intersection(x0, y0, r0, x1, y1, r1){
      var a, dx, dy, d, h, rx, ry;
      var x2, y2;
      dx = x1 - x0;
      dy = y1 - y0;
      d = Math.hypot(dy,dx);
      //if (d > (r0 + r1)){return false;}
      //if (d < Math.abs(r0 - r1)){return false;}
      a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);
      x2 = x0 + (dx * a / d);
      y2 = y0 + (dy * a / d);
      h = Math.sqrt((r0 * r0) - (a * a));
      rx = -dy * (h / d);
      ry = dx * (h / d);
      var xi = x2 + rx;
      var xi_prime = x2 - rx;
      var yi = y2 + ry;
      var yi_prime = y2 - ry;
      return [xi, xi_prime, yi, yi_prime]; // xi is positive, xi_prime is negative for the word-letter situation
    }
    
    async function sortOutTheFuckingBoundingBox(){ // jshint ignore:line fuck off, async is a thing
      setTimeout(() => {
        var svg = document.querySelector("svg");
        // Get internal size of SVG
        var bbox = svg.getBBox();
        // Construct and set a viewBox for the SVG
        var viewBox = [bbox.x, bbox.y, bbox.width, bbox.height].join(" ");
        svg.setAttribute("viewBox", viewBox);
      }, 1);
    }
  }
  
  //     _____ __                                   _____ __                            
  //    / ___// /_  ___  _________ ___  ____ _____ / ___// /_____  _________ _____ ____ 
  //    \__ \/ __ \/ _ \/ ___/ __ `__ \/ __ `/ __ \\__ \/ __/ __ \/ ___/ __ `/ __ `/ _ \
  //   ___/ / / / /  __/ /  / / / / / / /_/ / / / /__/ / /_/ /_/ / /  / /_/ / /_/ /  __/
  //  /____/_/ /_/\___/_/  /_/ /_/ /_/\__,_/_/ /_/____/\__/\____/_/   \__,_/\__, /\___/ 
  //  Stores the data for the letters for Sherman's language               /____/       
  function ShermanStorage(){
    // s, p, d, f
    // s is moonrise
    // p is noon
    // d is dawn
    // f is twilight
    // that makes no sense lol but hopefully you remember. same order listed in sherman's doc
    // for s block, b = 0.8 and the circle is cut
    // for p block, b = 1.2 and full circle
    // for d block, b = 0  and cut circle
    // for f block, b = 0 and full circle
    var alphabet = [
      {value: "B", block: "s", dots: 0, lines: 0},
      {value: "CH", block: "s", dots: 2, lines: 0},
      {value: "D", block: "s", dots: 3, lines: 0},
      {value: "F", block: "s", dots: 0, lines: 3},
      {value: "G", block: "s", dots: 0, lines: 1},
      {value: "H", block: "s", dots: 0, lines: 2},
      {value: "J", block: "p", dots: 0, lines: 0},
      {value: "K", block: "p", dots: 2, lines: 0},
      {value: "L", block: "p", dots: 3, lines: 0},
      {value: "M", block: "p", dots: 0, lines: 3},
      {value: "N", block: "p", dots: 0, lines: 1},
      {value: "P", block: "p", dots: 0, lines: 2},
      {value: "T", block: "d", dots: 0, lines: 0},
      {value: "SH", block: "d", dots: 2, lines: 0},
      {value: "R", block: "d", dots: 3, lines: 0},
      {value: "S", block: "d", dots: 0, lines: 3},
      {value: "V", block: "d", dots: 0, lines: 1},
      {value: "W", block: "d", dots: 0, lines: 2},
      {value: "TH", block: "f", dots: 0, lines: 0},
      {value: "Y", block: "f", dots: 2, lines: 0},
      {value: "Z", block: "f", dots: 3, lines: 0},
      {value: "NG", block: "f", dots: 0, lines: 3},
      //{name: "QU", block: "f", dots: 0, lines: 1},
      {value: "Q#", block: "f", dots: 0, lines: 1}, // because fuck QU
      {value: "X", block: "f", dots: 0, lines: 2},
      {value: "A", block: "v", vert: -1, line: 0}, // vert: -1 = down, 1 = up
      {value: "E", block: "v", vert: 0, line: 0}, // line: 1 = in, -1 = out
      {value: "I", block: "v", vert: 0, line: 1},
      {value: "O", block: "v", vert: 1, line: 0},
      {value: "U", block: "v", vert: 0, line: -1},
      {value: "WH", block: "p", dots: 1, lines: 0},
      {value: "PH", block: "d", dots: 1, lines: 0},
      {value: "GH", block: "f", dots: 1, lines: 3},
      {value: "C", block: "p", dots: 4, lines: 0}, // discouraged characters
      {value: "Q", block: "f", dots: 4, lines: 0}, // maybe even remove these in favour of else?
      {value: "BUFFER", block: "buffer"},
      //{value: "else", block: "s", dots: 1, lines: 0},
    ];
    // I'm gonna write the formula here too
    // because each block has its circle at a different height, circles of the same radius will subtend a different angle
    // I have chosen to prioritise balancing the angle subtended as opposed to the radius
    // remember the hour of wolfram alpha? yeah
    // r = R cos(90 - A/2) / b cos(90 - A/2)+1
    // var r = (R*Math.cos(90-(A/2)))/(b*Math.cos(90-(A/2))+1)
    // where r is the radius of the letter circle,
    //       R is the radius of the word circle,
    //       A is the angle subtended (degs) and
    //       b depends on what block the letter is in.
    // this determines r. We know A. We know b on a per-block basis. R has yet to be decided, but theoretically we know what it is.
    return { // the following functions are available to controllers with ShermanStorage as dependency
      getLetter: function(letter){
        // find the entry with name "letter" and returns it
        grep = $.grep(alphabet, function(e){return e.value === letter;})[0];
        if(grep === undefined){
          return {}; // support unknown characters
        } else {
          return grep;
        }
      },
      getAlphabet: function(){
        // dump the whole alphabet as JSON
        return JSON.stringify(alphabet);
      },
      setAlphabet: function(betabet){
        // input new alphabet for custom ciphers
        alphabet = JSON.parse(betabet);
      }
    };
  }



})();