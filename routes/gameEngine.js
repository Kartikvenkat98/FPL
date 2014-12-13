var express = require('express');
var router = express.Router();
var fs = require('fs');
var erfArr = JSON.parse(fs.readFileSync('erf.json','utf8'));
/* GET home page. */
router.get('/', function(req, res) {
//  var ballResult  = gameEngine(req.query);
//  console.log(req.query);
    generateRandomness();
 res.render('index', { title: 'Hello World!',name:'Karthik' });
});
function generateRandomness(){
  var runs =0;
  var wickets =0;
  var meanR=0;
  var meanW=0;
  var mean=0;
  var object= {};
  var random;
  for(var j =0;j<10000;j++){
      runs = 0;
      wickets =0;
  for(var i=0;i<30;i++){
        random = Math.random()*100;
        object.batSkill = random;
        random = Math.random()*100;
        object.ballSkill = random;
        random = (Math.random()*2-1)*25;
        object.batConfidence = random;
        random = (Math.random()*2-1)*25;
        object.ballConfidence = random;
        random = Math.random();
        if(random>0.5)
            object.batStyle = "Attack";
        else
            object.batStyle = "Defend";
        random = Math.random();
        if(random>0.5)
            object.ballStyle = "Attack";
        else
            object.ballStyle = "Defend";
        random = gameEngine(object);
        if(random==-1)
            wickets++;
        else
            runs = runs + random;
        if(wickets==10)
            break;
    }
        meanW = meanW + (wickets);
        meanR = meanR + runs;
        if(wickets!=0)
            mean = mean + (runs/wickets);
  }
  console.log(meanR/10000);
  console.log(meanW/10000);
  console.log(mean/10000);
}
function gameEngine(statusObject){
    // range of 0 - 100
    var batSkill = statusObject.batSkill;
    var ballSkill = statusObject.ballSkill;
    // alters skill from -x% to +x%
    var batConfidence = statusObject.batConfidence;
    var ballConfidence = statusObject.ballConfidence;
    //
    //  defensive:
    //          low wicket chance, but low runs
    //  normal:
    //          none
    //  attacking:
    //          high wicket chance, but high runs
    var batStyle = statusObject.batStyle;
    var ballStyle = statusObject.ballStyle;
    // adavantageous skills
    var finalBatPoints = (batSkill+(batSkill*batConfidence/100))/100;
    var finalBallPoints = (ballSkill+(ballSkill*ballConfidence/100))/100;
    // mean computed by Skill with Confidence
    // variance computed by mean with style
    var mean = 0.5+(finalBatPoints-finalBallPoints)/2;
    var variance =  0.1;
    var varianceFactor = 0.1;
    if(batStyle=="Defend")
        variance = variance - varianceFactor*finalBatPoints/2;
    else
        variance = variance + varianceFactor*finalBatPoints/2;
    if(ballStyle=="Defend")
        variance = variance - varianceFactor*finalBallPoints/2;
    else
        variance = variance + varianceFactor*finalBallPoints/2;
    //random event
    var randomEvent = Math.random();
    //set if erf should be taken in negative, so we multiply xErf by -1,odd function
    var negativeFlag = false;
    var valueOfErf = 2*randomEvent - 1;
    if(valueOfErf<0){
        valueOfErf = valueOfErf*-1;
        negativeFlag = true;
    }
    var xErf = 0.0;
    for(var i=0;i<erfArr.length;i++){
        xErf = erfArr[i].x;
        if(parseFloat(erfArr[i].y) >= valueOfErf){
            break;
        }
    }
    if(negativeFlag)
        xErf = xErf*-1;
    var randomVariable = (xErf*Math.sqrt(2*variance))+mean;
    if(randomVariable<0.14)
        return -1;
    else if(randomVariable<0.50)
        return 0;
    else if(randomVariable<0.60)
        return 1;
    else if(randomVariable<0.65)
        return 2;
    else if(randomVariable<0.75)
        return 3;
    else if(randomVariable<0.85)
        return 4;
    else
        return 6;
}
module.exports = router;