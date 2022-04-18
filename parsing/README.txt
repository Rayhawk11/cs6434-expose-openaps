TODO:
Create a script that outputs the following two files of output. expose_output.txt is a real test input that your script should accept and successfully parse.

Output file 1: test_cases.txt
List of non-erroring ExpoSE test cases
In expose_output.txt, these are indicated by
[+] {JSON_STRING_HERE}

Example input:
[+] Not important
[+] Also not important
[+] {"foo": true, "bar": 0}
[+] More garbage
[+] {"foo": false, "bar": 1}

Example output (it's okay to leave the pluses):
[+] {"foo": true, "bar": 0}
[+] {"foo": false, "bar": 1}


Output file 2: error_cases.txt
List of erroring ExpoSE test cases

In ExpoSE output, they look something like one of these (see EXAMPLE ERRORS). There may be other variations! For safety, the best thing to do is probably look for the expoSE replay string, and capture all the lines starting with [!] above it until you hit the next [+].
For example, if you get
[+] Info
[!] Foo
[!] Bar
[!] expoSE replay ...
[+} Info

error_cases.txt should have a block containing just:
[!] Foo
[!] Bar
[!] expoSE replay ...

Please try to separate each error block with a newline. Example:
[!] Foo
[!] Bar
[!] expoSE replay some_string

[!] Different error
[!] expoSE replay some_other_string

EXAMPLE ERRORS

[!] Exception E: SyntaxError: Unexpected end of JSON input of test data on
[!] Error extracting final output - a fatal error must have occured
[!] expoSE replay '/home/dylan/oref0/test.js' '{"gs_delta":0,"gs_glucose":60.02,"gs_long_avgdelta":0,"gs_short_avgdelta":0,"gs_noise":1,"ct_duration":0,"ct_rate":0,"ct_temp":"","iob_iob":-0.012,"iob_activity":null,"iob_bolussnooze":0,"autosens_ratio":null,"profile_max_iob":0,"profile_dia":0,"profile_type":"","profile_current_basal":null,"profile_max_daily_basal":0,"profile_max_basal":0,"profile_max_bg":60.02,"profile_min_bg":115,"profile_sens":null,"profile_carb_ratio":null,"md_carbs":27,"md_nsCarbs":0,"md_bwCarbs":0,"md_journalCarbs":0,"md_mealCOB":0,"md_currentDeviation":0,"md_maxDeviation":0,"md_minDeviation":0,"md_slopeFromMaxDeviation":0,"md_slopeFromMinDeviation":0,"md_allDeviations":[],"md_bwFound":false,"_bound":38}'

[!] Exit code non-zero
[!] expoSE replay '/home/dylan/oref0/test.js' '{"gs_delta":-0.45,"gs_glucose":60.05,"gs_long_avgdelta":0,"gs_short_avgdelta":0,"gs_noise":1.95,"ct_duration":0,"ct_rate":0,"ct_temp":"","iob_iob":0,"iob_activity":-0.6,"iob_bolussnooze":0,"autosens_ratio":1.05,"profile_max_iob":0,"profile_dia":0,"profile_type":"","profile_current_basal":-0.05,"profile_max_daily_basal":0,"profile_max_basal":0,"profile_max_bg":60.05,"profile_min_bg":0,"profile_sens":-0.105,"profile_carb_ratio":0,"md_carbs":28,"md_nsCarbs":0,"md_bwCarbs":0,"md_journalCarbs":0,"md_mealCOB":0,"md_currentDeviation":0,"md_maxDeviation":0,"md_minDeviation":0,"md_slopeFromMaxDeviation":0,"md_slopeFromMinDeviation":0,"md_allDeviations":[],"md_bwFound":false,"_bound":23}'

