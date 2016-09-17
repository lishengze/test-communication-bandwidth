var fs = require('fs');
var path = require('path');
var fileName = path.join (__dirname, './TestResultAnalysis.txt');

var timeIterVal = [1,1,1,1,1,
                   30,30,30,30,30, 
                   60,60,60,60,60, 
                   1800,1800,1800,1800,1800, 
                   3600,3600,3600,3600,3600];

var callBackNumb = [87, 90, 87, 91, 89,
                    2899, 2907, 2903, 2904, 2897,
                    5824, 5807, 5806, 5811, 5814,
                    174518, 175635, 175439, 176351, 176262,
                    351044, 350489, 350779, 349548, 350011];

var aveCalbkNumb = [];
var outputInfo = "";
for (var i = 0; i < timeIterVal.length; ++i) {
  aveCalbkNumb[i] = callBackNumb[i] / timeIterVal[i];
  outputInfo += 'ComTime:  '+ timeIterVal[i].toString() + '  '
              + 'SumCalbkNumb:  ' + callBackNumb[i].toString() + '  '
              + 'AveCalbkNumb:  ' + aveCalbkNumb[i].toString() + ' \n';
}

fs.writeFileSync(fileName, outputInfo);