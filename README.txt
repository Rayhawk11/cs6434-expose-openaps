https://parsed.dev/articles/ExpoSE_A_Quick_Start_Guide
https://parsed.dev/articles/A_Short_Tutorial_on_Logging_in_ExpoSE

Helpful files: 
oref0/tests/determine-basal.test.js

Useful commands:
Run expoSE on test.js (test.js must be in oref0 folder) and write output to output.txt
EXPOSE_MAX_CONCURRENT=1 EXPOSE_MAX_TIME=60000 EXPOSE_LOG_LEVEL=0 ~/ExpoSE/expoSE test.js | tee output.txt

Run expoSE test case previously shown in output.txt
expoSE replay test.js '{JSON_STRING}'


