"use strict"

var S$ = require('S$');
var determine_basal = require('./lib/determine-basal/determine-basal');
var tempBasalFunctions = require('./lib/basal-set-temp');

var gs_delta = S$.symbol('gs_delta', 0);
/*
S$.assume(-10 < gs_delta);
S$.assume(gs_delta < 10);
*/

var gs_glucose = S$.symbol('gs_glucose', 115);
/*
S$.assume(gs_glucose > -100);
S$.assume(gs_glucose < 1000);
*/

var gs_long_avgdelta = S$.symbol('gs_long_avgdelta', 1.1);
/*
S$.assume(gs_long_avgdelta > -100);
S$.assume(gs_long_avgdelta < 100);
*/

var gs_short_avgdelta = S$.symbol('gs_short_avgdelta', 0.0);
/*
S$.assume(gs_short_avgdelta > -100);
S$.assume(gs_short_avgdelta < 100);
*/

var gs_noise = S$.symbol('gs_noise', 0);

var glucose_status = { "delta": gs_delta, "glucose": gs_glucose, "long_avgdelta": gs_long_avgdelta, "short_avgdelta": gs_short_avgdelta, "noise": gs_noise };

var ct_duration = S$.symbol('ct_duration', 0);
var ct_rate = S$.symbol('ct_rate', 0.0);
var ct_temp = S$.symbol('ct_temp', 'absolute');

var currenttemp = { "duration": ct_duration, rate: ct_rate, temp: ct_temp };

var iob_iob = S$.symbol('iob_iob', 0.0);
var iob_activity = S$.symbol('iob_activity', 0.0);
var iob_bolussnooze = S$.symbol('iob_bolussnooze', 0.0);
var iob_data = { "iob": iob_iob, "activity": iob_activity, "bolussnooze": iob_bolussnooze };

var autosens_ratio = S$.symbol('autosens_ratio', 1.0);
var autosens = { "ratio": autosens_ratio };

var profile_max_iob = S$.symbol('profile_max_iob', 2.5);
var profile_dia = S$.symbol('profile_dia', 3);
var profile_type = S$.symbol('profile_type', 'current');
var profile_current_basal = S$.symbol('profile_current_basal', 0.9);
var profile_max_daily_basal = S$.symbol('profile_max_daily_basal', 1.3);
var profile_max_basal = S$.symbol('profile_max_basal', 3.5);
var profile_max_bg = S$.symbol('profile_max_bg', 120);
var profile_min_bg = S$.symbol('profile_min_bg', 110);
var profile_sens = S$.symbol('profile_sens', 40);
var profile_carb_ratio = S$.symbol('profile_carb_ratio', 10);
var profile = {
  "max_iob": profile_max_iob, "dia": profile_dia, "type": profile_type, "current_basal": profile_current_basal,
  "max_daily_basal": profile_max_daily_basal, "max_basal": profile_max_basal, "max_bg": profile_max_bg,
  "min_bg": profile_min_bg, "sens": profile_sens, "carb_ratio": profile_carb_ratio
}

var md_carbs = S$.symbol('md_carbs', 50);
var md_nsCarbs = S$.symbol('md_nsCarbs', 50);
var md_bwCarbs = S$.symbol('md_bwCarbs', 0);
var md_journalCarbs = S$.symbol('md_journalCarbs', 0);
var md_mealCOB = S$.symbol('md_mealCOB', 0);
var md_currentDeviation = S$.symbol('md_currentDeviation', 0.0);
var md_maxDeviation = S$.symbol('md_maxDeviation', 0.0);
var md_minDeviation = S$.symbol('md_minDeviation', 0.0);
var md_slopeFromMaxDeviation = S$.symbol('md_slopeFromMaxDeviation', 0.0);
var md_slopeFromMinDeviation = S$.symbol('md_slopeFromMinDeviation', 0.0);
var md_allDeviations = S$.symbol('md_allDeviations', [0, 0, 0, 0, 0]);
var md_bwFound = S$.symbol('md_bwFound', false);

var meal_data = {
  "carbs": md_carbs, "nsCarbs": md_nsCarbs, "bwCarbs": md_bwCarbs, "journalCarbs": md_journalCarbs, mealCOB: md_mealCOB,
  "currentDeviation": md_currentDeviation, "maxDeviation": md_maxDeviation, "minDeviation": md_minDeviation,
  "slopeFromMaxDeviation": md_slopeFromMaxDeviation, "slopeFromMinDeviation": md_slopeFromMinDeviation,
  "allDeviations": md_allDeviations, "bwFound": md_bwFound
}

var rT = determine_basal(glucose_status, currenttemp, iob_data, profile, autosens, meal_data, tempBasalFunctions);

/*
TODO: ADD IF STATEMENTS THAT THROW ERRORS
ON POTENTIALLY BAD OUTPUTS

Not sure what is a valid output for duration or temp
To be honest, not sure what temp is

Here's what I know...
rT.error being set means there is no problem, because that means OpenAPS detected the error and won't do anything harmful
(thus, it's an "error" in the sense that OpenAPS doesn't know what to do, but not an error as in buggy code)

Hence, rT.error being present means DON'T THROW AN ERROR

rT.reason: Gives the reason for the output. Sometimes it includes the string 'doing nothing' if it knows something is processing.
IF the reason string 'doing nothing', the following fields don't matter and can be NaN or undefined.

IF rT.error is not set (I'm not familiar with Javascript that well, I assume that means it's undefined?), 
AND rT.reason does not include 'doing nothing', then these fields presumably contain the action OpenAPS will take.
In such a case, please add

if(rT.rate > 10000) 
  throw 'Rate too high'
or something like that as appropriate because I have no idea what values are right!
If possible make the exception message something distinguishable so it's easier to look for in expoSE output

rT.rate: Basal rate in U? I think?
rT.duration: Duration in minutes
rT.deliverAt: This is proabably a date, I don't know though
*/
/*Because the current insulin we have available to us takes so long to reach peak activity, 
it’s better to do (most of) the manual meal bolus as you would otherwise do. There are features 
in the OpenAPS algorithm to help if BGs rise faster or drop faster than expected during or after 
a meal, but they don’t replace a regular meal bolus." -OpenAPS website. Since we are not worrying 
about bolus, I am making the maximum rT.rate lower than the bolus one we had discussed. Hopefully 
we can have a check like "are you sure?" to still give the basal*/
try{ 
  if(rT.rate > 3) throw "Unusually high basal rate attempted";
  if(rT.rate < 0) throw "Attempted negative basal rate";
  if(rT.temp < 0) throw "Attempted negative temp basal rate";  
  if(rT.temp > 9) throw "Unusually high temp basal rate attempted";
  if(rT.duration > 10) throw "Unusually long length of time for temp basal to run";
  if(rT.duration < 0) throw "Attempted negative length of time for temp basal to run"; 
}
catch(err){
  rT.error += " " + err;
}

console.log('Rate: %f', rT.rate);
console.log('Duration: %f', rT.duration);
console.log('Temp: %s', rT.temp);
console.log('Deliver at: %s', rT.deliverAt);
console.log('Error: %s', rT.error);
console.log('Reason: %s', rT.reason);
